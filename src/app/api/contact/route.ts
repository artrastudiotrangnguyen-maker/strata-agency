import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req: NextRequest) {
  let logDetails = "";
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
      privateKey = privateKey.replace(/\\n/g, "\n");
      // Safety check for quotes
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
    }

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
        console.error("Telegram Notification Error:", telErr);
        logDetails += ` [Telegram Error: ${telErr.message}]`;
      }
    }

    // --- Action 2: Google Sheets Logging ---
    if (serviceAccountEmail && privateKey && sheetId) {
      try {
        console.log("Attempting Google Sheets Auth with:", serviceAccountEmail);
        const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
        const jwt = new JWT({
          email: serviceAccountEmail,
          key: privateKey,
          scopes: SCOPES,
        });

        const doc = new GoogleSpreadsheet(sheetId, jwt);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        
        // Use column headers mapping
        await sheet.addRow({
          Date: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
          Name: name,
          Email: email,
          Company: company || "N/A",
          Message: message,
        });
        
        console.log("Successfully logged to Google Sheets");
      } catch (sheetErr: any) {
        console.error("Google Sheets Error:", sheetErr.message);
        logDetails += ` [Sheet Error: ${sheetErr.message}]`;
        
        // Notify via Telegram if sheet failed so you know WHY
        if (telegramToken && telegramChatId) {
          try {
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: telegramChatId,
                text: `❌ *Google Sheets Error:* ${sheetErr.message}\nCheck if you shared the sheet with \`${serviceAccountEmail}\`.`,
                parse_mode: "Markdown",
              }),
            });
          } catch (tErr) {}
        }
      }
    } else {
      console.warn("One or more Google Sheets env vars are missing.");
      logDetails += " [Missing Google Env Vars]";
    }

    return NextResponse.json({ message: "Processed", details: logDetails }, { status: 201 });
  } catch (error: any) {
    console.error("Full API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
