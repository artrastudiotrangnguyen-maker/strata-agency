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
        // V15.5: EXTREME ROBUST PRIVATE KEY PARSING
        // 1. Remove quotes if any
        let cleanKey = privateKey.trim();
        if (cleanKey.startsWith('"') && cleanKey.endsWith('"')) {
          cleanKey = cleanKey.slice(1, -1);
        }
        
        // 2. Fix Double Escaping (common in Vercel)
        // Convert literal "\n" strings to actual newline characters
        cleanKey = cleanKey.replace(/\\n/gm, "\n");
        
        // 3. Ensure the header and footer are clean
        if (!cleanKey.includes("-----BEGIN PRIVATE KEY-----")) {
           throw new Error("Missing BEGIN PRIVATE KEY header");
        }

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
        
        // Send actual error back to Telegram for debugging
        if (telegramToken && telegramChatId) {
          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: `❌ *Sheet Auth Failed:*\n\`${sheetErr.message}\`\n\n_Tip: Please ensure Vercel Private Key includes newlines correctly._`,
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
