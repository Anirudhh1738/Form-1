import { FormState } from "./types";

interface FileStore {
  companyLogo?: File;
  favicon?: File;
  brochure?: File;
  brandGuide?: File;
  paymentProof?: File;
  teamPhotos: { [key: string]: File }; // id -> File
  testimonialPhotos: { [key: string]: File }; // id -> File
  media: {
    heroBanners: File[];
    teamPhotos: File[];
    officePhotos: File[];
    serviceImages: File[];
    certificates: File[];
    awards: File[];
    clientLogos: File[];
    galleryImages: File[];
  };
}

/**
 * Submits the multi-step intake portfolio to a Formspree endpoint (or custom destination).
 * All text fields and actual files are structured section-wise.
 */
export async function submitToFormspree(
  endpointUrl: string,
  state: FormState,
  files: FileStore
): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new FormData();

    // 1. Compile text fields with strict human-readable section prefixes
    // This organizes the results section-wise directly inside Formspree and Gmail!
    
    // --- BASIC INFO ---
    formData.append("Basic Info - Owner Full Name", state.ownerFullName);
    formData.append("Basic Info - Designation", state.designation);
    formData.append("Basic Info - Working Hours", state.workingHours);

    // --- CONTACT & ADDRESS ---
    formData.append("Contact - Mobile Number", state.mobileNumber);
    formData.append("Contact - WhatsApp Number", state.whatsAppNumber);
    formData.append("Contact - Email Address", state.emailAddress);
    formData.append("Contact - Alternate Email", state.alternateEmail);
    formData.append("Contact - Office Address", state.officeAddress);
    formData.append("Contact - City", state.city);
    formData.append("Contact - State", state.state);
    formData.append("Contact - Pincode", state.pincode);
    formData.append("Contact - Country", state.country);
    formData.append("Contact - Google Maps Link", state.googleMapsLink);

    // --- WEBSITE CONTENT DETAILS ---
    formData.append("Content - About Us", state.aboutUsContent);
    formData.append("Content - Why Choose Us", state.whyChooseUsContent);
    formData.append("Content - Founder Story", state.founderStory);
    formData.append("Content - Company History", state.companyHistory);
    formData.append("Content - Services Description", state.servicesDescription);
    formData.append("Content - Legal Disclaimer", state.legalDisclaimerText);
    formData.append("Content - Privacy Policy", state.privacyPolicyText);
    formData.append("Content - Terms & Conditions", state.termsConditionsText);
    formData.append("Content - Refund Policy", state.refundPolicyText);

    // --- SERVICES TO DISPLAY ---
    Object.entries(state.services).forEach(([serviceKey, isSelected]) => {
      if (serviceKey === "otherServices") {
        formData.append("Services - Custom Other Field", state.services.otherServices);
      } else {
        const formattedKey = serviceKey
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        formData.append(`Services Offered - ${formattedKey}`, isSelected ? "Yes" : "No");
      }
    });

    // --- TEAM DETAILS ---
    state.team.forEach((member, idx) => {
      const prefix = `Team Member ${idx + 1}`;
      formData.append(`${prefix} - Name`, member.fullName);
      formData.append(`${prefix} - Designation`, member.designation);
      formData.append(`${prefix} - Qualification`, member.qualification);
      formData.append(`${prefix} - Experience`, member.experience);
      formData.append(`${prefix} - Bio`, member.shortBio);
      
      // Look up and append profile photo if it exists
      const photoFile = files.teamPhotos[member.id];
      if (photoFile) {
        formData.append(`Team Photo - Member ${idx + 1} (${member.fullName})`, photoFile);
      }
    });

    // --- BRANDING DETAILS ---
    formData.append("Branding - Primary Color", state.primaryBrandColor);
    formData.append("Branding - Secondary Color", state.secondaryBrandColor);
    formData.append("Branding - Font Preference", state.fontStylePreference);
    formData.append("Branding - Website Style Style", state.websiteStylePreference);
    
    if (files.companyLogo) formData.append("Branding - Company Logo", files.companyLogo);
    if (files.favicon) formData.append("Branding - Favicon", files.favicon);
    if (files.brochure) formData.append("Branding - Brochure", files.brochure);
    if (files.brandGuide) formData.append("Branding - Brand/Style Guide", files.brandGuide);

    // --- MEDIA UPLOADS ---
    files.media.heroBanners.forEach((file, index) => {
      formData.append(`Media - Hero Banner ${index + 1}`, file);
    });
    files.media.teamPhotos.forEach((file, index) => {
      formData.append(`Media - Team Photo ${index + 1}`, file);
    });
    files.media.officePhotos.forEach((file, index) => {
      formData.append(`Media - Office Photo ${index + 1}`, file);
    });
    files.media.serviceImages.forEach((file, index) => {
      formData.append(`Media - Service Image ${index + 1}`, file);
    });
    files.media.certificates.forEach((file, index) => {
      formData.append(`Media - License/Certificate ${index + 1}`, file);
    });
    files.media.awards.forEach((file, index) => {
      formData.append(`Media - Award Photo ${index + 1}`, file);
    });
    files.media.clientLogos.forEach((file, index) => {
      formData.append(`Media - Client Logo ${index + 1}`, file);
    });
    files.media.galleryImages.forEach((file, index) => {
      formData.append(`Media - Gallery Photo ${index + 1}`, file);
    });

    // --- SOCIAL MEDIA & LINKS ---
    formData.append("Social Links - Facebook", state.facebookLink);
    formData.append("Social Links - Instagram", state.instagramLink);
    formData.append("Social Links - LinkedIn", state.linkedInLink);
    formData.append("Social Links - Twitter X", state.twitterLink);
    formData.append("Social Links - YouTube", state.youTubeLink);
    formData.append("Social Links - WhatsApp Contact", state.whatsAppLink);
    formData.append("Social Links - Telegram Username", state.telegramLink);
    formData.append("Social Links - Existing Website URL", state.existingWebsiteUrl);

    // --- TRUST & CREDIBILITY ---
    formData.append("Trust - Total Clients Served", state.totalClientsServed);
    formData.append("Trust - Years of Experience", state.yearsOfExperience);
    formData.append("Trust - Google Reviews Count", state.googleReviewsCount);
    formData.append("Trust - Awards Won Count", state.awardsWonCount);
    formData.append("Trust - Certifications List", state.certificationsList);
    formData.append("Trust - Government Approvals", state.governmentApprovals);
    formData.append("Trust - Industry Memberships", state.industryMemberships);
    formData.append("Trust - Associated Brands", state.associatedBrands);

    // --- TESTIMONIALS ---
    state.testimonials.forEach((testi, idx) => {
      const prefix = `Testimonial ${idx + 1}`;
      formData.append(`${prefix} - Client Name`, testi.clientName);
      formData.append(`${prefix} - Review Text`, testi.review);
      formData.append(`${prefix} - Rating Stars`, `${testi.rating} / 5`);
      
      const photoFile = files.testimonialPhotos[testi.id];
      if (photoFile) {
        formData.append(`Testimonial Photo - Client ${idx + 1} (${testi.clientName})`, photoFile);
      }
    });

    // --- SEO DETAILS ---
    formData.append("SEO - Target Keywords", state.targetKeywords);
    formData.append("SEO - Meta Title", state.metaTitle);
    formData.append("SEO - Meta Description", state.metaDescription);
    formData.append("SEO - Business Categories", state.businessCategories);
    formData.append("SEO - Target Locations", state.targetLocations);

    // --- ADDITIONAL REQUIREMENTS ---
    formData.append("Requirements - Competitor URLs", state.competitorUrls);
    formData.append("Requirements - Reference Sites", state.referenceUrls);
    formData.append("Requirements - Special Features", state.specialFeaturesNeeded);
    formData.append("Requirements - Essential Pages", state.pagesNeeded);
    formData.append("Requirements - Additional Notes", state.additionalNotes);

    // --- PAYMENT DETAILS ---
    formData.append("Payment - Advance Amount Paid", state.advancePaid);
    formData.append("Payment - Remaining Amount Due", state.remainingAmount);
    formData.append("Payment - Payment Method Used", state.paymentMethod);
    if (files.paymentProof) {
      formData.append("Payment - Proof of Payment Upload", files.paymentProof);
    }

    // Create a beautiful dashboard-style overall summary string. 
    // This allows the receiver to read a perfectly formatted markdown report at a glance!
    const summaryMarkdown = `
# CLIENT INTAKE PORTFOLIO OVERVIEW
Submitted: ${new Date().toLocaleString()}

## 1. BASIC INFORMATION
- **Owner Full Name:** ${state.ownerFullName || "N/A"}
- **Designation:** ${state.designation || "N/A"}
- **Working Hours:** ${state.workingHours || "N/A"}

## 2. CONTACT DETAILS
- **Mobile Number:** ${state.mobileNumber || "N/A"}
- **WhatsApp Number:** ${state.whatsAppNumber || "N/A"}
- **Email Address:** ${state.emailAddress || "N/A"}
- **Alternate Email:** ${state.alternateEmail || "N/A"}
- **Office Address:** ${state.officeAddress || "N/A"}, ${state.city || "N/A"}, ${state.state || "N/A"} - ${state.pincode || "N/A"}, ${state.country || "N/A"}
- **Google Maps Link:** ${state.googleMapsLink || "N/A"}

## 3. WEBSITE CONTENT
- **About Us Outline:** ${state.aboutUsContent ? state.aboutUsContent.substring(0, 150) + "..." : "N/A"}
- **Why Choose Us:** ${state.whyChooseUsContent ? state.whyChooseUsContent.substring(0, 150) + "..." : "N/A"}
- **Founder Story:** ${state.founderStory ? state.founderStory.substring(0, 150) + "..." : "N/A"}
- **Company History:** ${state.companyHistory ? state.companyHistory.substring(0, 150) + "..." : "N/A"}

## 4. SELECTED SERVICES
${Object.entries(state.services)
  .filter(([k, v]) => v === true && k !== "otherServices")
  .map(([k]) => `- ${k.replace(/([A-Z])/g, " $1")}`)
  .join("\n") || "No standard services selected"}
${state.services.otherServices ? `- Other Services: ${state.services.otherServices}` : ""}

## 5. TEAM DETAILS
- **Total Members:** ${state.team.length}
${state.team.map((m, idx) => `  ${idx + 1}. ${m.fullName} (${m.designation}) - ${m.qualification}, Exp: ${m.experience}`).join("\n")}

## 6. BRANDING IDENTITY
- **Primary Color Code:** ${state.primaryBrandColor || "N/A"}
- **Secondary Color Code:** ${state.secondaryBrandColor || "N/A"}
- **Typography Preference:** ${state.fontStylePreference || "N/A"}
- **Web Interface Style:** ${state.websiteStylePreference || "N/A"}

## 7. SOCIAL CHANNELS
- **Facebook:** ${state.facebookLink || "N/A"}
- **Instagram:** ${state.instagramLink || "N/A"}
- **LinkedIn:** ${state.linkedInLink || "N/A"}
- **Twitter/X:** ${state.twitterLink || "N/A"}

## 8. TRUST & METRICS
- **Total Clients Served:** ${state.totalClientsServed || "0"}
- **Years Operating:** ${state.yearsOfExperience || "0"}
- **Reviews Count:** ${state.googleReviewsCount || "0"}

## 9. SEARCH ENGINE OPTIMIZATION (SEO)
- **Target Keywords:** ${state.targetKeywords || "None stated"}
- **Meta Description:** ${state.metaDescription || "None stated"}

## 10. TRANSACTION DETAILS
- **Advance Payment:** ${state.advancePaid || "N/A"}
- **Remaining Balance:** ${state.remainingAmount || "N/A"}
- **Approved Method:** ${state.paymentMethod || "N/A"}
`;

    formData.append("_message", summaryMarkdown); // Sent as a text markdown body
    formData.append("Subject", `New Client Intake Submission - ${state.ownerFullName || "Agency Partner"}`);

    const targetUrl = endpointUrl.trim() || "https://formspree.io/f/placeholder";
    
    const response = await fetch(targetUrl, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return { success: true, message: "Thank you! Your full agency onboarding portfolio has been successfully processed." };
    } else {
      const responseData = await response.json().catch(() => ({}));
      const errorMsg = responseData.error || responseData.errors?.[0]?.message || "Formspree submission rejected.";
      return { success: false, message: `Submission error: ${errorMsg}` };
    }
  } catch (error: any) {
    console.error("Submission failed:", error);
    return { success: false, message: error?.message || "Network error. Please verify your connection & try again." };
  }
}
