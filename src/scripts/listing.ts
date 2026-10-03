/**
 * Client-side filtering/sorting for listings ([data-listing]). Items carry data-* attributes
 * (src/lib/facets.ts). Filter buttons ([data-f-key][data-f-value]) are single-select per key
 * and may appear twice (chip row + filter sheet); they stay in sync. State is mirrored to the
 * URL (?month=…&style=…&q=…&sort=…) so filtered views are shareable and TripFinder links work.
 * Other params (utm_*, gclid…) are left untouched. Canonical tags never include params.
 */
import { track } from './analytics';

type State = Record<string, string>;
const KEYS = ['month', 'style', 'dur', 'budget', 'travel', 'origin', 'q', 'sort'] as const;

const iso = (d: Date) => d.toISOString().slice(0, 10);
function weekend(todayIso: string, ahead: number): [string, string] {
  const d = new Date(`${todayIso}T00:00:00Z`);
  const dow = d.getUTCDay();
  const offset = dow >= 5 || dow === 0 ? -((dow + 3) % 7) : (4 - dow + 7) % 7;
  const thu = new Date(d);
  thu.setUTCDate(d.getUTCDate() + offset + ahead * 7);
  const sun = new Date(thu);
  sun.setUTCDate(thu.getUTCDate() + 3);
  return [iso(thu), iso(sun)];
}

export function initListings() {
  document.querySelectorAll<HTMLElement>('[data-listing]:not([data-ready])').forEach(init);
}

function init(root: HTMLElement) {
  root.dataset.ready = '';
  const today = root.dataset.today || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const list = root.querySelector<HTMLElement>('[data-items]')!;
  const items = [...root.querySelectorAll<HTMLElement>('[data-item]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-group]')];
  const buttons = () => [...root.querySelectorAll<HTMLButtonElement>('[data-f-key]')];
  const sortSel = root.querySelector<HTMLSelectElement>('[data-sort]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const result = root.querySelector<HTMLElement>('[data-result]');
  const badge = root.querySelector<HTMLElement>('[data-filter-count]');
  const qChip = root.querySelector<HTMLElement>('[data-q-chip]');
  const noun = root.dataset.noun ?? 'trip';
  const original = items.slice();

  const params = new URLSearchParams(location.search);
  const state: State = {};
  KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) state[k] = v.slice(0, 80);
  });

  const words = (el: HTMLElement, attr: string) => (el.dataset[attr] ?? '').split(' ').filter(Boolean);

  const matches = (el: HTMLElement, s: State, skip?: string) => {
    for (const [k, v] of Object.entries(s)) {
      if (!v || k === skip || k === 'sort') continue;
      if (k === 'q') {
        const text = el.dataset.text ?? '';
        if (!v.toLowerCase().split(/\s+/).filter(Boolean).every((w) => text.includes(w))) return false;
      } else if (k === 'month') {
        if (v === 'this-weekend' || v === 'next-weekend') {
          const [from, to] = weekend(today, v === 'this-weekend' ? 0 : 1);
          if (!words(el, 'dates').some((d) => d >= from && d <= to)) return false;
        } else if (!words(el, 'months').includes(v)) return false;
      } else if (k === 'style') {
        if (!words(el, 'style').includes(v)) return false;
      } else if (!words(el, k).includes(v)) return false;
    }
    return true;
  };

  const sortItems = (mode: string) => {
    // Items without a value always sort last.
    const num = (el: HTMLElement, a: string, missing: number) => (el.dataset[a] ? Number(el.dataset[a]) : missing);
    const by: Record<string, (a: HTMLElement, b: HTMLElement) => number> = {
      soonest: (a, b) => (a.dataset.start || '9999').localeCompare(b.dataset.start || '9999'),
      'price-asc': (a, b) => num(a, 'price', Infinity) - num(b, 'price', Infinity),
      'price-desc': (a, b) => num(b, 'price', -1) - num(a, 'price', -1),
      duration: (a, b) => num(a, 'nights', Infinity) - num(b, 'nights', Infinity),
    };
    const sorted = by[mode] ? original.slice().sort(by[mode]) : original;
    sorted.forEach((el) => list.appendChild(el));
  };

  const render = (source: string) => {
    let shown = 0;
    items.forEach((el) => {
      const ok = matches(el, state);
      el.hidden = !ok;
      if (ok) shown++;
    });
    groups.forEach((g) => (g.hidden = !g.querySelector('[data-item]:not([hidden])')));
    if (sortSel) {
      sortSel.value = state.sort ?? sortSel.dataset.default ?? 'soonest';
      sortItems(sortSel.value);
    }

    buttons().forEach((b) => {
      const k = b.dataset.fKey!;
      const v = b.dataset.fValue!;
      b.setAttribute('aria-pressed', String(state[k] === v));
      // Hide options that would give zero results given the other active filters.
      const would = items.some((el) => matches(el, { ...state, [k]: v }, undefined));
      b.hidden = !would && state[k] !== v;
    });

    const active = Object.entries(state).filter(([k, v]) => v && k !== 'sort' && k !== 'q').length;
    if (badge) {
      badge.textContent = String(active);
      badge.hidden = active === 0;
    }
    if (qChip) {
      qChip.hidden = !state.q;
      const t = qChip.querySelector('[data-q-text]');
      if (t) t.textContent = state.q ?? '';
    }
    if (result) result.textContent = `${shown} ${noun}${shown === 1 ? '' : 's'}`;
    if (empty) empty.hidden = shown > 0;
    root.querySelectorAll<HTMLElement>('[data-show-count]').forEach((el) => (el.textContent = `Show ${shown} ${noun}${shown === 1 ? '' : 's'}`));

    // Mirror to URL, keeping unrelated params (utm, gclid…)
    const url = new URL(location.href);
    KEYS.forEach((k) => (state[k] ? url.searchParams.set(k, state[k]) : url.searchParams.delete(k)));
    history.replaceState(null, '', url);

    if (source !== 'init') track(state.q && source === 'q' ? 'search' : 'filter_trips', { ...state, results: shown, list: root.dataset.listing });
  };

  root.addEventListener('click', (e) => {
    const t = e.target as Element;
    const b = t.closest<HTMLButtonElement>('[data-f-key]');
    if (b) {
      const k = b.dataset.fKey!;
      state[k] = state[k] === b.dataset.fValue ? '' : b.dataset.fValue!;
      render('filter');
      return;
    }
    if (t.closest('[data-clear]')) {
      KEYS.forEach((k) => k !== 'sort' && delete state[k]);
      render('clear');
      return;
    }
    if (t.closest('[data-q-clear]')) {
      delete state.q;
      render('q');
      return;
    }
    if (t.closest('[data-open-filters]')) root.querySelector<HTMLDialogElement>('[data-filter-sheet]')?.showModal();
    if (t.closest('[data-close-filters]')) root.querySelector<HTMLDialogElement>('[data-filter-sheet]')?.close();
  });
  sortSel?.addEventListener('change', () => {
    state.sort = sortSel.value === (sortSel.dataset.default ?? 'soonest') ? '' : sortSel.value;
    render('sort');
  });
  const sheet = root.querySelector<HTMLDialogElement>('[data-filter-sheet]');
  sheet?.addEventListener('click', (e) => e.target === sheet && sheet.close());

  render('init');
}
