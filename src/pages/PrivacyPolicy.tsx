import LegalPage from "./LegalPage";

const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    description="How Neoplatron India Pvt. Ltd. collects, uses and protects personal information submitted through neoplatron.com, including warranty registrations."
    path="/privacy"
    updated="30 October 2026"
    intro="This policy explains what personal information NEOPLATRON India Pvt. Ltd. (“Neoplatron”, “we”) collects through neoplatron.com, how we use it, and the choices you have."
    sections={[
      {
        heading: "Information we collect",
        paragraphs: ["We collect only what you submit to us through our forms:"],
        bullets: [
          "Warranty registration: your name, phone number, email address, postal address, vehicle or generator details, kit serial number, invoice number and date, installation date and installer details.",
          "Documents and photos you upload with a registration: the purchase invoice, vehicle registration certificate and installation photographs.",
          "Contact, partner and enquiry forms: your name, contact details and the message you send.",
          "Basic technical data such as browser type, collected through standard website analytics.",
        ],
      },
      {
        heading: "How we use it",
        bullets: [
          "To register and administer your warranty, and to issue your warranty certificate by email.",
          "To verify installations and handle warranty claims.",
          "To respond to your enquiries and, where you ask us to, to put you in touch with our dealers or installers.",
          "To keep records required for business, accounting and legal compliance.",
        ],
      },
      {
        heading: "Where your information is stored",
        paragraphs: [
          "Registration details are stored in a secured database hosted by Supabase. Uploaded documents and photos, and a record of each registration, are stored in Neoplatron’s Google Drive and Google Sheets, which only authorised Neoplatron staff can access. Warranty emails are sent through Resend.",
          "Our use of Google services is limited to storing and organising the files and records described above in Neoplatron’s own account. We do not read your Google account data, and we do not use information received from Google APIs for advertising or share it with third parties.",
        ],
      },
      {
        heading: "Sharing",
        paragraphs: [
          "We do not sell your personal information. We share it only with the service providers named above who process it for us, with the authorised dealer or installer who sold or fitted your kit, and where required by law.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "We keep warranty records for the warranty period and for as long afterwards as is needed for claims, accounting and legal obligations. Enquiry messages are kept only as long as needed to respond to you.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You may ask us to access, correct or delete your personal information, subject to records we must keep by law, by writing to info@neoplatron.com. Deleting warranty records may end your warranty coverage.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "We use access controls and encrypted connections to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: ["We may update this policy from time to time. The date at the top shows when it was last changed."],
      },
      {
        heading: "Contact us",
        paragraphs: [
          "NEOPLATRON India Pvt. Ltd. — info@neoplatron.com — +91 7416493939.",
        ],
      },
    ]}
  />
);

export default PrivacyPolicy;
