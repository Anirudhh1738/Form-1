import React, { useRef } from "react";
import { FormState, TeamMember, Testimonial } from "../types";
import { SERVICES_LIST } from "../constants";
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileCheck, 
  Users, 
  Smile, 
  Star, 
  UploadCloud, 
  Trash2, 
  Search, 
  DollarSign, 
  HelpCircle,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";

interface StepFieldsProps {
  step: number;
  state: FormState;
  onChange: (field: string, value: any) => void;
  onServiceChange: (serviceKey: string, checked: boolean) => void;
  onAddTeamMember: (member: TeamMember, file: File | null) => void;
  onRemoveTeamMember: (id: string) => void;
  onAddTestimonial: (testimonial: Testimonial, file: File | null) => void;
  onRemoveTestimonial: (id: string) => void;
  onFileChange: (category: "heroBanners" | "teamPhotos" | "officePhotos" | "serviceImages" | "certificates" | "awards" | "clientLogos" | "galleryImages", files: File[]) => void;
  onRemoveFile: (category: "heroBanners" | "teamPhotos" | "officePhotos" | "serviceImages" | "certificates" | "awards" | "clientLogos" | "galleryImages", index: number) => void;
  onSingleFileChange: (key: "companyLogo" | "favicon" | "brochure" | "brandGuide" | "paymentProof", file: File | null) => void;
  files: {
    companyLogo: File | null;
    favicon: File | null;
    brochure: File | null;
    brandGuide: File | null;
    paymentProof: File | null;
    teamPhotos: { [key: string]: File };
    testimonialPhotos: { [key: string]: File };
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
  };
  errors: { [key: string]: string };
}

