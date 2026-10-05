/** Site-wide client bootstrap: attribution, tags, click/view tracking, WhatsApp enrichment. */
import { captureAttribution } from './attribution';
import { initClickTracking, initViewEvents } from './analytics';
import { initTags } from './tags';
import { initWhatsApp } from './whatsapp';

// Safety net if the nightly rebuild is late: hide departures that have already left.
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
document.querySelectorAll<HTMLElement>('[data-dep-start]').forEach((el) => {
  if (el.dataset.depStart! < today) el.classList.add('is-past');
});

captureAttribution();
initTags();
initClickTracking();
initWhatsApp();
initViewEvents();
