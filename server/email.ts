import nodemailer from "nodemailer";

// ─── Configuration ───────────────────────────────────────────────
// For PRODUCTION, set these environment variables:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
//
// For DEVELOPMENT, we auto-create an Ethereal test account so emails
// work out of the box. Check the console for preview URLs.
// ─────────────────────────────────────────────────────────────────

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    // Production SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("📧 Email: Using SMTP server", process.env.SMTP_HOST);
  } else {
    // Development — Ethereal fake SMTP
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Email: Using Ethereal test account (dev mode)");
    console.log(`   Ethereal inbox: https://ethereal.email/login`);
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
  }

  return transporter;
}

const FROM_ADDRESS = process.env.SMTP_FROM || "African Strikers FC <noreply@africanstrikers.com>";
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

// ─── Welcome Email Template ─────────────────────────────────────
export async function sendWelcomeEmail(to: string, playerName: string, position: string): Promise<boolean> {
  try {
    const transport = await getTransporter();

    const info = await transport.sendMail({
      from: FROM_ADDRESS,
      to,
      subject: "🎉 Welcome to African Strikers FC!",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488 0%,#065f56 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">
        ⚽ African Strikers FC
      </h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">
        Where Unity Comes First
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;font-weight:700;">
        Welcome to the Team, ${playerName}! 🎉
      </h2>
      
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">
        We're thrilled to officially welcome you to the <strong style="color:#2dd4bf;">African Strikers Football Club</strong> family! Your application as <strong style="color:#2dd4bf;">${position}</strong> has been <span style="color:#10b981;font-weight:700;">accepted</span>.
      </p>

      <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.6;">
        You're joining a brotherhood dedicated to excellence on and off the pitch. Our motto — <em>"Where Unity Comes First"</em> — is more than words; it's how we play, train, and grow together.
      </p>

      <!-- Highlight Box -->
      <div style="background:rgba(13,148,136,0.1);border:1px solid rgba(45,212,191,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#2dd4bf;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
          What's Next?
        </h3>
        <ul style="margin:0;padding:0 0 0 20px;color:#94a3b8;font-size:15px;line-height:1.8;">
          <li>A team coordinator will reach out with training schedules</li>
          <li>Join our team group chat for match-day updates</li>
          <li>Attend your first training session to meet the squad</li>
          <li>Get fitted for your official ASFC kit</li>
        </ul>
      </div>

      <p style="margin:0 0 32px;font-size:16px;color:#94a3b8;line-height:1.6;">
        We compete in the <strong style="color:#ffffff;">Around Da Hours (ADH) Super League</strong> in Brooklyn Park, Minnesota. Get ready to represent the Strikers with pride!
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${SITE_URL}/team" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#065f56);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
          View Your Team
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">
        African Strikers Football Club · Brooklyn Park, Minnesota
      </p>
      <p style="margin:0;font-size:12px;color:#334155;">
        ADH Super League · Est. 2020
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `Welcome to African Strikers FC, ${playerName}!\n\nYour application as ${position} has been ACCEPTED! 🎉\n\nYou're joining a brotherhood dedicated to excellence on and off the pitch. Our motto — "Where Unity Comes First" — is more than words; it's how we play, train, and grow together.\n\nWhat's Next:\n- A team coordinator will reach out with training schedules\n- Join our team group chat for match-day updates\n- Attend your first training session to meet the squad\n- Get fitted for your official ASFC kit\n\nWe compete in the Around Da Hours (ADH) Super League in Brooklyn Park, Minnesota.\n\nWelcome aboard!\nAfrican Strikers FC`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Welcome email preview: ${previewUrl}`);
    } else {
      console.log(`📧 Welcome email sent to ${to}`);
    }

    return true;
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err);
    return false;
  }
}

// ─── Rejection Email Template ───────────────────────────────────
export async function sendRejectionEmail(to: string, playerName: string, position: string): Promise<boolean> {
  try {
    const transport = await getTransporter();

    const info = await transport.sendMail({
      from: FROM_ADDRESS,
      to,
      subject: "African Strikers FC — Application Update",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#374151 0%,#1f2937 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">
        ⚽ African Strikers FC
      </h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">
        Where Unity Comes First
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;font-weight:700;">
        Dear ${playerName},
      </h2>
      
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">
        Thank you for your interest in joining <strong style="color:#2dd4bf;">African Strikers Football Club</strong> and for taking the time to try out for the <strong style="color:#2dd4bf;">${position}</strong> position.
      </p>

      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">
        After careful evaluation of your trial performance, we regret to inform you that we are unable to offer you a spot on the team at this time. This was not an easy decision — we appreciate the effort and dedication you showed during the trial process.
      </p>

      <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.6;">
        Unfortunately, your profile does not fit the current team structure and the specific needs we have for this season. This does not reflect on your abilities as a player, and we encourage you to keep training and improving.
      </p>

      <!-- Encouragement Box -->
      <div style="background:rgba(100,116,139,0.1);border:1px solid rgba(148,163,184,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#e2e8f0;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
          What You Can Do
        </h3>
        <ul style="margin:0;padding:0 0 0 20px;color:#94a3b8;font-size:15px;line-height:1.8;">
          <li>Continue developing your skills and fitness</li>
          <li>You are welcome to try out again in the future</li>
          <li>Follow us on social media for open trial announcements</li>
          <li>Stay connected with the ASFC community</li>
        </ul>
      </div>

      <p style="margin:0 0 32px;font-size:16px;color:#94a3b8;line-height:1.6;">
        We wish you the very best of luck in your football journey. Keep pushing forward — your time will come! 💪
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#475569,#334155);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
          Visit Our Website
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">
        African Strikers Football Club · Brooklyn Park, Minnesota
      </p>
      <p style="margin:0;font-size:12px;color:#334155;">
        ADH Super League · Est. 2020
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `Dear ${playerName},\n\nThank you for your interest in joining African Strikers Football Club and for taking the time to try out for the ${position} position.\n\nAfter careful evaluation of your trial performance, we regret to inform you that we are unable to offer you a spot on the team at this time. Unfortunately, your profile does not fit the current team structure and the specific needs we have for this season.\n\nThis does not reflect on your abilities as a player, and we encourage you to keep training and improving.\n\nWhat You Can Do:\n- Continue developing your skills and fitness\n- You are welcome to try out again in the future\n- Follow us on social media for open trial announcements\n- Stay connected with the ASFC community\n\nWe wish you the very best of luck in your football journey. Keep pushing forward!\n\nBest regards,\nAfrican Strikers FC`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Rejection email preview: ${previewUrl}`);
    } else {
      console.log(`📧 Rejection email sent to ${to}`);
    }

    return true;
  } catch (err) {
    console.error("❌ Failed to send rejection email:", err);
    return false;
  }
}
