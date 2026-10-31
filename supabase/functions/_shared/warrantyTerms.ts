// Neoplatron Green Hydrogen Kit — Warranty Terms & Conditions.
// Single source of truth: imported by the website (Warranty page) and by the
// send-warranty-email edge function (warranty certificate PDF).
// Keep to plain ASCII / WinAnsi characters so the PDF's standard fonts can render it.

export interface TermItem {
  n: string;
  text: string;
  bullets?: string[];
  /** Renders as a bold sub-heading (e.g. "2.1. One-Year Replacement Warranty"). */
  subheading?: boolean;
}

export interface TermSection {
  title: string;
  items: TermItem[];
}

export const WARRANTY_TERMS_TITLE = "Green Hydrogen Kit - Warranty Terms & Conditions";
export const WARRANTY_MANUFACTURER = "Neoplatron India Pvt. Ltd.";
export const WARRANTY_PRODUCT = "Hydrogen Kit / Hydrogen-Assisted Fuel Enhancement System";

export const WARRANTY_TERMS: TermSection[] = [
  {
    title: "1. Scope",
    items: [
      { n: "1.1.", text: "These Terms and Conditions (\"Terms\") govern the sale, installation and warranty of the Hydrogen Kit (\"Kit\") supplied by Neoplatron India Pvt Ltd." },
      { n: "1.2.", text: "The Kit is designed for use with compatible 2-wheelers, 3-wheelers, 4-wheelers, other multi-wheel vehicles, marine engines, generators, earth movers, machinery and other approved applications, subject to the technical specifications and installation requirements prescribed by the Company." },
      { n: "1.3.", text: "The customer's purchase invoice and these Terms together constitute the agreement between the Company and the customer." },
    ],
  },
  {
    title: "2. Warranty Structure",
    items: [
      { n: "2.1.", text: "One-Year Replacement Warranty", subheading: true },
      { n: "2.1.1.", text: "The Kit shall carry a 1-year replacement warranty from the date of installation or invoice, whichever is specified on the customer's warranty certificate." },
      {
        n: "2.1.2.",
        text: "During the warranty period, if an eligible component of the Kit develops a manufacturing defect under normal operating conditions, the Company may, at its discretion:",
        bullets: [
          "Repair the defective component.",
          "Replace the defective component.",
          "Replace the complete Kit where the defect cannot reasonably be rectified.",
        ],
      },
      { n: "2.2.", text: "Replacement will be subject to inspection and confirmation by the Company or its authorised service partner." },
      { n: "2.3.", text: "Warranty Is Not a Performance Guarantee", subheading: true },
      { n: "", text: "Actual performance may vary depending upon vehicle/engine condition, fuel quality, driving pattern, operating environment, load, maintenance, calibration and other external factors." },
    ],
  },
  {
    title: "3. User Instructions",
    items: [
      { n: "3.1.", text: "Engine noise, piston noise, tappet and cranking noise black smoke emission(valve problem) should be rectified before fitting the unit. The manufacturer/distributor/franchisee/dealer is not responsible for the damage arising in the vehicle because of the Unit. If installed even with the above mentioned faults. For the best results and performance of the unit, ensure installing the unit from the Authorised Service Centers only / Authorised Certified Technician. Unauthorized installation will void warranty and/or will not give results estimated." },
      { n: "3.2.", text: "Battery should be in very good condition before the installation." },
      { n: "3.3.", text: "Air filter, Air intake (Throttle Section) and Exhaust Section should be clean and tuned to optimum. Service Air Filter regularly, ensure fuel filter to be clean, service it regularly, ensure spark plug in good condition. If the spark plug is not in good condition, it needs to be replaced." },
      { n: "3.4.", text: "Improper / Reverse wiring may cause fault in the unit and will not be covered in Warranty / Guarantee, Improper tubing will not give results. Try to get Unit installed from Authorized Service centers only, to avoid conspiracy." },
      { n: "3.5.", text: "Check the air filter, If found dirty clean it or replace it. Air filter plays an important role in the SFC (Specified Fuel Consumption)." },
      { n: "3.6.", text: "SFC / Mileage is directly dependent on Driving Style, Traffic Conditions and Engine Condition. As per EPA (Environment Protection Act 1986), best SFC/mileage is always calculated at economy speed 80kmph or 2000RPM drive in a 4 wheel vehicle. Neoplatron Hydrogen Kits are calibrated on the same to give the best." },
      { n: "3.7.", text: "Change Engine Oil on/before first 2000 kms, drive must / compulsory because oil will contaminate due to decarbonization of the engine and may jam the strainer in the oil chamber. The manufacturer is not responsible directly or indirectly for any problem arising on failure of the first time drain and replacement of oil. Top up liquid after / on every 15,000/30,000 based on the model of the kit." },
    ],
  },
  {
    title: "4. Warranty",
    items: [
      { n: "4.1.", text: "Manufacturer provides ONE YEAR PRODUCT WARRANTY only for MANUFACTURING DEFECTS Contamination/Slugging/Corrosion arising in the Unit. Due to unauthorised refill or Top Up (Other than the liquid provided by the manufacturer). The accidental or tampering in the unit will void warranty. No warranty for water damage or short circuit in the unit due to mishandling or improper installation." },
      { n: "4.2.", text: "For consistent and persistent results the unit ensures regular maintenance of the Kit as advised by Neoplatron/Distributor/Franchise/Dealer or Authorised Certified Technician." },
      { n: "4.3.", text: "Warranty One year or 20000 Kms which ever is earlier." },
    ],
  },
  {
    title: "5. Installation",
    items: [
      { n: "5.1.", text: "The Kit must be installed by the Company or an authorised installation/service partner." },
      {
        n: "5.2.",
        text: "Warranty may be rendered invalid if:",
        bullets: [
          "The Kit is installed by an unauthorised person.",
          "Installation is materially altered.",
          "Wiring or electrical connections are modified.",
          "Hydrogen/fuel-cell components are tampered with.",
          "Non-approved components are connected to the Kit.",
          "The Kit is installed in an application not approved by the Company.",
        ],
      },
      { n: "5.3.", text: "The Company shall not be responsible for damage arising from improper installation by an unauthorised party." },
    ],
  },
  {
    title: "6. Vehicle and Engine Compatibility",
    items: [
      { n: "6.1.", text: "The Kit shall only be installed in vehicles, engines, generators, machinery or equipment for which compatibility has been confirmed by the Company." },
      {
        n: "6.2.",
        text: "The customer shall provide accurate information regarding:",
        bullets: [
          "Vehicle/equipment model.",
          "Engine type.",
          "Fuel type.",
          "Engine capacity.",
          "Operating conditions.",
          "Relevant technical specifications.",
        ],
      },
      { n: "6.3.", text: "The Company reserves the right to reject installation where the application is technically unsuitable or presents a safety or reliability concern or Engine Characteristics." },
    ],
  },
  {
    title: "7. Warranty Exclusions",
    items: [
      { n: "7.1.", text: "The warranty shall not cover defects, failures or damage resulting from:" },
      { n: "7.1.1.", text: "Accident, collision, fire, flooding or natural calamity." },
      { n: "7.1.2.", text: "Improper installation or unauthorised modification." },
      { n: "7.1.3.", text: "Tampering with the Kit or its components." },
      { n: "7.1.4.", text: "Use outside the Company's specified operating parameters." },
      { n: "7.1.5.", text: "Use of incompatible fuel, electrical systems or engine configurations." },
      { n: "7.1.6.", text: "Physical damage caused by external factors." },
      { n: "7.1.7.", text: "Damage caused by rodents, corrosion, chemicals or environmental exposure." },
      { n: "7.1.8.", text: "Normal wear and tear." },
      { n: "7.1.9.", text: "Consumable items, where applicable." },
      { n: "7.1.10.", text: "Failure to follow recommended maintenance or service procedures." },
      { n: "7.1.11.", text: "Use of unauthorised replacement components." },
      { n: "7.1.12.", text: "Installation or servicing by an unauthorised person." },
      { n: "7.1.13.", text: "Commercial or industrial use outside the application approved by the Company." },
      { n: "7.1.14.", text: "Damage resulting from modifications to the vehicle/engine after installation." },
      { n: "7.1.15.", text: "Any consequential damage caused by an unrelated vehicle or engine failure." },
    ],
  },
  {
    title: "8. Engine and Vehicle Warranty",
    items: [
      { n: "8.1.", text: "The Kit warranty is limited to the Kit and its eligible components." },
      { n: "8.2.", text: "Unless expressly stated in writing, the Company does not assume responsibility for the manufacturer's warranty of the vehicle, engine, generator or other equipment on which the Kit is installed." },
      { n: "8.3.", text: "The customer should ensure that installation of the Kit is compatible with the applicable vehicle/equipment manufacturer's requirements." },
    ],
  },
  {
    title: "9. Service and Maintenance",
    items: [
      { n: "9.1.", text: "Customers shall operate and maintain the Kit in accordance with the Company's instructions." },
      {
        n: "9.2.",
        text: "The Company may recommend periodic inspection depending on:",
        bullets: ["Vehicle usage.", "Engine type.", "Operating hours.", "Environmental conditions.", "Fuel type.", "Kit configuration."],
      },
      { n: "9.3.", text: "Failure to follow mandatory service requirements may affect warranty eligibility." },
    ],
  },
  {
    title: "10. Warranty Claim Procedure",
    items: [
      {
        n: "10.1.",
        text: "For a warranty claim, the customer shall provide:",
        bullets: [
          "Customer name and contact details.",
          "Invoice/warranty certificate.",
          "Kit serial number.",
          "Vehicle/equipment registration number.",
          "Description of the issue.",
          "Photographs/videos or diagnostic information where requested.",
        ],
      },
      { n: "10.2.", text: "The Company may inspect the Kit before approving a warranty claim." },
      { n: "10.3.", text: "If the defect is confirmed as a manufacturing defect covered under warranty, the Company shall provide the applicable repair or replacement service." },
    ],
  },
  {
    title: "11. Replacement Components",
    items: [
      { n: "11.1.", text: "Any component replaced under warranty shall become the property of the Company unless otherwise required by applicable law." },
      {
        n: "11.2.",
        text: "Replacement components may be:",
        bullets: ["New.", "Equivalent specification components; or add-on components.", "Refurbished components of equivalent functionality."],
      },
      { n: "11.3.", text: "Subject to applicable law and Company policy, the warranty period for replacement components shall not extend beyond the original applicable warranty period unless specifically stated otherwise." },
    ],
  },
  {
    title: "12. Transfer of Kit",
    items: [
      { n: "12.1.", text: "The warranty is linked to the Kit's serial number and registered vehicle/equipment." },
      { n: "12.2.", text: "Transfer of the Kit to another vehicle may require prior written approval from the Company." },
      {
        n: "12.3.",
        text: "A transfer may require:",
        bullets: [
          "Technical inspection.",
          "Reinstallation.",
          "Recalibration.",
          "Change of customer records; and/or",
          "Payment of applicable transfer/service charges.",
        ],
      },
    ],
  },
  {
    title: "13. Customer Responsibilities",
    items: [
      { n: "13.1.", text: "The customer agrees to use the Kit only for its intended purpose." },
      { n: "13.2.", text: "The customer agrees to follow operating and safety instructions." },
      { n: "13.3.", text: "The customer agrees to ensure authorised servicing." },
      { n: "13.4.", text: "The customer agrees to report abnormal operation promptly." },
      { n: "13.5.", text: "The customer agrees not to tamper with the Kit." },
      { n: "13.6.", text: "The customer agrees to maintain the vehicle/engine according to manufacturer recommendations." },
      { n: "13.7.", text: "The customer agrees to provide accurate vehicle and customer information." },
    ],
  },
  {
    title: "14. Safety",
    items: [
      { n: "14.1.", text: "Hydrogen is a highly combustible gas and must be handled with appropriate safety precautions." },
      { n: "14.2.", text: "The customer shall not attempt to dismantle, modify, repair, refill or otherwise interfere with hydrogen-generation, storage, fuel-cell or associated components unless expressly authorised by the Company." },
      { n: "14.3.", text: "Any suspected leakage, abnormal smell, overheating, electrical fault, physical damage or abnormal operation should be reported immediately to the Company/authorised service partner." },
      { n: "14.4.", text: "The Company may suspend operation or service of the Kit where it reasonably determines that continued operation may create a safety risk." },
    ],
  },
  {
    title: "15. Performance and Environmental Benefits",
    items: [
      { n: "15.1.", text: "Any performance, fuel-efficiency, emission-reduction or environmental-benefit figures communicated by the Company shall be understood as indicative or application-dependent unless supported by a specific test report applicable to the customer's vehicle/application." },
      { n: "15.2.", text: "Actual results may vary due to vehicle condition, engine condition, fuel quality, driving behaviour, load, terrain, climate, maintenance and other operating variables." },
      { n: "15.3.", text: "The customer acknowledges that the Kit does not eliminate the need for normal vehicle/engine maintenance." },
    ],
  },
  {
    title: "16. Refund Policy for Mileage Performance",
    items: [
      { n: "16.1.", text: "If, after installation and qualifying use of the Kit, the expected minimum mileage improvement of 30% in city driving and 50% on highways is not achieved, the customer may request a refund, subject to the conditions in this section and approval by Neoplatron India Pvt. Ltd." },
      { n: "16.2.", text: "A refund request or assessment of whether the Kit is working as expected may be considered only after the Kit has been used regularly for at least 10 days or has completed 2,000 kilometres of use, as applicable. Neoplatron may determine the appropriate assessment period based on the circumstances." },
      { n: "16.3.", text: "To be eligible for consideration, the customer must provide reasonable proof that the expected mileage improvement has not been achieved. Neoplatron may conduct or require a mileage test following its standard SOP, which is the accurate testing procedure: (a) fill 5 litres of fuel when the reserve light comes on; (b) reset Trip A to zero; (c) drive on the 5 litres until the reserve light comes on again, and note the distance on Trip A; (d) repeat the test 3 times in city driving and 3 times on the highway. The customer must allow reasonable time and access for the company or its authorised representative to carry out the test." },
      { n: "16.4.", text: "Any refund is subject to verification of the claim and prior acceptance or approval by Neoplatron India Pvt. Ltd. The company will consider a refund only where the claim is found to be genuine and the applicable conditions have been met." },
      { n: "16.5.", text: "If a refund is approved, the refund amount will exclude the 5% GST amount and the applicable installation and deinstallation charges." },
      { n: "16.6.", text: "Spare-parts and wiring charges will also be deducted from the refund. These charges are approximately Rs. 3,000 in total; the actual amount may vary depending on the parts and work required." },
      { n: "16.7.", text: "Meeting the mileage thresholds alone does not automatically guarantee a refund. The claim remains subject to valid evidence, testing where required, verification of the circumstances, and written approval by Neoplatron India Pvt. Ltd., subject to applicable law." },
    ],
  },
  {
    title: "17. Limitation of Liability",
    items: [
      { n: "17.1.", text: "To the maximum extent permitted by applicable law, the Company's liability shall be limited to the repair, replacement or service obligations expressly provided under the applicable warranty." },
      {
        n: "17.2.",
        text: "The Company shall not be liable for indirect, incidental, special or consequential losses arising from:",
        bullets: [
          "Vehicle downtime.",
          "Loss of business.",
          "Loss of revenue.",
          "Loss of productivity.",
          "Loss of anticipated fuel savings; or",
          "Other consequential economic losses, except where such limitation is prohibited by applicable law.",
        ],
      },
    ],
  },
  {
    title: "18. Regulatory Compliance",
    items: [
      { n: "18.1.", text: "The Kit shall be supplied and installed in accordance with applicable laws, regulations, technical standards and approvals applicable to the product and its intended application." },
      { n: "18.2.", text: "The customer shall comply with applicable vehicle, transport, environmental, electrical, safety and other regulatory requirements." },
      { n: "18.3.", text: "Where regulatory approval is required for a particular application, installation shall be subject to such approval." },
    ],
  },
  {
    title: "19. Modification of Terms",
    items: [
      { n: "19.1.", text: "The Company reserves the right to modify service procedures, technical specifications and commercial policies for future purchases, subject to applicable law." },
      { n: "19.2.", text: "Changes shall not retrospectively reduce an already-purchased warranty entitlement, except where required or permitted by law." },
    ],
  },
  {
    title: "20. Governing Law and Jurisdiction",
    items: [
      { n: "20.1.", text: "These Terms shall be governed by the laws applicable in India." },
      { n: "20.2.", text: "Any dispute arising from these Terms shall be subject to the jurisdiction of the courts specified by Neoplatron India Pvt Ltd, subject to applicable law." },
    ],
  },
  {
    title: "21. Customer Acknowledgement and Warranty Certificate Issuance",
    items: [
      { n: "21.1.", text: "The warranty certificate shall be generated electronically by Neoplatron India Pvt. Ltd. using the customer, product, vehicle/equipment, purchase and installation details recorded during warranty registration." },
      { n: "21.2.", text: "The electronically generated warranty certificate shall be sent to the customer through the available communication channel, such as WhatsApp or email." },
      { n: "21.3.", text: "The warranty certificate shall contain the registered customer details, vehicle/equipment details, Kit Serial Number, warranty commencement date, applicable warranty period and warranty expiry date." },
      { n: "21.4.", text: "The customer is responsible for ensuring that the information provided during registration is accurate and complete. Any errors or changes must be reported to Neoplatron India Pvt. Ltd. for correction." },
      { n: "21.5.", text: "The electronically generated warranty certificate serves as a record of warranty registration. Warranty coverage remains subject to these Terms and Conditions and the applicable warranty eligibility requirements." },
      { n: "21.6.", text: "The issuance or delivery of the warranty certificate does not, by itself, constitute approval of any warranty claim." },
      { n: "21.7.", text: "Neoplatron India Pvt. Ltd. shall maintain the warranty registration details and certificate records in its system for verification and warranty administration." },
    ],
  },
];
