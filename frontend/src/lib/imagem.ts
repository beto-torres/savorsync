const HOSTS_GOOGLE_DRIVE = new Set(["drive.google.com", "www.drive.google.com"]);

export function normalizarUrlImagem(url?: string | null) {
  const valor = url?.trim();
  if (!valor) return "";

  try {
    const endereco = new URL(valor);
    if (!HOSTS_GOOGLE_DRIVE.has(endereco.hostname.toLowerCase())) return valor;

    const idNoCaminho = endereco.pathname.match(/^\/file\/d\/([^/]+)/)?.[1];
    const id = idNoCaminho ?? endereco.searchParams.get("id");
    if (!id) return valor;

    return `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}=w2000`;
  } catch {
    return valor;
  }
}
