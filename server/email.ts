import { Resend } from "resend";

// ─── Email Service for African Strikers FC ──────────────────────
//
// Uses Resend API — bypasses SMTP entirely, works from any cloud host.
// PRODUCTION: Set RESEND_API_KEY and RESEND_FROM in Railway environment variables.
//   RESEND_API_KEY  — your Resend API key (from resend.com/api-keys)
//   RESEND_FROM     — sender address e.g. "African Strikers FC <noreply@yourdomain.com>"
//                     Without a verified domain, use: "African Strikers FC <onboarding@resend.dev>"
//   ADMIN_EMAIL     — where admin notifications go
// ─────────────────────────────────────────────────────────────────

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY || "re_test_key";
  return new Resend(key);
}

function getFromAddress(): string {
  return process.env.RESEND_FROM || "African Strikers FC <onboarding@resend.dev>";
}

function getSiteUrl(): string {
  return process.env.SITE_URL || "http://localhost:3000";
}

function getAdminEmail(): string | null {
  return process.env.ADMIN_EMAIL || null;
}

function emailLog(level: "INFO" | "WARN" | "ERROR", message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
  const prefix = level === "ERROR" ? "❌" : level === "WARN" ? "⚠️" : "📧";
  console.log(`${prefix} [${timestamp}] [EMAIL/${level}] ${message}${metaStr}`);
}

// ─── Startup Diagnostic ─────────────────────────────────────────
export async function verifyEmailConfig(): Promise<void> {
  emailLog("INFO", "─── Email Configuration Check ───");

  if (!process.env.RESEND_API_KEY) {
    emailLog("WARN", "RESEND_API_KEY not set — emails will NOT be delivered. Add it in Railway environment variables.");
  } else {
    emailLog("INFO", `RESEND_API_KEY: ✅ Set`);
  }

  if (!process.env.RESEND_FROM) {
    emailLog("WARN", `RESEND_FROM not set — using default: ${getFromAddress()}`);
  } else {
    emailLog("INFO", `RESEND_FROM: ${process.env.RESEND_FROM}`);
  }

  if (!process.env.ADMIN_EMAIL) {
    emailLog("WARN", "ADMIN_EMAIL not set — admin notifications will be skipped");
  } else {
    emailLog("INFO", `ADMIN_EMAIL: ${process.env.ADMIN_EMAIL}`);
  }

  emailLog("INFO", `SITE_URL: ${getSiteUrl()}`);
  emailLog("INFO", "─── End Email Check ───");
}

