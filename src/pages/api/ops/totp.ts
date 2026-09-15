import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/ops/auth';
import { regenerateBackupCodes, resetTotp, totpManagedByEnv } from '../../../lib/ops/totp';

export const prerender = false;

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const form = await request.formData();
  const action = String(form.get('action') || '');
  const code = String(form.get('code') || '');

  if (action === 'backup') {
    const codes = regenerateBackupCodes(code);
    if (!codes) return redirectTo('/ops/sicurezza/?errore=codice');
    return redirectTo('/ops/sicurezza/?nuovo=1');
  }

  if (action === 'reset') {
    if (totpManagedByEnv()) return redirectTo('/ops/sicurezza/?errore=env');
    if (!resetTotp(code)) return redirectTo('/ops/sicurezza/?errore=codice');
    clearSessionCookie(cookies);
    return redirectTo('/ops/login/');
  }

  return redirectTo('/ops/sicurezza/?errore=dati');
};
