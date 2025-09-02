export async function api(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    let data = null;
    try { data = JSON.parse(text); } catch(e) { data = text; }
    const err = new Error(data?.message || data || res.statusText || 'Request failed');
    err.response = data;
    throw err;
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await res.json();
  return await res.text();
}
