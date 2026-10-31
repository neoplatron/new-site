import { Camera, CheckCircle, RefreshCw, Trash2, X } from "lucide-react";

export type PhotoSlotKey = "front" | "back" | "sideLeft" | "sideRight" | "rearKit" | "kitLabel";
export const MAX_EXTRA_PHOTOS = 5;

export interface SlotPhoto {
  file: File;
  previewUrl: string;
}

export type PhotoSlots = Record<PhotoSlotKey, SlotPhoto | null>;

type Mode = "vehicle" | "generator";

interface SlotDef {
  key: PhotoSlotKey;
  label: Record<Mode, string>;
  hint: Record<Mode, string>;
}

export const PHOTO_SLOTS: SlotDef[] = [
  {
    key: "front",
    label: { vehicle: "Front View", generator: "Front View" },
    hint: {
      vehicle: "Full front of the vehicle with number plate clearly visible",
      generator: "Full front of the generator with control panel visible",
    },
  },
  {
    key: "back",
    label: { vehicle: "Rear View (Closed)", generator: "Rear View" },
    hint: {
      vehicle: "Normal rear view, boot closed, number plate clearly visible",
      generator: "Full rear of the generator",
    },
  },
  {
    key: "sideLeft",
    label: { vehicle: "Left Side View", generator: "Left Side View" },
    hint: {
      vehicle: "Complete left side profile, both wheels in frame",
      generator: "Complete left side profile of the generator",
    },
  },
  {
    key: "sideRight",
    label: { vehicle: "Right Side View", generator: "Right Side View" },
    hint: {
      vehicle: "Complete right side profile, both wheels in frame",
      generator: "Complete right side profile of the generator",
    },
  },
  {
    key: "rearKit",
    label: { vehicle: "Rear Open with Kit", generator: "Generator with Kit" },
    hint: {
      vehicle: "Boot / rear door open, installed kit clearly visible",
      generator: "Generator with the installed kit clearly visible",
    },
  },
  {
    key: "kitLabel",
    label: { vehicle: "Kit Serial Label", generator: "Kit Serial Label" },
    hint: {
      vehicle: "Close-up of the kit's unique ID sticker, text readable",
      generator: "Close-up of the kit's unique ID sticker, text readable",
    },
  },
];

export const emptyPhotoSlots = (): PhotoSlots => ({
  front: null,
  back: null,
  sideLeft: null,
  sideRight: null,
  rearKit: null,
  kitLabel: null,
});

// ==================== REFERENCE SKELETONS ====================
// Line drawings showing how each photo should be framed. The highlighted
// (primary-colored) parts are what must be clearly visible.

const FrameCorners = () => (
  <g className="text-text-muted" strokeWidth={1.5}>
    <path d="M4 14V4h10M106 4h10v10M116 66v10h-10M14 76H4V66" />
  </g>
);

const Wheel = ({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} />
    <circle cx={cx} cy={cy} r={r * 0.45} />
  </g>
);

const KitBox = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={1.5} />
    <rect x={x + w * 0.12} y={y + h * 0.2} width={w * 0.3} height={h * 0.25} />
    <circle cx={x + w * 0.72} cy={y + h * 0.5} r={Math.min(w, h) * 0.15} />
  </g>
);

const VehicleSide = (
  <>
    <path d="M12 54V40l14-4 12-16h30l14 16h22l4 6v12z" />
    <path d="M42 22h24l10 14H34zM12 46h96" />
    <g className="text-primary" strokeWidth={2}>
      <Wheel cx={30} cy={56} r={9} />
      <Wheel cx={90} cy={56} r={9} />
    </g>
  </>
);

const GeneratorSide = (
  <>
    <rect x={10} y={22} width={100} height={38} rx={3} />
    <path d="M10 60h100v6H10z" className="text-primary" strokeWidth={2} />
    <path d="M20 30h30v22H20zM60 30v22M68 30v22M76 30v22M84 30v22M92 30v22" />
  </>
);

// The drawings above face right (right side of the vehicle); mirror for the left side.
const Mirror = ({ children }: { children: React.ReactNode }) => (
  <g transform="translate(120 0) scale(-1 1)">{children}</g>
);

