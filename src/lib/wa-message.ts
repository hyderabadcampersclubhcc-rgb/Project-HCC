/**
 * "Hi HCC, I'm interested in <subject>…": one natural sentence for trips with a whatsappSubject
 * (e.g. "Harivillu Resort camping in Ananthagiri Hills"). No imports, so the browser booking
 * script can use it without bundling site settings.
 */
export function subjectMessage(subject: string, dateLabel?: string): string {
  return `Hi HCC, I'm interested in ${subject}${dateLabel ? ` (date: ${dateLabel})` : ''}. Please share the available dates and booking details.`;
}
