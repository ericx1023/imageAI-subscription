import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


interface EmailData {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: EmailData) {
  try {
    ('開始發送電子郵件:', { to, subject, text });
    
    const data = await resend.emails.send({
      from: 'Gen My Image <info@mail.genmyimage.com>',
      to: [to],
      subject: subject,
      html: text,
    });
    
    ('電子郵件發送成功:', data);
    const emailId = data.data?.id;
    const status = await resend.emails.get(emailId!);
    ('郵件狀態:', status);
    return data;
  } catch (error) {
    console.error('發送電子郵件時發生錯誤:', error);
    throw error;
  }
} 