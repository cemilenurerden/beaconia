import { config } from '../config/index.js';

interface SendPasswordResetCodeParams {
  email: string;
  code: string;
  name: string;
}

export async function sendPasswordResetCode({ email, code, name }: SendPasswordResetCodeParams): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: [email],
      subject: 'Şifre Sıfırlama Kodu - Beaconia',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #3B82F6;">Beaconia</h2>
          <p>Merhaba ${name},</p>
          <p>Şifre sıfırlama talebiniz alındı. Doğrulama kodunuz:</p>
          <div style="background: #EFF6FF; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E40AF;">${code}</span>
          </div>
          <p style="color: #6B7280; font-size: 14px;">Bu kod 15 dakika içinde geçerliliğini yitirecektir.</p>
          <p style="color: #6B7280; font-size: 14px;">Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Email gönderilemedi');
  }
}
