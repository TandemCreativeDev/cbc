"use client";

import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

import TextInput from "./TextInput";
import Checkbox from "./Checkbox";

import { useLanguage } from "@/context/LanguageContext";

import contact_form from "@/data/contact_form.json";
import Button from "./Button";

export default function ContactForm({ legend }: { legend: string }) {
  const contactForm = contact_form.reduce<{ [key: string]: string }>(
    (acc, field) => {
      acc[field.id] = "";
      return acc;
    },
    {}
  );

  const [formData, setFormData] = useState(contactForm);
  const { isFrench } = useLanguage();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    for (const key in formData) {
      fd.append(key, formData[key]);
    }
    fd.append("language", isFrench ? "fr" : "en");
    const toastId = toast.loading("Sending message...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });
      const data = await response.json();
      toast.dismiss(toastId);
      if (response.ok) {
        toast.success(
          `Thanks ${
            formData.name.trim().split(" ")[0]
          }, we’ll be in touch soon!`
        );
      } else {
        toast.error(`Something went wrong: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to send message. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <fieldset className="grid gap-x-8 gap-y-6">
        <legend className="text-lg leading-relaxed mb-8">{legend}</legend>
        {contact_form.map((field) => (
          <TextInput
            key={field.id}
            label={isFrench ? field.label_FR : field.label}
            id={field.id}
            name={field.name}
            type={field.type}
            value={formData[field.id]}
            onChange={handleChange}
            required={field.required}
            long={field.long}
            className={field.className}
          />
        ))}
        <Checkbox
          id={"privacyPolicy"}
          name={"privacyPolicy"}
          label={isFrench ? "J’accepte la " : "Agree to our "}
          url={`/privacy-policy?isFrench=${isFrench}`}
          urlText={isFrench ? "politique de confidentialité" : "privacy policy"}
          required
        />
      </fieldset>
      <Button
        type="submit"
        className="block w-full font-blanch text-2xl p-1"
        label={isFrench ? "Parlez-nous" : "Let's talk"}
      />
    </form>
  );
}
