/** Site-wide client bootstrap: attribution, click tracking, WhatsApp enrichment. ~2 KB gz. */
import { captureAttribution } from './attribution';
import { initClickTracking } from './analytics';
import { initWhatsApp } from './whatsapp';

captureAttribution();
initClickTracking();
initWhatsApp();
