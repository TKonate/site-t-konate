/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Envoie le message du formulaire par email via Resend.
 * Variables d'environnement (Cloudflare Pages > Settings > Environment variables) :
 *   RESEND_API_KEY  clé API Resend (obligatoire)
 *   CONTACT_TO      destinataire (défaut : tiberio.konatepro@gmail.com)
 *   CONTACT_FROM    expéditeur vérifié (défaut : site@t-konate.dev)
 *
 * Sans RESEND_API_KEY, la fonction répond 503 : le front bascule sur le lien mailto.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Anti-flood best-effort, par isolate (pas de KV configuré).
const hits = new Map<string, number>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY) {
    return json({ error: 'envoi non configuré' }, 503);
  }

  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'corps de requête invalide' }, 400);
  }

  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const company = (data.company ?? '').trim();
  const subject = (data.subject ?? '').trim();
  const message = (data.message ?? '').trim();
  const honeypot = (data.website ?? '').trim();
  const lang = data.lang === 'en' ? 'en' : 'fr';

  if (honeypot) return json({ ok: true }); // bot silencieux

  if (!name || !email || !message) {
    return json({ error: 'champs requis manquants' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ error: 'adresse email invalide' }, 400);
  }
  if (message.length > 4000 || name.length > 120) {
    return json({ error: 'message trop long' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const now = Date.now();
  for (const [k, v] of hits) if (now - v > WINDOW_MS) hits.delete(k);
  const count = [...hits.keys()].filter((k) => k.startsWith(ip + ':')).length;
  if (count >= MAX_PER_WINDOW) {
    return json({ error: 'trop de messages, réessayez plus tard' }, 429);
  }
  hits.set(`${ip}:${now}`, now);

  const to = env.CONTACT_TO ?? 'tiberio.konatepro@gmail.com';
  const from = env.CONTACT_FROM ?? 'site@t-konate.dev';

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px">Nouveau message — t-konate.dev</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 14px 4px 0;color:#666">Nom</td><td><strong>${escape(name)}</strong></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#666">Email</td><td>${escape(email)}</td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#666">Structure</td><td>${escape(company) || '—'}</td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#666">Besoin</td><td>${escape(subject) || '—'}</td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#666">Langue</td><td>${lang}</td></tr>
      </table>
      <pre style="margin-top:18px;white-space:pre-wrap;font-family:inherit;background:#f5f5f7;padding:14px;border-radius:8px">${escape(message)}</pre>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${'Polaris'} <${from}>`,
      to: [to],
      reply_to: email,
      subject: `[Site] ${subject || 'Nouveau message'} — ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('resend_error', res.status, detail);
    return json({ error: "l'envoi a échoué" }, 502);
  }

  return json({ ok: true });
};

export const onRequestGet: PagesFunction = () => json({ error: 'méthode non autorisée' }, 405);
