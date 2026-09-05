export function contactUrl(contact: string): string {
  if (/^https?:\/\//i.test(contact)) return contact;
  const handle = contact.replace(/^@/, "");
  return `https://t.me/${handle}`;
}