// ─── Helper: Send via Resend ─────────────────────────────────────
async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  context: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    emailLog("WARN", `${options.context} — skipped (RESEND_API_KEY not set)`, { to: options.to });
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      emailLog("ERROR", `${options.context} — Resend API error`, { to: options.to, error: error.message });
      return { sent: false, error: error.message };
    }

    emailLog("INFO", `${options.context} — sent successfully`, { to: options.to, id: data?.id });
    return { sent: true };
  } catch (err: any) {
    emailLog("ERROR", `${options.context} — unexpected error`, { to: options.to, error: err.message });
    return { sent: false, error: err.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// 1. APPLICATION CONFIRMATION (sent immediately on form submit)
// ═══════════════════════════════════════════════════════════════
export async function sendApplicationConfirmation(
  to: string,
  playerName: string,
  position: string
): Promise<{ sent: boolean; error?: string }> {
  const siteUrl = getSiteUrl();

  return sendEmail({
    to,
    subject: "✅ Application Received — African Strikers FC",
    context: "Application Confirmation",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#0d9488 0%,#065f56 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">⚽ African Strikers FC</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">Where Unity Comes First</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;font-weight:700;">Application Received, ${playerName}! ✅</h2>
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">Thank you for applying to join <strong style="color:#2dd4bf;">African Strikers Football Club</strong>. We've received your application for the <strong style="color:#2dd4bf;">${position}</strong> position.</p>
      <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.6;">Our coaching staff will review your application and get back to you regarding the next steps, including upcoming trial dates.</p>
      <div style="background:rgba(13,148,136,0.1);border:1px solid rgba(45,212,191,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#2dd4bf;font-weight:700;text-transform:uppercase;letter-spacing:1px;">What Happens Next?</h3>
        <ul style="margin:0;padding:0 0 0 20px;color:#94a3b8;font-size:15px;line-height:1.8;">
          <li>Your application will be reviewed by our coaching staff</li>
          <li>You'll receive an email when a decision is made</li>
          <li>Selected players will be invited for a trial session</li>
          <li>The process typically takes 3–5 business days</li>
        </ul>
      </div>
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${siteUrl}/team" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#065f56);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Meet the Squad</a>
      </div>
    </div>
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">African Strikers Football Club · Brooklyn Park, Minnesota</p>
      <p style="margin:0;font-size:12px;color:#334155;">ADH Super League · Est. 2020</p>
    </div>
  </div>
</body>
</html>`,
    text: `Application Received, ${playerName}!\n\nThank you for applying to African Strikers FC for the ${position} position.\n\nOur coaching staff will review your application and contact you about trial dates.\n\nAfrican Strikers FC · Brooklyn Park, Minnesota`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 2. WELCOME EMAIL (sent when admin accepts application)
// ═══════════════════════════════════════════════════════════════
export async function sendWelcomeEmail(
  to: string,
  playerName: string,
  position: string
): Promise<{ sent: boolean; error?: string }> {
  const siteUrl = getSiteUrl();

  return sendEmail({
    to,
    subject: "🎉 Welcome to African Strikers FC!",
    context: "Welcome Email (Accepted)",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#0d9488 0%,#065f56 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">⚽ African Strikers FC</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">Where Unity Comes First</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;font-weight:700;">Welcome to the Team, ${playerName}! 🎉</h2>
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">We're thrilled to officially welcome you to <strong style="color:#2dd4bf;">African Strikers Football Club</strong>! Your application as <strong style="color:#2dd4bf;">${position}</strong> has been <span style="color:#10b981;font-weight:700;">accepted</span>.</p>
      <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.6;">You're joining a brotherhood dedicated to excellence on and off the pitch. Our motto — <em>"Where Unity Comes First"</em> — is how we play, train, and grow together.</p>
      <div style="background:rgba(13,148,136,0.1);border:1px solid rgba(45,212,191,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#2dd4bf;font-weight:700;text-transform:uppercase;letter-spacing:1px;">What's Next?</h3>
        <ul style="margin:0;padding:0 0 0 20px;color:#94a3b8;font-size:15px;line-height:1.8;">
          <li>A team coordinator will reach out with training schedules</li>
          <li>Join our team group chat for match-day updates</li>
          <li>Attend your first training session to meet the squad</li>
          <li>Get fitted for your official ASFC kit</li>
        </ul>
      </div>
      <p style="margin:0 0 32px;font-size:16px;color:#94a3b8;line-height:1.6;">We compete in the <strong style="color:#ffffff;">Around Da Hours (ADH) Super League</strong> in Brooklyn Park, Minnesota. Get ready to represent the Strikers with pride!</p>
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${siteUrl}/team" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#065f56);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">View Your Team</a>
      </div>
    </div>
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">African Strikers Football Club · Brooklyn Park, Minnesota</p>
      <p style="margin:0;font-size:12px;color:#334155;">ADH Super League · Est. 2020</p>
    </div>
  </div>
</body>
</html>`,
    text: `Welcome to African Strikers FC, ${playerName}!\n\nYour application as ${position} has been ACCEPTED!\n\nA team coordinator will reach out with training schedules. Welcome aboard!\n\nAfrican Strikers FC · Brooklyn Park, Minnesota`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. REJECTION EMAIL (sent when admin rejects application)
// ═══════════════════════════════════════════════════════════════
export async function sendRejectionEmail(
  to: string,
  playerName: string,
  position: string
): Promise<{ sent: boolean; error?: string }> {
  const siteUrl = getSiteUrl();

  return sendEmail({
    to,
    subject: "African Strikers FC — Application Update",
    context: "Rejection Email",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#374151 0%,#1f2937 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">⚽ African Strikers FC</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">Where Unity Comes First</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;font-weight:700;">Dear ${playerName},</h2>
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">Thank you for your interest in joining <strong style="color:#2dd4bf;">African Strikers Football Club</strong> and for taking the time to apply for the <strong style="color:#2dd4bf;">${position}</strong> position.</p>
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">After careful review, we regret to inform you that we are unable to offer you a spot on the team at this time. This was not an easy decision — we appreciate the effort and dedication you showed.</p>
      <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.6;">This does not reflect on your abilities as a player. We encourage you to keep training and improving.</p>
      <div style="background:rgba(100,116,139,0.1);border:1px solid rgba(148,163,184,0.2);border-radius:12px;padding:24px;margin:0 0 24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#e2e8f0;font-weight:700;text-transform:uppercase;letter-spacing:1px;">What You Can Do</h3>
        <ul style="margin:0;padding:0 0 0 20px;color:#94a3b8;font-size:15px;line-height:1.8;">
          <li>Continue developing your skills and fitness</li>
          <li>You are welcome to apply again in the future</li>
          <li>Follow us for open trial announcements</li>
          <li>Stay connected with the ASFC community</li>
        </ul>
      </div>
      <p style="margin:0 0 32px;font-size:16px;color:#94a3b8;line-height:1.6;">We wish you the very best in your football journey. Keep pushing forward! 💪</p>
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#475569,#334155);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Visit Our Website</a>
      </div>
    </div>
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">African Strikers Football Club · Brooklyn Park, Minnesota</p>
      <p style="margin:0;font-size:12px;color:#334155;">ADH Super League · Est. 2020</p>
    </div>
  </div>
</body>
</html>`,
    text: `Dear ${playerName},\n\nThank you for applying to African Strikers FC for the ${position} position.\n\nAfter careful review, we are unable to offer you a spot at this time. We encourage you to keep training and apply again in the future.\n\nBest regards,\nAfrican Strikers FC · Brooklyn Park, Minnesota`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. CONTACT NOTIFICATION (sent to ADMIN_EMAIL when form submitted)
// ═══════════════════════════════════════════════════════════════
export async function sendContactNotification(
  senderName: string,
  senderEmail: string,
  subject: string,
  message: string
): Promise<{ sent: boolean; error?: string }> {
  const adminEmail = getAdminEmail();

  if (!adminEmail) {
    emailLog("WARN", "Contact notification skipped — ADMIN_EMAIL not set", { senderEmail });
    return { sent: false, error: "ADMIN_EMAIL not configured" };
  }

  return sendEmail({
    to: adminEmail,
    subject: `📬 New Contact: ${subject} — from ${senderName}`,
    context: "Contact Notification → Admin",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:32px;text-align:center;">
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">📬 New Contact Form Submission</h1>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr><td style="padding:12px 16px;color:#94a3b8;font-size:13px;font-weight:700;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.1);width:120px;">Name</td><td style="padding:12px 16px;color:#ffffff;font-size:15px;border-bottom:1px solid rgba(255,255,255,0.1);">${senderName}</td></tr>
        <tr><td style="padding:12px 16px;color:#94a3b8;font-size:13px;font-weight:700;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.1);">Email</td><td style="padding:12px 16px;color:#2dd4bf;font-size:15px;border-bottom:1px solid rgba(255,255,255,0.1);"><a href="mailto:${senderEmail}" style="color:#2dd4bf;text-decoration:none;">${senderEmail}</a></td></tr>
        <tr><td style="padding:12px 16px;color:#94a3b8;font-size:13px;font-weight:700;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.1);">Subject</td><td style="padding:12px 16px;color:#ffffff;font-size:15px;border-bottom:1px solid rgba(255,255,255,0.1);">${subject}</td></tr>
      </table>
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;">
        <h3 style="margin:0 0 8px;font-size:13px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Message</h3>
        <p style="margin:0;font-size:15px;color:#e2e8f0;line-height:1.7;white-space:pre-wrap;">${message}</p>
      </div>
      <div style="text-align:center;margin:24px 0 0;">
        <a href="mailto:${senderEmail}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Reply to ${senderName}</a>
      </div>
    </div>
  </div>
</body>
</html>`,
    text: `New Contact Form Submission\n\nName: ${senderName}\nEmail: ${senderEmail}\nSubject: ${subject}\n\nMessage:\n${message}\n\nReply to: ${senderEmail}`,
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. CONTACT AUTO-REPLY (sent to the visitor who submitted)
// ═══════════════════════════════════════════════════════════════
export async function sendContactAutoReply(
  to: string,
  senderName: string
): Promise<{ sent: boolean; error?: string }> {
  const siteUrl = getSiteUrl();

  return sendEmail({
    to,
    subject: "We got your message! — African Strikers FC",
    context: "Contact Auto-Reply",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#0d9488 0%,#065f56 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">⚽ African Strikers FC</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">Where Unity Comes First</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;font-weight:700;">Thanks for reaching out, ${senderName}! 📩</h2>
      <p style="margin:0 0 16px;font-size:16px;color:#94a3b8;line-height:1.6;">We've received your message and our team will get back to you as soon as possible — typically within 1–2 business days.</p>
      <p style="margin:0 0 32px;font-size:16px;color:#94a3b8;line-height:1.6;">In the meantime, feel free to explore our website for the latest news, fixtures, and team updates.</p>
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#065f56);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Visit Our Website</a>
      </div>
    </div>
    <div style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">African Strikers Football Club · Brooklyn Park, Minnesota</p>
      <p style="margin:0;font-size:12px;color:#334155;">ADH Super League · Est. 2020</p>
    </div>
  </div>
</body>
</html>`,
    text: `Thanks for reaching out, ${senderName}!\n\nWe've received your message and will get back to you within 1–2 business days.\n\n${siteUrl}\n\nAfrican Strikers FC · Brooklyn Park, Minnesota`,
  });
}
