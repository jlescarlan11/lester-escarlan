import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

const LOGO_URL = "https://placehold.co/120x32?text=Logo"; // Replace with your logo if available

const ContactEmail = ({ name, email, message }: ContactEmailProps) => (
  <Html>
    <Head />
    <Preview>New contact message from {name}</Preview>
    <Body
      style={{
        backgroundColor: "#f6f8fa",
        fontFamily: "Inter, Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <Container
        style={{
          backgroundColor: "#fff",
          margin: "0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 0,
        }}
      >
        {/* Logo */}
        <Section style={{ textAlign: "center", padding: "32px 0 0 0" }}>
          <Img
            src={LOGO_URL}
            alt="Logo"
            width={120}
            height={32}
            style={{ margin: "0 auto 8px auto" }}
          />
        </Section>
        {/* Greeting */}
        <Section style={{ padding: "0" }}>
          <Text
            style={{
              color: "#222",
              fontWeight: 500,
              margin: "32px 0 0 0",
            }}
          >
            こんにちわ, レスターさん
          </Text>
          <Text
            style={{
              color: "#444",
              margin: "16px 0 0 0",
              lineHeight: 1.7,
            }}
          >
            You received a new message from your portfolio contact form. Here
            are the details:
          </Text>
        </Section>
        {/* Card Section */}
        <Section
          style={{
            background: "#f6f8fa",
            borderRadius: 8,
            margin: "32px 0px 0 0px",
            padding: "24px 24px 16px 24px",
            border: "1px solid #ececec",
          }}
        >
          <Text style={{ color: "#888", fontWeight: 600, margin: 0 }}>
            Name
          </Text>
          <Text
            style={{
              color: "#222",
              margin: "0 0 16px 0",
            }}
          >
            {name}
          </Text>
          <Text style={{ color: "#888", fontWeight: 600, margin: 0 }}>
            Email
          </Text>
          <Text
            style={{
              color: "#0070f3",
              margin: "4px 0 16px 0",
            }}
          >
            <Link href={`mailto:${email}`}>{email}</Link>
          </Text>
          <Text
            style={{ color: "#888", fontSize: 13, fontWeight: 600, margin: 0 }}
          >
            Message
          </Text>
          <Text
            style={{
              color: "#222",
              fontSize: 15,
              lineHeight: 1.7,
              margin: "4px 0 0 0",
            }}
          >
            {message.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Text>
        </Section>

        {/* Footer */}
        <Section style={{ margin: "32px 0px 0px 0px", textAlign: "center" }}>
          <Text style={{ color: "#aaa", fontSize: 12, margin: 0 }}>
            This message was sent from your{" "}
            <Link
              href="https://john-lester-escarlan-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              portfolio
            </Link>{" "}
            contact form.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ContactEmail; 