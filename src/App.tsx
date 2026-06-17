import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FORM_STEPS, 
  INITIAL_FORM_STATE, 
  StepDefinition 
} from "./constants";
import { FormState, TeamMember, Testimonial } from "./types";
import { submitToFormspree } from "./formspreeService";
import { StepFields } from "./components/StepFields";
import { 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw, 
  FileLock2, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle,
  Github,
  Globe2,
  MailCheck,
  Smartphone
} from "lucide-react";

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [state, setState] = useState<FormState>(INITIAL_FORM_STATE);
  const [formspreeEndpoint, setFormspreeEndpoint] = useState<string>(() => {
    return (
      
      ((import.meta as any).env?.VITE_FORMSPREE_ENDPOINT as string) ||
      "https://formspree.io/f/xgobqgkk"
    );
  });
  const [showEndpointConfig, setShowEndpointConfig] = useState<boolean>(false);
  const [showHelpDrawer, setShowHelpDrawer] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Parallel in-memory storage for actual physical File objects (which cannot be JSON stringified to localStorage)
  const [files, setFiles] = useState({
    companyLogo: null as File | null,
    favicon: null as File | null,
    brochure: null as File | null,
    brandGuide: null as File | null,
    paymentProof: null as File | null,
    teamPhotos: {} as { [key: string]: File },
    testimonialPhotos: {} as { [key: string]: File },
    media: {
      heroBanners: [] as File[],
      teamPhotos: [] as File[],
      officePhotos: [] as File[],
      serviceImages: [] as File[],
      certificates: [] as File[],
      awards: [] as File[],
      clientLogos: [] as File[],
      galleryImages: [] as File[],
    },
  });

  // Load draft text metrics from LocalStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("goldline_onboarding_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Fallback structures to support backward compatibility
        setState((prev) => ({
          ...prev,
          ...parsed,
          services: parsed.services ? { ...prev.services, ...parsed.services } : prev.services,
          mediaMetadata: parsed.mediaMetadata ? { ...prev.mediaMetadata, ...parsed.mediaMetadata } : prev.mediaMetadata,
          team: parsed.team || [],
          testimonials: parsed.testimonials || [],
        }));
        setLastSavedTimestamp(localStorage.getItem("goldline_draft_time") || "Restored");
      } catch (e) {
        console.error("Error restoring local state draft:", e);
      }
    }
  }, []);

  // Sync state modifications with LocalStorage
  const persistDraft = (newState: FormState) => {
    setIsSavingDraft(true);
    localStorage.setItem("goldline_onboarding_draft", JSON.stringify(newState));
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    localStorage.setItem("goldline_draft_time", nowStr);
    setLastSavedTimestamp(nowStr);
    setTimeout(() => setIsSavingDraft(false), 450);
  };

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...state, [field]: value };
    setState(updated);
    persistDraft(updated);

    // Clear error message once value is typed
    if (errors[field]) {
      const errCopy = { ...errors };
      delete errCopy[field];
      setErrors(errCopy);
    }
  };

  const handleServiceCheckboxChange = (serviceKey: string, checked: boolean) => {
    const servicesCopy = { ...state.services, [serviceKey]: checked };
    const updated = { ...state, services: servicesCopy };
    setState(updated);
    persistDraft(updated);
  };

  // Dynamic board team controllers
  const handleAddNewTeamMember = (member: TeamMember, photo: File | null) => {
    const updatedTeam = [...state.team, member];
    const updated = { ...state, team: updatedTeam };
    setState(updated);
    persistDraft(updated);

    if (photo) {
      setFiles((prev) => ({
        ...prev,
        teamPhotos: {
          ...prev.teamPhotos,
          [member.id]: photo,
        },
      }));
    }
  };

  const handleRemoveTeamMember = (id: string) => {
    const updatedTeam = state.team.filter((m) => m.id !== id);
    const updated = { ...state, team: updatedTeam };
    setState(updated);
    persistDraft(updated);

    setFiles((prev) => {
      const copy = { ...prev.teamPhotos };
      delete copy[id];
      return { ...prev, teamPhotos: copy };
    });
  };

  // Dynamic testimonial controllers
  const handleAddNewTestimonial = (testimonial: Testimonial, photo: File | null) => {
    const updatedTestimonials = [...state.testimonials, testimonial];
    const updated = { ...state, testimonials: updatedTestimonials };
    setState(updated);
    persistDraft(updated);

    if (photo) {
      setFiles((prev) => ({
        ...prev,
        testimonialPhotos: {
          ...prev.testimonialPhotos,
          [testimonial.id]: photo,
        },
      }));
    }
  };

  const handleRemoveTestimonial = (id: string) => {
    const updatedTestimonials = state.testimonials.filter((t) => t.id !== id);
    const updated = { ...state, testimonials: updatedTestimonials };
    setState(updated);
    persistDraft(updated);

    setFiles((prev) => {
      const copy = { ...prev.testimonialPhotos };
      delete copy[id];
      return { ...prev, testimonialPhotos: copy };
    });
  };

  // Multi-upload media arrays controllers
  const handleMultiMediaChange = (
    category: "heroBanners" | "teamPhotos" | "officePhotos" | "serviceImages" | "certificates" | "awards" | "clientLogos" | "galleryImages",
    addedFiles: File[]
  ) => {
    // Append actual files
    setFiles((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [category]: [...prev.media[category], ...addedFiles],
      },
    }));

    // Save lightweight metadata list for draft sync
    const newMetaList = addedFiles.map((f) => ({ name: f.name, size: f.size }));
    const updatedMetadata = {
      ...state.mediaMetadata,
      [category]: [...(state.mediaMetadata[category] || []), ...newMetaList],
    };
    const updated = { ...state, mediaMetadata: updatedMetadata };
    setState(updated);
    persistDraft(updated);
  };

  const handleRemoveMultiMedia = (
    category: "heroBanners" | "teamPhotos" | "officePhotos" | "serviceImages" | "certificates" | "awards" | "clientLogos" | "galleryImages",
    index: number
  ) => {
    setFiles((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [category]: prev.media[category].filter((_, idx) => idx !== index),
      },
    }));

    const updatedMetadata = {
      ...state.mediaMetadata,
      [category]: (state.mediaMetadata[category] || []).filter((_, idx) => idx !== index),
    };
    const updated = { ...state, mediaMetadata: updatedMetadata };
    setState(updated);
    persistDraft(updated);
  };

  // Single branded files controllers
  const handleSingleAssetChange = (
    key: "companyLogo" | "favicon" | "brochure" | "brandGuide" | "paymentProof",
    file: File | null
  ) => {
    // Save live file object state
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    // Record properties to form state
    const filenameKey = `${key}Name`;
    const updated = {
      ...state,
      [filenameKey]: file ? file.name : "",
    };
    setState(updated);
    persistDraft(updated);
  };

  // Perform constraints verification per Step index
  const validateStepRequirements = (stepNum: number): boolean => {
    const definition = FORM_STEPS.find((s) => s.num === stepNum);
    if (!definition) return true;

    const stepErrors: { [key: string]: string } = {};

    definition.requiredFields.forEach((fieldName) => {
      const val = (state as any)[fieldName];
      if (typeof val === "string" && !val.trim()) {
        const readableLabel = fieldName
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        stepErrors[fieldName] = `${readableLabel} standard input is essential before forwarding.`;
      }
    });

    // Special custom email checks
    if (stepNum === 2 && state.emailAddress) {
      const isEmailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.emailAddress);
      if (!isEmailOk) {
        stepErrors.emailAddress = "Please include a standard, valid email handle.";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleStepForward = () => {
    const isStepValid = validateStepRequirements(activeStep);
    if (isStepValid) {
      if (activeStep < 13) {
        setActiveStep(activeStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Focus on first validation error
      const firstErrKey = Object.keys(errors)[0];
      const targetElement = document.getElementById(firstErrKey);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleStepBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToStepDirectly = (targetStep: number) => {
    // Only permit forward jumping if all intermediate preceding steps are valid
    if (targetStep > activeStep) {
      for (let s = activeStep; s < targetStep; s++) {
        if (!validateStepRequirements(s)) {
          setActiveStep(s);
          return;
        }
      }
    }
    setActiveStep(targetStep);
  };

  // Completely wipe state & draft
  const handleWipeStateDetails = () => {
    if (confirm("Are you absolutely sure you want to reset your entry draft? All client details, listings and media links will be completely emptied.")) {
      localStorage.removeItem("goldline_onboarding_draft");
      localStorage.removeItem("goldline_draft_time");
      setState(INITIAL_FORM_STATE);
      setFiles({
        companyLogo: null,
        favicon: null,
        brochure: null,
        brandGuide: null,
        paymentProof: null,
        teamPhotos: {},
        testimonialPhotos: {},
        media: {
          heroBanners: [],
          teamPhotos: [],
          officePhotos: [],
          serviceImages: [],
          certificates: [],
          awards: [],
          clientLogos: [],
          galleryImages: [],
        },
      });
      setErrors({});
      setActiveStep(1);
    }
  };

  // Submit complete client portfolio
  const handleFinalPortfolioSubmitAction = async () => {
    // Validate final step payouts
    if (!validateStepRequirements(13)) {
      return;
    }

    setIsSubmitting(true);
    const apiResult = await submitToFormspree(formspreeEndpoint, state, files);
    setIsSubmitting(false);

    setSubmitResult(apiResult);
    if (apiResult.success) {
      // Submission OK! Wipe the old draft to prevent reuse
      localStorage.removeItem("goldline_onboarding_draft");
    }
  };

  const totalStepsCount = FORM_STEPS.length;
  const currentStepDef = FORM_STEPS.find((s) => s.num === activeStep)!;
  const currentProgressPercent = Math.round(((activeStep - 1) / (totalStepsCount - 1)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-slate-100 flex flex-col font-sans transition-all selection:bg-brand-gold-500 selection:text-brand-navy-950">
      
      {/* 🚀 STICKY CORE HEADER */}
      <header className="sticky top-0 z-40 bg-brand-navy-950/90 backdrop-blur-md border-b border-brand-gold-500/20 py-3.5 px-4 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Status metrics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-gold-500 to-amber-600 flex items-center justify-center border border-brand-gold-400 font-display text-slate-950 font-black text-xl tracking-tight shadow">
                G
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-white tracking-wide">
                  Goldline Enterprise Intake
                </h1>
                <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-gold-500 animate-pulse"></span> Offline Draft Safe
                </p>
              </div>
            </div>
          </div>

          {/* Formspree endpoint quick connector */}
          <div className="flex items-center gap-2 md:self-center self-start bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            <div className="text-[11px] font-mono pl-2 text-slate-400">
              Formspree:
            </div>
            
            <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${formspreeEndpoint.includes("placeholder") ? "bg-red-400" : "bg-emerald-400"}`}></span>
            
            <button
              id="btn-toggle-endpoint-config"
              onClick={() => setShowEndpointConfig(!showEndpointConfig)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-brand-gold-400 hover:text-brand-gold-300 rounded text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              {formspreeEndpoint.includes("placeholder") ? "Unconfigured" : "Connected"}
            </button>
          </div>

        </div>

        {/* Formspree Configuration Drawer */}
        <AnimatePresence>
          {showEndpointConfig && (
            <motion.div
              layoutId="endpoint-config-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-7xl mx-auto overflow-hidden text-slate-300 text-xs w-full mt-3 bg-slate-900/90 rounded-lg border border-brand-gold-500/20 p-4 space-y-3 shadow-inner"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display font-semibold text-white text-sm">Deploy Target Setup</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Please map your Formspree production endpoint. Raw JSON logs and actual uploaded media files are routed here directly.</p>
                </div>
                <button
                  id="btn-close-endpoint-drawer"
                  onClick={() => setShowEndpointConfig(false)}
                  className="text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  id="input-formspree-endpoint"
                  type="url"
                  value={formspreeEndpoint}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormspreeEndpoint(val);
                    localStorage.setItem("goldline_endpoint_custom", val);
                  }}
                  placeholder="https://formspree.io/f/xbjnqdyo"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold-500 font-mono"
                />
                <button
                  id="btn-reset-endpoint-to-default"
                  onClick={() => {
                    setFormspreeEndpoint("https://formspree.io/f/placeholder");
                    localStorage.removeItem("goldline_endpoint_custom");
                  }}
                  className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded font-semibold border border-slate-700 whitespace-nowrap"
                >
                  Wipe Endpoint
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>By default, submissions use a sandbox mock. Register at <strong>formspree.io</strong> to get your endpoint.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP BUBBLE PROGRESS NAVIGATOR */}
        <div className="max-w-7xl mx-auto mt-4 px-1 pb-1">
          {/* Completion Bar */}
          <div className="relative w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div 
              style={{ width: `${currentProgressPercent}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600 transition-all duration-300"
            />
          </div>

          {/* Stepper circles */}
          <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar py-1">
            {FORM_STEPS.map((stepDef) => {
              const checked = stepDef.num < activeStep;
              const active = stepDef.num === activeStep;
              return (
                <button
                  key={stepDef.num}
                  id={`btn-nav-step-${stepDef.num}`}
                  onClick={() => handleJumpToStepDirectly(stepDef.num)}
                  title={`${stepDef.num}. ${stepDef.title}`}
                  className="flex flex-col items-center shrink-0 min-w-10 text-center select-none group"
                >
                  <div className={`w-7 h-7 rounded-full text-[11px] font-mono flex items-center justify-center font-bold border transition-all ${
                    active 
                      ? "bg-brand-gold-500 border-brand-gold-400 text-slate-950 shadow-md transform scale-110" 
                      : checked 
                        ? "bg-brand-gold-500/10 border-brand-gold-500/80 text-brand-gold-400" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}>
                    {checked ? "✓" : stepDef.num}
                  </div>
                  <span className={`text-[9px] mt-1 font-sans hidden md:block whitespace-nowrap transition-all ${
                    active ? "text-brand-gold-400 font-semibold" : "text-slate-500 group-hover:text-slate-300"
                  }`}>
                    {stepDef.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 🔮 MAIN STAGE */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        
        {/* Success summary screen */}
        {submitResult ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full overflow-hidden text-slate-300 bg-slate-950 rounded-2xl border ${
              submitResult.success ? "border-brand-gold-500/40" : "border-red-500/40"
            } p-6 sm:p-8 shadow-2xl relative`}
          >
            <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
              {submitResult.success ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-brand-gold-500/10 border border-brand-gold-500 flex items-center justify-center text-brand-gold-500 animate-bounce">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-white tracking-wide">
                    Portfolio Submitted!
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    {submitResult.message}
                  </p>
                  <p className="text-xs text-slate-500">
                    Your answers, static media declarations, brand guide colors and payment documents have been compiled into a dashboard layout and sent.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-9 h-9" />
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-white">
                    Filing Error Detected
                  </h2>
                  <p className="text-sm text-red-300">
                    {submitResult.message}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please ensure that the Formspree endpoint is configured correctly. You can edit the endpoint setting directly in the top header and retry.
                  </p>
                </>
              )}

              <div className="flex items-center gap-3 pt-6 w-full">
                <button
                  id="btn-resume-and-fix"
                  onClick={() => setSubmitResult(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-brand-gold-400 hover:text-brand-gold-300 py-3 rounded-lg border border-slate-800 text-xs font-bold transition-all shadow cursor-pointer text-center"
                >
                  Return to Form
                </button>
                {submitResult.success && (
                  <button
                    id="btn-restart-fresh"
                    onClick={() => {
                      setSubmitResult(null);
                      setState(INITIAL_FORM_STATE);
                      setActiveStep(1);
                    }}
                    className="flex-1 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 py-3 rounded-lg text-xs font-black transition-all shadow cursor-pointer text-center"
                  >
                    Start New Form
                  </button>
                )}
              </div>
            </div>

            {/* Compiled summary display list */}
            {submitResult.success && (
              <div className="mt-8 border-t border-slate-900 pt-6 space-y-4">
                <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-brand-gold-400">Submitted Metadata Receipt</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-900/60 p-4 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-500 block">Owner Name:</span>
                    <span className="text-white font-sans">{state.ownerFullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mobile:</span>
                    <span className="text-white font-sans">{state.mobileNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Brand Palette:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: state.primaryBrandColor }} />
                      <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: state.secondaryBrandColor }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Escrow Paid:</span>
                    <span className="text-brand-gold-400">{state.advancePaid}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Card-based layout with steps active */
          <div className="space-y-6">
            
            {/* Main Content card */}
            <div id={`step-panel-${activeStep}`} className="bg-slate-950 rounded-2xl border border-slate-850 p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />
              
              {/* Header card details */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-900 pb-5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold-400 font-bold">
                    STEP {activeStep} of {totalStepsCount}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-1">
                    {currentStepDef.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    {currentStepDef.description}
                  </p>
                </div>
                
                {/* Save details status badge */}
                <div className="shrink-0 flex items-center md:flex-col items-end gap-2 md:gap-0 font-mono text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {isSavingDraft ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-brand-gold-400 border-t-transparent animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Draft Encrypted</span>
                      </>
                    )}
                  </div>
                  {lastSavedTimestamp && (
                    <span className="mt-0.5 text-slate-400">Sync: {lastSavedTimestamp}</span>
                  )}
                </div>
              </div>

              {/* Render dynamic sub fields */}
              <div className="min-h-[220px]">
                <StepFields
                  step={activeStep}
                  state={state}
                  onChange={handleFieldChange}
                  onServiceChange={handleServiceCheckboxChange}
                  onAddTeamMember={handleAddNewTeamMember}
                  onRemoveTeamMember={handleRemoveTeamMember}
                  onAddTestimonial={handleAddNewTestimonial}
                  onRemoveTestimonial={handleRemoveTestimonial}
                  onFileChange={handleMultiMediaChange}
                  onRemoveFile={handleRemoveMultiMedia}
                  onSingleFileChange={handleSingleAssetChange}
                  files={files}
                  errors={errors}
                />
              </div>

              {/* Controls bar footer */}
              <div className="border-t border-slate-900 pt-5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                
                {/* Left controls or wipe option */}
                <div className="flex gap-2">
                  <button
                    id="btn-action-wipe"
                    type="button"
                    onClick={handleWipeStateDetails}
                    className="px-3 py-2 border border-slate-800 hover:border-red-500/40 rounded-lg text-slate-500 hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Initialize fresh onboarding"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                  
                  {activeStep > 1 && (
                    <button
                      id="btn-step-prev"
                      type="button"
                      onClick={handleStepBack}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all text-center"
                    >
                      <ChevronLeft className="w-4 h-4 text-brand-gold-500" /> Back
                    </button>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex-1 flex justify-end">
                  {activeStep < 13 ? (
                    <button
                      id="btn-step-next"
                      type="button"
                      onClick={handleStepForward}
                      className="w-full sm:w-auto px-6 py-2.5 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-brand-gold-500/10 cursor-pointer transition-all"
                    >
                      Next Step <ChevronRight className="w-4 h-4 text-slate-950" />
                    </button>
                  ) : (
                    <button
                      id="btn-finalize-submit-portfolio"
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalPortfolioSubmitAction}
                      className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-brand-gold-600 to-amber-500 hover:from-brand-gold-500 hover:to-brand-gold-400 text-slate-950 font-black text-xs rounded-lg shadow-xl shadow-brand-gold-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 tracking-wider transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                          Submitting Agency Portfolio...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          SUBMIT COMPLETE REGISTRATION PORTFOLIO
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Quick tips box */}
            <div className="bg-brand-navy-900 border border-slate-800 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-400">
              <Sparkles className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">Intelligent Portfolio Assembler:</span> Your registration progress is auto-saved locally in real time. Feel free to refresh the window. File lists can be easily previewed or appended before submission.
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 🚀 FLOATING HELP BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btn-trigger-help-drawer"
          onClick={() => setShowHelpDrawer(!showHelpDrawer)}
          className="w-12 h-12 rounded-full bg-slate-900 border border-brand-gold-500 hover:bg-brand-gold-500 hover:text-slate-950 text-brand-gold-500 flex items-center justify-center shadow-2xl transition-all cursor-pointer group"
          title="Onboarding instructions"
        >
          <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* 🔮 HELP SYSTEM CONTAINER DRAWER */}
      <AnimatePresence>
        {showHelpDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end"
          >
            {/* Modal Backdrop closer */}
            <button
              id="help-drawer-backdrop-closer"
              onClick={() => setShowHelpDrawer(false)}
              className="absolute inset-0 cursor-default bg-transparent w-full h-full text-left"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6 overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-gold-500" />
                    <h3 className="font-display text-base font-bold text-white">Guidelines for Intake Setup</h3>
                  </div>
                  <button
                    id="btn-close-help-drawer"
                    onClick={() => setShowHelpDrawer(false)}
                    className="p-1 rounded text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                  <div className="bg-slate-900 p-3 rounded border border-slate-800">
                    <h5 className="font-bold text-brand-gold-400 mb-1">💼 Step Requirements Checklist:</h5>
                    <p className="text-slate-400">Step 1 and Step 2 require validating essential physical identity records (Owner Name, mobile contact addresses). If requirements are unfulfilled, the panel triggers flashing indicators pointing directly to the required fields.</p>
                  </div>
                  
                  <div className="bg-slate-900 p-3 rounded border border-slate-800">
                    <h5 className="font-bold text-brand-gold-400 mb-1">📥 File Upload Standards:</h5>
                    <p className="text-slate-400">Our compiler organizes multi-image uploads (Certificates, Logotypes, Office Photos) into specific multipart arrays. When Formspree executes submission, these media items are mapped to labeled links within Gmail.</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-slate-800">
                    <h5 className="font-bold text-brand-gold-400 mb-1">🏦 Escrow Payouts:</h5>
                    <p className="text-slate-400">Step 13 collects the contract advance fee and matches payment proof attachments. Submission compiles an advanced Markdown panel report sent to Gmail for streamlined legal processing.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-4 text-center">
                <p className="text-[10px] text-slate-500 font-mono">Goldline Onboarding Console v1.2.0 • 2026</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 FOOTER */}
      <footer className="bg-brand-navy-950 border-t border-slate-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Goldline Corporate Services. All rights confidential. Secure Formspree Transit Protocol.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Smartphone className="w-4 h-4 text-brand-gold-500" /> Client Mobile Optimised</span>
            <span className="flex items-center gap-1"><FileLock2 className="w-4 h-4 text-brand-gold-500" /> AES-256 draft storage</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