const VehicleGuides: Record<PhotoSlotKey, React.ReactNode> = {
  front: (
    <>
      <path d="M30 34l6-16h48l6 16" />
      <path d="M38 20h44l4 12H34z" />
      <rect x={26} y={34} width={68} height={24} rx={3} />
      <circle cx={36} cy={42} r={5} />
      <circle cx={84} cy={42} r={5} />
      <path d="M46 37v10M52 37v10M58 37v10M64 37v10M70 37v10" />
      <path d="M30 58v8h8v-8M82 58v8h8v-8" />
      <rect x={48} y={51} width={24} height={6} rx={1} className="text-primary" strokeWidth={2} />
    </>
  ),
  back: (
    <>
      <path d="M26 40l6-18h56l6 18" />
      <path d="M36 25h48l3 11H33z" />
      <rect x={24} y={38} width={72} height={22} rx={4} />
      <rect x={27} y={42} width={14} height={6} rx={1} />
      <rect x={79} y={42} width={14} height={6} rx={1} />
      <path d="M30 60v7h9v-7M81 60v7h9v-7" />
      <rect x={48} y={50} width={24} height={6} rx={1} className="text-primary" strokeWidth={2} />
    </>
  ),
  sideLeft: <Mirror>{VehicleSide}</Mirror>,
  sideRight: VehicleSide,
  rearKit: (
    <>
      <path d="M22 16h56v46H22z" />
      <path d="M78 16l20 4v38l-20 4" />
      <path d="M26 20h48v38H26z" />
      <path d="M26 44h48" />
      <path d="M26 66h52" />
      <g className="text-primary" strokeWidth={2}>
        <KitBox x={46} y={44} w={24} h={12} />
      </g>
    </>
  ),
  kitLabel: (
    <>
      <rect x={16} y={10} width={88} height={60} rx={4} />
      <circle cx={36} cy={52} r={10} />
      <g className="text-primary" strokeWidth={2}>
        <rect x={56} y={18} width={40} height={44} rx={2} />
        <path d="M62 26h28M62 32v12M65 32v12M69 32v12M71 32v12M75 32v12M78 32v12M82 32v12M86 32v12M89 32v12M62 52h20" />
      </g>
    </>
  ),
};

const GeneratorGuides: Record<PhotoSlotKey, React.ReactNode> = {
  front: (
    <>
      <rect x={22} y={18} width={76} height={44} rx={3} />
      <path d="M22 62v4h8v-4M90 62v4h8v-4" />
      <g className="text-primary" strokeWidth={2}>
        <rect x={32} y={26} width={30} height={20} rx={1} />
        <circle cx={40} cy={36} r={3} />
        <circle cx={54} cy={36} r={3} />
      </g>
      <path d="M70 26v28M76 26v28M82 26v28M88 26v28" />
    </>
  ),
  back: (
    <>
      <rect x={22} y={18} width={76} height={44} rx={3} />
      <path d="M22 62v4h8v-4M90 62v4h8v-4" />
      <path d="M30 26h60M30 32h60M30 38h60M30 44h60" />
      <path d="M80 18v-8h6v8" className="text-primary" strokeWidth={2} />
    </>
  ),
  sideLeft: <Mirror>{GeneratorSide}</Mirror>,
  sideRight: GeneratorSide,
  rearKit: (
    <>
      <rect x={14} y={28} width={70} height={36} rx={3} />
      <path d="M22 36h30v20H22zM60 36v20M68 36v20M76 36v20" />
      <g className="text-primary" strokeWidth={2}>
        <KitBox x={86} y={36} w={24} h={14} />
        <path d="M86 43H74" strokeDasharray="2 2" />
      </g>
    </>
  ),
  kitLabel: VehicleGuides.kitLabel,
};

const PhotoGuide = ({ mode, slot }: { mode: Mode; slot: PhotoSlotKey }) => (
  <svg
    viewBox="0 0 120 80"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full text-text-muted/70 dark:text-d-text-muted/70"
    aria-hidden="true"
  >
    <FrameCorners />
    {(mode === "vehicle" ? VehicleGuides : GeneratorGuides)[slot]}
  </svg>
);

