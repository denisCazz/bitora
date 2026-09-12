import type { APIRoute } from 'astro';
import { sendOpsEvents } from '../../../lib/ops/alerts';

export const prerender = false;

export const POST: APIRoute = async ({ redirect }) => {
  const result = await sendOpsEvents(
    [
      {
        kind: 'vps',
        id: 'telegram-test',
        title: 'Test Telegram',
        detail: 'Configurazione Bitora Ops funzionante',
      },
    ],
    false
  );

  return redirect(`/ops/infrastruttura/?telegram=${result.sent ? 'ok' : 'errore'}`);
};
