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
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    // --- Action 1: Telegram Notification ---
    let telegramMessage = `🚀 *New Lead from STRATA*\n\n` +
                          `👤 *Name:* ${name}\n` +
                          `📧 *Email:* ${email}\n` +
                          `🏢 *Company:* ${company || "N/A"}\n\n` +
                          `💬 *Message:* \n${message}`;

    if (telegramToken && telegramChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramMessage,
            parse_mode: "Markdown",
          }),
        });
      } catch (telErr: any) {
        console.error("Telegram Error:", telErr.message);
      }
    }

    // --- Action 2: Google Sheets Logging ---
    if (serviceAccountEmail && privateKey && sheetId) {
      try {
        // V15.5 FINAL: EXTREME ROBUST PRIVATE KEY PARSING
        let cleanKey = privateKey.trim();
        if (cleanKey.startsWith('"') && cleanKey.endsWith('"')) {
          cleanKey = cleanKey.slice(1, -1);
        }
        
        // Convert both "\\n" string literals and raw "\n" to actual newlines
        cleanKey = cleanKey.replace(/\\n/g, "\n");
        
        const jwt = new JWT({
          email: serviceAccountEmail,
          key: cleanKey,
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
        
        console.log("Successfully logged to Google Sheets");
      } catch (sheetErr: any) {
        console.error("Google Sheets Final Error:", sheetErr.message);
        
        // Notify user via Telegram about WHICH error happened
        if (telegramToken && telegramChatId) {
          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: `❌ *Sheet Error:* ${sheetErr.message}\nCheck if you shared the sheet with the Service Account email.`,
              parse_mode: "Markdown",
            }),
          });
        }
      }
    }

    return NextResponse.json({ message: "Processed" }, { status: 201 });
  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
