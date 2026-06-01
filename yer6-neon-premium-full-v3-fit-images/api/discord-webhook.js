export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return res.status(200).json({ ok: false, warning: "DISCORD_WEBHOOK_URL eksik" });
  try {
    const body = req.body || {};
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: body.content || "YER6 Log", embeds: body.embeds || [] })
    });
    return res.status(response.ok ? 200 : 500).json({ ok: response.ok });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
