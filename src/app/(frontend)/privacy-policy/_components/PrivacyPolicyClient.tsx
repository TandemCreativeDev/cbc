"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import useIsMounted from "@/utils/useIsMounted";

export default function PrivacyPolicy() {
  const email = "contact@clarksbowlingclub.com";
  const { isFrench } = useLanguage();
  const isLoaded = useIsMounted();

  useEffect(() => {
    document.title = `${
      isFrench ? "Politique de Confidentialité" : "Privacy Policy"
    } | Clark's Bowling Club`;
  }, [isFrench]);

  if (!isLoaded)
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">
          {isFrench ? "Chargement du contenu..." : "Loading content..."}
        </span>
        <div aria-hidden="true">{isFrench ? "Chargement..." : "Loading..."}.</div>
      </div>
    );

  return (
    <article>
      <header className="mb-6">
        <h1 className="text-4xl font-blanch mb-2">
          {isFrench ? "Politique de Confidentialité" : "Privacy Policy"}
        </h1>
        <time dateTime="2025-03-10" className="text-sm text-gray-400">
          {isFrench
            ? "Dernière mise à jour : 21 juin 2025"
            : "Last Updated: 21 June 2025"}
        </time>
      </header>

      <div className="space-y-6">
        <section id="introduction">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench ? "1. Introduction" : "1. Introduction"}
          </h2>
          <p>
            {isFrench
              ? "Bienvenue sur Clarks Bowling Club (« nous », « notre » ou « nos »). Nous nous engageons à protéger votre vie privée et à garantir que vos informations personnelles soient traitées en toute sécurité. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons toute information soumise via notre formulaire de contact."
              : "Welcome to Clarks Bowling Club ('we,' 'us,' or 'our'). We are committed to protecting your privacy and ensuring that your personal information is handled securely. This Privacy Policy explains how we collect, use, and protect any information submitted through our contact form."}
          </p>
        </section>

        <section id="information-collection">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench
              ? "2. Quelles informations nous collectons"
              : "2. What Information We Collect"}
          </h2>
          <p className="mb-4">
            {isFrench
              ? "Lorsque vous soumettez une demande via notre formulaire de contact, nous collectons les informations suivantes :"
              : "When you submit an inquiry through our contact form, we collect the following details:"}
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>{isFrench ? "Nom :" : "Name:"}</strong>{" "}
              {isFrench ? "Prénom et nom de famille" : "First and last name"}
            </li>
            <li>
              <strong>
                {isFrench ? "Nom de l'entreprise :" : "Company Name:"}
              </strong>{" "}
              {isFrench ? "(si fourni)" : "(if provided)"}
            </li>
            <li>
              <strong>{isFrench ? "Adresse e-mail" : "Email Address"}</strong>
            </li>
            <li>
              <strong>
                {isFrench ? "Numéro de téléphone :" : "Phone Number:"}
              </strong>{" "}
              {isFrench ? "(si fourni)" : "(if provided)"}
            </li>
            <li>
              <strong>
                {isFrench ? "Contenu du message" : "Message Content"}
              </strong>
            </li>
          </ul>
        </section>

        <section id="information-usage">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench
              ? "3. Comment nous utilisons vos informations"
              : "3. How We Use Your Information"}
          </h2>
          <p className="mb-4">
            {isFrench
              ? "Nous utilisons les informations que vous fournissez uniquement dans le but de répondre à votre demande et de communiquer avec vous concernant votre requête. Plus précisément, nous :"
              : "We use the information you provide solely for the purpose of responding to your inquiry and communicating with you regarding your request. Specifically, we:"}
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>
              {isFrench
                ? "Traiter votre message et l'envoyer à notre équipe par e-mail."
                : "Process your message and send it to our team via email."}
            </li>
            <li>
              {isFrench
                ? "Utiliser vos coordonnées pour répondre à votre demande."
                : "Use your contact details to respond to your inquiry."}
            </li>
          </ul>
          <p>
            <strong>
              {isFrench
                ? "Nous ne stockons pas vos informations dans une base de données, ne les utilisons pas pour le marketing, ni ne les partageons avec des tiers."
                : "We do not store your information in a database, use it for marketing, or share it with third parties."}
            </strong>
          </p>
        </section>

        <section id="data-protection">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench
              ? "4. Comment nous protégeons vos données"
              : "4. How We Protect Your Data"}
          </h2>
          <p className="mb-4">
            {isFrench
              ? "Nous prenons des mesures de sécurité appropriées pour protéger vos informations personnelles, notamment :"
              : "We take appropriate security measures to protect your personal information, including:"}
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              {isFrench
                ? "Transmission d'e-mails sécurisée avec un cryptage conforme aux normes de l'industrie."
                : "Secure email transmission with industry-standard encryption."}
            </li>
            <li>
              {isFrench
                ? "Limitation de l'accès aux demandes reçues aux seuls personnels autorisés."
                : "Limiting access to received inquiries to authorized personnel only."}
            </li>
            <li>
              {isFrench
                ? "Ne pas stocker ou conserver les données soumises au-delà de la portée de la communication."
                : "Not storing or retaining submitted data beyond the scope of communication."}
            </li>
          </ul>
        </section>

        <section id="legal-basis">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench
              ? "5. Base légale du traitement (RGPD)"
              : "5. Legal Basis for Processing (GDPR)"}
          </h2>
          <p>
            {isFrench
              ? "En vertu du Règlement Général sur la Protection des Données (RGPD), notre base légale pour le traitement de vos données est l'**intérêt légitime** — nous traitons vos informations uniquement pour répondre à votre demande."
              : "Under the General Data Protection Regulation (GDPR), our legal basis for processing your data is **legitimate interest**—we process your information solely to respond to your inquiry."}
          </p>
        </section>

        <section id="data-rights">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench
              ? "6. Vos droits en matière de protection des données"
              : "6. Your Data Protection Rights"}
          </h2>
          <p className="mb-4">
            {isFrench
              ? "Si vous êtes résident du Royaume-Uni ou de l'UE, vous avez le droit de :"
              : "If you are a resident of the UK or EU, you have the right to:"}
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>
              {isFrench
                ? "Demander l'accès aux données personnelles que nous détenons à votre sujet."
                : "Request access to the personal data we hold about you."}
            </li>
            <li>
              {isFrench
                ? "Demander la correction ou la suppression de vos données personnelles."
                : "Request correction or deletion of your personal data."}
            </li>
            <li>
              {isFrench
                ? "S'opposer au traitement si vous pensez que vos données sont utilisées de manière illégale."
                : "Object to processing if you believe your data is being used unlawfully."}
            </li>
          </ul>
          <p>
            {isFrench
              ? "Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : "
              : "To exercise these rights, please contact us at "}
            <Link
              href={`mailto:${email}`}
              aria-label={
                isFrench
                  ? "Envoyer un e-mail à l'adresse de contact de Clark's Bowling Club"
                  : "Send email to Clark's Bowling Club contact address"
              }
              className="text-clarks-orange hover:underline focus:outline-hidden focus-visible:ring-2 focus:ring-clarks-orange"
            >
              {email}
            </Link>
            .
          </p>
        </section>

        <section id="cookies-tracking">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench ? "7. Cookies et Suivi" : "7. Cookies and Tracking"}
          </h2>
          <p>
            {isFrench
              ? "Notre site web n'utilise pas de cookies pour suivre ou stocker des informations personnelles liées aux soumissions de formulaires de contact."
              : "Our website does not use cookies to track or store personal information related to contact form submissions."}
          </p>
        </section>

        <section id="policy-changes">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench
              ? "8. Modifications de cette politique"
              : "8. Changes to This Policy"}
          </h2>
          <p>
            {isFrench
              ? "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification sera affichée sur cette page avec la date révisée."
              : "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the revised date."}
          </p>
        </section>

        <section id="contact-us">
          <h2 className="font-blanch uppercase text-2xl font-semibold mb-4">
            {isFrench ? "9. Nous contacter" : "9. Contact Us"}
          </h2>
          <p className="mb-4">
            {isFrench
              ? "Si vous avez des questions concernant cette politique de confidentialité ou sur la manière dont nous traitons vos informations, veuillez nous contacter à :"
              : "If you have any questions about this Privacy Policy or how we handle your information, please contact us at:"}
          </p>

          <address className="not-italic">
            <p>
              📧 <strong>{isFrench ? "E-mail:" : "Email:"}</strong>{" "}
              <Link
                href={`mailto:${email}`}
                aria-label={
                  isFrench
                    ? "Envoyer un e-mail à l'adresse de contact de Clark's Bowling Club"
                    : "Send email to Clark's Bowling Club contact address"
                }
                className="text-clarks-orange hover:underline focus:outline-hidden focus-visible:ring-2 focus:ring-clarks-orange"
              >
                {email}
              </Link>
            </p>
          </address>
        </section>
      </div>
    </article>
  );
}
