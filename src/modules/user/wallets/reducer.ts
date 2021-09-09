import { CommonError } from '../../types';
import { WalletsAction } from './actions';
import {
    SET_MOBILE_WALLET_UI,
    WALLETS_ADDRESS_DATA,
    WALLETS_ADDRESS_ERROR,
    WALLETS_ADDRESS_FETCH,
    WALLETS_DATA,
    WALLETS_DATA_WS,
    WALLETS_ERROR,
    WALLETS_FETCH,
    WALLETS_RESET,
    WALLETS_WITHDRAW_CCY_DATA,
    WALLETS_WITHDRAW_CCY_ERROR,
    WALLETS_WITHDRAW_CCY_FETCH,

    SAVINGS_WALLETS_FETCH,
    SAVINGS_WALLETS_DATA,
    SAVINGS_WALLETS_DATA_WS,
    SAVINGS_WALLETS_ERROR,

    P2P_WALLETS_FETCH,
    P2P_WALLETS_DATA,
    P2P_WALLETS_DATA_WS,
    P2P_WALLETS_ERROR,
} from './constants';
import { Wallet } from './types';

export interface WalletsState {
    wallets: {
        list: Wallet[];
        savings: Wallet[];
        p2p: Wallet[];
        loading: boolean;
        loadingSavingsWallets: boolean;
        errorSavingsWallets?: CommonError;
        loadingP2PWallets: boolean;
        errorP2PWallets?: CommonError;
        withdrawProcessing: boolean;
        withdrawSuccess: boolean;
        error?: CommonError;
        mobileWalletChosen: string;
        selectedWalletAddress: string;
        walletAddressLoading: boolean;
        walletAddressSuccess: boolean;
    };
}

export const initialWalletsState: WalletsState = {
    wallets: {
        list: [],
        savings: [],
        p2p: [],
        loading: false,
        loadingSavingsWallets: false,
        loadingP2PWallets: false,
        withdrawProcessing: false,
        withdrawSuccess: false,
        mobileWalletChosen: '',
        selectedWalletAddress: '',
        walletAddressLoading: false,
        walletAddressSuccess: false,
    },
};

