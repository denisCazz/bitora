export function sanitizeRichText(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<\/?(iframe|object|embed|form|input)[^>]*>/gi, '');
}
