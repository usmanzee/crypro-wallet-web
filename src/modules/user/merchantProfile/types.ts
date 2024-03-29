export interface Profile {
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
    state: string;
    created_at: string;
    updated_at: string;
    metadata?: string;
}

export interface MerchantProfile {
    email: string;
    level: number;
    otp: boolean;
    role: string;
    state: string;
    uid: string;
    csrf_token?: string;
    data?: string;
    profiles: Profile[];
}