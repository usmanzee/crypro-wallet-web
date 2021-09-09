export interface SavingsPlan {
    id: number;
    name: string;
    currency_id: string;
    type: string;
    rate: string;
    compound: string;
    status: string;
    updated_at: string;
    autoTransfer: boolean;
    durations: string[];
    selectedDuration: string;
    ratePerDuration: string;
}
