/**
 * Lead forms (<form data-intent-form="custom|book|itinerary|contact">).
 *
 *  - form_start on first interaction, form_submit on submit, generate_lead on success
 *  - inline validation: name + 10-digit Indian mobile are the only required fields
 *  - attaches first/last-touch attribution (UTM, gclid, fbclid…) and the page path
 *  - POSTs JSON to the form's action (/api/intents → BookingIntent, Phase 4)
 *  - if the endpoint is unreachable, offers WhatsApp with the details pre-filled
 *    (data-wa = HCC's number) so a lead is never silently lost
 *
 * No personal data is ever sent to analytics.
 */
import { getAttribution } from './attribution';
import { track } from './analytics';

const PHONE = /^[6-9]\d{9}$/;
const TIMEOUT_MS = 12000;

interface IntentResponse {
  ok: boolean;
  id?: string;
  next?: 'confirm' | 'pay';
}

export function initIntentForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-intent-form]:not([data-ready])').forEach(init);
}

function init(form: HTMLFormElement) {
  form.dataset.ready = '';
  form.noValidate = true;
  // Read at event time: one form can serve several intents (e.g. the sheet's book/itinerary modes).
  const formName = () => form.dataset.intentForm!;
  const scope = form.closest<HTMLElement>('[data-intent-scope]') ?? form.parentElement!;
  const success = scope.querySelector<HTMLElement>('[data-form-success]');
  const failure = scope.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  let started = false;

  const start = () => {
    if (started) return;
    started = true;
    track('form_start', { form_name: formName(), trip_id: form.dataset.tripId });
  };
  form.addEventListener('focusin', start, { once: true });
  form.addEventListener('input', start, { once: true });

  const setError = (field: HTMLInputElement | null, msg: string) => {
    if (!field) return;
    const err = document.getElementById(`${field.id}-err`);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      err.textContent = msg;
      err.hidden = !msg;
    }
  };

  // Clear a field's error as soon as it's corrected.
  form.addEventListener('input', (e) => {
    const f = e.target as HTMLInputElement;
    if (f.getAttribute('aria-invalid') === 'true') setError(f, '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    start();
    const fd = new FormData(form);
    const nameEl = form.querySelector<HTMLInputElement>('[name="name"]');
    const phoneEl = form.querySelector<HTMLInputElement>('[name="phone"]');
    const phone = String(fd.get('phone') ?? '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');

    const errors: [HTMLInputElement | null, string][] = [];
    if (String(fd.get('name') ?? '').trim().length < 2) errors.push([nameEl, 'Please tell us your name']);
    if (!PHONE.test(phone)) errors.push([phoneEl, 'Enter a 10-digit mobile number']);
    setError(nameEl, '');
    setError(phoneEl, '');
    errors.forEach(([el, msg]) => setError(el, msg));
    if (errors.length) {
      errors[0][0]?.focus();
      track('form_error', { form_name: formName(), fields: errors.map(([el]) => el?.name).join(',') });
      return;
    }

    // Honeypot: bots fill hidden fields. Pretend success, send nothing.
    if (String(fd.get('company') ?? '')) {
      showSuccess();
      return;
    }

    track('form_submit', { form_name: formName(), trip_id: form.dataset.tripId });
    const payload = {
      ...Object.fromEntries([...fd.entries()].filter(([k]) => k !== 'company').map(([k, v]) => [k, String(v).trim()])),
      phone,
      tripId: form.dataset.tripId,
      departureId: form.dataset.departureId,
      page: location.pathname,
      attribution: getAttribution(),
    };

    submit?.setAttribute('data-loading', '');
    if (failure) failure.hidden = true;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = (await res.json().catch(() => ({ ok: false }))) as IntentResponse;
      if (!res.ok || !data.ok) throw new Error(`HTTP ${res.status}`);

      track('generate_lead', { form_name: formName(), lead_id: data.id, trip_id: form.dataset.tripId, currency: 'INR' });
      window.dispatchEvent(new CustomEvent('hcc:lead', { detail: { form: formName(), id: data.id, next: data.next } }));
      showSuccess();
    } catch {
      showFailure(payload as Record<string, unknown>);
    } finally {
      submit?.removeAttribute('data-loading');
    }
  });

  function showSuccess() {
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus();
    }
  }

  function showFailure(p: Record<string, unknown>) {
    track('form_failed', { form_name: formName() });
    if (!failure) return;
    failure.hidden = false;
    const wa = form.dataset.wa;
    const link = failure.querySelector<HTMLAnchorElement>('[data-fallback-wa]');
    if (wa && link) {
      const LABELS: [string, string][] = [
        ['date', 'Date'],
        ['option', 'Option'],
        ['destination', 'Destination'],
        ['dates', 'When'],
        ['travellers', 'Travellers'],
        ['budget', 'Budget'],
        ['travelType', 'Type'],
        ['name', 'Name'],
      ];
      const lines = [
        form.dataset.fallbackIntro ?? "Hi HCC! I'd like to plan a trip.",
        ...LABELS.filter(([k]) => p[k]).map(([k, label]) => `${label}: ${p[k]}`),
      ];
      link.href = `https://wa.me/${wa}?text=${encodeURIComponent(lines.join('\n'))}`;
      link.hidden = false;
    }
    failure.focus();
  }
}
