import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Environment Variables ---
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    // --- Action 1: Telegram Notification (V15) ---
    if (telegramToken && telegramChatId) {
      try {
        const text = `🚀 *New Lead from STRATA*\n\n` +
                     `👤 *Name:* ${name}\n` +
                     `📧 *Email:* ${email}\n` +
                     `🏢 *Company:* ${company || "N/A"}\n\n` +
                     `💬 *Message:* \n${message}`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: text,
            parse_mode: "Markdown",
          }),
        });
      } catch (telErr) {
        console.error("Telegram Notification Error:", telErr);
        // We continue anyway to log to Sheets
      }
    } else {
      console.warn("Telegram credentials not set. Skipping notification.");
    }

    // --- Action 2: Google Sheets Logging ---
    if (serviceAccountEmail && privateKey && sheetId) {
      const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
      const jwt = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: SCOPES,
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
    } else {
      console.warn("Google Sheets credentials not set. Logging data instead:", body);
      // In demo/dev mode without keys, we still want to show success in UI
      if (!telegramToken) {
        return NextResponse.json({ 
          message: "Demo Mode: Data received but no external integrations configured.",
          data: body 
        }, { status: 200 });
      }
    }

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
