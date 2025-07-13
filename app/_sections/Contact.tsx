"use client";
import React, { useState } from "react";
import { toast } from "@/lib/toast";
import SectionTitle from "../_components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Send,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import contact from "../_data/contact";
import Link from "next/link";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: contact.contactInfo.email,
      href: `mailto:${contact.contactInfo.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: contact.contactInfo.phone,
      href: `tel:${contact.contactInfo.phone}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value: contact.contactInfo.address,
      href: null,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "View Profile",
      href: contact.contactInfo.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect",
      href: contact.contactInfo.linkedin,
    },
  ];

  return (
    <section id="contact" className="section">
      <SectionTitle
        section={contact.section}
        description={contact.sectionDescription}
      />
      <div className="max-w-4xl w-full mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Contact Information */}

          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-foreground">
              Send a Message
            </h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me about your project or just say hello!"
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-foreground">
              {"Let's Connect"}
            </h3>
            <div className="space-y-5">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-x-3">
                  <span className="flex-shrink-0 p-2 rounded-md bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </span>
                  <div>
                    <span className="block text-xs text-muted-foreground mb-0.5">
                      {label}
                    </span>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {value}
                      </Link>
                    ) : (
                      <span className="text-sm text-foreground font-medium">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
