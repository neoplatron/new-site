import { useState } from "react";
import {
  Calculator,
  // TrendingUp,
  Fuel,
  IndianRupee,
  Gauge,
  // PartyPopper,
} from "lucide-react";
import {
  calculateFuelSavings,
  formatCurrency,
  formatNumber,
  type VehicleType,
  type CalculatorInputs,
} from "../utils/fuelCalculator";

const SavingsCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    vehicleType: "4-wheeler",
    fuelPricePerLiter: 100,
    avgDailyDistance: 50,
    currentMileage: 15,
    kitCost: 70000,
  });

  const [activeTab, setActiveTab] = useState<"monthly" | "yearly">("monthly");
  const [isInputsOpen, setIsInputsOpen] = useState(true);
  const results = calculateFuelSavings(inputs);

  const handleInputChange = <K extends keyof CalculatorInputs>(
    field: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentResults = results?.[activeTab];

  return (
    <section className="relative py-16 md:py-20 lg:py-28 bg-bg dark:bg-d-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-d-primary/10 border border-primary/20 dark:border-d-primary/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6">
            <Calculator className="w-3 h-3 md:w-4 md:h-4 text-primary dark:text-d-primary" />
            <span className="text-xs md:text-sm font-medium text-text dark:text-d-text">
              Savings Calculator
            </span>
          </div>
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-bold text-text dark:text-d-text mb-3 md:mb-4">
            Calculate Your{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-success via-info to-secondary">
              Savings
            </span>
          </h2>
          <p className="text-base md:text-lg text-text-para dark:text-d-text-para max-w-2xl mx-auto px-4">
            See how much you can save on fuel costs and improve your vehicle's
            efficiency with NeoPlatron
          </p>
        </div>

        {/* Calculator Layout */}
        <div className="grid lg:grid-cols-[30%_70%] gap-6 md:gap-8">
          {/* Left Panel - Inputs */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-bg-light dark:bg-d-bg-light rounded-xl md:rounded-2xl p-4 md:p-6 border border-border dark:border-d-border shadow-xl">
              {/* Header with collapse button */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="font-title text-lg md:text-xl font-bold text-text dark:text-d-text flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 dark:bg-d-primary/10 flex items-center justify-center">
                    <Calculator className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary dark:text-d-primary" />
                  </div>
                  Input Details
                </h3>

                {/* Collapse button - only visible on mobile */}
                <button
                  onClick={() => setIsInputsOpen(!isInputsOpen)}
                  className="md:hidden flex items-center gap-1.5 text-xs font-medium text-primary dark:text-d-primary hover:text-primary/80 dark:hover:text-d-primary/80 transition-colors"
                >
                  <span>{isInputsOpen ? "Close" : "Open"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isInputsOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out ${isInputsOpen
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0 md:max-h-full md:opacity-100"
                  }`}
              >
                <div className="space-y-4 md:space-y-6">
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-text dark:text-d-text mb-2 md:mb-3">
                      Vehicle Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {(
                        [
                          "2-wheeler",
                          "3-wheeler",
                          "4-wheeler",
                          "6-wheeler",
                        ] as VehicleType[]
                      ).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleInputChange("vehicleType", type)}
                          className={`px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${inputs.vehicleType === type
                              ? "bg-linear-to-r from-primary to-secondary text-white shadow-lg"
                              : "bg-bg dark:bg-d-bg text-text-muted dark:text-d-text-muted border border-border dark:border-d-border hover:border-primary dark:hover:border-d-primary"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Mileage */}
                  <div>
                    <label
                      htmlFor="current-mileage"
                      className="block text-xs md:text-sm font-medium text-text dark:text-d-text mb-2"
                    >
                      Current Vehicle Mileage (km/L)
                    </label>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-muted dark:text-d-text-muted" />
                      <input
                        id="current-mileage"
                        type="number"
                        value={inputs.currentMileage}
                        onChange={(e) =>
                          handleInputChange(
                            "currentMileage",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-bg dark:bg-d-bg border border-border dark:border-d-border rounded-lg md:rounded-xl text-sm md:text-base text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-d-primary transition-all"
                        min="1"
                        step="0.1"
                        placeholder="e.g., 15"
                      />
                    </div>
                    <p className="text-xs text-text-muted dark:text-d-text-muted mt-1.5 md:mt-2">
                      Enter your vehicle's current fuel efficiency
                    </p>
                  </div>

                  {/* Fuel Price */}
                  <div>
                    <label
                      htmlFor="fuel-price"
                      className="block text-xs md:text-sm font-medium text-text dark:text-d-text mb-2"
                    >
                      Fuel Price (₹/Liter)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-muted dark:text-d-text-muted" />
                      <input
                        id="fuel-price"
                        type="number"
                        value={inputs.fuelPricePerLiter}
                        onChange={(e) =>
                          handleInputChange(
                            "fuelPricePerLiter",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-bg dark:bg-d-bg border border-border dark:border-d-border rounded-lg md:rounded-xl text-sm md:text-base text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-d-primary transition-all"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  {/* Daily Distance */}
                  <div>
                    <label
                      htmlFor="daily-distance"
                      className="block text-xs md:text-sm font-medium text-text dark:text-d-text mb-2"
                    >
                      Avg. Daily Distance (km)
                    </label>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-muted dark:text-d-text-muted" />
                      <input
                        id="daily-distance"
                        type="number"
                        value={inputs.avgDailyDistance}
                        onChange={(e) =>
                          handleInputChange(
                            "avgDailyDistance",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-bg dark:bg-d-bg border border-border dark:border-d-border rounded-lg md:rounded-xl text-sm md:text-base text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-d-primary transition-all"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  {/* Kit Cost */}
                  {/*<div>
                    <label
                      htmlFor="kit-cost"
                      className="block text-xs md:text-sm font-medium text-text dark:text-d-text mb-2"
                    >
                      NeoPlatron Kit Cost
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-muted dark:text-d-text-muted" />
                      <input
                        id="kit-cost"
                        type="number"
                        value={inputs.kitCost}
                        disabled
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-bg-dark dark:bg-d-bg-dark border border-border dark:border-d-border rounded-lg md:rounded-xl text-sm md:text-base text-text dark:text-d-text opacity-75 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-text-muted dark:text-d-text-muted mt-1.5 md:mt-2">
                      Fixed installation cost
                    </p>
                  </div>*/}
                </div>
              </div>
            </div>

            {/* Payback Period Card */}
            {/* {results && (
              <div className="bg-linear-to-br from-success/10 to-info/10 dark:from-success/5 dark:to-info/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-success/30 dark:border-success/20">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-success" />
                  <h4 className="text-sm md:text-base font-semibold text-text dark:text-d-text">
                    Payback Period
                  </h4>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-title text-success mb-1">
                  {results.paybackPeriod} months
                </p>
                <p className="text-xs md:text-sm text-text-muted dark:text-d-text-muted">
                  You'll recover your investment in under{" "}
                  {Math.ceil(results.paybackPeriod)} months!
                </p>
              </div>
            )} */}
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4 md:space-y-6">
            {/* Tab Switcher */}
            <div className="flex gap-2 md:gap-3 bg-bg-light dark:bg-d-bg-light rounded-lg md:rounded-xl p-1.5 md:p-2 border border-border dark:border-d-border">
              <button
                onClick={() => setActiveTab("monthly")}
                className={`flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${activeTab === "monthly"
                    ? "bg-linear-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setActiveTab("yearly")}
                className={`flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${activeTab === "yearly"
                    ? "bg-linear-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                  }`}
              >
                Yearly
              </button>
            </div>

            {/* Results Grid */}
            {currentResults && (
              <div className="grid gap-4 md:gap-6">
                {/* Fuel Consumption and Money Spent - Row on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Fuel Consumption */}
                  <div className="bg-bg-light dark:bg-d-bg-light rounded-xl md:rounded-2xl p-4 md:p-6 border border-border dark:border-d-border shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-error/10 dark:bg-error/5 flex items-center justify-center shrink-0">
                        <Fuel className="w-4 h-4 md:w-5 md:h-5 text-error" />
                      </div>
                      <h4 className="text-sm md:text-base font-semibold text-text dark:text-d-text">
                        Fuel Consumption
                      </h4>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs md:text-sm text-text-muted dark:text-d-text-muted shrink-0">
                          Before:
                        </span>
                        <span className="text-base md:text-lg font-semibold text-error text-right break-all">
                          {formatNumber(currentResults.fuelUsedBefore)} L
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs md:text-sm text-text-muted dark:text-d-text-muted shrink-0">
                          After:
                        </span>
                        <span className="text-base md:text-lg font-semibold text-success text-right break-all">
                          {formatNumber(currentResults.fuelUsedAfter)} L
                        </span>
                      </div>
                      <div className="pt-2 md:pt-3 border-t border-border dark:border-d-border">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs md:text-sm font-medium text-text dark:text-d-text shrink-0">
                            Saved:
                          </span>
                          <span className="text-lg md:text-xl font-bold text-success text-right break-all">
                            {formatNumber(currentResults.fuelSaved)} L
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Money Spent */}
                  <div className="bg-bg-light dark:bg-d-bg-light rounded-xl md:rounded-2xl p-4 md:p-6 border border-border dark:border-d-border shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-warning/10 dark:bg-warning/5 flex items-center justify-center shrink-0">
                        <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-warning" />
                      </div>
                      <h4 className="text-sm md:text-base font-semibold text-text dark:text-d-text">
                        Money Spent
                      </h4>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs md:text-sm text-text-muted dark:text-d-text-muted shrink-0">
                          Before:
                        </span>
                        <span className="text-base md:text-lg font-semibold text-error text-right break-all">
                          {formatCurrency(currentResults.moneySpentBefore)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs md:text-sm text-text-muted dark:text-d-text-muted shrink-0">
                          After:
                        </span>
                        <span className="text-base md:text-lg font-semibold text-success text-right break-all">
                          {formatCurrency(currentResults.moneySpentAfter)}
                        </span>
                      </div>
                      <div className="pt-2 md:pt-3 border-t border-border dark:border-d-border">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs md:text-sm font-medium text-text dark:text-d-text shrink-0">
                            Saved:
                          </span>
                          <span className="text-lg md:text-xl font-bold text-success text-right break-all">
                            {formatCurrency(currentResults.moneySavedOnFuel)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mileage */}
                <div className="bg-bg-light dark:bg-d-bg-light rounded-xl md:rounded-2xl p-4 md:p-6 border border-border dark:border-d-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-info/10 dark:bg-info/5 flex items-center justify-center shrink-0">
                      <Gauge className="w-4 h-4 md:w-5 md:h-5 text-info" />
                    </div>
                    <h4 className="text-sm md:text-base font-semibold text-text dark:text-d-text">
                      Vehicle Mileage
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:gap-6">
                    <div className="text-center min-w-0">
                      <p className="text-xs md:text-sm text-text-muted dark:text-d-text-muted mb-1 md:mb-2">
                        Before
                      </p>
                      <p className="text-lg md:text-2xl font-bold text-error break-all">
                        {formatNumber(currentResults.mileageBefore)}
                      </p>
                      <p className="text-[10px] md:text-xs text-text-muted dark:text-d-text-muted mt-0.5 md:mt-1">
                        km/liter
                      </p>
                    </div>
                    <div className="text-center min-w-0">
                      <p className="text-xs md:text-sm text-text-muted dark:text-d-text-muted mb-1 md:mb-2">
                        After<sup className="text-[0.6em] text-text-muted dark:text-d-text-muted ml-0.5">*</sup>
                      </p>
                      <p className="text-lg md:text-2xl font-bold text-success break-all">
                        {formatNumber(currentResults.mileageAfter)}
                      </p>
                      <p className="text-[10px] md:text-xs text-text-muted dark:text-d-text-muted mt-0.5 md:mt-1">
                        km/liter
                      </p>
                    </div>
                    <div className="text-center min-w-0">
                      <p className="text-xs md:text-sm text-text-muted dark:text-d-text-muted mb-1 md:mb-2">
                        Gain
                      </p>
                      <p className="text-lg md:text-2xl font-bold text-info break-all">
                        {formatNumber(
                          currentResults.mileageAfter -
                          currentResults.mileageBefore
                        )}
                      </p>
                      <p className="text-[10px] md:text-xs text-text-muted dark:text-d-text-muted mt-0.5 md:mt-1">
                        km/liter
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-text-muted dark:text-d-text-muted mt-6 md:mt-8 text-center italic opacity-70">
              * Savings calculations are based on controlled test environments. Actual results may vary depending on vehicle condition, driving habits, road conditions, and maintenance.
            </p>
            {/* Summary Card */}
            {/* {results && (
              <div className="bg-linear-to-br from-primary/5 via-secondary/5 to-tertiary/5 dark:from-primary/10 dark:via-secondary/10 dark:to-tertiary/10 rounded-xl md:rounded-2xl p-5 md:p-8 border border-primary/20 dark:border-primary/30">
                <h4 className="font-title text-lg md:text-xl font-bold text-text dark:text-d-text mb-3 md:mb-4">
                  First Year Summary
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-text-muted dark:text-d-text-muted mb-1.5 md:mb-2">
                      Total Yearly Savings
                    </p>
                    <p className="text-2xl md:text-3xl font-bold font-title text-transparent bg-clip-text bg-linear-to-r from-success to-info break-all">
                      {formatCurrency(results.yearly.moneySavedOnFuel)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-text-muted dark:text-d-text-muted mb-1.5 md:mb-2">
                      Net Profit (After Kit Cost)
                    </p>
                    <p className="text-2xl md:text-3xl font-bold font-title text-transparent bg-clip-text bg-linear-to-r from-success to-info break-all">
                      {formatCurrency(results.totalSavingsAfterPayback)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border dark:border-d-border">
                  <p className="text-xs md:text-sm text-text-para dark:text-d-text-para flex items-start gap-1.5 md:gap-2">
                    <PartyPopper className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary shrink-0 mt-0.5" />{" "}
                    <span className="wrap-break-words">
                      <strong>Amazing!</strong> You'll save{" "}
                      <span className="text-success font-semibold break-all">
                        {formatCurrency(results.yearly.moneySavedOnFuel)}
                      </span>{" "}
                      every year on fuel costs. That's{" "}
                      <span className="text-success font-semibold break-all">
                        {formatNumber(results.yearly.fuelSaved)} liters
                      </span>{" "}
                      of fuel saved annually!
                    </span>
                  </p>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsCalculator;
