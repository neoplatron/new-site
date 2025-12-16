export const WARRANTY_PERIOD_YEARS = 1;

export const isWarrantyValid = (installationDate: string, durationYears: number = WARRANTY_PERIOD_YEARS): { valid: boolean; expiryDate: Date; daysRemaining: number } => {
    const instDate = new Date(installationDate);
    const expiryDate = new Date(instDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + durationYears);

    const now = new Date();
    const valid = now < expiryDate;
    const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return { valid, expiryDate, daysRemaining };
};
