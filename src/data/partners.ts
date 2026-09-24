export type PartnerType = "dealer" | "distributor" | "franchise";

export interface Partner {
  id: string;
  type: PartnerType;
  name: string;
  city: string;
  state: string;
  contactPerson?: string;
  phone?: string;
  address: string;
  mapsUrl: string;
}

export const PARTNER_TYPE_META: Record<
  PartnerType,
  {
    label: string;
    labelPlural: string;
    searchNoun: string;
    applyPath: string;
    applyLabel: string;
    benefitsHeading: string;
    benefits: string[];
  }
> = {
  dealer: {
    label: "Dealer",
    labelPlural: "Dealers",
    searchNoun: "dealer",
    applyPath: "/get-started/distribution",
    applyLabel: "Apply as a Dealer",
    benefitsHeading: "Why Partner With Neoplatron?",
    benefits: [
      "Ideal for established businesses, automobile distributors, fleet service providers, industrial suppliers, and entrepreneurs",
      "Market and distribute Neoplatron products within your allotted region",
      "Product training and technical support from our team",
      "Marketing assistance to help you grow in your territory",
    ],
  },
  distributor: {
    label: "Distributor",
    labelPlural: "Distributors",
    searchNoun: "distributor",
    applyPath: "/get-started/distribution",
    applyLabel: "Apply as a Distributor",
    benefitsHeading: "Why Distribute For Neoplatron?",
    benefits: [
      "Ideal for established businesses, automobile distributors, fleet service providers, industrial suppliers, and entrepreneurs",
      "Distribute Neoplatron products within your allotted region",
      "Product training and technical support from our team",
      "Marketing assistance to help you grow in your territory",
    ],
  },
  franchise: {
    label: "Franchise Partner",
    labelPlural: "Franchise Partners",
    searchNoun: "franchise partner",
    applyPath: "/get-started/franchise",
    applyLabel: "Apply for a Franchise",
    benefitsHeading: "Franchise Eligibility & Requirements",
    benefits: [
      "Initial purchase of 20–30 Neoplatron Kits",
      "Suitable for entrepreneurs, automobile businesses, workshops, distributors, and service centers",
      "Training and technical support provided",
      "Marketing assistance from the Neoplatron team",
    ],
  },
};

