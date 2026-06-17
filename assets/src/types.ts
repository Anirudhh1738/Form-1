export interface TeamMember {
  id: string;
  fullName: string;
  designation: string;
  qualification: string;
  experience: string;
  shortBio: string;
  profilePhoto?: File;
  profilePhotoUrl?: string; // Cache url for preview/persistence metadata
  profilePhotoName?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  review: string;
  rating: number; // 1-5 stars
  clientPhoto?: File;
  clientPhotoUrl?: string; // Cache url for preview/persistence metadata
  clientPhotoName?: string;
}

export interface ServicesDisplay {
  trademarkRegistration: boolean;
  trademarkRenewal: boolean;
  trademarkObjection: boolean;
  trademarkOpposition: boolean;
  copyrightRegistration: boolean;
  privateLimitedRegistration: boolean;
  llpRegistration: boolean;
  opcRegistration: boolean;
  section8Registration: boolean;
  gstRegistration: boolean;
  gstFiling: boolean;
  gstModification: boolean;
  fssaiRegistration: boolean;
  iecRegistration: boolean;
  isoRegistration: boolean;
  pfRegistration: boolean;
  esicRegistration: boolean;
  taxFiling: boolean;
  payrollServices: boolean;
  businessCompliance: boolean;
  legalDisputeServices: boolean;
  hrServices: boolean;
  bookkeeping: boolean;
  ngoRegistration: boolean;
  otherServices: string; // text for custom field
}

export interface MediaUploads {
  heroBanners: File[];
  heroBannersMetadata: { name: string; size: number }[];
  teamPhotos: File[];
  teamPhotosMetadata: { name: string; size: number }[];
  officePhotos: File[];
  officePhotosMetadata: { name: string; size: number }[];
  serviceImages: File[];
  serviceImagesMetadata: { name: string; size: number }[];
  certificates: File[];
  certificatesMetadata: { name: string; size: number }[];
  awards: File[];
  awardsMetadata: { name: string; size: number }[];
  clientLogos: File[];
  clientLogosMetadata: { name: string; size: number }[];
  galleryImages: File[];
  galleryImagesMetadata: { name: string; size: number }[];
}

export interface FormState {
  // Step 1: Owner Profile & Basic Details
  ownerFullName: string;
  designation: string;
  workingHours: string;

  // Step 2: Contact & Address Details
  mobileNumber: string;
  whatsAppNumber: string;
  emailAddress: string;
  alternateEmail: string;
  officeAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  googleMapsLink: string;

  // Step 3: Website Content Details
  aboutUsContent: string;
  whyChooseUsContent: string;
  founderStory: string;
  companyHistory: string;
  servicesDescription: string;
  legalDisclaimerText: string;
  privacyPolicyText: string;
  termsConditionsText: string;
  refundPolicyText: string;

  // Step 4: Services
  services: ServicesDisplay;

  // Step 5: Team Details
  team: TeamMember[];

  // Step 6: Branding Details
  primaryBrandColor: string;
  secondaryBrandColor: string;
  fontStylePreference: string;
  websiteStylePreference: 'Modern' | 'Corporate' | 'Luxury' | 'Premium' | 'Minimal';
  
  // Branding Files (stored separately in state, metadata kept here)
  companyLogoName?: string;
  companyLogoUrl?: string;
  faviconName?: string;
  faviconUrl?: string;
  brochureName?: string;
  brochureUrl?: string;
  brandGuideName?: string;
  brandGuideUrl?: string;

  // Step 7: Media Uploads (metadata for tracking, actual Files in state)
  mediaMetadata: {
    heroBanners: { name: string; size: number }[];
    teamPhotos: { name: string; size: number }[];
    officePhotos: { name: string; size: number }[];
    serviceImages: { name: string; size: number }[];
    certificates: { name: string; size: number }[];
    awards: { name: string; size: number }[];
    clientLogos: { name: string; size: number }[];
    galleryImages: { name: string; size: number }[];
  };

  // Step 8: Social Media Links
  facebookLink: string;
  instagramLink: string;
  linkedInLink: string;
  twitterLink: string; // X Link
  youTubeLink: string;
  whatsAppLink: string;
  telegramLink: string;
  existingWebsiteUrl: string;

  // Step 9: Trust & Credibility
  totalClientsServed: string;
  yearsOfExperience: string;
  googleReviewsCount: string;
  awardsWonCount: string;
  certificationsList: string;
  governmentApprovals: string;
  industryMemberships: string;
  associatedBrands: string;

  // Step 10: Testimonials
  testimonials: Testimonial[];

  // Step 11: SEO Details
  targetKeywords: string;
  metaTitle: string;
  metaDescription: string;
  businessCategories: string;
  targetLocations: string;

  // Step 12: Additional Requirements
  competitorUrls: string;
  referenceUrls: string;
  specialFeaturesNeeded: string;
  pagesNeeded: string;
  additionalNotes: string;

  // Step 13: Payment Details
  advancePaid: string;
  remainingAmount: string;
  paymentMethod: string;
  paymentProofName?: string;
  paymentProofUrl?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}
