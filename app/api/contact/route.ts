import { NextResponse } from "next/server";

/**
 * Заглушка приёмника контактной формы.
 *
 * TODO: подключи реальную отправку письма — варианты:
 *  1) EmailJS (просто, без сервера): REST API https://api.emailjs.com/api/v1.0/email/send
 *  2) Resend/Nodemailer с SMTP — надёжнее для продакшена.
 * Адрес получателя храни в переменных окружения Vercel (CONTACT_EMAIL).
 */
export async function POST(request: Request) {
  try {
    const data: unknown = await request.json();
    if (!data || typeof data !== "object") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    console.log("[contact]", JSON.stringify(data));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
