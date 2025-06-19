import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const PrivacyPolicyClient = dynamic(
  () => import("./_components/PrivacyPolicyClient"),
  { ssr: false }
);

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