const walletsListReducer = (state: WalletsState['wallets'], action: WalletsAction): WalletsState['wallets'] => {
    switch (action.type) {
        case WALLETS_ADDRESS_FETCH:
            return {
                ...state,
                walletAddressLoading: true,
            };
        case WALLETS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case WALLETS_WITHDRAW_CCY_FETCH:
            return {
                ...state,
                loading: true,
                withdrawProcessing: true,
                withdrawSuccess: false,
            };
        case WALLETS_DATA: {
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        }
        case WALLETS_DATA_WS: {
            let updatedList = state.list;

            if (state.list.length) {
                updatedList = state.list.map(wallet => {
                    let updatedWallet = wallet;
                    const payloadCurrencies = Object.keys(action.payload.balances);

                    if (payloadCurrencies.length) {
                        payloadCurrencies.some(value => {
                            const targetWallet = action.payload.balances[value];

                            if (value === wallet.currency) {
                                updatedWallet = {
                                    ...updatedWallet,
                                    balance: targetWallet && targetWallet[0] ? targetWallet[0] : updatedWallet.balance,
                                    locked: targetWallet && targetWallet[1] ? targetWallet[1] : updatedWallet.locked,
                                };

                                return true;
                            }

                            return false;
                        });
                    }

                    return updatedWallet;
                });
            }

            return {
                ...state,
                loading: false,
                list: updatedList,
            };
        }
        case WALLETS_ADDRESS_DATA: {
            // const walletIndex = state.list.findIndex(
            //     wallet => wallet.currency.toLowerCase() === action.payload.currency.toLowerCase(),
            // );
            // if (walletIndex !== -1) {
            //     return {
            //         ...state,
            //         loading: false,
            //         selectedWalletAddress: action.payload.address,
            //         walletAddressLoading: false,
            //     };
            // }

            return {
                ...state,
                loading: false,
                selectedWalletAddress: action.payload.address,
                walletAddressLoading: false,
            };
        }
        case WALLETS_WITHDRAW_CCY_DATA:
            return {
                ...state,
                loading: false,
                withdrawProcessing: false,
                withdrawSuccess: true,
            };
        case WALLETS_WITHDRAW_CCY_ERROR:
            return {
                ...state,
                loading: false,
                withdrawProcessing: false,
                withdrawSuccess: false,
                error: action.payload,
            };
        case WALLETS_ADDRESS_ERROR:
            return {
                ...state,
                selectedWalletAddress: '',
                walletAddressLoading: false,
                walletAddressSuccess: false
            }
        case WALLETS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case SET_MOBILE_WALLET_UI:
            return { ...state, mobileWalletChosen: action.payload };

        case SAVINGS_WALLETS_FETCH:
            return {
                ...state,
                loadingSavingsWallets: true,
            };
        case SAVINGS_WALLETS_DATA: 
            console.log(action);
            return {
                ...state,
                loadingSavingsWallets: false,
                savings: action.payload,
            };
        case SAVINGS_WALLETS_DATA_WS: {
            let updatedList = state.savings;

            if (state.savings.length) {
                updatedList = state.savings.map(wallet => {
                    let updatedWallet = wallet;
                    const payloadCurrencies = Object.keys(action.payload.balances);

                    if (payloadCurrencies.length) {
                        payloadCurrencies.some(value => {
                            const targetWallet = action.payload.balances[value];

                            if (value === wallet.currency) {
                                updatedWallet = {
                                    ...updatedWallet,
                                    balance: targetWallet && targetWallet[0] ? targetWallet[0] : updatedWallet.balance,
                                    locked: targetWallet && targetWallet[1] ? targetWallet[1] : updatedWallet.locked,
                                };

                                return true;
                            }

                            return false;
                        });
                    }

                    return updatedWallet;
                });
            }

            return {
                ...state,
                loadingSavingsWallets: false,
                savings: updatedList,
            };
        }
        case SAVINGS_WALLETS_ERROR:
            return {
                ...state,
                loadingSavingsWallets: false,
                errorSavingsWallets: action.payload,
            };
        case P2P_WALLETS_FETCH:
            return {
                ...state,
                loadingP2PWallets: true,
            };
        case P2P_WALLETS_DATA: 
            return {
                ...state,
                loadingP2PWallets: false,
                p2p: action.payload,
            };

        case P2P_WALLETS_DATA_WS: {
            let updatedList = state.p2p;

            if (state.p2p.length) {
                updatedList = state.p2p.map(wallet => {
                    let updatedWallet = wallet;
                    const payloadCurrencies = Object.keys(action.payload.balances);

                    if (payloadCurrencies.length) {
                        payloadCurrencies.some(value => {
                            const targetWallet = action.payload.balances[value];

                            if (value === wallet.currency) {
                                updatedWallet = {
                                    ...updatedWallet,
                                    balance: targetWallet && targetWallet[0] ? targetWallet[0] : updatedWallet.balance,
                                    locked: targetWallet && targetWallet[1] ? targetWallet[1] : updatedWallet.locked,
                                };

                                return true;
                            }

                            return false;
                        });
                    }

                    return updatedWallet;
                });
            }

            return {
                ...state,
                loadingP2PWallets: false,
                p2p: updatedList,
            };
        }

        case P2P_WALLETS_ERROR:
            return {
                ...state,
                loadingP2PWallets: false,
                errorP2PWallets: action.payload,
            };

        default:
            return state;
    }
};

export const walletsReducer = (state = initialWalletsState, action: WalletsAction): WalletsState => {
    switch (action.type) {
        case WALLETS_FETCH:
        case WALLETS_DATA:
        case WALLETS_DATA_WS:
        case WALLETS_ERROR:
        case SAVINGS_WALLETS_FETCH:
        case SAVINGS_WALLETS_DATA:
        case SAVINGS_WALLETS_DATA_WS:
        case SAVINGS_WALLETS_ERROR:
        case P2P_WALLETS_FETCH:
        case P2P_WALLETS_DATA:
        case P2P_WALLETS_DATA_WS:
        case P2P_WALLETS_ERROR:
        case WALLETS_ADDRESS_FETCH:
        case WALLETS_ADDRESS_DATA:
        case WALLETS_ADDRESS_ERROR:
        case WALLETS_WITHDRAW_CCY_FETCH:
        case WALLETS_WITHDRAW_CCY_DATA:
        case SET_MOBILE_WALLET_UI:
        case WALLETS_WITHDRAW_CCY_ERROR:
            const walletsListState = { ...state.wallets };

            return {
                ...state,
                wallets: walletsListReducer(walletsListState, action),
            };
        case WALLETS_RESET:
            return {
                ...state,
                wallets: {
                    list: [],
                    savings: [],
                    p2p: [],
                    loading: false,
                    loadingSavingsWallets: false,
                    loadingP2PWallets: false,
                    withdrawProcessing: false,
                    withdrawSuccess: false,
                    mobileWalletChosen: '',
                    selectedWalletAddress: '',
                    walletAddressLoading: false,
                    walletAddressSuccess: false
                },
            };
        default:
            return state;
    }
};
