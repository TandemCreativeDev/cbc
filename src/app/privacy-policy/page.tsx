import type { Metadata } from "next";
import PrivacyPolicyClient from "./_components/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
