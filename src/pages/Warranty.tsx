import { useState } from "react";
import {
  Shield,
  CheckCircle,
  User,
  Car,
  Wrench,
  FileText,
  Send,
  AlertCircle,
  Search,
  ClipboardCopy,
  Clock,
  Calendar,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Download,
  MapPin,
  Phone,
  Mail,
  Fuel,
  Gauge,
  Store,
} from "lucide-react";
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "../integrations/supabase/client";
import { validateSellerCode, searchWarranty } from "../api/warrantyAPI";
import WarrantyTermsAcceptance from "../components/WarrantyTermsAcceptance";
import SEO from "../components/SEO";
import { OdometerSample, MileageSample } from "../components/SamplePhotos";
import InstallationPhotoSlots, {
  MAX_EXTRA_PHOTOS,
  PHOTO_SLOTS,
  emptyPhotoSlots,
  type PhotoSlotKey,
  type PhotoSlots,
  type SlotPhoto,
} from "../components/InstallationPhotoSlots";

// ==================== TYPES ====================
type WarrantyMode = "vehicle" | "generator";
type WarrantyAction = "register" | "check" | null;
type SubmitStatus = null | "success" | "error";

interface FilesState {
  invoice: File | null;
  garagePics: PhotoSlots;
  extraPics: SlotPhoto[];
  vehicleRC: File | null;
  odometerPhoto: File | null;
  mileagePhoto: File | null;
}

interface WarrantyData {
  id: string;
  verification_uid: string;
  warranty_type: string;
  customer_name: string;
  email: string;
  phone: string;
  customer_address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  registration_date: string;
  installation_date: string;
  invoice_number?: string;
  invoice_date?: string;
  kit_serial_number?: string;
  vehicle_model?: string;
  install_product_type?: string;
  terms_accepted_at?: string;
  installed_by?: string;
  seller_code_used?: string;
  garage_name?: string;
  product_type: string;
  vehicle_number?: string;
  fuel_type?: string;
  kms_driven?: number;
}

const formatDisplayDate = (value?: string | null): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

