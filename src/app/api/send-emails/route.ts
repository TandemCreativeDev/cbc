import { transporter } from "@/utils/nodemailer";

const LIMITS = {
  name: 100,
  company: 100,
  email: 254,
  phoneNumber: 30,
  message: 5000,
};
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const requestLog = new Map<string, number[]>();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT.windowMs,
  );
  if (recent.length >= RATE_LIMIT.max) {
    requestLog.set(ip, recent);
    return true;
  }
  requestLog.set(ip, [...recent, now]);
  return false;
}

function readField(formData: FormData, key: keyof typeof LIMITS) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const isFrench = formData.get("language") === "fr";

    if (formData.get("website")) {
      return Response.json({ message: "Thanks, we will be in touch shortly." });
    }

    if (isRateLimited(getClientIp(request))) {
      return Response.json(
        {
          error: isFrench
            ? "Trop de messages, veuillez réessayer plus tard"
            : "Too many requests, please try again later",
        },
        { status: 429 },
      );
    }

    const name = readField(formData, "name");
    const company = readField(formData, "company");
    const email = readField(formData, "email");
    const phoneNumber = readField(formData, "phoneNumber");
    const message = readField(formData, "message");

    const fields = { name, company, email, phoneNumber, message };
    const tooLong = (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).some(
      (key) => fields[key].length > LIMITS[key],
    );
    if (
      !name ||
      !message ||
      !EMAIL_PATTERN.test(email) ||
      /[\r\n]/.test(name + email) ||
      tooLong
    ) {
      return Response.json(
        {
          error: isFrench
            ? "Veuillez vérifier les informations saisies"
            : "Invalid form data",
        },
        { status: 400 },
      );
    }

    const plainFirstName = name.split(" ")[0];
    const firstName = escapeHtml(plainFirstName);
    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safePhoneNumber = escapeHtml(phoneNumber);
    const safeMessage = escapeHtml(message);

    let clarksSubject, clarksEmailHtml, userSubject, userEmailHtml;

    if (isFrench) {
      clarksSubject = `${plainFirstName} souhaite entrer en contact`;
      clarksEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle soumission du formulaire de contact</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
              h2 { color: #333; }
              p { color: #555; font-size: 16px; line-height: 1.5; }
              .details { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 10px; }
              .footer { font-size: 14px; color: #777; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Nouvelle soumission du formulaire de contact</h2>
              <p>Quelqu'un a soumis un formulaire de contact sur le site Clarks Bowling Club. Voici les détails :</p>
              <div class="details">
                <p><strong>Nom :</strong> ${safeName}</p>
                <p><strong>Entreprise :</strong> ${safeCompany}</p>
                <p><strong>E-mail :</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                <p><strong>Téléphone :</strong> ${safePhoneNumber}</p>
                <p><strong>Message :</strong><br> ${safeMessage}</p>
              </div>
              <p>Merci de le contacter dans les 2 jours ouvrables.</p>
              <p><strong>- Notification du site Clarks Bowling Club</strong></p>
              <div class="footer">
                <p>&copy; 2025 Clarks Bowling Club | Usage Interne</p>
              </div>
            </div>
          </body>
          </html>
         `;
      userSubject = `Bonjour ${plainFirstName}, merci de nous avoir contactés`;
      userEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Merci d'avoir contacté Clarks Bowling Club</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
              h2 { color: #333; }
              p { color: #555; font-size: 16px; line-height: 1.5; }
              .details { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 10px; }
              .footer { font-size: 14px; color: #777; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Merci, <span style="color: #FEBC12;">${firstName}</span>!</h2>
              <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés. Nous reviendrons vers vous dans les 2 jours ouvrables.</p>
              <p>Pour vos archives, voici les détails que vous avez soumis :</p>
              <div class="details">
                <p><strong>Nom :</strong> ${safeName}</p>
                <p><strong>Entreprise :</strong> ${safeCompany}</p>
                <p><strong>Email :</strong> ${safeEmail}</p>
                <p><strong>Téléphone :</strong> ${safePhoneNumber}</p>
                <p><strong>Message :</strong><br> ${safeMessage}</p>
              </div>
              <p>Si vous avez besoin de nous contacter plus rapidement, n'hésitez pas à répondre à cet e-mail.</p>
              <p>Au plaisir de vous parler !</p>
              <p>Cordialement,<br><strong>Clarks Bowling Club</strong></p>
              <div class="footer">
                <p>&copy; 2025 Clarks Bowling Club | Tous droits réservés</p>
              </div>
            </div>
          </body>
          </html>
         `;
    } else {
      clarksSubject = `${plainFirstName} wants to get in touch`;
      clarksEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                h2 { color: #333; }
                p { color: #555; font-size: 16px; line-height: 1.5; }
                .details { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 10px; }
                .footer { font-size: 14px; color: #777; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>New Contact Form Submission</h2>
              <p>Someone has submitted a contact form on the Clarks Bowling Club website. Here are the details:</p>
              <div class="details">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Company:</strong> ${safeCompany}</p>
                <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                <p><strong>Phone Number:</strong> ${safePhoneNumber}</p>
                <p><strong>Message:</strong><br> ${safeMessage}</p>
              </div>
              <p>Please reach out to them within 2 working days.</p>
              <p><strong>- Clarks Bowling Club Website Notification</strong></p>
              <div class="footer">
                <p>&copy; 2025 Clarks Bowling Club | Internal Use Only</p>
              </div>
            </div>
          </body>
          </html>
         `;
      userSubject = `Hi ${plainFirstName}, thanks for getting in touch`;
      userEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You for Contacting Clarks Bowling Club</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                h2 { color: #333; }
                p { color: #555; font-size: 16px; line-height: 1.5; }
                .details { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 10px; }
                .footer { font-size: 14px; color: #777; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Thank You, <span style="color: #FEBC12;">${firstName}</span>!</h2>
              <p>We’ve received your message and appreciate you reaching out. We will be in touch within 2 working days.</p>
              <p>For your records, here are the details you submitted:</p>
              <div class="details">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Company:</strong> ${safeCompany}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Phone Number:</strong> ${safePhoneNumber}</p>
                <p><strong>Message:</strong><br> ${safeMessage}</p>
              </div>
              <p>If you need to reach us sooner, feel free to reply to this email.</p>
              <p>Looking forward to speaking with you!</p>
              <p>Best,<br><strong>Clarks Bowling Club</strong></p>
              <div class="footer">
                <p>&copy; 2025 Clarks Bowling Club | All Rights Reserved</p>
              </div>
            </div>
          </body>
          </html>
         `;
    }

    const clarksEmail = await transporter.sendMail({
      from: "Clarks Bowling Club Website <websiteform@clarksbowlingclub.com>",
      replyTo: email,
      to: `Clarks Bowling Club <${process.env.EMAIL_USER}>`,
      cc: "Clarks Bowling Club <clarksbowlingclub@gmail.com>",
      subject: clarksSubject,
      html: clarksEmailHtml,
    });

    const userEmail = await transporter.sendMail({
      from: `Clarks Bowling Club <${process.env.EMAIL_USER}>`,
      to: email,
      subject: userSubject,
      html: userEmailHtml,
    });
    console.log("Email sent to Clarks Bowling Club: %s", clarksEmail.messageId);
    console.log("Email sent to user: %s", userEmail.messageId);
    return Response.json(
      { message: `Thanks ${plainFirstName}, we will be in touch shortly.` },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "An error occurred while sending the email" },
      { status: 500 },
    );
  }
}
