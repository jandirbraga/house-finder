import fetch from "node-fetch";
import type { Listing } from "./types.js";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function notify(listing: Listing): Promise<void> {
  console.log(`[notify] New listing: ${listing.url}`);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set, skipping Telegram notification.");
    return;
  }

  const lines = [
    "🏠 *Novo imóvel encontrado!*",
    "",
    listing.title ? `📋 ${listing.title}` : null,
    listing.address ? `📍 ${listing.address}` : null,
    listing.price ? `💰 ${listing.price}` : null,
    `🌐 ${listing.site}`,
    `🔗 [Ver anúncio](${listing.url})`,
  ].filter(Boolean).join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: lines,
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error(`[notify] Telegram error: ${response.status} ${body}`);
  }
}
