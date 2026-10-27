export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** plural(2, 'prazo') → "prazos"; plural(1, 'prazo') → "prazo". */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return count === 1 ? singular : pluralForm;
}

/** "https://moodle.udesc.br" → "moodle.udesc.br". */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
