import { config } from '../config/index.js';

const RESEND_API = 'https://api.resend.com/emails';

interface EmailParams {
  email: string;
  subject: string;
  html: string;
}

async function sendEmail({ email, subject, html }: EmailParams): Promise<void> {
  const response = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: [email],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Email gönderilemedi');
  }
}

function buildCodeEmail({
  name,
  code,
  message,
  securityNote,
}: {
  name: string;
  code: string;
  message: string;
  securityNote: string;
}): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1E40AF;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Beaconia</h1>
              <p style="margin:6px 0 0;color:#BFDBFE;font-size:13px;">Şimdi ne yapmalıyım?</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#111827;font-size:16px;">Merhaba <strong>${name}</strong>,</p>
              <p style="margin:0 0 28px;color:#6B7280;font-size:15px;line-height:1.6;">${message}</p>

              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:28px;text-align:center;">
                    <p style="margin:0 0 10px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Doğrulama Kodu</p>
                    <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#1E40AF;">${code}</span>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#FFFBEB;border-left:3px solid #F59E0B;padding:12px 16px;border-radius:0 8px 8px 0;">
                    <p style="margin:0;color:#92400E;font-size:13px;">&#9200; Bu kod <strong>15 dakika</strong> içinde geçerliliğini yitirecektir.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.6;">${securityNote}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#6B7280;font-size:12px;">Bu e-posta Beaconia tarafından otomatik olarak gönderilmiştir.</p>
              <p style="margin:0;color:#9CA3AF;font-size:12px;">&copy; ${year} Beaconia. Tüm hakları saklıdır.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendEmailVerificationCode({ email, code, name }: {
  email: string;
  code: string;
  name: string;
}): Promise<void> {
  await sendEmail({
    email,
    subject: 'E-posta Doğrulama Kodu - Beaconia',
    html: buildCodeEmail({
      name,
      code,
      message: 'Hesabınızı doğrulamak için aşağıdaki kodu kullanın.',
      securityNote: 'Bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.',
    }),
  });
}

export async function sendPasswordResetCode({ email, code, name }: {
  email: string;
  code: string;
  name: string;
}): Promise<void> {
  await sendEmail({
    email,
    subject: 'Şifre Sıfırlama Kodu - Beaconia',
    html: buildCodeEmail({
      name,
      code,
      message: 'Şifre sıfırlama talebiniz alındı. Aşağıdaki kodu kullanarak şifrenizi sıfırlayabilirsiniz.',
      securityNote: 'Bu talebi siz yapmadıysanız şifreniz güvende, bu e-postayı görmezden gelebilirsiniz. Hesabınıza yetkisiz erişim şüphesi varsa destek ekibimizle iletişime geçin.',
    }),
  });
}
