import { CommonState } from '../../types';
import { FiatCurrenciesAction } from './actions';
import {
    FIAT_CURRENCIES_DATA,
    FIAT_CURRENCIES_ERROR,
    FIAT_CURRENCIES_FETCH,
} from './constants';
import { FiatCurrency } from './types';

export interface FiatCurrenciesState extends CommonState {
    list: FiatCurrency[];
    loading: boolean;
}

export const initialFiatCurrenciesState: FiatCurrenciesState = {
    list: [],
    loading: false,
};

export const fiatCurrenciesReducer = (state = initialFiatCurrenciesState, action: FiatCurrenciesAction) => {
    switch (action.type) {
        case FIAT_CURRENCIES_FETCH:
            return {
                ...state,
                loading: true,
            };
        case FIAT_CURRENCIES_DATA:
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case FIAT_CURRENCIES_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
