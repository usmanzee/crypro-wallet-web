import { CommonError } from '../../types';
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

export interface OffersFetch {
    type: typeof P2P_OFFERS_FETCH;
    payload: {
        side: string;
        base: string;
        quote: string;
        payment_method_id?: number;
        sort?: string;
        page: number;
        limit: number;
    };
}

export interface OffersData {
    type: typeof P2P_OFFERS_DATA;
    payload: {
        list: Offer[];
        page: number;
        total: number;
        side: string;
        sort?: string;
        base: string;
        quote: string;
        payment_method_id?: number;
    };
}

export interface OffersError {
    type: typeof P2P_OFFERS_ERROR;
    error: CommonError;
}

export interface P2POffersUpdate {
    type: typeof P2P_OFFERS_UPDATE;
    payload: Offer;
}

export interface P2PPaymentMethodsFetch {
    type: typeof P2P_PAYMENT_METHODS_FETCH;
}

export interface P2PPaymentMethodsData {
    type: typeof P2P_PAYMENT_METHODS_DATA;
    payload: PaymentMethod[];
}

export interface P2PPaymentMethodsError {
    type: typeof P2P_PAYMENT_METHODS_ERROR;
    error: CommonError;
}

export type P2PActions =
    OffersFetch
    | OffersData
    | OffersError
    | P2PPaymentMethodsFetch
    | P2PPaymentMethodsData
    | P2PPaymentMethodsError
    | P2POffersUpdate

export const offersFetch = (payload?: OffersFetch['payload']): OffersFetch => ({
    type: P2P_OFFERS_FETCH,
    payload,
});

export const offersData = (payload: OffersData['payload']): OffersData => ({
    type: P2P_OFFERS_DATA,
    payload,
});

export const offersError = (error: CommonError): OffersError => ({
    type: P2P_OFFERS_ERROR,
    error,
});

export const p2pOffersUpdate = (payload: P2POffersUpdate['payload']): P2POffersUpdate => ({
    type: P2P_OFFERS_UPDATE,
    payload,
});

export const p2pPaymentMethodsFetch = (): P2PPaymentMethodsFetch => ({
    type: P2P_PAYMENT_METHODS_FETCH,
});

export const p2pPaymentMethodsData = (payload: P2PPaymentMethodsData['payload']): P2PPaymentMethodsData => ({
    type: P2P_PAYMENT_METHODS_DATA,
    payload,
});

export const p2pPaymentMethodsError = (error: CommonError): P2PPaymentMethodsError => ({
    type: P2P_PAYMENT_METHODS_ERROR,
    error,
});
