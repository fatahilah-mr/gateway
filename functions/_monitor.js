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
    service = 'Gateway Portal',
    host = 'fatah.web.id',
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
  const fullTargetUrl = `https://${host}${path}${query ? query : ''}`;
  const alertTitle = `[Gateway | ${host}] 🚨 Anomali: ${type}`;
  const promises = [];

  // 1. Dispatch Telegram Alert if configured
  if (telegramBotToken && telegramChatId) {
    const teleMessage = [
      `🚨 *[SECURITY ALERT]* \`${service}\` (${host})`,
      `*Traffic Tidak Wajar Terdeteksi!*`,
      ``,
      `• *Layanan*: ${service} (\`${host}\`)`,
      `• *Kategori*: ${type}`,
      `• *IP*: \`${ip}\` (${country})`,
      `• *Target URL*: \`${fullTargetUrl}\``,
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
      'Title': alertTitle,
      'Priority': '4',
      'Tags': 'gateway,shield,rotating_light',
      'Click': fullTargetUrl,
      'Content-Type': 'text/plain; charset=utf-8'
    };
    if (ntfyToken) {
      headers['Authorization'] = `Bearer ${ntfyToken}`;
    }

    const ntfyBody = [
      `Layanan: ${service} (Cloudflare Pages)`,
      `Host / Domain: ${host}`,
      `Kategori: ${type}`,
      `IP Penyerang: ${ip} (${country})`,
      `Target URL: ${fullTargetUrl}`,
      `Tindakan: ${action}`,
      `Waktu: ${timestamp} WIB`,
      details ? `Catatan: ${details}` : null
    ].filter(Boolean).join('\n');

    promises.push(
      fetch(`${ntfyServer.replace(/\/$/, '')}/${ntfyTopic}`, {
        method: 'POST',
        headers,
        body: ntfyBody
      }).catch((err) => console.error('ntfy alert dispatch error:', err))
    );
  }

  return Promise.allSettled(promises);
}