// Static partner directory; update here when onboarding/removing a partner
export const PARTNERS: Partner[] = [
  {
    id: "dealer-1",
    type: "dealer",
    name: "Marvel Auto Centre",
    city: "Pune",
    state: "Maharashtra",
    contactPerson: "Tanveer",
    phone: "+91 93074 57713",
    address:
      "Nizam Park, Gulmohar Society, Next to Dilliwala Dairy, Market Yard, Pune - 37",
    mapsUrl: "https://maps.app.goo.gl/pSn7AN5BoU4s8Y9s9",
  },
  {
    id: "dealer-2",
    type: "dealer",
    name: "Karthikeya Motors",
    city: "Hyderabad",
    state: "Telangana",
    contactPerson: "Praveen",
    phone: "+91 93936 83783",
    address:
      "SV Colony, Chengicharla X Road, Warangal Highway, Pillar No: 122, Hyderabad, Telangana",
    mapsUrl: "https://maps.app.goo.gl/v9y7aJ1VB2F1T8DB9?g_st=iw",
  },
  {
    id: "distributor-1",
    type: "distributor",
    name: "Srinivas Chowdary",
    city: "East/West Godavari",
    state: "Andhra Pradesh",
    phone: "+91 91543 44771",
    address:
      "Thirumala Apartment, Ground Floor, Pothavaram Road, East Godavari Dt, Andhra Pradesh - 543112",
    mapsUrl: "https://maps.app.goo.gl/FhuJfCAEfsJYWen47?g_st=aw",
  },
  {
    id: "distributor-2",
    type: "distributor",
    name: "HydroTorque Energy",
    city: "Erode",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman",
    phone: "+91 96298 94842",
    address:
      "16/8, Periya Thoattam, Ondikkaranpalayam, Villarasampatti, Erode - 638012",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8%2C+Periya+Thoattam%2C+Ondikkaranpalayam%2C+Villarasampatti%2C+Erode+-+638012",
  },
  {
    id: "dealer-3",
    type: "dealer",
    name: "HydroTorque Energy",
    city: "Erode",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman Vetrikannan",
    phone: "+91 96298 94842",
    address: "16/8 Periya Thoattam, Ondikkarampalayam, Villarasampatti, Erode district, Tamil Nadu - 638107",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8+Periya+Thoattam%2C+Ondikkarampalayam%2C+Villarasampatti%2C+Erode+district%2C+Tamil+Nadu+-+638107",
  },
  {
    id: "dealer-4",
    type: "dealer",
    name: "HydroTorque Energy",
    city: "Tirupur",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman Vetrikannan",
    phone: "+91 96298 94842",
    address: "16/8 Periya Thoattam, Ondikkarampalayam, Villarasampatti, Erode district, Tamil Nadu - 638107",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8+Periya+Thoattam%2C+Ondikkarampalayam%2C+Villarasampatti%2C+Erode+district%2C+Tamil+Nadu+-+638107",
  },
  {
    id: "dealer-5",
    type: "dealer",
    name: "HydroTorque Energy",
    city: "Coimbatore",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman Vetrikannan",
    phone: "+91 96298 94842",
    address: "16/8 Periya Thoattam, Ondikkarampalayam, Villarasampatti, Erode district, Tamil Nadu - 638107",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8+Periya+Thoattam%2C+Ondikkarampalayam%2C+Villarasampatti%2C+Erode+district%2C+Tamil+Nadu+-+638107",
  },
  {
    id: "dealer-6",
    type: "dealer",
    name: "HydroTorque Energy",
    city: "Namakkal",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman Vetrikannan",
    phone: "+91 96298 94842",
    address: "16/8 Periya Thoattam, Ondikkarampalayam, Villarasampatti, Erode district, Tamil Nadu - 638107",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8+Periya+Thoattam%2C+Ondikkarampalayam%2C+Villarasampatti%2C+Erode+district%2C+Tamil+Nadu+-+638107",
  },
  {
    id: "dealer-7",
    type: "dealer",
    name: "HydroTorque Energy",
    city: "Krishnagiri",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman Vetrikannan",
    phone: "+91 96298 94842",
    address: "16/8 Periya Thoattam, Ondikkarampalayam, Villarasampatti, Erode district, Tamil Nadu - 638107",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8+Periya+Thoattam%2C+Ondikkarampalayam%2C+Villarasampatti%2C+Erode+district%2C+Tamil+Nadu+-+638107",
  },
  {
    id: "dealer-8",
    type: "dealer",
    name: "HydroTorque Energy",
    city: "Dharmapuri",
    state: "Tamil Nadu",
    contactPerson: "Gowthaman Vetrikannan",
    phone: "+91 96298 94842",
    address: "16/8 Periya Thoattam, Ondikkarampalayam, Villarasampatti, Erode district, Tamil Nadu - 638107",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=16%2F8+Periya+Thoattam%2C+Ondikkarampalayam%2C+Villarasampatti%2C+Erode+district%2C+Tamil+Nadu+-+638107",
  },
  {
    id: "franchise-1",
    type: "franchise",
    name: "Green OS Hydrogen Technologies Pvt Ltd",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    contactPerson: "K. Chakradhar",
    phone: "+91 86631 51759",
    address: "Shop no. 275, Iron Complex, Urmila Subbarao Nagar, Jojinagar, Bhavanipuram, Vijayawada, Andhra Pradesh 520012",
    mapsUrl: "https://maps.app.goo.gl/MgUGmzoj2LqmPGGR7",
  },
  {
    id: "franchise-2",
    type: "franchise",
    name: "Srinivas Chowdary",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    phone: "+91 91543 44771",
    address:
      "1-69-4/1, Rythu Bazaar Rd, Opposite Rythu Bazaar, MVP Colony, Sector 4, Visakhapatnam, Andhra Pradesh - 530017",
    mapsUrl: "https://maps.app.goo.gl/6r74cFHskrFdBoZZ7",
  },
];
