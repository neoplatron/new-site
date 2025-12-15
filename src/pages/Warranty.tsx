import { useState, useCallback } from "react";
import {
  Shield,
  CheckCircle,
  User,
  Car,
  Wrench,
  Camera,
  FileText,
  Send,
  AlertCircle,
  Search,
  ClipboardCopy,
  Clock,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { validateSellerCode, searchWarranty } from "../api/warrantyAPI";
import SimpleCaptcha from "../components/SimpleCaptcha";

// ==================== TYPES ====================
type WarrantyMode = "vehicle" | "generator";
type WarrantyAction = "register" | "check" | null;
type SubmitStatus = null | "success" | "error";

interface GaragePic {
  file: File;
  previewUrl: string;
}

interface FilesState {
  invoice: File | null;
  garagePics: GaragePic[];
  vehicleRC: File | null;
}

interface WarrantyData {
  id: string;
  verification_uid: string;
  warranty_type: string;
  customer_name: string;
  email: string;
  phone: string;
  registration_date: string;
  installation_date: string;
  product_type: string;
  vehicle_number?: string;
}

// ==================== CONSTANTS ====================
const WARRANTY_PERIOD_YEARS = 1; // Configurable warranty period

const generateUID = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uid = "";
  for (let i = 0; i < 12; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uid;
};

const isWarrantyValid = (installationDate: string): { valid: boolean; expiryDate: Date; daysRemaining: number } => {
  const instDate = new Date(installationDate);
  const expiryDate = new Date(instDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + WARRANTY_PERIOD_YEARS);

  const now = new Date();
  const valid = now < expiryDate;
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return { valid, expiryDate, daysRemaining };
};

// ==================== MAIN COMPONENT ====================
const WarrantyPage = () => {
  const [warrantyMode, setWarrantyMode] = useState<WarrantyMode | null>(null);
  const [warrantyAction, setWarrantyAction] = useState<WarrantyAction>(null);

  const handleBack = () => {
    if (warrantyAction) {
      setWarrantyAction(null);
    } else {
      setWarrantyMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-bg-light">
              Warranty Services
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Warranty{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Portal
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed">
            Register your installation or check your existing warranty status
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(warrantyMode || warrantyAction) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {!warrantyMode && <ModeSelection onSelect={setWarrantyMode} />}

        {warrantyMode && !warrantyAction && (
          <ActionSelection
            mode={warrantyMode}
            onSelect={setWarrantyAction}
          />
        )}

        {warrantyMode && warrantyAction === "register" && (
          <RegistrationForm mode={warrantyMode} onReset={() => setWarrantyAction(null)} />
        )}

        {warrantyMode && warrantyAction === "check" && (
          <CheckWarranty mode={warrantyMode} />
        )}
      </section>
    </div>
  );
};

// ==================== MODE SELECTION ====================
const ModeSelection = ({ onSelect }: { onSelect: (mode: WarrantyMode) => void }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <button
      onClick={() => onSelect("vehicle")}
      className="group bg-bg-light dark:bg-d-bg-light rounded-2xl p-8 border-2 border-border dark:border-d-border hover:border-primary transition-all duration-300 text-left"
    >
      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Car className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-2">
        Vehicle Installation
      </h3>
      <p className="text-text-muted dark:text-d-text-muted text-sm">
        Register or check warranty for vehicle kit installations
      </p>
    </button>

    <button
      onClick={() => onSelect("generator")}
      className="group bg-bg-light dark:bg-d-bg-light rounded-2xl p-8 border-2 border-border dark:border-d-border hover:border-primary transition-all duration-300 text-left"
    >
      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Wrench className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-2">
        Generator Installation
      </h3>
      <p className="text-text-muted dark:text-d-text-muted text-sm">
        Register or check warranty for generator kit installations
      </p>
    </button>
  </div>
);

// ==================== ACTION SELECTION ====================
const ActionSelection = ({
  mode,
  onSelect
}: {
  mode: WarrantyMode;
  onSelect: (action: WarrantyAction) => void;
}) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="font-title text-2xl font-bold text-text dark:text-d-text">
        {mode === "vehicle" ? "Vehicle" : "Generator"} Warranty
      </h2>
      <p className="text-text-muted dark:text-d-text-muted mt-2">
        What would you like to do?
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <button
        onClick={() => onSelect("register")}
        className="group bg-bg-light dark:bg-d-bg-light rounded-2xl p-8 border-2 border-border dark:border-d-border hover:border-primary transition-all duration-300 text-left"
      >
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-2">
          Register Warranty
        </h3>
        <p className="text-text-muted dark:text-d-text-muted text-sm">
          Register your new installation and get a verification UID
        </p>
      </button>

      <button
        onClick={() => onSelect("check")}
        className="group bg-bg-light dark:bg-d-bg-light rounded-2xl p-8 border-2 border-border dark:border-d-border hover:border-primary transition-all duration-300 text-left"
      >
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-2">
          Check Warranty
        </h3>
        <p className="text-text-muted dark:text-d-text-muted text-sm">
          Check your warranty status using your UID, Phone or Email
        </p>
      </button>
    </div>
  </div>
);

// ==================== REGISTRATION FORM ====================
const RegistrationForm = ({
  mode,
  onReset
}: {
  mode: WarrantyMode;
  onReset: () => void;
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    installationDate: "",
    invoiceNumber: "",
    installedBy: "",
    // garageName is now optional or used for non-seller installs if we allowed them, 
    // but requirements say "Seller Code" is key. We'll keep garageName as "Seller Name" (read only) or manual override?
    // Requirement: "user will fill out the form and they will also have to fill the seller code"
    sellerCode: "",
    garageName: "", // We can auto-fill this from seller code
    customerAddress: "",
    city: "",
    state: "",
    pinCode: "",
    vehicleNumber: "",
    productType: "",
    fuelType: "",
    kmsDriven: "",
  });

  const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerVerified, setSellerVerified] = useState(false);

  const [files, setFiles] = useState<FilesState>({
    invoice: null,
    garagePics: [],
    vehicleRC: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedUID, setGeneratedUID] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaVerify = useCallback((isValid: boolean) => {
    setCaptchaVerified(isValid);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "invoice" | "vehicleRC"
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size should not exceed 5MB");
      return;
    }

    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    for (const file of picked) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Each file size should not exceed 5MB");
        return;
      }
    }

    const newPics: GaragePic[] = picked.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));

    setFiles((prev) => {
      const combined = [...prev.garagePics, ...newPics].slice(0, 5);
      return { ...prev, garagePics: combined };
    });

    e.currentTarget.value = "";
  };

  const removeGaragePic = (index: number) => {
    setFiles((prev) => {
      const toRemove = prev.garagePics[index];
      if (toRemove?.previewUrl) {
        URL.revokeObjectURL(toRemove.previewUrl);
      }
      return {
        ...prev,
        garagePics: prev.garagePics.filter((_, i) => i !== index),
      };
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateStep = (step: number): { isValid: boolean; message: string } => {
    if (step === 1) {
      if (!formData.customerName.trim()) return { isValid: false, message: "Customer Name is required" };
      if (!formData.phone.trim()) return { isValid: false, message: "Phone Number is required" };
      if (!formData.email.trim()) return { isValid: false, message: "Email Address is required" };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return { isValid: false, message: "Please enter a valid email address" };
      if (!formData.customerAddress.trim()) return { isValid: false, message: "Customer Address is required" };
      if (!formData.city.trim()) return { isValid: false, message: "City is required" };
      if (!formData.state.trim()) return { isValid: false, message: "State is required" };
      if (!formData.pinCode.trim()) return { isValid: false, message: "PIN Code is required" };
      if (!/^\d{6}$/.test(formData.pinCode)) return { isValid: false, message: "Please enter a valid 6-digit PIN Code" };
    }

    if (step === 2) {
      if (!formData.installationDate) return { isValid: false, message: "Installation Date is required" };

      // Date Logic: 10 Days
      const today = new Date();
      const selectedDate = new Date(formData.installationDate);
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10);

      // Reset time
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      tenDaysAgo.setHours(0, 0, 0, 0);

      if (selectedDate > today) return { isValid: false, message: "Date cannot be in the future" };
      if (selectedDate < tenDaysAgo) return { isValid: false, message: "Installation Date cannot be older than 10 days" };

      if (!formData.invoiceNumber.trim()) return { isValid: false, message: "Invoice Number is required" };
      if (!formData.installedBy.trim()) return { isValid: false, message: "Installed By is required" };

      // Seller Code Validation
      if (!formData.sellerCode.trim()) return { isValid: false, message: "Seller Code is required" };
      if (!sellerVerified) return { isValid: false, message: "Invalid Seller Code. Please verify." };

      if (!files.invoice) return { isValid: false, message: "Please upload the invoice document" };
      if (files.garagePics.length === 0) return { isValid: false, message: "Please upload at least one installation photo" };
    }

    if (step === 3) {
      if (!formData.productType) return { isValid: false, message: `${mode === "vehicle" ? "Vehicle" : "Generator"} Type is required` };
      if (mode === "vehicle") {
        if (!formData.vehicleNumber.trim()) return { isValid: false, message: "Vehicle Number is required" };
        if (!formData.fuelType) return { isValid: false, message: "Fuel Type is required" };
        if (!formData.kmsDriven.trim()) return { isValid: false, message: "Kilometers Driven is required" };
      }
    }

    return { isValid: true, message: "" };
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
      }, 3000);
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    for (let step = 1; step <= 3; step++) {
      const validation = validateStep(step);
      if (!validation.isValid) {
        setErrorMessage(validation.message);
        setSubmitStatus("error");
        setTimeout(() => {
          setSubmitStatus(null);
          setErrorMessage("");
        }, 5000);
        return;
      }
    }

    // Check captcha
    if (!captchaVerified) {
      setErrorMessage("Please complete the security check");
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
      }, 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const uid = generateUID();

      const invoiceBase64 = files.invoice ? await fileToBase64(files.invoice) : null;
      const vehicleRCBase64 = files.vehicleRC ? await fileToBase64(files.vehicleRC) : null;
      const garagePicsBase64 = await Promise.all(
        files.garagePics.map(async (pic) => ({
          data: await fileToBase64(pic.file),
          name: pic.file.name,
          type: pic.file.type,
        }))
      );

      const { error } = await supabase.from("warranty_registrations").insert({
        verification_uid: uid,
        warranty_type: mode,
        customer_name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        customer_address: formData.customerAddress,
        city: formData.city,
        state: formData.state,
        pin_code: formData.pinCode,
        installation_date: formData.installationDate,
        invoice_number: formData.invoiceNumber,
        installed_by: formData.installedBy,

        // Seller Fields
        seller_id: sellerId,
        seller_code_used: formData.sellerCode,
        garage_name: formData.garageName, // Auto-filled from seller

        vehicle_number: mode === "vehicle" ? formData.vehicleNumber.toUpperCase() : null,
        product_type: formData.productType,
        fuel_type: mode === "vehicle" ? formData.fuelType : null,
        kms_driven: mode === "vehicle" && formData.kmsDriven ? parseInt(formData.kmsDriven) : null,
        invoice_data: invoiceBase64,
        vehicle_rc_data: vehicleRCBase64,
        installation_photos: garagePicsBase64,
      });

      if (error) throw error;

      setGeneratedUID(uid);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting warranty:", error);
      setErrorMessage(error instanceof Error ? error.message : "Submission failed");
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUID = () => {
    if (generatedUID) {
      navigator.clipboard.writeText(generatedUID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success Screen
  if (submitStatus === "success" && generatedUID) {
    return (
      <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-8 border-2 border-border dark:border-d-border text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-title text-2xl font-bold text-text dark:text-d-text mb-4">
          Registration Successful!
        </h2>
        <p className="text-text-muted dark:text-d-text-muted mb-6">
          Your warranty has been registered. Please save your Verification UID below.
        </p>

        <div className="bg-bg dark:bg-d-bg rounded-xl p-6 mb-6">
          <p className="text-sm text-text-muted dark:text-d-text-muted mb-2">Your Verification UID</p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-2xl font-bold text-primary tracking-wider">
              {generatedUID}
            </span>
            <button
              onClick={copyUID}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ClipboardCopy className={`w-5 h-5 ${copied ? "text-green-600" : "text-primary"}`} />
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>

        <p className="text-sm text-text-muted dark:text-d-text-muted mb-6">
          Keep this UID safe. You'll need it to check your warranty status or file a claim.
        </p>

        <button
          onClick={onReset}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  const stepConfig = [
    { num: 1, label: "Personal Info", icon: User },
    { num: 2, label: "Installation", icon: Wrench },
    { num: 3, label: mode === "vehicle" ? "Vehicle Details" : "Generator Details", icon: mode === "vehicle" ? Car : Wrench },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-6 border-2 border-border dark:border-d-border">
        <div className="flex justify-between items-center">
          {stepConfig.map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.num
                  ? "bg-primary border-primary text-white"
                  : "border-border dark:border-d-border text-text-muted"
                  }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 text-center ${currentStep >= step.num ? "text-primary font-medium" : "text-text-muted"
                  }`}>
                  {step.label}
                </span>
              </div>
              {idx < stepConfig.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.num ? "bg-primary" : "bg-border dark:bg-d-border"
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-6 sm:p-8 border-2 border-border dark:border-d-border">
        {/* Error Message */}
        {submitStatus === "error" && errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-600">{errorMessage}</span>
          </div>
        )}

        {/* Pre-check: Seller Verification */}
        {!sellerVerified && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-2">
                Verify Seller
              </h3>
              <p className="text-text-muted dark:text-d-text-muted text-sm">
                Please enter the Seller ID provided by your installer to proceed.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/20 rounded-full h-fit">
                    <Wrench className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text dark:text-d-text mb-1">Don't have a Seller ID?</h4>
                    <p className="text-xs text-text-muted dark:text-d-text-muted">
                      Please ask the garage or technician where you got the device installed for their unique 8-digit Seller Code.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">
                  Seller Code
                </label>
                <div className="flex gap-2">
                  <input
                    name="sellerCode"
                    value={formData.sellerCode}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, sellerCode: e.target.value }));
                      setErrorMessage("");
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-bg dark:bg-d-bg border border-border dark:border-d-border focus:ring-1 focus:ring-primary outline-hidden"
                    placeholder="Enter 8-digit code"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      // If already verified (garageName is set), proceed
                      if (formData.garageName) {
                        setSellerVerified(true);
                        return;
                      }

                      if (formData.sellerCode.length < 8) {
                        setErrorMessage("Code must be 8 digits");
                        return;
                      }

                      const seller = await validateSellerCode(formData.sellerCode);
                      if (seller) {
                        setSellerId(seller.id);
                        setFormData(prev => ({ ...prev, garageName: seller.name }));
                        setErrorMessage("");
                      } else {
                        setSellerId(null);
                        setErrorMessage("Invalid Seller Code");
                      }
                    }}
                    className={`px-6 py-2 rounded-lg transition-colors font-medium text-white ${formData.garageName
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:bg-primary/90"
                      }`}
                  >
                    {formData.garageName ? "Continue" : "Verify"}
                  </button>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <p className="text-sm text-red-500 mt-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </p>
                )}

                {/* Seller Confirmation Display */}
                {formData.garageName && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-0.5">Verified Seller</p>
                      <p className="text-base font-bold text-text dark:text-d-text leading-tight">{formData.garageName}</p>
                      <p className="text-xs text-text-muted mt-1">Click Continue to proceed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Form Steps (Only if Verified) */}
        {sellerVerified && (
          <>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Full Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                  <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  <InputField label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleChange} maxLength={6} required />
                </div>
                <InputField label="Address" name="customerAddress" value={formData.customerAddress} onChange={handleChange} required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
                  <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>
            )}

            {/* Step 2: Installation Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
                  Installation Details
                </h3>

                {/* Verified Seller Badge */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-1">
                      Verified Seller
                    </p>
                    <p className="font-medium text-text dark:text-d-text">
                      {formData.garageName} <span className="text-text-muted">({formData.sellerCode})</span>
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <InputField
                      label="Installation Date"
                      name="installationDate"
                      type="date"
                      value={formData.installationDate}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-text-muted mt-1">Must be within the last 10 days</p>
                  </div>
                  <InputField label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required />
                  <InputField label="Installed By (Technician)" name="installedBy" value={formData.installedBy} onChange={handleChange} required />
                </div>

                <div className="space-y-4">
                  <FileUpload
                    label="Upload Invoice"
                    file={files.invoice}
                    onChange={(e) => handleFileChange(e, "invoice")}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
                      Installation Photos (Max 5) *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {files.garagePics.map((pic, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                          <img src={pic.previewUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGaragePic(index)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {files.garagePics.length < 5 && (
                        <label className="w-20 h-20 border-2 border-dashed border-border dark:border-d-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <Camera className="w-6 h-6 text-text-muted" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 3: Product Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
              {mode === "vehicle" ? "Vehicle Details" : "Generator Details"}
            </h3>

            {mode === "vehicle" ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
                  <SelectField
                    label="Vehicle Type"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    options={[
                      { value: "", label: "Select Vehicle Type" },
                      { value: "2-Wheeler", label: "2-Wheeler" },
                      { value: "3-Wheeler", label: "3-Wheeler" },
                      { value: "4-Wheeler", label: "4-Wheeler" },
                      { value: "Bus", label: "Bus" },
                      { value: "Truck", label: "Truck" },
                    ]}
                    required
                  />
                  <SelectField
                    label="Fuel Type"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    options={[
                      { value: "", label: "Select Fuel Type" },
                      { value: "Petrol", label: "Petrol" },
                      { value: "Diesel", label: "Diesel" },
                      { value: "CNG", label: "CNG" },
                    ]}
                    required
                  />
                  <InputField label="Kilometers Driven" name="kmsDriven" type="number" value={formData.kmsDriven} onChange={handleChange} required />
                </div>
                <FileUpload
                  label="Vehicle RC (Optional)"
                  file={files.vehicleRC}
                  onChange={(e) => handleFileChange(e, "vehicleRC")}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </>
            ) : (
              <SelectField
                label="Generator Type"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Generator Type" },
                  { value: "Portable", label: "Portable Generator" },
                  { value: "Standby", label: "Standby Generator" },
                  { value: "Industrial", label: "Industrial Generator" },
                  { value: "Inverter", label: "Inverter Generator" },
                ]}
                required
              />
            )}

            {/* Simple Captcha */}
            <div className="mt-6 pt-6 border-t border-border dark:border-d-border">
              <SimpleCaptcha onVerify={handleCaptchaVerify} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border dark:border-d-border">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-border dark:border-d-border rounded-lg text-text dark:text-d-text hover:bg-bg dark:hover:bg-d-bg transition-colors"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Registration
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div >
  );
};

// ==================== CHECK WARRANTY ====================
const CheckWarranty = ({ mode }: { mode: WarrantyMode }) => {
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warrantyData, setWarrantyData] = useState<WarrantyData | null>(null);
  const [multiResults, setMultiResults] = useState<WarrantyData[]>([]);
  const [error, setError] = useState("");
  const [showClaimForm, setShowClaimForm] = useState(false);

  const handleCheck = async () => {
    if (!uid.trim()) {
      setError("Please enter your Verification UID, Phone, or Email");
      return;
    }

    setIsLoading(true);
    setError("");
    setWarrantyData(null);
    setMultiResults([]);

    try {
      const data = await searchWarranty(uid);

      if (!data || data.length === 0) {
        setError("No warranty found with this UID, Phone, or Email. Please check and try again.");
        return;
      }

      // Logic: 
      // 1. If exact UID match (1 result), show details directly.
      // 2. If search by Email/Phone (multiple or single result), show selection list.
      const isExactUIDMatch = data.length === 1 && data[0].verification_uid === uid.toUpperCase();

      if (isExactUIDMatch) {
        setWarrantyData(data[0] as WarrantyData);
      } else {
        setMultiResults(data as WarrantyData[]);
      }

    } catch (err) {
      console.error("Error checking warranty:", err);
      setError("Failed to check warranty. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showClaimForm && warrantyData) {
    return <ClaimWarrantyForm warrantyData={warrantyData} onBack={() => setShowClaimForm(false)} />;
  }

  // Multi-Result Selection
  if (multiResults.length > 0) {
    return (
      <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-6 sm:p-8 border-2 border-border dark:border-d-border">
        <h2 className="font-title text-xl font-bold text-text dark:text-d-text mb-4">
          Select Your Warranty
        </h2>
        <p className="text-text-muted dark:text-d-text-muted mb-6">
          We found multiple warranties linked to this search. Please select yours.
        </p>
        <div className="space-y-3">
          {multiResults.map((warranty) => {
            const status = isWarrantyValid(warranty.installation_date);
            return (
              <button
                key={warranty.id}
                onClick={() => {
                  setWarrantyData(warranty);
                  setMultiResults([]);
                }}
                className="w-full text-left p-4 rounded-lg border border-border dark:border-d-border hover:border-primary bg-bg dark:bg-d-bg transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-text dark:text-d-text">{warranty.product_type} ({warranty.warranty_type})</p>
                  {status.valid ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">Expired</span>
                  )}
                </div>
                <div className="text-sm text-text-muted dark:text-d-text-muted flex gap-4">
                  <span className="font-mono">{warranty.verification_uid}</span>
                  <span>Installed: {new Date(warranty.installation_date).toLocaleDateString()}</span>
                </div>
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setMultiResults([])}
          className="mt-6 text-sm text-text-muted hover:text-primary underline"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const warrantyStatus = warrantyData ? isWarrantyValid(warrantyData.installation_date) : null;

  return (
    <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-6 sm:p-8 border-2 border-border dark:border-d-border">
      <h2 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
        Check {mode === "vehicle" ? "Vehicle" : "Generator"} Warranty
      </h2>

      {!warrantyData ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
              Enter Verification UID, Phone Number, or Email
            </label>
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="e.g., UID, +919876543210, or email@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary tracking-wider"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-600">{error}</span>
            </div>
          )}

          <button
            onClick={handleCheck}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Check Warranty
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Warranty Status Card */}
          <div className={`p-6 rounded-xl border-2 ${warrantyStatus?.valid
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${warrantyStatus?.valid ? "bg-green-100 dark:bg-green-800" : "bg-red-100 dark:bg-red-800"
                }`}>
                {warrantyStatus?.valid ? (
                  <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className={`font-title text-xl font-bold ${warrantyStatus?.valid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                  }`}>
                  {warrantyStatus?.valid ? "Warranty Active" : "Warranty Expired"}
                </h3>
                {warrantyStatus?.valid && (
                  <p className="text-green-600 dark:text-green-500">
                    {warrantyStatus.daysRemaining} days remaining
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoItem icon={User} label="Customer Name" value={warrantyData.customer_name} />
            <InfoItem icon={FileText} label="Verification UID" value={warrantyData.verification_uid} />
            <InfoItem icon={Calendar} label="Registration Date" value={new Date(warrantyData.registration_date).toLocaleDateString()} />
            <InfoItem icon={Calendar} label="Installation Date" value={new Date(warrantyData.installation_date).toLocaleDateString()} />
            <InfoItem icon={Clock} label="Expiry Date" value={warrantyStatus?.expiryDate.toLocaleDateString() || "-"} />
            <InfoItem icon={mode === "vehicle" ? Car : Wrench} label="Product Type" value={warrantyData.product_type} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border dark:border-d-border">
            <button
              onClick={() => setWarrantyData(null)}
              className="flex-1 px-6 py-3 border border-border dark:border-d-border rounded-lg text-text dark:text-d-text hover:bg-bg dark:hover:bg-d-bg transition-colors"
            >
              Check Another
            </button>
            {warrantyStatus?.valid && (
              <button
                onClick={() => setShowClaimForm(true)}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Raise a Request
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== CLAIM WARRANTY FORM ====================
const ClaimWarrantyForm = ({
  warrantyData,
  onBack
}: {
  warrantyData: WarrantyData;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState({
    customerName: warrantyData.customer_name,
    email: warrantyData.email,
    phone: warrantyData.phone,
    issueDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.issueDescription.trim()) {
      alert("Please describe your issue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase.from("warranty_claims").insert({
        warranty_id: warrantyData.id,
        customer_name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        issue_description: formData.issueDescription,
      });

      if (error) throw error;

      // Submit via FormSubmit (replace email with company email)
      const formSubmitData = new FormData();
      formSubmitData.append("name", formData.customerName);
      formSubmitData.append("email", formData.email);
      formSubmitData.append("phone", formData.phone);
      formSubmitData.append("verification_uid", warrantyData.verification_uid);
      formSubmitData.append("product_type", warrantyData.product_type);
      if (warrantyData.vehicle_number) {
        formSubmitData.append("vehicle_number", warrantyData.vehicle_number);
      }
      formSubmitData.append("installation_date", new Date(warrantyData.installation_date).toLocaleDateString());
      formSubmitData.append("issue", formData.issueDescription);
      formSubmitData.append("_subject", `Warranty Claim - ${warrantyData.verification_uid}`);

      await fetch("https://formsubmit.co/ajax/warranty@neoplatron.com", {
        method: "POST",
        body: formSubmitData,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting claim:", err);
      alert("Failed to submit claim. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-8 border-2 border-border dark:border-d-border text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-title text-2xl font-bold text-text dark:text-d-text mb-4">
          Claim Submitted!
        </h2>
        <p className="text-text-muted dark:text-d-text-muted mb-6">
          Your warranty claim has been submitted. Our team will contact you shortly.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-light dark:bg-d-bg-light rounded-2xl p-6 sm:p-8 border-2 border-border dark:border-d-border">
      <h2 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
        Claim Warranty
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-Only Warranty UID */}
        <div>
          <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
            Warranty UID
          </label>
          <input
            type="text"
            value={warrantyData.verification_uid}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-border dark:border-d-border bg-gray-100 dark:bg-gray-800 text-text-muted dark:text-d-text-muted cursor-not-allowed font-mono"
          />
        </div>

        {/* More Information Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-border dark:border-d-border">
          <h3 className="text-sm font-bold text-text dark:text-d-text mb-3 uppercase tracking-wider">
            More Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs text-text-muted dark:text-d-text-muted">
                {warrantyData.warranty_type === "generator" ? "Generator Type" : "Product Type"}
              </span>
              <span className="font-medium text-text dark:text-d-text">{warrantyData.product_type}</span>
            </div>
            <div>
              <span className="block text-xs text-text-muted dark:text-d-text-muted">Installation Date</span>
              <span className="font-medium text-text dark:text-d-text">
                {new Date(warrantyData.installation_date).toLocaleDateString()}
              </span>
            </div>
            {warrantyData.vehicle_number && (
              <div>
                <span className="block text-xs text-text-muted dark:text-d-text-muted">Vehicle Number</span>
                <span className="font-medium text-text dark:text-d-text">{warrantyData.vehicle_number}</span>
              </div>
            )}
          </div>
        </div>

        <InputField label="Full Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <InputField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
            Describe Your Issue *
          </label>
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            rows={4}
            placeholder="Please describe the issue you're experiencing..."
            className="w-full px-4 py-3 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-border dark:border-d-border rounded-lg text-text dark:text-d-text hover:bg-bg dark:hover:bg-d-bg transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Claim
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================== HELPER COMPONENTS ====================
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
}) => (
  <div>
    <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="w-full px-4 py-3 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary"
      required={required}
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
      {label} {required && "*"}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary"
      required={required}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({
  label,
  file,
  onChange,
  accept,
  required,
}: {
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
      {label} {required && "*"}
    </label>
    <div className="border-2 border-dashed border-border dark:border-d-border rounded-lg p-4 text-center hover:border-primary transition-colors">
      <input
        type="file"
        onChange={onChange}
        accept={accept}
        className="hidden"
        id={label.replace(/\s/g, "-")}
      />
      <label htmlFor={label.replace(/\s/g, "-")} className="cursor-pointer">
        {file ? (
          <div className="flex items-center justify-center gap-2 text-primary">
            <FileText className="w-5 h-5" />
            <span className="text-sm">{file.name}</span>
          </div>
        ) : (
          <div className="text-text-muted">
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Click to upload</span>
          </div>
        )}
      </label>
    </div>
  </div>
);

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 bg-bg dark:bg-d-bg rounded-lg">
    <Icon className="w-5 h-5 text-primary mt-0.5" />
    <div>
      <p className="text-xs text-text-muted dark:text-d-text-muted">{label}</p>
      <p className="font-medium text-text dark:text-d-text">{value}</p>
    </div>
  </div>
);

export default WarrantyPage;
