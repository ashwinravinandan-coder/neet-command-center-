// Vercel serverless function — runs on the server, not in the browser,
// so it can call Telegram's public preview page without CORS issues.
// Works ONLY for public channels (the ones with a t.me/<name> link that
// opens without joining).
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { channel, before } = req.query;
  if (!channel) {
    return res.status(400).json({ error: "Missing 'channel' query param" });
  }

  const cleanChannel = channel.replace(/^@/, "");
  const url = `https://t.me/s/${cleanChannel}${before ? `?before=${before}` : ""}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NEET2027Bot/1.0)" },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `Telegram returned ${response.status}. Is the channel name correct and public?` });
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const messages = [];
    $(".tgme_widget_message_wrap").each((_, el) => {
      const msgEl = $(el).find(".tgme_widget_message");
      const dataPost = msgEl.attr("data-post"); // "channelname/1234"
      if (!dataPost) return;
      const id = dataPost.split("/")[1];

      const text = $(el).find(".tgme_widget_message_text").first().text().trim();
      const dateAttr = $(el).find(".tgme_widget_message_date time").attr("datetime");
      const hasVideo = $(el).find(".tgme_widget_message_video_player").length > 0;
      const hasDocument = $(el).find(".tgme_widget_message_document").length > 0;
      const documentName = $(el).find(".tgme_widget_message_document_title").first().text().trim();
      const hasPhoto = $(el).find(".tgme_widget_message_photo_wrap").length > 0;

      messages.push({
        id,
        link: `https://t.me/${cleanChannel}/${id}`,
        text,
        date: dateAttr || null,
        hasVideo,
        hasDocument,
        documentName: documentName || null,
        hasPhoto,
      });
    });

    // Telegram's preview shows oldest-first in the HTML; reverse so newest is first
    messages.reverse();

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
    return res.status(200).json({ channel: cleanChannel, messages });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch channel" });
  }
}
