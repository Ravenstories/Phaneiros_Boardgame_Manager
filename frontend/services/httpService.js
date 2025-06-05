export async function fetchJSON(url, opts={}) {
  const res = await fetch(url, opts);
  if (res.status === 304) {
    // nothing changed → return whatever we already cached
    return JSON.parse(sessionStorage.getItem(url) ?? 'null');
  }
  if (!res.ok) throw new Error(res.status);

  const data = await res.json();
  sessionStorage.setItem(url, JSON.stringify(data));
  return data;
}
