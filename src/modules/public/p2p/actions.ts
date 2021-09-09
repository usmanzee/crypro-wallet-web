import { CommonError } from '../../types';
import {
    P2P_OFFERS_DATA,
    P2P_OFFERS_ERROR,
    P2P_OFFERS_FETCH,
    P2P_OFFERS_UPDATE,
} from './constants';
import { Offer } from './types';

export interface OffersFetch {
    type: typeof P2P_OFFERS_FETCH;
    payload: {
        page: number;
        limit: number;
        side: string;
        sort?: string;
        base: string;
        quote: string;
        payment_method?: number;
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
        payment_method?: number;
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

export type P2PActions =
    OffersFetch
    | OffersData
    | OffersError
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
