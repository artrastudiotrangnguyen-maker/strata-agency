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

    // Normalize Private Key (Handle different Vercel formats)
    if (privateKey) {
      // Replace literal \n string with real newline characters
      privateKey = privateKey.replace(/\\n/g, "\n");
      // If it has escaped quotes, remove them
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
    }

    // --- Action 1: Telegram Notification ---
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
      }
    }

    // --- Action 2: Google Sheets Logging ---
    if (serviceAccountEmail && privateKey && sheetId) {
      try {
        const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
        const jwt = new JWT({
          email: serviceAccountEmail,
          key: privateKey,
          scopes: SCOPES,
        });

        const doc = new GoogleSpreadsheet(sheetId, jwt);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        
        // Add row with specific mapping
        await sheet.addRow({
          Date: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
          Name: name,
          Email: email,
          Company: company || "N/A",
          Message: message,
        });
        
        console.log("Successfully logged to Google Sheets");
      } catch (sheetErr: any) {
        console.error("Google Sheets Authorization/Write Error:", sheetErr.message);
        // We log the error but don't fail the whole request because Telegram might have worked
      }
    } else {
      console.warn("Google Sheets credentials incomplete. Sheet logging skipped.");
    }

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error: any) {
    console.error("Full API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
