import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  confirmLink: string;
  action?: "reset" | "confirm";
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  confirmLink,
  action = "confirm",
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>
      Click <a href={confirmLink}>here</a> to {action} your
      {action === "confirm" ? "email" : "password"}!
    </p>
  </div>
);
