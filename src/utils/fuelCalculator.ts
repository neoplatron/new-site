// fuelCalculator.ts

// Vehicle type efficiency improvements based on NeoPlatron kit
export interface VehicleEfficiency {
  fuelSavingPercentage: number; // kept for backward-compat / optional display, not used for fuel-after calc
  mileageIncreasePercentage: number; // Percentage increase in mileage
}

export type VehicleType = "2-wheeler" | "3-wheeler" | "4-wheeler" | "6-wheeler";

// UPDATED Vehicle efficiency data (mileageIncreasePercentage as requested)
export const VEHICLE_EFFICIENCY: Record<VehicleType, VehicleEfficiency> = {
  "2-wheeler": {
    fuelSavingPercentage: 25,
    mileageIncreasePercentage: 50,
  },
  "3-wheeler": {
    fuelSavingPercentage: 30,
    mileageIncreasePercentage: 50,
  },
  "4-wheeler": {
    fuelSavingPercentage: 35,
    mileageIncreasePercentage: 70,
  },
  "6-wheeler": {
    fuelSavingPercentage: 40,
    mileageIncreasePercentage: 40,
  },
};

export interface CalculatorInputs {
  vehicleType: VehicleType;
  fuelPricePerLiter: number;
  avgDailyDistance: number;
  currentMileage: number; // User's current vehicle mileage (km/liter)
  kitCost: number;
}

export interface CalculatorResults {
  monthly: {
    fuelUsedBefore: number;
    fuelUsedAfter: number;
    fuelSaved: number;
    moneySavedOnFuel: number;
    moneySpentBefore: number;
    moneySpentAfter: number;
    mileageBefore: number;
    mileageAfter: number;
  };
  yearly: {
    fuelUsedBefore: number;
    fuelUsedAfter: number;
    fuelSaved: number;
    moneySavedOnFuel: number;
    moneySpentBefore: number;
    moneySpentAfter: number;
    mileageBefore: number;
    mileageAfter: number;
  };
}

export const calculateFuelSavings = (
  inputs: CalculatorInputs
): CalculatorResults => {
  const efficiency = VEHICLE_EFFICIENCY[inputs.vehicleType];
  const { avgDailyDistance, fuelPricePerLiter, currentMileage } = inputs;

  // Safety clamp to avoid divide-by-zero or negative mileage input
  const safeCurrentMileage = currentMileage > 0 ? currentMileage : 0.0001;

  // Monthly calculations
  const monthlyDistance = avgDailyDistance * 30;

  // Mileage before & after
  const mileageBeforeMonthly = safeCurrentMileage;
  const mileageAfterMonthly =
    safeCurrentMileage * (1 + efficiency.mileageIncreasePercentage / 100);

  // Fuel used
  const fuelUsedBeforeMonthly = monthlyDistance / mileageBeforeMonthly;
  const fuelUsedAfterMonthly =
    monthlyDistance / (mileageAfterMonthly || 0.0001);
  const fuelSavedMonthly = fuelUsedBeforeMonthly - fuelUsedAfterMonthly;

  // Money spent
  const moneySpentBeforeMonthly = fuelUsedBeforeMonthly * fuelPricePerLiter;
  const moneySpentAfterMonthly = fuelUsedAfterMonthly * fuelPricePerLiter;
  const moneySavedMonthly = moneySpentBeforeMonthly - moneySpentAfterMonthly;

  const yearlyDistance = avgDailyDistance * 365;

  const mileageBeforeYearly = safeCurrentMileage;
  const mileageAfterYearly =
    safeCurrentMileage * (1 + efficiency.mileageIncreasePercentage / 100);

  // Fuel yearly
  const fuelUsedBeforeYearly = yearlyDistance / mileageBeforeYearly;
  const fuelUsedAfterYearly = yearlyDistance / (mileageAfterYearly || 0.0001);
  const fuelSavedYearly = fuelUsedBeforeYearly - fuelUsedAfterYearly;

  // Money yearly
  const moneySpentBeforeYearly = fuelUsedBeforeYearly * fuelPricePerLiter;
  const moneySpentAfterYearly = fuelUsedAfterYearly * fuelPricePerLiter;
  const moneySavedYearly = moneySpentBeforeYearly - moneySpentAfterYearly;

  return {
    monthly: {
      fuelUsedBefore: parseFloat(fuelUsedBeforeMonthly.toFixed(2)),
      fuelUsedAfter: parseFloat(fuelUsedAfterMonthly.toFixed(2)),
      fuelSaved: parseFloat(fuelSavedMonthly.toFixed(2)),
      moneySavedOnFuel: parseFloat(moneySavedMonthly.toFixed(2)),
      moneySpentBefore: parseFloat(moneySpentBeforeMonthly.toFixed(2)),
      moneySpentAfter: parseFloat(moneySpentAfterMonthly.toFixed(2)),
      mileageBefore: parseFloat(mileageBeforeMonthly.toFixed(2)),
      mileageAfter: parseFloat(mileageAfterMonthly.toFixed(2)),
    },
    yearly: {
      fuelUsedBefore: parseFloat(fuelUsedBeforeYearly.toFixed(2)),
      fuelUsedAfter: parseFloat(fuelUsedAfterYearly.toFixed(2)),
      fuelSaved: parseFloat(fuelSavedYearly.toFixed(2)),
      moneySavedOnFuel: parseFloat(moneySavedYearly.toFixed(2)),
      moneySpentBefore: parseFloat(moneySpentBeforeYearly.toFixed(2)),
      moneySpentAfter: parseFloat(moneySpentAfterYearly.toFixed(2)),
      mileageBefore: parseFloat(mileageBeforeYearly.toFixed(2)),
      mileageAfter: parseFloat(mileageAfterYearly.toFixed(2)),
    },
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
