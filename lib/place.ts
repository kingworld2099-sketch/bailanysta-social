export function placeSearchUrl(place: string): string {
  return `https://2gis.kz/search/${encodeURIComponent(place)}`;
}
