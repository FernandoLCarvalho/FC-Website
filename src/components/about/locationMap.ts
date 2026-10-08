const APPROXIMATE_LOCATION_QUERY = "Goiania, Brazil";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed/v1/place";

export function buildCurrentLocationMapUrl(apiKey: string) {
  const params = new URLSearchParams({
    key: apiKey,
    q: APPROXIMATE_LOCATION_QUERY,
  });

  return `${GOOGLE_MAPS_EMBED_URL}?${params.toString()}`;
}
