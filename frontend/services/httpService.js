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

export async function httpGet(url, headers = {}) {
  return fetchJSON(url, {
    method: 'GET',
    headers: {
      ...headers,
    },
  });
}

export async function httpPost(url, data, headers = {}) {
  return fetchJSON(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
}

export async function httpPut(url, data, headers = {}) {
  return fetchJSON(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
}

export async function httpDelete(url, headers = {}) {
  return fetchJSON(url, {
    method: 'DELETE',
    headers: {
      ...headers,
    },
  });
}