import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const ContactEmail = (await import("./ContactEmail")).default;
    const html = await render(
      React.createElement(ContactEmail, { name, email, message })
    );
    
    await resend.emails.send({
      from: `${name.toUpperCase()} <onboarding@resend.dev>`,
      to: ["jlescarlan11@gmail.com"],
      subject: `A New Message From ${name}`,
      replyTo: email,
      html,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
} 