// ==================== CONSTANTS ====================
// YYYY-MM-DD for a date input, offset by N days from today (or from a given YYYY-MM-DD).
const dateInput = (offsetDays: number, from?: string): string => {
  const d = from ? new Date(`${from}T00:00:00`) : new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

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
      <SEO 
        title="Warranty & Policies - Neoplatron"
        description="Read Neoplatron's Warranty, Terms & Conditions, Privacy Policy, and Refund Policy. We stand by our ADPT engine optimization products."
        canonical="/warranty"
        keywords="Neoplatron warranty, refund policy, terms and conditions, ADPT warranty, customer policies"
      />
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
          Register your new installation and get a warranty UID
        </p>
        <p className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Only for authorised dealers, franchises, or the seller where it was installed
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
    invoiceDate: "",
    kitSerialNumber: "",
    vehicleCompany: "",
    vehicleModel: "",
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
    installProductType: "",
    fuelType: "",
    kmsDriven: "",
    avgFuelEconomy: "",
  });

  const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerVerified, setSellerVerified] = useState(false);

  const [files, setFiles] = useState<FilesState>({
    invoice: null,
    garagePics: emptyPhotoSlots(),
    extraPics: [],
    vehicleRC: null,
    odometerPhoto: null,
    mileagePhoto: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [errorMessage, setErrorMessage] = useState("");
  // Problems with a chosen file (too big, wrong type); shown next to the upload fields.
  const [uploadError, setUploadError] = useState("");
  // Some vehicles don't display an average mileage; the odometer photo is accepted instead.
  const [noAvgDisplay, setNoAvgDisplay] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedUID, setGeneratedUID] = useState<string | null>(null);
  const [failedUploads, setFailedUploads] = useState<string[]>([]);
  const [cardPayload, setCardPayload] = useState<Record<string, unknown> | null>(null);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [cardDownloadError, setCardDownloadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
  const sizeMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "invoice" | "vehicleRC" | "odometerPhoto" | "mileagePhoto"
  ) => {
    const file = e.target.files?.[0] ?? null;
    e.currentTarget.value = "";
    if (!file) return;

    const what = {
      invoice: "Invoice",
      vehicleRC: "Vehicle RC",
      odometerPhoto: "Kilometers driven photo",
      mileagePhoto: "Present mileage photo",
    }[fieldName];
    const imageOnly = fieldName === "odometerPhoto" || fieldName === "mileagePhoto";
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(`${what} "${file.name}" is ${sizeMB(file.size)} MB. The maximum allowed is 5 MB. Please choose a smaller file.`);
      return;
    }
    if (imageOnly ? !file.type.startsWith("image/") : !/.(pdf|jpe?g|png)$/i.test(file.name)) {
      setUploadError(
        imageOnly
          ? `${what} "${file.name}" is not an image. Please upload a photo (JPG, PNG or HEIC).`
          : `${what} "${file.name}" is not a supported file type. Please upload a PDF, JPG or PNG.`,
      );
      return;
    }

    setUploadError("");
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleSlotPhotoChange = (slot: PhotoSlotKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;

    const label = PHOTO_SLOTS.find((s) => s.key === slot)?.label[mode] ?? "Photo";
    if (!file.type.startsWith("image/")) {
      setUploadError(`${label}: "${file.name}" is not an image. Please upload a photo (JPG, PNG or HEIC).`);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(`${label}: photo "${file.name}" is ${sizeMB(file.size)} MB. The maximum allowed is 5 MB per photo. Please choose a smaller photo.`);
      return;
    }

    setUploadError("");
    setFiles((prev) => {
      const old = prev.garagePics[slot];
      if (old) URL.revokeObjectURL(old.previewUrl);
      return {
        ...prev,
        garagePics: { ...prev.garagePics, [slot]: { file, previewUrl: URL.createObjectURL(file) } },
      };
    });
  };

  const handleExtraPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.currentTarget.value = "";
    if (picked.length === 0) return;

    const notImage = picked.find((f) => !f.type.startsWith("image/"));
    if (notImage) {
      setUploadError(`Additional photos: "${notImage.name}" is not an image. Please upload photos only (JPG, PNG or HEIC).`);
      return;
    }
    const tooBig = picked.find((f) => f.size > MAX_UPLOAD_BYTES);
    if (tooBig) {
      setUploadError(`Additional photos: "${tooBig.name}" is ${sizeMB(tooBig.size)} MB. The maximum allowed is 5 MB per photo. None of the selected photos were added.`);
      return;
    }

    setUploadError("");
    const newPics: SlotPhoto[] = picked.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setFiles((prev) => ({
      ...prev,
      extraPics: [...prev.extraPics, ...newPics].slice(0, MAX_EXTRA_PHOTOS),
    }));
  };

  const removeExtraPic = (index: number) => {
    setFiles((prev) => {
      const toRemove = prev.extraPics[index];
      if (toRemove) URL.revokeObjectURL(toRemove.previewUrl);
      return { ...prev, extraPics: prev.extraPics.filter((_, i) => i !== index) };
    });
  };

  const removeGaragePic = (slot: PhotoSlotKey) => {
    setFiles((prev) => {
      const toRemove = prev.garagePics[slot];
      if (toRemove) URL.revokeObjectURL(toRemove.previewUrl);
      return { ...prev, garagePics: { ...prev.garagePics, [slot]: null } };
    });
  };

  const readAsDataURL = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Phone photos are several MB each; shrinking them keeps the upload (the slow part of submitting) short.
  const fileToBase64 = async (file: File): Promise<string> => {
    const MAX_DIMENSION = 1800;
    if (!file.type.startsWith("image/") || file.size < 400 * 1024) return readAsDataURL(file);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
      return blob && blob.size < file.size ? readAsDataURL(blob) : readAsDataURL(file);
    } catch {
      return readAsDataURL(file);
    }
  };

  const validateStep = (step: number): { isValid: boolean; message: string } => {
    if (step === 1) {
      if (!formData.sellerCode.trim()) return { isValid: false, message: "Seller Code is required" };
      if (!sellerVerified) return { isValid: false, message: "Please verify the Seller Code before proceeding" };
    }

    if (step === 2) {
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

    if (step === 3) {
      if (!formData.installationDate) return { isValid: false, message: "Installation Date is required" };

      // Date Logic: today or the previous 2 days only
      // Compare plain YYYY-MM-DD strings in local time; parsing them as Date reads them as UTC midnight,
      // which made "today" look like the future for the first hours after midnight in timezones ahead of UTC.
      const todayStr = dateInput(0);
      if (formData.installationDate > todayStr) return { isValid: false, message: "Date cannot be in the future" };
      if (formData.installationDate < dateInput(-2)) return { isValid: false, message: "Installation Date must be today or within the previous 2 days" };

      if (!formData.invoiceNumber.trim()) return { isValid: false, message: "Invoice Number is required" };
      if (!formData.invoiceDate) return { isValid: false, message: "Invoice Date is required" };
      if (formData.invoiceDate > todayStr) return { isValid: false, message: "Invoice Date cannot be in the future" };

      // Installation and invoice dates must be at most 2 days apart (inputs are YYYY-MM-DD).
      const toDay = (d: string) => {
        const [y, m, day] = d.split("-").map(Number);
        return Date.UTC(y, m - 1, day) / 86400000;
      };
      if (Math.abs(toDay(formData.installationDate) - toDay(formData.invoiceDate)) > 2) {
        return { isValid: false, message: "Installation Date and Invoice Date must be within 2 days of each other" };
      }
      if (!formData.installedBy.trim()) return { isValid: false, message: "Installed By (Technician/Mechanic) Name is required" };
      if (!formData.installProductType) return { isValid: false, message: "Product Type is required" };
      if (!formData.kitSerialNumber.trim()) return { isValid: false, message: "Kit Serial Number is required" };

      if (!files.invoice) return { isValid: false, message: "Please upload the invoice document" };
      const missingPhoto = PHOTO_SLOTS.find((s) => !files.garagePics[s.key]);
      if (missingPhoto) return { isValid: false, message: `Please upload the "${missingPhoto.label[mode]}" photo` };
    }

    if (step === 4) {
      if (mode === "vehicle" && !formData.vehicleCompany.trim()) return { isValid: false, message: "Vehicle Company is required" };
      if (!formData.vehicleModel.trim()) return { isValid: false, message: `${mode === "vehicle" ? "Vehicle" : "Generator"} Model is required` };
      if (!formData.productType) return { isValid: false, message: `${mode === "vehicle" ? "Vehicle" : "Generator"} Type is required` };
      if (mode === "vehicle") {
        if (!formData.vehicleNumber.trim()) return { isValid: false, message: "Vehicle Number is required" };
        if (!formData.fuelType) return { isValid: false, message: "Fuel Type is required" };
        if (!formData.kmsDriven.trim()) return { isValid: false, message: "Kilometers Driven is required" };
        const economy = parseFloat(formData.avgFuelEconomy);
        if (!formData.avgFuelEconomy.trim() || !(economy > 0)) return { isValid: false, message: "Please enter the average fuel economy (km/l) before installing" };
        if (!files.odometerPhoto) return { isValid: false, message: "Please upload the kilometers driven photo" };
        if (!noAvgDisplay && !files.mileagePhoto) return { isValid: false, message: "Please upload the present mileage (before installing) photo, or tick that the vehicle doesn't show average mileage" };
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
    setUploadError("");
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setUploadError("");
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    for (let step = 1; step <= 4; step++) {
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

    if (!termsAccepted) {
      setErrorMessage("Please accept the Warranty Terms & Conditions");
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
      // Company and model are saved together in the single vehicle_model field, e.g. "Honda Activa".
      const fullModel = (mode === "vehicle" ? `${formData.vehicleCompany.trim()} ${formData.vehicleModel.trim()}` : formData.vehicleModel).trim();
      const registeredAt = new Date().toISOString();
      setSubmitProgress("Preparing files...");

      const invoiceBase64 = files.invoice ? await fileToBase64(files.invoice) : null;
      const vehicleRCBase64 = files.vehicleRC ? await fileToBase64(files.vehicleRC) : null;
      const odometerBase64 = mode === "vehicle" && files.odometerPhoto ? await fileToBase64(files.odometerPhoto) : null;
      const mileageBase64 = mode === "vehicle" && files.mileagePhoto ? await fileToBase64(files.mileagePhoto) : null;
      const garagePicsBase64 = await Promise.all([
        ...PHOTO_SLOTS.map(async (s) => {
          const pic = files.garagePics[s.key]!;
          return {
            data: await fileToBase64(pic.file),
            name: pic.file.name,
            type: pic.file.type,
            slot: s.key,
            label: s.label[mode],
          };
        }),
        ...files.extraPics.map(async (pic, i) => ({
          data: await fileToBase64(pic.file),
          name: pic.file.name,
          type: pic.file.type,
          slot: `extra${i + 1}`,
          label: `Additional Photo ${i + 1}`,
        })),
      ]);

      const registration = {
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
        invoice_date: formData.invoiceDate,
        kit_serial_number: formData.kitSerialNumber.trim().toUpperCase(),
        vehicle_model: fullModel,
        installed_by: formData.installedBy,
        terms_accepted_at: registeredAt,

        // Seller Fields
        seller_id: sellerId,
        seller_code_used: formData.sellerCode,
        garage_name: formData.garageName, // Auto-filled from seller

        vehicle_number: mode === "vehicle" ? formData.vehicleNumber.toUpperCase() : null,
        product_type: formData.productType,
        install_product_type: formData.installProductType,
        fuel_type: mode === "vehicle" ? formData.fuelType : null,
        kms_driven: mode === "vehicle" && formData.kmsDriven ? parseInt(formData.kmsDriven) : null,
        invoice_data: null,
        vehicle_rc_data: null,
        // Only metadata here; the image files themselves go to Google Drive.
        installation_photos: garagePicsBase64.map(({ data: _data, ...meta }) => meta),
        avg_fuel_economy: mode === "vehicle" ? formData.avgFuelEconomy.trim() : null,
      };

      let { error } = await supabase.from("warranty_registrations").insert(registration);
      if (error && /avg_fuel_economy/.test(error.message)) {
        // The avg_fuel_economy column isn't in the database yet; save the registration without it.
        const { avg_fuel_economy: _skip, ...withoutEconomy } = registration;
        ({ error } = await supabase.from("warranty_registrations").insert(withoutEconomy));
      }

      if (error) throw error;

      // Files go straight to Google Drive (one request per file, retried up to 3 times).
      const driveUploads = [
        invoiceBase64 && files.invoice && { slot: "invoice", label: `Invoice ${formData.invoiceNumber}`, file: files.invoice, data: invoiceBase64 },
        vehicleRCBase64 && files.vehicleRC && { slot: "rc", label: "Vehicle RC", file: files.vehicleRC, data: vehicleRCBase64 },
        odometerBase64 && files.odometerPhoto && { slot: "odometer", label: "Kilometers Driven Photo", file: files.odometerPhoto, data: odometerBase64 },
        mileageBase64 && files.mileagePhoto && { slot: "mileage", label: "Present Mileage Before Installing", file: files.mileagePhoto, data: mileageBase64 },
        ...garagePicsBase64.map((p) => ({ slot: p.slot, label: p.label, file: { name: p.name, type: p.type }, data: p.data })),
      ].filter(Boolean) as { slot: string; label: string; file: { name: string; type: string }; data: string }[];

      const failed: string[] = [];
      let doneCount = 0;
      const uploadOne = async (u: (typeof driveUploads)[number]) => {
        let uploaded = false;
        for (let attempt = 1; attempt <= 3 && !uploaded; attempt++) {
          const startedAt = performance.now();
          const { error: uploadError } = await supabase.functions.invoke("upload-warranty-files", {
            body: { verificationUid: uid, slot: u.slot, label: u.label, name: u.data.startsWith("data:image/jpeg") ? u.file.name.replace(/.[^.]+$/, "") + ".jpg" : u.file.name, type: u.data.slice(5, u.data.indexOf(";")), data: u.data },
          });
          const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
          if (uploadError) console.error(`Drive upload failed for ${u.slot} (attempt ${attempt}, ${seconds}s):`, uploadError);
          else {
            uploaded = true;
            console.info(`Uploaded ${u.slot}: ${Math.round(u.data.length * 0.75 / 1024)} KB in ${seconds}s`);
          }
        }
        if (!uploaded) failed.push(u.label);
        setSubmitProgress(`Uploading files (${++doneCount} of ${driveUploads.length})...`);
      };

      // The first upload creates the Drive folder, so it goes alone; the rest run 4 at a time.
      if (driveUploads.length) {
        setSubmitProgress(`Uploading files (0 of ${driveUploads.length})...`);
        await uploadOne(driveUploads[0]);
        const rest = driveUploads.slice(1);
        let next = 0;
        const worker = async () => {
          while (next < rest.length) await uploadOne(rest[next++]);
        };
        await Promise.all(Array.from({ length: Math.min(4, rest.length) }, worker));
      }
      setFailedUploads(failed);
      setSubmitProgress("Finishing up...");

      // Log the registration (with the Drive folder link) to the Google Sheet.
      const { error: sheetError } = await supabase.functions.invoke("upload-warranty-files", {
        body: { action: "finalize", verificationUid: uid },
      });
      if (sheetError) console.error("Sheet logging failed:", sheetError);

      const expiryDate = new Date(formData.installationDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + WARRANTY_PERIOD_YEARS);

      const payload = {
        email: formData.email,
        customerName: formData.customerName,
        phone: formData.phone,
        customerAddress: formData.customerAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        verificationUid: uid,
        warrantyType: mode,
        productType: formData.productType,
        vehicleNumber: mode === "vehicle" ? formData.vehicleNumber.toUpperCase() : null,
        fuelType: mode === "vehicle" ? formData.fuelType : null,
        kmsDriven: mode === "vehicle" ? formData.kmsDriven : null,
        installationDate: formData.installationDate,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        kitSerialNumber: formData.kitSerialNumber.trim().toUpperCase(),
        vehicleModel: fullModel,
        installProductType: formData.installProductType,
        termsAcceptedAt: registeredAt,
        installedBy: formData.installedBy,
        sellerCode: formData.sellerCode,
        registrationDate: registeredAt,
        expiryDate: expiryDate.toISOString(),
        garageName: formData.garageName,
      };
      setCardPayload(payload);

      supabase.functions
        .invoke("send-warranty-email", { body: payload })
        .catch((emailError) => {
          console.error("Failed to send warranty email:", emailError);
        });

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
      setSubmitProgress("");
    }
  };

  const copyUID = () => {
    if (generatedUID) {
      navigator.clipboard.writeText(generatedUID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCard = async () => {
    if (!cardPayload || !generatedUID) return;
    setIsDownloadingCard(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-warranty-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ ...cardPayload, action: "download" }),
      });
      if (!response.ok) throw new Error("Failed to generate warranty card");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `warranty-card-${generatedUID}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading warranty card:", err);
      setCardDownloadError(true);
    } finally {
      setIsDownloadingCard(false);
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
          Your warranty has been registered. Please save your Warranty UID below.
        </p>

        <div className="bg-bg dark:bg-d-bg rounded-xl p-6 mb-6">
          <p className="text-sm text-text-muted dark:text-d-text-muted mb-2">Your Warranty UID</p>
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

        {failedUploads.length > 0 && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200 text-left">
            Your registration is saved, but these files could not be uploaded: {failedUploads.join(", ")}.
            Please contact support with your Warranty UID to send them.
          </div>
        )}

        <p className="text-sm text-text-muted dark:text-d-text-muted mb-6">
          Keep this UID safe. You'll need it to check your warranty status or file a claim.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={downloadCard}
            disabled={isDownloadingCard || !cardPayload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {isDownloadingCard ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            Download Warranty Card
          </button>
          <button
            onClick={onReset}
            className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            Done
          </button>
        </div>
        {cardDownloadError && (
          <p className="text-sm text-red-600 mt-3">
            Could not generate the card right now. It has also been emailed to you.
          </p>
        )}
      </div>
    );
  }

  const stepConfig = [
    { num: 1, label: "Verify Seller", icon: ShieldCheck },
    { num: 2, label: "Customer Info", icon: User },
    { num: 3, label: "Installation", icon: Wrench },
    { num: 4, label: "Details", icon: mode === "vehicle" ? Car : Wrench },
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

        {/* Step 1: Seller Verification */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
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
                    <p className="text-xs font-semibold text-text dark:text-d-text mt-2">
                      This registration must be filled in only by the authorised seller where the kit was installed.
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
                      if (sellerVerified) setSellerVerified(false); // Reset if changed
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-bg dark:bg-d-bg border border-border dark:border-d-border focus:ring-1 focus:ring-primary outline-hidden"
                    placeholder="Enter 8-digit code"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (formData.sellerCode.length < 8) {
                        setErrorMessage("Code must be 8 digits");
                        return;
                      }

                      const seller = await validateSellerCode(formData.sellerCode);
                      if (seller) {
                        setSellerId(seller.id);
                        setFormData(prev => ({ ...prev, garageName: seller.name }));
                        setSellerVerified(true);
                        setErrorMessage("");
                      } else {
                        setSellerId(null);
                        setSellerVerified(false);
                        setErrorMessage("Invalid Seller Code");
                      }
                    }}
                    className={`px-6 py-2 rounded-lg transition-colors font-medium text-white ${sellerVerified
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:bg-primary/90"
                      }`}
                  >
                    {sellerVerified ? "Verified" : "Verify"}
                  </button>
                </div>

                {/* Seller Confirmation Display */}
                {sellerVerified && formData.garageName && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-0.5">Verified Seller</p>
                      <p className="text-base font-bold text-text dark:text-d-text leading-tight">{formData.garageName}</p>
                      <p className="text-xs text-text-muted mt-1">Click Next to proceed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Customer Info */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
              Customer Information
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

        {/* Step 3: Installation Details */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
              Installation Details
            </h3>

            {/* Verified Seller Badge (Small) */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6 flex items-center justify-between text-sm">
              <span className="text-text dark:text-d-text font-medium">
                Seller: <span className="font-bold">{formData.garageName}</span>
              </span>
              <span className="text-xs px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full font-bold">
                {formData.sellerCode}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <InputField
                  label="Installation Date"
                  name="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={handleChange}
                  min={dateInput(-2)}
                  max={dateInput(0)}
                  required
                />
                <p className="text-xs text-text-muted mt-1">Today or the previous 2 days only</p>
              </div>
              <InputField label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required />
              <div className="relative">
                <InputField
                  label="Invoice Date"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  min={formData.installationDate ? dateInput(-2, formData.installationDate) : dateInput(-4)}
                  max={formData.installationDate ? [dateInput(0), dateInput(2, formData.installationDate)].sort()[0] : dateInput(0)}
                  required
                />
                <p className="text-xs text-text-muted mt-1">Must be within 2 days of the installation date</p>
              </div>
              <InputField label="Installed By (Technician/Mechanic) Name" name="installedBy" value={formData.installedBy} onChange={handleChange} required />
              <SelectField
                label="Product Type"
                name="installProductType"
                value={formData.installProductType}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Product Type" },
                  { value: "2/3 Wheeler", label: "2/3 Wheeler" },
                  { value: "4Wheeler 1.8 (Below 1800cc)", label: "4Wheeler 1.8 (Below 1800cc)" },
                  { value: "4Wheeler 3.0 (above 1800cc)", label: "4Wheeler 3.0 (above 1800cc)" },
                  { value: "6 wheeler", label: "6 wheeler" },
                  { value: "Truck/Bus", label: "Truck/Bus" },
                  { value: "Diesel Generator", label: "Diesel Generator" },
                ]}
                required
              />
              <div>
                <InputField
                  label="Kit Serial Number"
                  name="kitSerialNumber"
                  value={formData.kitSerialNumber}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-text-muted mt-1">As printed on the kit label, e.g. SV5G-GI-19</p>
              </div>
            </div>

            <div className="space-y-4">
              {uploadError && (
                <div role="alert" className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-600">{uploadError}</span>
                </div>
              )}
              <FileUpload
                label="Upload Invoice"
                file={files.invoice}
                onChange={(e) => handleFileChange(e, "invoice")}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />

              <InstallationPhotoSlots
                mode={mode}
                photos={files.garagePics}
                onSelect={handleSlotPhotoChange}
                onRemove={removeGaragePic}
                extras={files.extraPics}
                onAddExtras={handleExtraPhotos}
                onRemoveExtra={removeExtraPic}
              />
            </div>
          </div>
        )}

        {/* Step 4: Product Details */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-title text-xl font-bold text-text dark:text-d-text mb-6">
              {mode === "vehicle" ? "Vehicle Details" : "Generator Details"}
            </h3>

            {mode === "vehicle" ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
                  <InputField label="Vehicle Company" name="vehicleCompany" value={formData.vehicleCompany} onChange={handleChange} placeholder="e.g. Toyota, Honda, Hyundai" required />
                  <InputField label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="e.g. Fortuner" required />
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
                      { value: "LPG", label: "LPG" },
                    ]}
                    required
                  />
                  <InputField label="Kilometers Driven" name="kmsDriven" type="number" value={formData.kmsDriven} onChange={handleChange} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <FileUpload
                      label="Kilometers Driven Photo"
                      file={files.odometerPhoto}
                      onChange={(e) => handleFileChange(e, "odometerPhoto")}
                      accept="image/*"
                      required
                    />
                    <p className="text-xs text-text-muted mt-1">Clear photo of the odometer showing total kilometers (max 5 MB)</p>
                    <OdometerSample />
                  </div>
                  <div>
                    <FileUpload
                      label="Present Mileage Photo (Before Installing)"
                      file={files.mileagePhoto}
                      onChange={(e) => handleFileChange(e, "mileagePhoto")}
                      accept="image/*"
                      required={!noAvgDisplay}
                    />
                    <p className="text-xs text-text-muted mt-1">Photo showing the vehicle's present mileage before the kit was installed (max 5 MB)</p>
                    <MileageSample />
                    <label className="mt-3 flex items-start gap-2 text-sm text-text dark:text-d-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noAvgDisplay}
                        onChange={(e) => setNoAvgDisplay(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-primary"
                      />
                      <span>Vehicle doesn't show average mileage</span>
                    </label>
                    {noAvgDisplay && (
                      <p className="mt-1 text-xs text-text-muted">
                        No problem. The odometer photo you uploaded will be used instead, so make sure it is clear.
                        Enter your approximate average fuel economy below.
                      </p>
                    )}
                    <div className="mt-4">
                      <InputField
                        label="Average Fuel Economy (km/l)"
                        name="avgFuelEconomy"
                        type="number"
                        value={formData.avgFuelEconomy}
                        onChange={handleChange}
                        placeholder="e.g. 12.5"
                        required
                      />
                      <p className="text-xs text-text-muted mt-1">Average mileage before installing the kit</p>
                    </div>
                  </div>
                </div>
                {uploadError && (
                  <div role="alert" className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-600">{uploadError}</span>
                  </div>
                )}
                <FileUpload
                  label="Vehicle RC (Optional)"
                  file={files.vehicleRC}
                  onChange={(e) => handleFileChange(e, "vehicleRC")}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Generator Make & Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} required />
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
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border dark:border-d-border">
              <WarrantyTermsAcceptance accepted={termsAccepted} onChange={setTermsAccepted} />
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

          {currentStep < 4 ? (
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
                  {submitProgress || "Submitting..."}
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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCard = async () => {
    if (!warrantyData) return;

    setIsDownloading(true);
    try {
      const expiryDate = new Date(warrantyData.installation_date);
      expiryDate.setFullYear(expiryDate.getFullYear() + WARRANTY_PERIOD_YEARS);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-warranty-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action: "download",
          email: warrantyData.email,
          customerName: warrantyData.customer_name,
          phone: warrantyData.phone,
          customerAddress: warrantyData.customer_address,
          city: warrantyData.city,
          state: warrantyData.state,
          pinCode: warrantyData.pin_code,
          verificationUid: warrantyData.verification_uid,
          warrantyType: warrantyData.warranty_type,
          productType: warrantyData.product_type,
          vehicleNumber: warrantyData.vehicle_number,
          fuelType: warrantyData.fuel_type,
          kmsDriven: warrantyData.kms_driven,
          installationDate: warrantyData.installation_date,
          invoiceNumber: warrantyData.invoice_number,
          invoiceDate: warrantyData.invoice_date,
          kitSerialNumber: warrantyData.kit_serial_number,
          vehicleModel: warrantyData.vehicle_model,
          installProductType: warrantyData.install_product_type,
          termsAcceptedAt: warrantyData.terms_accepted_at,
          installedBy: warrantyData.installed_by,
          sellerCode: warrantyData.seller_code_used,
          registrationDate: warrantyData.registration_date,
          expiryDate: expiryDate.toISOString(),
          garageName: warrantyData.garage_name,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate warranty card");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `warranty-card-${warrantyData.verification_uid}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading warranty card:", err);
      setError("Failed to download warranty card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCheck = async () => {
    if (!uid.trim()) {
      setError("Please enter your Warranty UID, Phone, or Email");
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
                  <span>Installed: {formatDisplayDate(warranty.installation_date)}</span>
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
              Enter Warranty UID, Phone Number, or Email
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

          {/* Customer Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-d-text-muted mb-3">
              Customer Details
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Customer Name" value={warrantyData.customer_name} />
              <InfoItem icon={Phone} label="Phone" value={warrantyData.phone} />
              <InfoItem icon={Mail} label="Email" value={warrantyData.email} />
              <InfoItem icon={MapPin} label="Address" value={warrantyData.customer_address || "-"} />
              <InfoItem icon={MapPin} label="City" value={warrantyData.city || "-"} />
              <InfoItem icon={MapPin} label="State / PIN Code" value={`${warrantyData.state || "-"} - ${warrantyData.pin_code || "-"}`} />
            </div>
          </div>

          {/* Installation & Seller Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-d-text-muted mb-3">
              Installation & Seller Details
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoItem icon={Calendar} label="Installation Date" value={formatDisplayDate(warrantyData.installation_date)} />
              <InfoItem icon={FileText} label="Invoice Number" value={warrantyData.invoice_number || "-"} />
              <InfoItem icon={Calendar} label="Invoice Date" value={formatDisplayDate(warrantyData.invoice_date)} />
              <InfoItem icon={Wrench} label="Installed By" value={warrantyData.installed_by || "-"} />
              <InfoItem icon={Store} label="Seller Code" value={warrantyData.seller_code_used || "-"} />
              <InfoItem icon={Store} label="Garage / Seller Name" value={warrantyData.garage_name || "-"} />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-d-text-muted mb-3">
              Product Details
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoItem icon={ShieldCheck} label="Kit Serial Number" value={warrantyData.kit_serial_number || "-"} />
              <InfoItem icon={Wrench} label="Product Type" value={warrantyData.install_product_type || "-"} />
              <InfoItem icon={mode === "vehicle" ? Car : Wrench} label={mode === "vehicle" ? "Vehicle Model" : "Generator Model"} value={warrantyData.vehicle_model || "-"} />
              <InfoItem icon={mode === "vehicle" ? Car : Wrench} label={mode === "vehicle" ? "Vehicle Type" : "Generator Type"} value={warrantyData.product_type} />
              {mode === "vehicle" && (
                <>
                  <InfoItem icon={Car} label="Vehicle Number" value={warrantyData.vehicle_number || "-"} />
                  <InfoItem icon={Fuel} label="Fuel Type" value={warrantyData.fuel_type || "-"} />
                  <InfoItem icon={Gauge} label="Kms Driven at Installation" value={warrantyData.kms_driven ? `${warrantyData.kms_driven} km` : "-"} />
                </>
              )}
            </div>
          </div>

          {/* Warranty Validity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-d-text-muted mb-3">
              Warranty Validity
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoItem icon={FileText} label="Warranty UID" value={warrantyData.verification_uid} />
              <InfoItem icon={Calendar} label="Registration Date" value={formatDisplayDate(warrantyData.registration_date)} />
              <InfoItem icon={Clock} label="Expiry Date" value={warrantyStatus?.expiryDate.toLocaleDateString() || "-"} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border dark:border-d-border">
            <button
              onClick={() => setWarrantyData(null)}
              className="flex-1 px-6 py-3 border border-border dark:border-d-border rounded-lg text-text dark:text-d-text hover:bg-bg dark:hover:bg-d-bg transition-colors"
            >
              Check Another
            </button>
            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="flex-1 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Warranty Card
                </>
              )}
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
  min,
  max,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  min?: string;
  max?: string;
  placeholder?: string;
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
      min={min}
      max={max}
      placeholder={placeholder}
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
