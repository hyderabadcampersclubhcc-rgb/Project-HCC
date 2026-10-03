/** Site-wide client bootstrap: attribution, tags, click/view tracking, WhatsApp enrichment. */
import { captureAttribution } from './attribution';
import { initClickTracking, initViewEvents } from './analytics';
import { initTags } from './tags';
import { initWhatsApp } from './whatsapp';

captureAttribution();
initTags();
initClickTracking();
initWhatsApp();
initViewEvents();
