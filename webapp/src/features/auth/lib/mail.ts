import { EmailTemplate } from "@/features/auth/components";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirm email",
    react: EmailTemplate({ firstName: email, confirmLink }),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetlink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset Password",
    react: EmailTemplate({
      firstName: email,
      confirmLink: resetlink,
      action: "reset",
    }),
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};
