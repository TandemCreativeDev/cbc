"use client";

import { FormEvent, useState, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { isFrench } = useLanguage();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    for (const key in formData) {
      fd.append(key, formData[key]);
    }
    fd.append("language", isFrench ? "fr" : "en");

    const loadingMessage = isFrench
      ? "Envoi en cours..."
      : "Sending message...";
    const toastId = toast.loading(loadingMessage);

    try {
      const response = await fetch("/api/send-emails", {
        method: "POST",
        body: fd,
      });
      const data = await response.json();
      toast.dismiss(toastId);

      if (response.ok) {
        const successMessage = isFrench
          ? `Merci ${
              formData.name.trim().split(" ")[0]
            }, nous vous recontacterons bientôt !`
          : `Thanks ${
              formData.name.trim().split(" ")[0]
            }, we'll be in touch soon!`;
        toast.success(successMessage);

        // Reset form on success
        setFormData(contactForm);
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        const errorMessage = isFrench
          ? `Une erreur s'est produite : ${data.error}`
          : `Something went wrong: ${data.error}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      const errorMessage = isFrench
        ? "Échec de l'envoi du message. Veuillez réessayer plus tard."
        : "Failed to send message. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-heading"
      aria-describedby="contact-form-description"
    >
      <h2 id="contact-form-heading" className="sr-only">
        {isFrench ? "Formulaire de contact" : "Contact Form"}
      </h2>
      <p id="contact-form-description" className="sr-only">
        {isFrench
          ? "Remplissez ce formulaire pour nous envoyer un message. Les champs obligatoires sont marqués."
          : "Fill out this form to send us a message. Required fields are marked."}
      </p>

      <fieldset className="grid gap-x-8 gap-y-6" disabled={isSubmitting}>
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
          label={isFrench ? "J'accepte la " : "Agree to our "}
          url={`/privacy-policy?isFrench=${isFrench}`}
          urlText={isFrench ? "politique de confidentialité" : "privacy policy"}
          required
        />
      </fieldset>

      <Button
        type="submit"
        disabled={isSubmitting}
        label={isFrench ? "Faisons de la music!" : "Let's jam!"}
        aria-label={
          isFrench ? "Envoyer le formulaire de contact" : "Submit contact form"
        }
        aria-describedby="submit-help"
        className="block w-full font-blanch text-2xl p-1"
      ></Button>
      <div id="submit-help" className="sr-only">
        {isFrench
          ? "Cliquez pour envoyer votre message à Clark's Bowling Club"
          : "Click to send your message to Clark's Bowling Club"}
      </div>
    </form>
  );
}
