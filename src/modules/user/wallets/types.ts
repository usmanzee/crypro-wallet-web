export interface Wallet {
    balance?: string;
    currency: string;
    name: string;
    walletType: string;
    type: 'fiat' | 'coin';
    fee: number;
    address?: string;
    locked?: string;
    explorerTransaction: string;
    explorerAddress: string;
    fixed: number;
    iconUrl?: string;
    depositEnabled: boolean,
    withdrawEnabled: boolean,
    precision: number,
    swapFee: number,
	minSwapAmount: number,
	maxSwapAmount: number
}

export interface WalletAddress {
    address: string;
    currency: string;
}

export interface WalletWithdrawCCY {
    amount: string;
    currency: string;
    otp: string;
    beneficiary_id: string;
}

export interface WalletWithdrawFiat {
    amount: string;
    currency: string;
    currency_type: string;
    otp: string;
    beneficiary_id: string;
}

export interface AccountInterface {
    currency: string;
    balance?: string;
    locked?: string;
}
