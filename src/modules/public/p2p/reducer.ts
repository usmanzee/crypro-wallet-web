import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { insertOrUpdate } from './helpers';
import { CommonError } from '../../types';
import { P2PActions } from './actions';
import {
    P2P_OFFERS_DATA,
    P2P_OFFERS_ERROR,
    P2P_OFFERS_FETCH,
    P2P_OFFERS_UPDATE,
    P2P_PAYMENT_METHODS_DATA,
    P2P_PAYMENT_METHODS_ERROR,
    P2P_PAYMENT_METHODS_FETCH,
} from './constants';
import { Offer, PaymentMethod } from './types';

export interface P2PState {    
    paymentMethods: {
        data: PaymentMethod[];
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    offers: {
        page: number;
        total: number;
        list: Offer[];
        side: string;
        base: string;
        quote: string;
        payment_method?: number;
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
}

export const initialP2PState: P2PState = {
    paymentMethods: {
        data: [],
        fetching: false,
        success: false,
    },
    offers: {
        page: 0,
        total: 0,
        list: [],
        side: '',
        base: '',
        quote: '',
        fetching: false,
        success: false,
    }
};

export const p2pOffersFetchReducer = (state: P2PState['offers'], action: P2PActions) => {
    switch (action.type) {
        case P2P_OFFERS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_OFFERS_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                page: action.payload.page,
                total: action.payload.total,
                side: action.payload.side,
                base: action.payload.base,
                quote: action.payload.quote,
                payment_method: action.payload.payment_method_id,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFERS_UPDATE:
            const newList = sliceArray(
                insertOrUpdate(
                    state.list,
                    action.payload,
                    state.side,
                    state.base,
                    state.quote,
                    state.payment_method,
            ), defaultStorageLimit());

            return {
                ...state,
                list: newList,
                total: newList.length,
            };
        case P2P_OFFERS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                side: '',
                total: 0,
                list: [],
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pPaymentMethodsReducer = (state: P2PState['paymentMethods'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PAYMENT_METHODS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PAYMENT_METHODS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_METHODS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pReducer = (state = initialP2PState, action: P2PActions) => {
    switch (action.type) {

        case P2P_PAYMENT_METHODS_FETCH:
        case P2P_PAYMENT_METHODS_DATA:
        case P2P_PAYMENT_METHODS_ERROR:
            const p2pPaymentMethodsState = { ...state.paymentMethods };

            return {
                ...state,
                paymentMethods: p2pPaymentMethodsReducer(p2pPaymentMethodsState, action),
            };
        case P2P_OFFERS_FETCH:
        case P2P_OFFERS_DATA:
        case P2P_OFFERS_ERROR:
        case P2P_OFFERS_UPDATE:
            const p2pOffersFetchState = { ...state.offers };

            return {
                ...state,
                offers: p2pOffersFetchReducer(p2pOffersFetchState, action),
            };
        default:
            return state;
    }
};