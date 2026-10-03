/**
 * Compare trips: up to 3 trip ids kept in localStorage. Toggle buttons
 * (<button data-compare-toggle="trip-id">) update everywhere at once; the tray
 * ([data-compare-tray]) shows the selection and links to /trips/compare/?ids=a,b,c.
 */
import { track } from './analytics';

const KEY = 'hcc_compare';
export const MAX_COMPARE = 3;
// Fallback when storage is blocked (some in-app browsers, private mode): lasts for this page view.
let memory: string[] | null = null;

export function getCompare(): string[] {
  try {
    if (memory) return memory;
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

export function setCompare(ids: string[]) {
  const unique = [...new Set(ids)].slice(0, MAX_COMPARE);
  try {
    localStorage.setItem(KEY, JSON.stringify(unique));
  } catch {
    memory = unique; // storage blocked: selection lives for this page only
  }
  window.dispatchEvent(new CustomEvent('hcc:compare', { detail: unique }));
  return unique;
}

function sync(ids: string[]) {
  document.querySelectorAll<HTMLButtonElement>('[data-compare-toggle]').forEach((b) => {
    const on = ids.includes(b.dataset.compareToggle!);
    b.setAttribute('aria-pressed', String(on));
    const label = b.querySelector('[data-compare-label]');
    if (label) label.textContent = on ? 'Comparing' : 'Compare';
    b.disabled = !on && ids.length >= MAX_COMPARE;
  });

  const tray = document.querySelector<HTMLElement>('[data-compare-tray]');
  if (!tray) return;
  tray.hidden = ids.length === 0;
  document.body.classList.toggle('has-compare', ids.length > 0);
  const slots = tray.querySelectorAll<HTMLElement>('[data-compare-slot]');
  slots.forEach((slot, i) => {
    const id = ids[i];
    slot.dataset.filled = id ? 'true' : 'false';
    const name = slot.querySelector('[data-compare-name]');
    if (name) name.textContent = id ? (document.querySelector<HTMLElement>(`[data-compare-toggle="${id}"]`)?.dataset.compareTitle ?? titleFromId(id)) : 'Add a trip';
    const rm = slot.querySelector<HTMLButtonElement>('[data-compare-remove]');
    if (rm) {
      rm.hidden = !id;
      rm.dataset.id = id ?? '';
    }
  });
  const go = tray.querySelector<HTMLAnchorElement>('[data-compare-go]');
  if (go) {
    go.href = `/trips/compare/?ids=${ids.join(',')}`;
    go.setAttribute('aria-disabled', String(ids.length < 2));
  }
  const summary = tray.querySelector('[data-compare-summary]');
  if (summary) summary.textContent = `${ids.length} of ${MAX_COMPARE} trips selected`;
  const count = tray.querySelector('[data-compare-count]');
  if (count) count.textContent = ids.length < 2 ? 'Add 1 more' : `Compare ${ids.length}`;
}

const titleFromId = (id: string) => id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function initCompare() {
  sync(getCompare());
  window.addEventListener('hcc:compare', (e) => sync((e as CustomEvent<string[]>).detail));
  window.addEventListener('storage', (e) => e.key === KEY && sync(getCompare()));

  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    const toggle = t.closest<HTMLButtonElement>('[data-compare-toggle]');
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      const id = toggle.dataset.compareToggle!;
      const ids = getCompare();
      const on = ids.includes(id);
      setCompare(on ? ids.filter((x) => x !== id) : [...ids, id]);
      track(on ? 'remove_from_compare' : 'add_to_compare', { trip_id: id });
      return;
    }
    const rm = t.closest<HTMLButtonElement>('[data-compare-remove]');
    if (rm?.dataset.id) setCompare(getCompare().filter((x) => x !== rm.dataset.id));
    if (t.closest('[data-compare-clear]')) setCompare([]);
    const go = t.closest<HTMLAnchorElement>('[data-compare-go]');
    if (go && go.getAttribute('aria-disabled') === 'true') e.preventDefault();
    else if (go) track('compare_trips', { trip_ids: getCompare().join(',') });
  });
}
