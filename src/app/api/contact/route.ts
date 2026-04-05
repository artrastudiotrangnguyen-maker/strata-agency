import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    // --- Telegram Notification ---
    if (telegramToken && telegramChatId) {
      const text = `🚀 *New Lead from STRATA*\n\n` +
                   `👤 *Name:* ${name}\n` +
                   `📧 *Email:* ${email}\n` +
                   `🏢 *Company:* ${company || "N/A"}\n\n` +
                   `💬 *Message:* \n${message}`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: telegramChatId, text: text, parse_mode: "Markdown" }),
        });
      } catch (e) {}
    }

    // --- Google Sheets Logging (V15.6 - Ultimate Key Reconstruction) ---
    if (serviceAccountEmail && privateKey && sheetId) {
      try {
        // 1. Defensively clean the key string
        let rawKey = privateKey.trim();
        
        // Remove literal quotes if they exist
        if (rawKey.startsWith('"')) rawKey = rawKey.substring(1);
        if (rawKey.endsWith('"')) rawKey = rawKey.substring(0, rawKey.length - 1);
        
        // Handle escaped newlines
        rawKey = rawKey.replace(/\\n/g, "\n");

        // 2. RECONSTRUCTION: Extract only the base64 content and re-wrap it properly
        const header = "-----BEGIN PRIVATE KEY-----";
        const footer = "-----END PRIVATE KEY-----";
        
        let content = rawKey
          .replace(header, "")
          .replace(footer, "")
          .replace(/\s/g, ""); // Remove ALL whitespace, newlines, etc.
        
        // Re-wrap content every 64 characters (standard PEM format)
        const wrappedContent = content.match(/.{1,64}/g)?.join("\n") || content;
        const finalizedKey = `${header}\n${wrappedContent}\n${footer}\n`;

        const jwt = new JWT({
          email: serviceAccountEmail,
          key: finalizedKey,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const doc = new GoogleSpreadsheet(sheetId, jwt);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow({
          Date: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
          Name: name,
          Email: email,
          Company: company || "N/A",
          Message: message,
        });
        
        console.log("Logged to Sheets with reconstructed key.");
      } catch (sheetErr: any) {
        console.error("Sheets Final Error:", sheetErr.message);
        if (telegramToken && telegramChatId) {
          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: `❌ *Sheet Auth Failed (V15.6):*\n\`${sheetErr.message}\`\n\n_If it still says DECODER unsupported, verify you copied the entire key correctly from the file._`,
              parse_mode: "Markdown",
            }),
          });
        }
      }
    }

    return NextResponse.json({ message: "Processed" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}
