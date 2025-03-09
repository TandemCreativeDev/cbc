import { transporter } from "@/utils/nodemailer";

export async function POST(request: Request) {
  const formData = await request.formData();
  try {
    const name = formData.get("name") as string;
    const firstName = name.trim().split(" ")[0];
    const company = formData.get("company");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const message = formData.get("message");
    const isFrench = formData.get("language") === "fr";

    const clarksEmail = await transporter.sendMail({
      from: `${name} <websiteform@clarksbowlingclub.com>`,
      to: process.env.EMAIL_USER,
      subject: `${firstName} wants to get in touch`,
      html: `
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
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Message:</strong><br> ${message}</p>
            </div>
            <p>Please reach out to them within 2 working days.</p>
            <p><strong>- Clarks Bowling Club Website Notification</strong></p>
            <div class="footer">
            <p>&copy; 2025 Clarks Bowling Club | Internal Use Only</p>
            </div>
        </div>
        </body>
        </html>
        `,
    });

    const userEmail = await transporter.sendMail({
      from: `Clarks Bowling Club <${process.env.EMAIL_USER}>`,
      to: `${name} <${email}>`,
      subject: `Hi ${firstName}, thanks for getting in touch`,
      html: `
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
            <h2>Thank You, <span style="color: #0073e6;">${firstName}</span>!</h2>
            <p>We’ve received your message and appreciate you reaching out. We will be in touch within 2 working days.</p>
            <p>For your records, here are the details you submitted:</p>
            <div class="details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Message:</strong><br> ${message}</p>
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
        `,
    });
    return Response.json(
      { message: `Thanks ${firstName}, we will be in touch shortly.` },
      { status: 200 }
    );
    console.log("Email sent to Clarks Bowling Club: %s", clarksEmail.messageId);
    console.log("Email sent to user: %s", userEmail.messageId);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "An error occurred while sending the email" },
      { status: 500 }
    );
  }
}
