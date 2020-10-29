import {
    EXCHANGE_RATE_FETCH,
    EXCHANGE_RATE_SUCCESS,
    EXCHANGE_RATE_ERROR,
    EXCHANGE_RATE_RESET,
    EXCHANGE_REQUEST,
    EXCHANGE_SUCCESS,
    EXCHANGE_ERROR,
} from './constants';


export interface ExchangeState {
    isRateFetching: boolean;
    loading: boolean;
    exchangeSuccess: boolean;
    rate: string;
}

export const initialExchangeState: ExchangeState = {
    isRateFetching: false,
    loading: false,
    exchangeSuccess: false,
    rate: '0.00'
}

export const exchangeReducer = (state: ExchangeState = initialExchangeState, action) => {
    switch(action.type) {
        case EXCHANGE_RATE_FETCH:
            return {
                ...state,
                isRateFetching: true
            }
        case EXCHANGE_RATE_SUCCESS:
            return {
                ...state,
                isRateFetching: false,
                rate: action.payload.rate
            }
        case EXCHANGE_RATE_ERROR:
            return {
                ...state,
                isRateFetching: false,
                rate: '0.00',
                error: action.payload.message
            }
        case EXCHANGE_RATE_RESET:
            return {
                ...state,
                isFetchingRate: false,
                rate: '0.00'
            }
        case EXCHANGE_REQUEST:
            return {
                ...state,
                loading: true,
                exchangeSuccess: false
            }
        case EXCHANGE_SUCCESS:
            return {
                ...state,
                loading: false,
                exchangeSuccess: true
            }
        case EXCHANGE_ERROR:
            return {
                ...state,
                loading: false,
                exchangeSuccess: false,
                error: action.payload.message
            }
        default:
            return state;
    }
}