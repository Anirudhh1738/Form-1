import { FormState, ServicesDisplay } from "./types";

export const SERVICES_LIST: { key: keyof ServicesDisplay; label: string }[] = [
  { key: "trademarkRegistration", label: "Trademark Registration" },
  { key: "trademarkRenewal", label: "Trademark Renewal" },
  { key: "trademarkObjection", label: "Trademark Objection" },
  { key: "trademarkOpposition", label: "Trademark Opposition" },
  { key: "copyrightRegistration", label: "Copyright Registration" },
  { key: "privateLimitedRegistration", label: "Private Limited Registration" },
  { key: "llpRegistration", label: "LLP Registration" },
  { key: "opcRegistration", label: "OPC Registration" },
  { key: "section8Registration", label: "Section 8 Registration" },
  { key: "gstRegistration", label: "GST Registration" },
  { key: "gstFiling", label: "GST Filing" },
  { key: "gstModification", label: "GST Modification" },
  { key: "fssaiRegistration", label: "FSSAI Registration" },
  { key: "iecRegistration", label: "IEC Registration" },
  { key: "isoRegistration", label: "ISO Registration" },
  { key: "pfRegistration", label: "PF Registration" },
  { key: "esicRegistration", label: "ESIC Registration" },
  { key: "taxFiling", label: "Tax Filing" },
  { key: "payrollServices", label: "Payroll Services" },
  { key: "businessCompliance", label: "Business Compliance" },
  { key: "legalDisputeServices", label: "Legal Dispute Services" },
  { key: "hrServices", label: "HR Services" },
  { key: "bookkeeping", label: "Bookkeeping" },
  { key: "ngoRegistration", label: "NGO Registration" },
];

export const INITIAL_SERVICES_STATE: ServicesDisplay = {
  trademarkRegistration: false,
  trademarkRenewal: false,
  trademarkObjection: false,
  trademarkOpposition: false,
  copyrightRegistration: false,
  privateLimitedRegistration: false,
  llpRegistration: false,
  opcRegistration: false,
  section8Registration: false,
  gstRegistration: false,
  gstFiling: false,
  gstModification: false,
  fssaiRegistration: false,
  iecRegistration: false,
  isoRegistration: false,
  pfRegistration: false,
  esicRegistration: false,
  taxFiling: false,
  payrollServices: false,
  businessCompliance: false,
  legalDisputeServices: false,
  hrServices: false,
  bookkeeping: false,
  ngoRegistration: false,
  otherServices: "",
};

export const INITIAL_FORM_STATE: FormState = {
  // Step 1
  ownerFullName: "",
  designation: "",
  workingHours: "",

  // Step 2
  mobileNumber: "",
  whatsAppNumber: "",
  emailAddress: "",
  alternateEmail: "",
  officeAddress: "",
  city: "New Delhi",
  state: "Delhi",
  pincode: "",
  country: "India",
  googleMapsLink: "",

  // Step 3
  aboutUsContent: "",
  whyChooseUsContent: "",
  founderStory: "",
  companyHistory: "",
  servicesDescription: "",
  legalDisclaimerText: "Disclaimer: All information, data and resources compiled here are confidential.",
  privacyPolicyText: "",
  termsConditionsText: "",
  refundPolicyText: "",

  // Step 4
  services: INITIAL_SERVICES_STATE,

  // Step 5
  team: [],

  // Step 6
  primaryBrandColor: "#0A1931",
  secondaryBrandColor: "#F4C430",
  fontStylePreference: "Outfit (Modern Sans)",
  websiteStylePreference: "Corporate",
  companyLogoName: "",
  faviconName: "",
  brochureName: "",
  brandGuideName: "",

  // Step 7 media
  mediaMetadata: {
    heroBanners: [],
    teamPhotos: [],
    officePhotos: [],
    serviceImages: [],
    certificates: [],
    awards: [],
    clientLogos: [],
    galleryImages: [],
  },

  // Step 8
  facebookLink: "",
  instagramLink: "",
  linkedInLink: "",
  twitterLink: "",
  youTubeLink: "",
  whatsAppLink: "",
  telegramLink: "",
  existingWebsiteUrl: "",

  // Step 9
  totalClientsServed: "",
  yearsOfExperience: "",
  googleReviewsCount: "",
  awardsWonCount: "",
  certificationsList: "",
  governmentApprovals: "",
  industryMemberships: "",
  associatedBrands: "",

  // Step 10
  testimonials: [],

  // Step 11
  targetKeywords: "",
  metaTitle: "",
  metaDescription: "",
  businessCategories: "",
  targetLocations: "",

  // Step 12
  competitorUrls: "",
  referenceUrls: "",
  specialFeaturesNeeded: "",
  pagesNeeded: "",
  additionalNotes: "",

  // Step 13
  advancePaid: "",
  remainingAmount: "",
  paymentMethod: "Bank Transfer",
  paymentProofName: "",
};

