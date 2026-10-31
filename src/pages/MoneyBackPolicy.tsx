import SEO from "../components/SEO";

const clauses = [
  {
    id: "21.1",
    text: "If, after installation and qualifying use of the Kit, the expected minimum mileage improvement of 30% in city driving and 50% on highways is not achieved, the customer may request a refund, subject to the conditions in this section and approval by Neoplatron India Pvt. Ltd.",
  },
  {
    id: "21.2",
    text: "A refund request or assessment of whether the Kit is working as expected may be considered only after the Kit has been used regularly for at least 10 days or has completed 2,000 kilometres of use, as applicable. Neoplatron may determine the appropriate assessment period based on the circumstances.",
  },
  {
    id: "21.3",
    text: "To be eligible for consideration, the customer must provide reasonable proof that the expected mileage improvement has not been achieved. Neoplatron may instead conduct or require a reserve-to-reserve mileage test, as described below. The customer must allow reasonable time and access for the company or its authorised representative to carry out the test.",
  },
  {
    id: "21.4",
    text: "Any refund is subject to verification of the claim and prior acceptance or approval by Neoplatron India Pvt. Ltd. The company will consider a refund only where the claim is found to be genuine and the applicable conditions have been met.",
  },
  {
    id: "21.5",
    text: "If a refund is approved, the refund amount will exclude the 5% GST amount. Installation and deinstallation charges, and spare-parts and wiring charges, will also be deducted from the refund. These charges are approximately Rs 3,000 in total; the actual amount may vary depending on the parts and work required.",
  },
  {
    id: "21.6",
    text: "Meeting the mileage thresholds alone does not automatically guarantee a refund. The claim remains subject to valid evidence, testing where required, verification of the circumstances, and written approval by Neoplatron India Pvt. Ltd., subject to applicable law.",
  },
];

const testSteps = [
  "Fill 5 litres of fuel when the reserve light comes on.",
  "Reset Trip A to zero.",
  "Drive on the 5 litres until the reserve light comes on again, and note the distance on Trip A.",
  "Repeat the test 3 times in city driving and 3 times on the highway.",
];

const notes = [
  "The minimum improvements (30% in city, 50% on highway) are only the minimum covered by the money back guarantee. Customers can get an improvement of up to 90%.",
  "We only refund after these tests are completed and the vehicle still does not show the minimum mileage improvement.",
  "The reserve-to-reserve test is our standard SOP for mileage accuracy. After the tests, we carry out a system calibration.",
];

export default function MoneyBackPolicy() {
  return (
    <div className="min-h-[60vh] py-12 sm:py-20">
      <SEO
        title="Money Back Policy - Neoplatron"
        description="Terms and conditions of the Neoplatron money back guarantee on mileage performance."
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-3">
          Money Back{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            Policy
          </span>
        </h1>
        <div className="w-24 h-1 bg-linear-to-r from-primary to-secondary rounded-full mb-8"></div>

        <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-5">
          Refund Policy for Mileage Performance
        </h2>

        <ol className="space-y-4 mb-10">
          {clauses.map((c) => (
            <li
              key={c.id}
              className="flex gap-4 rounded-2xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light p-4 sm:p-5"
            >
              <span className="font-title font-bold text-primary dark:text-d-primary shrink-0">
                {c.id}
              </span>
              <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                {c.text}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-2">
          Reserve-to-Reserve Mileage Test
        </h2>
        <p className="text-sm sm:text-base text-text-para dark:text-d-text-para mb-4">
          This is our standard SOP for mileage accuracy.
        </p>
        <ol className="space-y-3 mb-10">
          {testSteps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="w-7 h-7 shrink-0 rounded-full bg-linear-to-br from-primary to-secondary text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed pt-0.5">
                {step}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-4">
          Note
        </h2>
        <ol className="space-y-3 list-decimal pl-5 text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed marker:font-bold marker:text-primary">
          {notes.map((n, i) => (
            <li key={i} className="pl-1">
              {n}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
