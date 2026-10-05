/**
 * BookingCard enhancement (no framework). Responsibilities:
 *  - date / transport / stay / traveller selection with live pricing
 *  - campaign deep links: ?d=YYYY-MM-DD, ?opt=<transport|stay id>, ?view=dates|itinerary|book
 *  - keep the WhatsApp CTA message in sync with the selected date
 *  - broadcast `hcc:selection` (StickyBar listens) and `hcc:book` / `hcc:itinerary`
 *    (EnquirySheet listens; that's where BookingIntents and, later, Razorpay plug in)
 */
import { track } from './analytics';

interface Dep {
  id: string;
  start: string;
  end: string;
  status: string;
  bookable: boolean;
  prices: Record<string, number>;
  originalPrice: number | null;
  seatsLeft: number | null;
  bookingMode: 'enquiry' | 'payment';
}

interface Data {
  tripId: string;
  title: string;
  origin: string;
  originLabel: string;
  gstPercent: number | null;
  advance: number | null;
  payments: boolean;
  wa: string;
  transport: { id: string; label: string }[];
  stay: { id: string; label: string }[];
  departures: Dep[];
}

export interface Selection {
  tripId: string;
  tripTitle: string;
  origin: string;
  originLabel: string;
  departureId: string | null;
  date: string | null;
  transport: string;
  stay: string;
  travellers: number;
  pricePerPerson: number | null;
  total: number | null;
  advanceTotal: number | null;
  bookingMode: 'enquiry' | 'payment';
}

declare global {
  interface Window {
    hccSelection?: Selection;
  }
  interface WindowEventMap {
    'hcc:selection': CustomEvent<Selection>;
    'hcc:book': CustomEvent<Selection>;
    'hcc:itinerary': CustomEvent<Selection>;
    'hcc:select-departure': CustomEvent<{ id: string }>;
  }
}

