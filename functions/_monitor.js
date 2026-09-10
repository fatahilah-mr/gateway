// functions/_monitor.js
// Dual-Platform Edge Alert Dispatcher (Telegram Bot & Self-Hosted ntfy)
// All credentials are read strictly from Cloudflare Environment Variables (zero secrets in code).

export async function sendSecurityAlert(env, data) {
  const telegramBotToken = env?.TELEGRAM_MONITOR_BOT_TOKEN;
  const telegramChatId = env?.TELEGRAM_MONITOR_CHAT_ID;
  const ntfyServer = env?.NTFY_SERVER || 'https://ntfy.fmr.web.id';
  const ntfyTopic = env?.NTFY_TOPIC || 'agent';
  const ntfyToken = env?.NTFY_AUTH_TOKEN;

  const {
    type = 'Traffic Anomali',
    ip = 'Unknown',
    country = 'ID',
    path = '/',
    query = '',
    userAgent = 'Unknown',
    action = 'Blocked',
    details = ''
  } = data;

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const promises = [];

  // 1. Dispatch Telegram Alert if configured
  if (telegramBotToken && telegramChatId) {
    const teleMessage = [
      `🚨 *[SECURITY ALERT] Traffic Tidak Wajar Terdeteksi!*`,
      ``,
      `• *Kategori*: ${type}`,
      `• *IP*: \`${ip}\` (${country})`,
      `• *Path*: \`${path}${query ? query : ''}\``,
      `• *User-Agent*: \`${userAgent.slice(0, 80)}\``,
      `• *Waktu*: ${timestamp} WIB`,
      `• *Tindakan*: ${action}`,
      details ? `• *Catatan*: ${details}` : ''
    ].filter(Boolean).join('\n');

    promises.push(
      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: teleMessage,
          parse_mode: 'Markdown'
        })
      }).catch((err) => console.error('Telegram alert dispatch error:', err))
    );
  }

  // 2. Dispatch ntfy Alert if configured
  if (ntfyServer && ntfyTopic) {
    const headers = {
      'Title': `🚨 Anomali Traffic: ${type}`,
      'Priority': '4',
      'Tags': 'rotating_light,shield',
      'Content-Type': 'text/plain; charset=utf-8'
    };
    if (ntfyToken) {
      headers['Authorization'] = `Bearer ${ntfyToken}`;
    }

    promises.push(
      fetch(`${ntfyServer.replace(/\/$/, '')}/${ntfyTopic}`, {
        method: 'POST',
        headers,
        body: `Kategori: ${type}\nIP: ${ip} (${country})\nTarget: ${path}${query ? query : ''}\nTindakan: ${action}\nWaktu: ${timestamp} WIB${details ? `\nCatatan: ${details}` : ''}`
      }).catch((err) => console.error('ntfy alert dispatch error:', err))
    );
  }

  return Promise.allSettled(promises);
}