// ==================== SLOT GRID ====================

interface InstallationPhotoSlotsProps {
  mode: Mode;
  photos: PhotoSlots;
  onSelect: (slot: PhotoSlotKey, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (slot: PhotoSlotKey) => void;
  extras: SlotPhoto[];
  onAddExtras: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExtra: (index: number) => void;
}

const InstallationPhotoSlots = ({
  mode,
  photos,
  onSelect,
  onRemove,
  extras,
  onAddExtras,
  onRemoveExtra,
}: InstallationPhotoSlotsProps) => {
  const done = PHOTO_SLOTS.filter((s) => photos[s.key]).length;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="block text-sm font-medium text-text dark:text-d-text">
          Installation Photos *
        </label>
        <span className={`text-xs font-medium ${done === PHOTO_SLOTS.length ? "text-green-600" : "text-text-muted"}`}>
          {done}/{PHOTO_SLOTS.length} uploaded
        </span>
      </div>
      <p className="text-xs text-text-muted mb-2">
        All {PHOTO_SLOTS.length} photos are required (maximum 5 MB per photo); extra photos are optional. Frame each shot like the reference outline. Highlighted parts must be clearly visible.
      </p>
      <div className="h-1.5 rounded-full bg-border/60 dark:bg-d-border/60 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-300 ${done === PHOTO_SLOTS.length ? "bg-green-600" : "bg-primary"}`}
          style={{ width: `${(done / PHOTO_SLOTS.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PHOTO_SLOTS.map((slot, i) => {
          const photo = photos[slot.key];
          const label = slot.label[mode];
          return (
            <div
              key={slot.key}
              className={`flex flex-col rounded-xl overflow-hidden border bg-bg dark:bg-d-bg transition-colors ${
                photo
                  ? "border-green-600/40 shadow-sm"
                  : "border-dashed border-border dark:border-d-border hover:border-primary"
              }`}
            >
              {photo ? (
                <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                  <a href={photo.previewUrl} target="_blank" rel="noreferrer" title="Open full size">
                    <img src={photo.previewUrl} alt={label} className="w-full h-full object-cover" />
                  </a>
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-medium text-white shadow">
                    <CheckCircle className="w-3 h-3" />
                    Uploaded
                  </span>
                </div>
              ) : (
                <label className="relative aspect-[4/3] flex flex-col cursor-pointer">
                  <div className="flex-1 min-h-0 p-2">
                    <PhotoGuide mode={mode} slot={slot.key} />
                  </div>
                  <span className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Camera className="w-3.5 h-3.5" />
                    Tap to upload
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => onSelect(slot.key, e)} className="hidden" />
                </label>
              )}

              <div className="flex-1 px-3 py-2.5 border-t border-border dark:border-d-border">
                <p className="text-sm font-medium text-text dark:text-d-text">
                  {i + 1}. {label}
                </p>
                {photo ? (
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-text-muted truncate" title={photo.file.name}>
                      {photo.file.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <label
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 cursor-pointer"
                        title={`Replace ${label}`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Replace
                        <input type="file" accept="image/*" onChange={(e) => onSelect(slot.key, e)} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => onRemove(slot.key)}
                        aria-label={`Remove ${label}`}
                        title="Remove"
                        className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-text-muted leading-snug">{slot.hint[mode]}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-sm font-medium text-text dark:text-d-text">Additional Photos (Optional)</p>
          <span className="text-xs text-text-muted">
            {extras.length}/{MAX_EXTRA_PHOTOS}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {extras.map((pic, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border dark:border-d-border">
              <img src={pic.previewUrl} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExtra(index)}
                aria-label={`Remove additional photo ${index + 1}`}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {extras.length < MAX_EXTRA_PHOTOS && (
            <label className="w-20 h-20 border-2 border-dashed border-border dark:border-d-border rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors text-text-muted">
              <Camera className="w-5 h-5" />
              <span className="text-[10px]">Add more</span>
              <input type="file" accept="image/*" multiple onChange={onAddExtras} className="hidden" />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationPhotoSlots;