const inr = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;
const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' });
const dateLong = (iso: string) => {
  const parts = fmt.formatToParts(new Date(`${iso}T00:00:00Z`));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('weekday')} ${get('day')} ${get('month')}`;
};
const MAX_TRAVELLERS = 12;

export function initBookingCards() {
  document.querySelectorAll<HTMLElement>('[data-booking-card]:not([data-ready])').forEach(init);
}

function init(root: HTMLElement) {
  root.dataset.ready = '';
  const data = JSON.parse(root.querySelector('[data-booking-data]')!.textContent!) as Data;
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const $$ = <T extends Element = HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];

  // Safety net if the nightly rebuild is late: departures that have already left are ignored.
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  data.departures = data.departures.filter((d) => d.start >= today);
  const firstBookable = data.departures.find((d) => d.bookable) ?? null;
  const cheapest = (dep: Dep) => Object.entries(dep.prices).sort((a, b) => a[1] - b[1])[0][0].split('|');

  const state = {
    dep: firstBookable,
    transport: firstBookable ? cheapest(firstBookable)[0] : data.transport[0].id,
    stay: firstBookable ? cheapest(firstBookable)[1] : data.stay[0].id,
    travellers: 1,
  };

  /* ---------- deep links ---------- */
  const qs = new URLSearchParams(location.search);
  const wantDate = qs.get('d');
  const note = $('[data-deeplink-note]');
  const noteText = $('[data-deeplink-text]');
  if (wantDate && /^\d{4}-\d{2}-\d{2}$/.test(wantDate)) {
    const exact = data.departures.find((d) => d.start === wantDate);
    if (exact?.bookable) {
      state.dep = exact;
      showNote(`Showing the <b>${dateLong(exact.start)}</b> departure from your link`);
    } else {
      const next = data.departures.find((d) => d.bookable && d.start > wantDate) ?? firstBookable;
      if (next) {
        state.dep = next;
        showNote(`${exact ? 'That date is full.' : 'That date isn’t available.'} Next available: <b>${dateLong(next.start)}</b>`);
      }
    }
  }
  const wantOpt = qs.get('opt');
  if (wantOpt) {
    if (data.transport.some((t) => t.id === wantOpt)) state.transport = wantOpt;
    if (data.stay.some((s) => s.id === wantOpt)) state.stay = wantOpt;
  }
  ensureComboAvailable();

  function showNote(html: string) {
    if (!note || !noteText) return;
    noteText.innerHTML = html;
    note.hidden = false;
  }

  /* ---------- helpers ---------- */
  function ensureComboAvailable() {
    const dep = state.dep;
    if (!dep) return;
    if (dep.prices[`${state.transport}|${state.stay}`] != null) return;
    // Keep the dimension the user chose if possible, else fall back to cheapest.
    const keys = Object.keys(dep.prices);
    const sameT = keys.filter((k) => k.startsWith(`${state.transport}|`)).sort((a, b) => dep.prices[a] - dep.prices[b])[0];
    const [t, s] = (sameT ?? cheapest(dep).join('|')).split('|');
    state.transport = t;
    state.stay = s;
  }

  function selection(): Selection {
    const ppp = state.dep ? (state.dep.prices[`${state.transport}|${state.stay}`] ?? null) : null;
    return {
      tripId: data.tripId,
      tripTitle: data.title,
      origin: data.origin,
      originLabel: data.originLabel,
      departureId: state.dep?.id ?? null,
      date: state.dep?.start ?? null,
      transport: state.transport,
      stay: state.stay,
      travellers: state.travellers,
      pricePerPerson: ppp,
      total: ppp != null ? ppp * state.travellers : null,
      advanceTotal: data.advance != null ? data.advance * state.travellers : null,
      bookingMode: state.dep?.bookingMode ?? 'enquiry',
    };
  }

  /* ---------- render ---------- */
  function render() {
    const s = selection();
    const dep = state.dep;

    $$<HTMLButtonElement>('[data-dep]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.dep === dep?.id)));
    $$<HTMLButtonElement>('[data-opt]').forEach((b) => {
      const isT = b.dataset.opt === 'transport';
      const id = b.dataset.id!;
      b.setAttribute('aria-checked', String(id === (isT ? state.transport : state.stay)));
      const key = isT ? `${id}|${state.stay}` : `${state.transport}|${id}`;
      const p = dep?.prices[key];
      const anyForOption = dep ? Object.keys(dep.prices).some((k) => (isT ? k.startsWith(`${id}|`) : k.endsWith(`|${id}`))) : true;
      b.querySelector('[data-opt-price]')!.textContent = p != null ? inr(p) : anyForOption ? '' : 'Unavailable';
      b.disabled = !anyForOption;
    });

    if (s.pricePerPerson != null) {
      const priceEl = $('[data-price]');
      if (priceEl) priceEl.textContent = inr(s.pricePerPerson);
      const was = $('[data-was]');
      if (was) {
        const orig = dep?.originalPrice;
        was.hidden = !(orig && orig > s.pricePerPerson);
        was.textContent = orig ? inr(orig) : '';
      }
      const stayLabel = $('[data-stay-label]');
      if (stayLabel) stayLabel.textContent = data.stay.find((x) => x.id === state.stay)?.label ?? '';
      const line = $('[data-sum-line]');
      if (line) line.textContent = `${s.travellers} traveller${s.travellers > 1 ? 's' : ''} × ${inr(s.pricePerPerson)}`;
      const sub = $('[data-sum-sub]');
      if (sub) sub.textContent = inr(s.total!);
      const gst = $('[data-sum-gst]');
      if (gst && data.gstPercent != null) gst.textContent = inr(Math.round((s.total! * data.gstPercent) / 100));
      const adv = $('[data-sum-adv]');
      if (adv && s.advanceTotal != null) adv.textContent = `${inr(s.advanceTotal)} advance`;
    }

    const count = $('[data-trav-count]');
    if (count) count.textContent = String(state.travellers);
    const [minus, plus] = $$<HTMLButtonElement>('[data-trav]');
    if (minus) minus.disabled = state.travellers <= 1;
    if (plus) plus.disabled = state.travellers >= MAX_TRAVELLERS;

    const bookLabel = $('[data-book-label]');
    if (bookLabel && dep) bookLabel.textContent = dep.status === 'waitlist' ? 'Join the Waitlist' : 'Book Your Seat';

    // WhatsApp: date-specific message + ref code
    const wa = $<HTMLAnchorElement>('[data-booking-wa]');
    if (wa && data.wa && dep) {
      const msg = `Hi HCC! I'm interested in the ${data.title} trip from ${data.originLabel} (departure: ${dateLong(dep.start)}).`;
      wa.href = `https://wa.me/${data.wa}?text=${encodeURIComponent(msg)}`;
      wa.dataset.departureDate = dep.start;
      wa.dataset.waRef = `${data.tripId.split('-')[0].slice(0, 6).toUpperCase()}-${dep.start.slice(5, 7)}${dep.start.slice(8, 10)}`;
      const label = wa.querySelector('span');
      if (label) label.textContent = `WhatsApp HCC about ${dateLong(dep.start).split(' ').slice(1).join(' ')}`;
    }

    // Late subscribers (scripts that load after this one) read the latest selection from here.
    window.hccSelection = s;
    window.dispatchEvent(new CustomEvent('hcc:selection', { detail: s }));
  }

  /* ---------- events ---------- */
  root.addEventListener('click', (e) => {
    const t = e.target as Element;
    const depBtn = t.closest<HTMLButtonElement>('[data-dep]');
    if (depBtn && depBtn.getAttribute('aria-disabled') !== 'true') {
      state.dep = data.departures.find((d) => d.id === depBtn.dataset.dep) ?? state.dep;
      ensureComboAvailable();
      render();
      track('select_departure', { trip_id: data.tripId, departure_date: state.dep?.start });
      return;
    }
    const optBtn = t.closest<HTMLButtonElement>('[data-opt]');
    if (optBtn && !optBtn.disabled) {
      if (optBtn.dataset.opt === 'transport') state.transport = optBtn.dataset.id!;
      else state.stay = optBtn.dataset.id!;
      ensureComboAvailable();
      render();
      return;
    }
    const trav = t.closest<HTMLButtonElement>('[data-trav]');
    if (trav) {
      state.travellers = Math.min(MAX_TRAVELLERS, Math.max(1, state.travellers + Number(trav.dataset.trav)));
      render();
      return;
    }
    if (t.closest('[data-book]')) {
      const s = selection();
      track('click_book', {
        trip_id: s.tripId,
        trip_name: s.tripTitle,
        departure_city: s.originLabel,
        departure_date: s.date,
        sharing_type: s.stay,
        transport: s.transport,
        travellers: s.travellers,
        price: s.pricePerPerson,
        value: s.total,
        currency: 'INR',
      });
      window.dispatchEvent(new CustomEvent('hcc:book', { detail: s }));
      return;
    }
    if (t.closest('[data-itinerary]')) {
      track('get_itinerary_click', { trip_id: data.tripId });
      window.dispatchEvent(new CustomEvent('hcc:itinerary', { detail: selection() }));
    }
  });

  // "Select" buttons in the Dates & prices list
  window.addEventListener('hcc:select-departure', (e) => {
    const id = (e as CustomEvent<{ id: string }>).detail.id;
    const dep = data.departures.find((d) => d.id === id);
    if (!dep?.bookable) return;
    state.dep = dep;
    ensureComboAvailable();
    render();
    track('select_departure', { trip_id: data.tripId, departure_date: dep.start, cta_location: 'dates_list' });
  });

  // Arrow-key navigation inside radio groups
  root.addEventListener('keydown', (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('[role="radio"]');
    if (!btn || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const group = [...btn.parentElement!.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([aria-disabled="true"]):not(:disabled)')];
    const i = group.indexOf(btn);
    const next = group[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + group.length) % group.length];
    e.preventDefault();
    next.focus();
    next.click();
  });

  // Roving tabindex: only the checked radio in each group is tabbable
  const syncTabIndex = () =>
    root.querySelectorAll('[role="radiogroup"]').forEach((g) => {
      const radios = [...g.querySelectorAll<HTMLElement>('[role="radio"]')];
      const checked = radios.find((r) => r.getAttribute('aria-checked') === 'true') ?? radios[0];
      radios.forEach((r) => (r.tabIndex = r === checked ? 0 : -1));
    });
  window.addEventListener('hcc:selection', syncTabIndex);

  render();

  // ?view= deep link
  const view = qs.get('view');
  if (view === 'book') requestAnimationFrame(() => root.querySelector<HTMLButtonElement>('[data-book]')?.click());
  else if (view === 'dates') root.scrollIntoView({ block: 'start' });
  else if (view === 'itinerary') document.getElementById('itinerary')?.scrollIntoView({ block: 'start' });
}