export interface StepDefinition {
  num: number;
  title: string;
  shortTitle: string;
  description: string;
  requiredFields: string[];
}

export const FORM_STEPS: StepDefinition[] = [
  {
    num: 1,
    title: "Owner Profile & Basic Details",
    shortTitle: "Owner",
    description: "Provide the essential owner identification data, official designation, and operational office hours.",
    requiredFields: ["ownerFullName", "designation"],
  },
  {
    num: 2,
    title: "Contact & Address Details",
    shortTitle: "Contact",
    description: "Specify active helpline coordinates, physical addresses, and map locators for your offices.",
    requiredFields: ["mobileNumber", "emailAddress", "officeAddress", "city", "pincode", "country"],
  },
  {
    num: 3,
    title: "Website Content Details",
    shortTitle: "Content",
    description: "Draft original marketing copywriting, corporate missions, and brand narratives for standard pages.",
    requiredFields: ["aboutUsContent", "whyChooseUsContent"],
  },
  {
    num: 4,
    title: "Services to Display",
    shortTitle: "Services",
    description: "Select core business expertise, certifications, tax, and compliance services to publish.",
    requiredFields: [],
  },
  {
    num: 5,
    title: "Team Details",
    shortTitle: "Team",
    description: "Profile management directors, lead attorneys, CPAs, or core partners advising clients.",
    requiredFields: [],
  },
  {
    num: 6,
    title: "Branding Details",
    shortTitle: "Branding",
    description: "Outline signature brand palettes, font preferences, and upload corporate logos/assets.",
    requiredFields: [],
  },
  {
    num: 7,
    title: "Website Media Assets",
    shortTitle: "Media",
    description: "Upload high-resolution photography, hero banners, client proofs, certificates, and awards.",
    requiredFields: [],
  },
  {
    num: 8,
    title: "Social Media & Links",
    shortTitle: "Socials",
    description: "Connect social media digital assets, chat handles, and existing legacy web URLs.",
    requiredFields: [],
  },
  {
    num: 9,
    title: "Trust & Credibility",
    shortTitle: "Metrics",
    description: "Highlight historical metrics, volume of clients served, review counts, and approvals achieved.",
    requiredFields: [],
  },
  {
    num: 10,
    title: "Client Testimonials",
    shortTitle: "Reviews",
    description: "Submit written or verbal client reviews, high satisfaction rates, and profile pictures.",
    requiredFields: [],
  },
  {
    num: 11,
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    description: "Input target focus keywords, meta tag suggestions, niche categories, and geographical regions.",
    requiredFields: [],
  },
  {
    num: 12,
    title: "Additional Requirements",
    shortTitle: "Notes",
    description: "Include reference competitor websites, special module features, specific custom notes.",
    requiredFields: [],
  },
  {
    num: 13,
    title: "Payment Details",
    shortTitle: "Receipt",
    description: "State contractual advance retainers paid vs outstanding balances and attach transaction slips.",
    requiredFields: ["advancePaid", "paymentMethod"],
  },
];
