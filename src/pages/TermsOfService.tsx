import LegalPage from "./LegalPage";

const TermsOfService = () => (
  <LegalPage
    title="Terms of Service"
    description="Terms for using neoplatron.com and its warranty registration service."
    path="/terms"
    updated="30 October 2026"
    intro="These terms apply to your use of neoplatron.com, operated by NEOPLATRON India Pvt. Ltd. (“Neoplatron”). By using the website you agree to them."
    sections={[
      {
        heading: "Use of the website",
        paragraphs: [
          "You may use this website for lawful purposes only. You must not attempt to disrupt it, gain unauthorised access to it, or submit false or misleading information.",
        ],
      },
      {
        heading: "Information you provide",
        paragraphs: [
          "You are responsible for the accuracy of the details, documents and photos you submit, including in warranty registrations. Inaccurate or false information may void your warranty.",
        ],
      },
      {
        heading: "Warranty registration",
        paragraphs: [
          "Registering a product through this website is subject to the Green Hydrogen Kit Warranty Terms & Conditions, which are shown during registration and included with your warranty certificate. Those terms govern warranty coverage, exclusions and claims.",
          "A warranty is valid only when the registration is complete and accepted, and the kit is installed by an authorised Neoplatron dealer or installer.",
        ],
      },
      {
        heading: "Product information",
        paragraphs: [
          "Mileage, savings and emissions figures shown on this website are indicative. Actual results depend on the vehicle, its condition, fuel and driving conditions.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The content, logos and designs on this website belong to Neoplatron or its licensors. You may not copy or reuse them without our written permission.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the extent permitted by law, Neoplatron is not liable for indirect or consequential loss arising from use of this website. Nothing in these terms limits liability that cannot be limited by law.",
        ],
      },
      {
        heading: "Privacy",
        paragraphs: ["How we handle your personal information is described in our Privacy Policy at neoplatron.com/privacy."],
      },
      {
        heading: "Governing law",
        paragraphs: ["These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts specified by Neoplatron India Pvt Ltd, subject to applicable law."],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          "We may update these terms from time to time; the date at the top shows the latest version. Questions: info@neoplatron.com.",
        ],
      },
    ]}
  />
);

export default TermsOfService;