export const StepFields: React.FC<StepFieldsProps> = ({
  step,
  state,
  onChange,
  onServiceChange,
  onAddTeamMember,
  onRemoveTeamMember,
  onAddTestimonial,
  onRemoveTestimonial,
  onFileChange,
  onRemoveFile,
  onSingleFileChange,
  files,
  errors,
}) => {
  // Local temporary states for Step 5 (Team Creator)
  const [newTeamName, setNewTeamName] = React.useState("");
  const [newTeamRole, setNewTeamRole] = React.useState("");
  const [newTeamQual, setNewTeamQual] = React.useState("");
  const [newTeamExp, setNewTeamExp] = React.useState("");
  const [newTeamBio, setNewTeamBio] = React.useState("");
  const [newTeamPhoto, setNewTeamPhoto] = React.useState<File | null>(null);
  const teamFileInputRef = useRef<HTMLInputElement>(null);

  // Local temporary states for Step 10 (Testimonial Creator)
  const [newClientName, setNewClientName] = React.useState("");
  const [newReview, setNewReview] = React.useState("");
  const [newRating, setNewRating] = React.useState(5);
  const [newClientPhoto, setNewClientPhoto] = React.useState<File | null>(null);
  const clientFileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamRole.trim()) {
      alert("Name and Designation are required for a team member.");
      return;
    }
    const member: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      fullName: newTeamName,
      designation: newTeamRole,
      qualification: newTeamQual,
      experience: newTeamExp,
      shortBio: newTeamBio,
      profilePhotoName: newTeamPhoto?.name || "",
    };
    onAddTeamMember(member, newTeamPhoto);
    setNewTeamName("");
    setNewTeamRole("");
    setNewTeamQual("");
    setNewTeamExp("");
    setNewTeamBio("");
    setNewTeamPhoto(null);
    if (teamFileInputRef.current) teamFileInputRef.current.value = "";
  };

  const handleAddTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newReview.trim()) {
      alert("Client Name and Review content are required for a testimonial.");
      return;
    }
    const testimonial: Testimonial = {
      id: Math.random().toString(36).substring(2, 9),
      clientName: newClientName,
      review: newReview,
      rating: newRating,
      clientPhotoName: newClientPhoto?.name || "",
    };
    onAddTestimonial(testimonial, newClientPhoto);
    setNewClientName("");
    setNewReview("");
    setNewRating(5);
    setNewClientPhoto(null);
    if (clientFileInputRef.current) clientFileInputRef.current.value = "";
  };

  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4 mb-2">
            <h3 className="font-display text-lg font-semibold text-white">Owner & Executive Information</h3>
            <p className="text-slate-400 text-sm">Please define the key point of contact for the registration process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ownerFullName" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                Owner Full Name <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  id="ownerFullName"
                  type="text"
                  value={state.ownerFullName}
                  onChange={(e) => onChange("ownerFullName", e.target.value)}
                  placeholder="e.g. Adv. Vikramaditya Sen"
                  className={`w-full bg-slate-900 border ${errors.ownerFullName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 font-sans transition-all`}
                />
              </div>
              {errors.ownerFullName && <p id="err-ownerFullName" className="mt-1.5 text-sm text-red-400">{errors.ownerFullName}</p>}
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                Designation / Title <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <input
                id="designation"
                type="text"
                value={state.designation}
                onChange={(e) => onChange("designation", e.target.value)}
                placeholder="e.g. Managing Partner / Founder"
                className={`w-full bg-slate-900 border ${errors.designation ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 font-sans transition-all`}
              />
              {errors.designation && <p id="err-designation" className="mt-1.5 text-sm text-red-400">{errors.designation}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="workingHours" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-gold-500" /> Working Hours / Business Hours
            </label>
            <input
              id="workingHours"
              type="text"
              value={state.workingHours}
              onChange={(e) => onChange("workingHours", e.target.value)}
              placeholder="e.g. Mon - Sat: 9:00 AM - 7:00 PM, Sunday: Closed"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 font-sans transition-all"
            />
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Contact & Locators</h3>
            <p className="text-slate-400 text-sm">Active contact details to setup map cards and email networks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-gold-500" /> Mobile Number <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <input
                id="mobileNumber"
                type="tel"
                value={state.mobileNumber}
                onChange={(e) => onChange("mobileNumber", e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={`w-full bg-slate-900 border ${errors.mobileNumber ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all`}
              />
              {errors.mobileNumber && <p id="err-mobileNumber" className="mt-1.5 text-sm text-red-400">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                WhatsApp Number
              </label>
              <input
                id="whatsAppNumber"
                type="tel"
                value={state.whatsAppNumber}
                onChange={(e) => onChange("whatsAppNumber", e.target.value)}
                placeholder="Same as mobile, or alternate WhatsApp"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-brand-gold-500" /> Email Address <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <input
                id="emailAddress"
                type="email"
                value={state.emailAddress}
                onChange={(e) => onChange("emailAddress", e.target.value)}
                placeholder="e.g. director@corp.com"
                className={`w-full bg-slate-900 border ${errors.emailAddress ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all`}
              />
              {errors.emailAddress && <p id="err-emailAddress" className="mt-1.5 text-sm text-red-400">{errors.emailAddress}</p>}
            </div>

            <div>
              <label htmlFor="alternateEmail" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                Alternate/CC Email
              </label>
              <input
                id="alternateEmail"
                type="email"
                value={state.alternateEmail}
                onChange={(e) => onChange("alternateEmail", e.target.value)}
                placeholder="e.g. support@corp.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="officeAddress" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-gold-500" /> Full Office Address <span className="text-brand-gold-500 font-bold">*</span>
            </label>
            <textarea
              id="officeAddress"
              rows={3}
              value={state.officeAddress}
              onChange={(e) => onChange("officeAddress", e.target.value)}
              placeholder="e.g. Suite 402, Golden IT Tower, Barakhamba Road"
              className={`w-full bg-slate-900 border ${errors.officeAddress ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all`}
            />
            {errors.officeAddress && <p id="err-officeAddress" className="mt-1.5 text-sm text-red-400">{errors.officeAddress}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-1.5">
                City <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={state.city}
                onChange={(e) => onChange("city", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold-500 transition-all"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-1.5">
                State
              </label>
              <input
                id="state"
                type="text"
                value={state.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold-500 transition-all"
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-slate-300 mb-1.5">
                Pincode <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <input
                id="pincode"
                type="text"
                value={state.pincode}
                onChange={(e) => onChange("pincode", e.target.value)}
                placeholder="e.g. 110001"
                className={`w-full bg-slate-900 border ${errors.pincode ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold-500 transition-all`}
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-1.5">
                Country <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <input
                id="country"
                type="text"
                value={state.country}
                onChange={(e) => onChange("country", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="googleMapsLink" className="block text-sm font-medium text-slate-100 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-brand-gold-500" /> Google Maps Embed/Share Link
            </label>
            <input
              id="googleMapsLink"
              type="url"
              value={state.googleMapsLink}
              onChange={(e) => onChange("googleMapsLink", e.target.value)}
              placeholder="e.g. https://maps.google.com/?cid=..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all"
            />
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Website Content & Regulatory Declarations</h3>
            <p className="text-slate-400 text-sm">Provide draft copywriting text. This will represent the blueprint layout content.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="aboutUsContent" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                About Us Content <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <textarea
                id="aboutUsContent"
                rows={3}
                value={state.aboutUsContent}
                onChange={(e) => onChange("aboutUsContent", e.target.value)}
                placeholder="We are a leading registration & corporate consulting agency committed to fostering enterprise excellence..."
                className={`w-full bg-slate-900 border ${errors.aboutUsContent ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all`}
              />
              {errors.aboutUsContent && <p id="err-aboutUsContent" className="mt-1.5 text-sm text-red-400">{errors.aboutUsContent}</p>}
            </div>

            <div>
              <label htmlFor="whyChooseUsContent" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                Why Choose Us Content <span className="text-brand-gold-500 font-bold">*</span>
              </label>
              <textarea
                id="whyChooseUsContent"
                rows={3}
                value={state.whyChooseUsContent}
                onChange={(e) => onChange("whyChooseUsContent", e.target.value)}
                placeholder="1. Verified Corporate Experts  2. Dedicated Compliance Managers  3. 100% Success Rate Fast Track..."
                className={`w-full bg-slate-900 border ${errors.whyChooseUsContent ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all`}
              />
              {errors.whyChooseUsContent && <p id="err-whyChooseUsContent" className="mt-1.5 text-sm text-red-400">{errors.whyChooseUsContent}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="founderStory" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Founder Story
                </label>
                <textarea
                  id="founderStory"
                  rows={3}
                  value={state.founderStory}
                  onChange={(e) => onChange("founderStory", e.target.value)}
                  placeholder="The founder established this entity to streamline the complex business setup frameworks..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="companyHistory" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Company History
                </label>
                <textarea
                  id="companyHistory"
                  rows={3}
                  value={state.companyHistory}
                  onChange={(e) => onChange("companyHistory", e.target.value)}
                  placeholder="Incorporated in 2018, we have quickly expanded across 12 states servicing over 500 corporates..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="servicesDescription" className="block text-sm font-medium text-slate-300 mb-1.5">
                General Services Overview Block
              </label>
              <textarea
                id="servicesDescription"
                rows={2}
                value={state.servicesDescription}
                onChange={(e) => onChange("servicesDescription", e.target.value)}
                placeholder="We specialize in fully comprehensive regulatory filings, auditing, taxation registration, and intellectual property setups."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-all"
              />
            </div>

            <div className="border-t border-slate-800 pt-4 mt-4">
              <h4 className="font-display text-sm font-medium text-brand-gold-400 uppercase tracking-widest mb-3">Legal & Standard Policy Documentation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="legalDisclaimerText" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Legal Disclaimer Text
                  </label>
                  <textarea
                    id="legalDisclaimerText"
                    rows={2}
                    value={state.legalDisclaimerText}
                    onChange={(e) => onChange("legalDisclaimerText", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-gold-500 transition-all text-xs font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="privacyPolicyText" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Privacy Policy Outline Text
                  </label>
                  <textarea
                    id="privacyPolicyText"
                    rows={2}
                    value={state.privacyPolicyText}
                    onChange={(e) => onChange("privacyPolicyText", e.target.value)}
                    placeholder="This privacy policy details how we deal with client data securely..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-gold-500 transition-all text-xs font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="termsConditionsText" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Terms & Conditions Outline Text
                  </label>
                  <textarea
                    id="termsConditionsText"
                    rows={2}
                    value={state.termsConditionsText}
                    onChange={(e) => onChange("termsConditionsText", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-gold-500 transition-all text-xs font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="refundPolicyText" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Refund & Cancellation Policy
                  </label>
                  <textarea
                    id="refundPolicyText"
                    rows={2}
                    value={state.refundPolicyText}
                    onChange={(e) => onChange("refundPolicyText", e.target.value)}
                    placeholder="We offer a 100% money back guarantee on professional fees if the filing cannot be submitted..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-brand-gold-500 transition-all text-xs font-sans"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4 mb-2">
            <h3 className="font-display text-lg font-semibold text-white">Select Services to Advertise</h3>
            <p className="text-slate-400 text-sm">Tag all checkboxes representing specific service cards to compile in the portal catalog.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 bg-slate-950 p-6 rounded-xl border border-slate-800">
            {SERVICES_LIST.map(({ key, label }) => {
              const isChecked = !!state.services[key];
              return (
                <label
                  key={key}
                  id={`label-${key}`}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-900 transition-all select-none ${
                    isChecked 
                      ? "border-brand-gold-500 bg-brand-gold-500/5 text-white" 
                      : "border-slate-800 text-slate-300"
                  }`}
                >
                  <input
                    id={`checkbox-${key}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onServiceChange(key, e.target.checked)}
                    className="mt-1 border-slate-600 rounded bg-slate-800 text-brand-gold-500 focus:ring-brand-gold-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium leading-tight">{label}</span>
                </label>
              );
            })}
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            <label htmlFor="otherServices" className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-gold-500" /> Custom / Other Services (Comma separated)
            </label>
            <input
              id="otherServices"
              type="text"
              value={state.services.otherServices}
              onChange={(e) => onServiceChange("otherServices", e.target.value)}
              placeholder="e.g. Patent Filing, MSME Registration, LLP Dissolution"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold-500 placeholder-slate-500 transition-all"
            />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Team Profiles & Executive Board</h3>
            <p className="text-slate-400 text-sm">Profile managers, lead lawyers, or accounting experts currently active.</p>
          </div>

          {/* Current Members list */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-brand-gold-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> Active Team Listing ({state.team.length})
            </h4>
            {state.team.length === 0 ? (
              <p className="text-slate-500 text-xs italic bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                No team profiles added yet. Use the tool below to build your board.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.team.map((member) => (
                  <div key={member.id} id={`team-member-${member.id}`} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-4 hover:border-brand-gold-500/50 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-500 text-xs overflow-hidden">
                      {member.profilePhotoName ? (
                        <span className="text-[10px] text-brand-gold-500 font-mono font-medium max-w-full truncate px-1" title={member.profilePhotoName}>
                          {member.profilePhotoName}
                        </span>
                      ) : (
                        <Users className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-display text-sm font-semibold text-white truncate">{member.fullName}</h5>
                      <p className="text-brand-gold-500 text-xs font-medium">{member.designation}</p>
                      {member.qualification && (
                        <p className="text-slate-400 text-[11px] truncate mt-0.5">Qual: {member.qualification}</p>
                      )}
                      {member.experience && (
                        <p className="text-slate-500 text-[11px]">Exp: {member.experience}</p>
                      )}
                    </div>
                    <button
                      id={`btn-remove-team-${member.id}`}
                      type="button"
                      onClick={() => onRemoveTeamMember(member.id)}
                      className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-all shrink-0"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Team Member form */}
          <form onSubmit={handleAddTeamSubmit} className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
            <h4 className="font-display text-sm font-semibold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Sparkles className="w-4 h-4 text-brand-gold-500" /> Profiler Assistant: Create Profile New
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newTeamName" className="block text-xs font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  id="newTeamName"
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Adv. Amit Saxena"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label htmlFor="newTeamRole" className="block text-xs font-medium text-slate-400 mb-1">
                  Designation
                </label>
                <input
                  id="newTeamRole"
                  type="text"
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value)}
                  placeholder="e.g. Senior Trademark Counsel"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label htmlFor="newTeamQual" className="block text-xs font-medium text-slate-400 mb-1">
                  Qualification
                </label>
                <input
                  id="newTeamQual"
                  type="text"
                  value={newTeamQual}
                  onChange={(e) => setNewTeamQual(e.target.value)}
                  placeholder="e.g. LL.M (IPR), NLS Bangalore"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label htmlFor="newTeamExp" className="block text-xs font-medium text-slate-400 mb-1">
                  Experience (Years)
                </label>
                <input
                  id="newTeamExp"
                  type="text"
                  value={newTeamExp}
                  onChange={(e) => setNewTeamExp(e.target.value)}
                  placeholder="e.g. 12+ Years"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newTeamBio" className="block text-xs font-medium text-slate-400 mb-1">
                Short Bio
              </label>
              <input
                id="newTeamBio"
                type="text"
                value={newTeamBio}
                onChange={(e) => setNewTeamBio(e.target.value)}
                placeholder="Specializes in international trademark filing (Madrid Protocol) & administrative appeals..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="newTeamPhoto" className="block text-xs font-medium text-slate-400 mb-1">
                Upload Member Portrait
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="newTeamPhoto"
                  type="file"
                  ref={teamFileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewTeamPhoto(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <button
                  id="btn-trigger-team-file"
                  type="button"
                  onClick={() => teamFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 font-medium text-xs rounded text-slate-300 flex items-center gap-1.5 float-left cursor-pointer transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-brand-gold-500" /> Chose Image File
                </button>
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  {newTeamPhoto ? newTeamPhoto.name : "No file chosen"}
                </span>
              </div>
            </div>

            <button
              id="btn-add-team-member"
              type="submit"
              className="w-full bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-bold text-xs py-2 rounded shadow cursor-pointer transition-all"
            >
              Add Profile to Board
            </button>
          </form>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Visual Corporate Branding</h3>
            <p className="text-slate-400 text-sm">Calibrate exact visual theme hexes, preferences and upload logo packs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryBrandColor" className="block text-sm font-medium text-slate-300 mb-1\">
                    Primary Color Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="primaryBrandColor"
                      type="color"
                      value={state.primaryBrandColor}
                      onChange={(e) => onChange("primaryBrandColor", e.target.value)}
                      className="w-10 h-10 rounded border border-slate-700 bg-transparent p-1 cursor-pointer shrink-0"
                    />
                    <input
                      id="primaryBrandColorText"
                      type="text"
                      value={state.primaryBrandColor}
                      onChange={(e) => onChange("primaryBrandColor", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="secondaryBrandColor" className="block text-sm font-medium text-slate-300 mb-1">
                    Secondary Color Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="secondaryBrandColor"
                      type="color"
                      value={state.secondaryBrandColor}
                      onChange={(e) => onChange("secondaryBrandColor", e.target.value)}
                      className="w-10 h-10 rounded border border-slate-700 bg-transparent p-1 cursor-pointer shrink-0"
                    />
                    <input
                      id="secondaryBrandColorText"
                      type="text"
                      value={state.secondaryBrandColor}
                      onChange={(e) => onChange("secondaryBrandColor", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="fontStylePreference" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Font Palette Preference
                </label>
                <select
                  id="fontStylePreference"
                  value={state.fontStylePreference}
                  onChange={(e) => onChange("fontStylePreference", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold-500"
                >
                  <option>Outfit (Modern Executive Sans)</option>
                  <option>Inter (Highly Legible Tech Corporate)</option>
                  <option>Cinzel & Garamond (Premium Luxury Serif)</option>
                  <option>Space Grotesk (Neo-Brutalist Technical)</option>
                  <option>Playfair Display (High-Contrast Editorial)</option>
                </select>
              </div>

              <div>
                <label htmlFor="websiteStylePreference" className="block text-sm font-medium text-slate-300 mb-1.5">
                  General Design Motif Style <span className="text-brand-gold-500 font-bold">*</span>
                </label>
                <select
                  id="websiteStylePreference"
                  value={state.websiteStylePreference}
                  onChange={(e) => onChange("websiteStylePreference", e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold-500"
                >
                  <option value="Modern">Modern (Clean grids & card layouts)</option>
                  <option value="Corporate">Corporate (Sleek professional trust blue)</option>
                  <option value="Luxury">Luxury (Premium deep dark + metallic gold accents)</option>
                  <option value="Premium">Premium (Sophisticated light / off-white minimalist)</option>
                  <option value="Minimal">Minimal (Maximum negative space, typographic-heavy)</option>
                </select>
              </div>
            </div>

            {/* Logo uploads details */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
              <h4 className="font-display text-sm font-semibold text-brand-gold-400">Essential Brand Assets</h4>
              
              <div className="space-y-4.5">
                {[
                  { key: "companyLogo" as const, label: "Company Official Logo", stateName: state.companyLogoName },
                  { key: "favicon" as const, label: "Favicon Vector (Browser Tab Icon)", stateName: state.faviconName },
                  { key: "brochure" as const, label: "Corporate Services Brochure (PDF/PNG)", stateName: state.brochureName },
                  { key: "brandGuide" as const, label: "Brand Stylistic Guidelines / Rules", stateName: state.brandGuideName }
                ].map(({ key, label, stateName }) => (
                  <div key={key}>
                    <span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>
                    <div className="flex items-center gap-3">
                      <input
                        id={`file-${key}`}
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            onSingleFileChange(key, e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        id={`btn-trigger-${key}`}
                        type="button"
                        onClick={() => document.getElementById(`file-${key}`)?.click()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all shrink-0"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-brand-gold-500" /> Upload
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] block truncate text-slate-400" title={stateName || files[key]?.name || "Not present"}>
                          {files[key] ? files[key]?.name : (stateName || "No file uploaded")}
                        </span>
                        {files[key] && (
                          <span className="text-[9px] text-brand-gold-500 font-mono">
                            Live loaded ({formatSize(files[key]!.size)})
                          </span>
                        )}
                      </div>
                      {files[key] && (
                        <button
                          id={`btn-clear-${key}`}
                          type="button"
                          onClick={() => onSingleFileChange(key, null)}
                          className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4 mb-2">
            <h3 className="font-display text-lg font-semibold text-white">Media Folders & Client Proofs</h3>
            <p className="text-slate-400 text-sm">Select and drop multi-image packs to display on grids throughout the agency portfolio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "heroBanners" as const, label: "Hero Banner Graphics", help: "High-resolution wide photos for home main slide." },
              { key: "teamPhotos" as const, label: "Board Members & General Staff Photos", help: "Team bonding, executive workspace meetings." },
              { key: "officePhotos" as const, label: "Physical Office Infrastructure Assets", help: "Client lounge, high-end meeting chambers." },
              { key: "serviceImages" as const, label: "Custom Service Demonstrations", help: "Trademark files, registration flow charts." },
              { key: "certificates" as const, label: "Government Approvals of Excellence", help: "ISO standards, bar council registrations." },
              { key: "awards" as const, label: "Awards & Recognition Accolades", help: "Industry leadership rankings, corporate trophies." },
              { key: "clientLogos" as const, label: "Associated Strategic Partner Logos", help: "Reputable clients and associated company symbols." },
              { key: "galleryImages" as const, label: "General Workspace Portfolio Gallery", help: "Candid client panels, business workshops." },
            ].map(({ key, label, help }) => {
              const fileList = files.media[key];
              const metadataList = state.mediaMetadata[key] || [];
              return (
                <div key={key} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-slate-100 flex items-center justify-between">
                      <span>{label}</span>
                      <span className="text-[10px] bg-slate-800 text-brand-gold-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                        Count: {Math.max(fileList.length, metadataList.length)}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{help}</p>
                    
                    {/* File List indicator */}
                    {(fileList.length > 0) && (
                      <div className="mt-2.5 max-h-24 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded border border-slate-850 font-mono text-[10px] text-slate-400">
                        {fileList.map((f, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1 last:border-0 last:pb-0">
                            <span className="truncate max-w-[200px]" title={f.name}>{f.name}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-brand-gold-500 font-semibold">{formatSize(f.size)}</span>
                              <button
                                id={`btn-delete-${key}-${i}`}
                                type="button"
                                onClick={() => onRemoveFile(key, i)}
                                className="text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-3" h-3="" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Retained from Draft and not loaded physically */}
                    {fileList.length === 0 && metadataList.length > 0 && (
                      <div className="mt-2 bg-amber-500/5 border border-amber-500/20 px-3 py-2 rounded text-[11px] text-amber-300">
                        ⚠️ Restored {metadataList.length} draft files. Please re-select files to include them in final submit.
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <input
                      id={`gallery-${key}`}
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          onFileChange(key, Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      id={`btn-trigger-gallery-${key}`}
                      type="button"
                      onClick={() => document.getElementById(`gallery-${key}`)?.click()}
                      className="w-full py-2 bg-slate-950 border border-dashed border-slate-700 hover:border-brand-gold-500 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-brand-gold-500" /> Select Files to Append
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 8:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Social Network Channels</h3>
            <p className="text-slate-400 text-sm">Affiliate social networking assets to map footer networks cleanly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div>
              <label htmlFor="facebookLink" className="block text-xs font-medium text-slate-400 mb-1">
                Facebook Link
              </label>
              <input
                id="facebookLink"
                type="url"
                value={state.facebookLink}
                onChange={(e) => onChange("facebookLink", e.target.value)}
                placeholder="https://facebook.com/yourbrand"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="instagramLink" className="block text-xs font-medium text-slate-400 mb-1">
                Instagram Link
              </label>
              <input
                id="instagramLink"
                type="url"
                value={state.instagramLink}
                onChange={(e) => onChange("instagramLink", e.target.value)}
                placeholder="https://instagram.com/yourbrand"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="linkedInLink" className="block text-xs font-medium text-slate-400 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                id="linkedInLink"
                type="url"
                value={state.linkedInLink}
                onChange={(e) => onChange("linkedInLink", e.target.value)}
                placeholder="https://linkedin.com/company/yourbrand"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="twitterLink" className="block text-xs font-medium text-slate-400 mb-1">
                Twitter/X URL
              </label>
              <input
                id="twitterLink"
                type="url"
                value={state.twitterLink}
                onChange={(e) => onChange("twitterLink", e.target.value)}
                placeholder="https://x.com/yourbrand"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="youTubeLink" className="block text-xs font-medium text-slate-400 mb-1">
                YouTube Channel Link
              </label>
              <input
                id="youTubeLink"
                type="url"
                value={state.youTubeLink}
                onChange={(e) => onChange("youTubeLink", e.target.value)}
                placeholder="https://youtube.com/@yourbrand"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="whatsAppLink" className="block text-xs font-medium text-slate-400 mb-1">
                WhatsApp Chat Hook (wa.me link)
              </label>
              <input
                id="whatsAppLink"
                type="url"
                value={state.whatsAppLink}
                onChange={(e) => onChange("whatsAppLink", e.target.value)}
                placeholder="https://wa.me/919876543210"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="telegramLink" className="block text-xs font-medium text-slate-400 mb-1">
                Telegram Link
              </label>
              <input
                id="telegramLink"
                type="url"
                value={state.telegramLink}
                onChange={(e) => onChange("telegramLink", e.target.value)}
                placeholder="https://t.me/yourbrand"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label htmlFor="existingWebsiteUrl" className="block text-xs font-medium text-slate-400 mb-1">
                Existing Website URL (if any)
              </label>
              <input
                id="existingWebsiteUrl"
                type="url"
                value={state.existingWebsiteUrl}
                onChange={(e) => onChange("existingWebsiteUrl", e.target.value)}
                placeholder="https://www.yourbrand.com"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>
          </div>
        </div>
      );

    case 9:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Trust, Credibility & Authority</h3>
            <p className="text-slate-400 text-sm">Key physical and legal metric points to drive trust with corporate candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
            <div className="space-y-4">
              <h4 className="font-display text-sm font-semibold text-brand-gold-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                🔢 Mathematical Trust Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="totalClientsServed" className="block text-xs font-medium text-slate-400 mb-1">
                    Total Clients Served
                  </label>
                  <input
                    id="totalClientsServed"
                    type="text"
                    value={state.totalClientsServed}
                    onChange={(e) => onChange("totalClientsServed", e.target.value)}
                    placeholder="e.g. 10,000+"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-xs font-medium text-slate-400 mb-1">
                    Years of Experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    type="text"
                    value={state.yearsOfExperience}
                    onChange={(e) => onChange("yearsOfExperience", e.target.value)}
                    placeholder="e.g. 15+ Years"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="googleReviewsCount" className="block text-xs font-medium text-slate-400 mb-1">
                  Google Reviews Count
                </label>
                <input
                  id="googleReviewsCount"
                  type="text"
                  value={state.googleReviewsCount}
                  onChange={(e) => onChange("googleReviewsCount", e.target.value)}
                  placeholder="e.g. 450+ (4.9 Rating)"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="awardsWonCount" className="block text-xs font-medium text-slate-400 mb-1">
                  Awards Won Count
                </label>
                <input
                  id="awardsWonCount"
                  type="text"
                  value={state.awardsWonCount}
                  onChange={(e) => onChange("awardsWonCount", e.target.value)}
                  placeholder="e.g. National IP Leadership 2024"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display text-sm font-semibold text-brand-gold-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                🏛️ Legal/Guild Alignments
              </h4>
              <div>
                <label htmlFor="certificationsList" className="block text-xs font-medium text-slate-400 mb-1">
                  Professional Certifications
                </label>
                <input
                  id="certificationsList"
                  type="text"
                  value={state.certificationsList}
                  onChange={(e) => onChange("certificationsList", e.target.value)}
                  placeholder="e.g. ISO 9001:2015 Compliance Bureau"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="governmentApprovals" className="block text-xs font-medium text-slate-400 mb-1">
                  Government Approvals / Licenses
                </label>
                <input
                  id="governmentApprovals"
                  type="text"
                  value={state.governmentApprovals}
                  onChange={(e) => onChange("governmentApprovals", e.target.value)}
                  placeholder="e.g. Registered IPR Agent (Govt of India)"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="industryMemberships" className="block text-xs font-medium text-slate-400 mb-1">
                  Industry Memberships
                </label>
                <input
                  id="industryMemberships"
                  type="text"
                  value={state.industryMemberships}
                  onChange={(e) => onChange("industryMemberships", e.target.value)}
                  placeholder="e.g. Bar Association, Chamber of Commerce"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="associatedBrands" className="block text-xs font-medium text-slate-400 mb-1">
                  Associated Brands / Partners
                </label>
                <input
                  id="associatedBrands"
                  type="text"
                  value={state.associatedBrands}
                  onChange={(e) => onChange("associatedBrands", e.target.value)}
                  placeholder="e.g. Tata, Reliance, Startup India Hub"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 10:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Client Testimonials & Recommendations</h3>
            <p className="text-slate-400 text-sm">Add stellar reviews to validate agency success ratios dynamically.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-brand-gold-400 flex items-center gap-2">
              <Smile className="w-4 h-4" /> Added Reviews ({state.testimonials.length})
            </h4>
            {state.testimonials.length === 0 ? (
              <p className="text-slate-500 text-xs italic bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                No client reviews added yet. Complete the review card below to build authority.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.testimonials.map((testi) => (
                  <div key={testi.id} id={`testimonial-${testi.id}`} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-4 hover:border-brand-gold-500/50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-slate-500 text-xs text-center font-mono">
                      {testi.clientPhotoName ? (
                        <span className="text-[8px] text-brand-gold-500 max-w-full truncate px-0.5">
                          {testi.clientPhotoName}
                        </span>
                      ) : (
                        <Smile className="w-5 h-5 text-slate-650" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-display text-sm font-semibold text-white truncate">{testi.clientName}</h5>
                        <div className="flex items-center text-brand-gold-500 shrink-0">
                          {Array.from({ length: testi.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs italic mt-1 line-clamp-3">"{testi.review}"</p>
                    </div>
                    <button
                      id={`btn-remove-testimonial-${testi.id}`}
                      type="button"
                      onClick={() => onRemoveTestimonial(testi.id)}
                      className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testimonial creator */}
          <form onSubmit={handleAddTestimonialSubmit} className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
            <h4 className="font-display text-sm font-semibold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Sparkles className="w-4 h-4 text-brand-gold-500" /> Create Client Review
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newClientName" className="block text-xs font-medium text-slate-400 mb-1">
                  Client Name / Corporate Title
                </label>
                <input
                  id="newClientName"
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Rohan Khanna (CEO, TechSol)"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="newRating" className="block text-xs font-medium text-slate-400 mb-1">
                  Rating Stars
                </label>
                <div className="flex items-center gap-1 mt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? "text-brand-gold-500 fill-brand-gold-500" : "text-slate-600"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="newReview" className="block text-xs font-medium text-slate-400 mb-1">
                Written Feedback
              </label>
              <textarea
                id="newReview"
                rows={3}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="The trademark filing process was absolutely breeze with this agency. Handled all legal objections seamlessly within 3 weeks..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="newClientPhoto" className="block text-xs font-medium text-slate-400 mb-1">
                Upload Client Photo
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="newClientPhoto"
                  type="file"
                  ref={clientFileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewClientPhoto(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <button
                  id="btn-trigger-testimonial-image"
                  type="button"
                  onClick={() => clientFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs rounded hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-brand-gold-500" /> Select Image file
                </button>
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  {newClientPhoto ? newClientPhoto.name : "No file chosen"}
                </span>
              </div>
            </div>

            <button
              id="btn-add-review"
              type="submit"
              className="w-full bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-bold text-xs py-2 rounded shadow cursor-pointer transition-all"
            >
              Add Testimonial Listing
            </button>
          </form>
        </div>
      );

    case 11:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">SEO & Google Indexing Details</h3>
            <p className="text-slate-400 text-sm">Calibrate exact keywords and meta snippets to capture high search rankings on Google.</p>
          </div>

          <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div>
              <label htmlFor="targetKeywords" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-brand-gold-500" /> Target Keywords (Comma separated)
              </label>
              <input
                id="targetKeywords"
                type="text"
                value={state.targetKeywords}
                onChange={(e) => onChange("targetKeywords", e.target.value)}
                placeholder="e.g. trademark registration Delhi, best tax lawyer LLP, compliance advisors"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="metaTitle" className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                  Suggested Meta Browser Title
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  value={state.metaTitle}
                  onChange={(e) => onChange("metaTitle", e.target.value)}
                  placeholder="e.g. Premier Corporate Compliances & Trademark Services"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Meta Snippet Description
                </label>
                <input
                  id="metaDescription"
                  type="text"
                  value={state.metaDescription}
                  onChange={(e) => onChange("metaDescription", e.target.value)}
                  placeholder="We are a top-tier licensing firm offering quick, guaranteed trademark filings..."
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850 pt-3">
              <div>
                <label htmlFor="businessCategories" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Business Categories / Niches
                </label>
                <input
                  id="businessCategories"
                  type="text"
                  value={state.businessCategories}
                  onChange={(e) => onChange("businessCategories", e.target.value)}
                  placeholder="e.g. Legal Services, Business Consulting, Financial Auditing Agency"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="targetLocations" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Geographical Focus Regions
                </label>
                <input
                  id="targetLocations"
                  type="text"
                  value={state.targetLocations}
                  onChange={(e) => onChange("targetLocations", e.target.value)}
                  placeholder="e.g. Delhi NCR, Mumbai, Bangalore, India-wide, Global"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 12:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Specific Modules & Reference Materials</h3>
            <p className="text-slate-400 text-sm">State dynamic references, competitor benchmarks, or exclusive requested files.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="competitorUrls" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-red-400" /> Direct Competitor Sites
                </label>
                <textarea
                  id="competitorUrls"
                  rows={2}
                  value={state.competitorUrls}
                  onChange={(e) => onChange("competitorUrls", e.target.value)}
                  placeholder="e.g. https://competitortrademark.com, https://legalsol.in"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none placeholder-slate-500"
                />
              </div>

              <div>
                <label htmlFor="referenceUrls" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-brand-gold-500" /> Web Design Inspiration References
                </label>
                <textarea
                  id="referenceUrls"
                  rows={2}
                  value={state.referenceUrls}
                  onChange={(e) => onChange("referenceUrls", e.target.value)}
                  placeholder="e.g. https://stripe.com (love the header grid), https://vantage.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="specialFeaturesNeeded" className="block text-xs font-semibold text-slate-300 mb-1">
                  Special Add-On Features Needed
                </label>
                <textarea
                  id="specialFeaturesNeeded"
                  rows={2}
                  value={state.specialFeaturesNeeded}
                  onChange={(e) => onChange("specialFeaturesNeeded", e.target.value)}
                  placeholder="e.g. WhatsApp Floating Assistant, Cost Estimator Calculator, GST Portal integration"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none placeholder-slate-500"
                />
              </div>

              <div>
                <label htmlFor="pagesNeeded" className="block text-xs font-semibold text-slate-300 mb-1">
                  Pages Specifically Needed
                </label>
                <textarea
                  id="pagesNeeded"
                  rows={2}
                  value={state.pagesNeeded}
                  onChange={(e) => onChange("pagesNeeded", e.target.value)}
                  placeholder="e.g. Home, Service Pages (split), About Us, Contact, Blog, Disclaimer"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-xs font-semibold text-slate-350 mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-gold-500" /> Additional Notes & Special Instructions
            </label>
            <textarea
              id="additionalNotes"
              rows={3}
              value={state.additionalNotes}
              onChange={(e) => onChange("additionalNotes", e.target.value)}
              placeholder="e.g. Please launch the trademark objection sub-page ahead of general compliance because we have active disputes..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none placeholder-slate-500"
            />
          </div>
        </div>
      );

    case 13:
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-brand-gold-500 pl-4">
            <h3 className="font-display text-lg font-semibold text-white">Payment & Escrow Compliance</h3>
            <p className="text-slate-400 text-sm">State the deposit/advance status and attach supporting transaction screenshots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div className="space-y-4">
              <div>
                <label htmlFor="advancePaid" className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-gold-500" /> Advance Retainer Paid <span className="text-brand-gold-500 font-bold">*</span>
                </label>
                <input
                  id="advancePaid"
                  type="text"
                  value={state.advancePaid}
                  onChange={(e) => onChange("advancePaid", e.target.value)}
                  placeholder="e.g. INR 15,000"
                  className={`w-full bg-slate-900 border ${errors.advancePaid ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold-500`}
                />
                {errors.advancePaid && <p id="err-advancePaid" className="mt-1.5 text-sm text-red-400">{errors.advancePaid}</p>}
              </div>

              <div>
                <label htmlFor="remainingAmount" className="block text-sm font-medium text-slate-300 mb-1">
                  Remaining Invoice Balance Due
                </label>
                <input
                  id="remainingAmount"
                  type="text"
                  value={state.remainingAmount}
                  onChange={(e) => onChange("remainingAmount", e.target.value)}
                  placeholder="e.g. INR 25,000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Strategic Payment Method Used
                </label>
                <select
                  id="paymentMethod"
                  value={state.paymentMethod}
                  onChange={(e) => onChange("paymentMethod", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold-500"
                >
                  <option>Bank Wire Transfer / IMPS / NEFT</option>
                  <option>UPI ID / Scan Pay (PhonePe / GPay)</option>
                  <option>Razorpay Secure payment link</option>
                  <option>Stripe Global Portal</option>
                  <option>Corporate Cheque / Draft</option>
                  <option>Cash Receipt Account</option>
                </select>
              </div>
            </div>

            {/* Receipt Proof Dropzone */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                  <FileCheck className="w-4 h-4 text-brand-gold-500" /> Proof of Transfer Upload
                </span>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <input
                    id="paymentProof"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onSingleFileChange("paymentProof", e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-trigger-paymentProof"
                      type="button"
                      onClick={() => document.getElementById("paymentProof")?.click()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 rounded cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-brand-gold-500" /> Choose File
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] block truncate text-slate-450" title={state.paymentProofName}>
                        {files.paymentProof ? files.paymentProof.name : (state.paymentProofName || "No proof attached")}
                      </span>
                      {files.paymentProof && (
                        <span className="text-[9px] text-brand-gold-500 block font-mono">
                          Live loaded ({formatSize(files.paymentProof.size)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-400">
                    Submit JPEG/PNG screenshot or PDF format slip of NEFT/UPI transaction confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
