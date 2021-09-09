import {
    FIAT_CURRENCIES_DATA,
    FIAT_CURRENCIES_ERROR,
    FIAT_CURRENCIES_FETCH,
} from './constants';
import { FiatCurrency } from './types';

export interface FiatCurrenciesFetch {
    type: typeof FIAT_CURRENCIES_FETCH;
}

export interface FiatCurrenciesData {
    type: typeof FIAT_CURRENCIES_DATA;
    payload: FiatCurrency[];
}

export interface FiatCurrenciesError {
    type: typeof FIAT_CURRENCIES_ERROR;
}

export type FiatCurrenciesAction =
    FiatCurrenciesFetch
    | FiatCurrenciesData
    | FiatCurrenciesError;

export const fiatCurrenciesFetch = (): FiatCurrenciesFetch => ({
    type: FIAT_CURRENCIES_FETCH,
});

export const fiatCurrenciesData = (payload: FiatCurrenciesData['payload']): FiatCurrenciesData => ({
    type: FIAT_CURRENCIES_DATA,
    payload,
});

export const fiatCurrenciesError = (): FiatCurrenciesError => ({
    type: FIAT_CURRENCIES_ERROR,
});
