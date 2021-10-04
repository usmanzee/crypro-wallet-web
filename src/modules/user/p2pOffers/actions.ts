import { Offer, P2POrder } from '../../../modules';
import { CommonError } from '../../types';
import {
    P2P_CREATE_OFFER_DATA,
    P2P_CREATE_OFFER_ERROR,
    P2P_CREATE_OFFER_FETCH,
    P2P_USER_OFFER_ORDERS_DATA,
    P2P_USER_OFFER_ORDERS_ERROR,
    P2P_USER_OFFER_ORDERS_FETCH,
    P2P_USER_OFFERS_DATA,
    P2P_USER_OFFERS_ERROR,
    P2P_USER_OFFERS_FETCH,
    P2P_USER_OFFERS_UPDATE,
    P2P_UPDATE_OFFER_DATA,
    P2P_UPDATE_OFFER_ERROR,
    P2P_UPDATE_OFFER_FETCH,
    P2P_USER_OFFER_DETAIL_FETCH,
    P2P_USER_OFFER_DETAIL_DATA,
    P2P_USER_OFFER_DETAIL_ERROR
} from './constants';

export interface OfferNestedOrders extends Offer {
    orders: P2POrder[];
}

export interface UserOffersFetch {
    type: typeof P2P_USER_OFFERS_FETCH;
    payload: {
        side?: string;
        baseUnit?: string;
        quoteUnit?: string;
        state?: string;
        page: number;
        limit: number;
    };
}

export interface UserOffersData {
    type: typeof P2P_USER_OFFERS_DATA;
    payload: {
        list: Offer[];
        total: number;
    };
}

export interface UserOffersError {
    type: typeof P2P_USER_OFFERS_ERROR;
    error: CommonError;
}

export interface UserOfferOrdersFetch {
    type: typeof P2P_USER_OFFER_ORDERS_FETCH;
    payload: {
        offer_id: number;
    };
}

export interface UserOfferOrdersData {
    type: typeof P2P_USER_OFFER_ORDERS_DATA;
    payload: OfferNestedOrders;
}

export interface UserOfferOrdersError {
    type: typeof P2P_USER_OFFER_ORDERS_ERROR;
    error: CommonError;
}

export interface P2PUserOffersUpdate {
    type: typeof P2P_USER_OFFERS_UPDATE;
    payload: Offer;
}

export interface CreateOfferFetch {
    type: typeof P2P_CREATE_OFFER_FETCH;
    payload: {
        base_unit: string;
        quote_unit: string;
        side: string;
        price: string | number;
        origin_amount: string | number;
        min_order_amount: string | number;
        max_order_amount: string | number;
        time_limit: string | number;
        margin?: string | number;
        note?: string;
        auto_reply?: string;
        payment_methods: any;
    };
}

export interface CreateOfferData {
    type: typeof P2P_CREATE_OFFER_DATA;
}

export interface CreateOfferError {
    type: typeof P2P_CREATE_OFFER_ERROR;
    error: CommonError;
}

export interface UpdateOfferFetch {
    type: typeof P2P_UPDATE_OFFER_FETCH;
    payload: {
        id: number;
        origin_amount: string;
        price: string;
        base_unit: string;
        quote_unit: string;
        state: string;
    }
}

export interface UpdateOfferData {
    type: typeof P2P_UPDATE_OFFER_DATA;
    payload: Offer[];
}

export interface UpdateOfferError {
    type: typeof P2P_UPDATE_OFFER_ERROR;
    error: CommonError;
}

export interface UserOfferDetailFetch {
    type: typeof P2P_USER_OFFER_DETAIL_FETCH;
    payload: {
        id: number;
    }
}

export interface UserOfferDetailData {
    type: typeof P2P_USER_OFFER_DETAIL_DATA;
    payload: Offer;
}

export interface UserOfferDetailError {
    type: typeof P2P_USER_OFFER_DETAIL_ERROR;
    error: CommonError;
}

export type P2POffersActions =
    UserOffersFetch
    | UserOffersData
    | UserOffersError
    | UserOfferOrdersFetch
    | UserOfferOrdersData
    | UserOfferOrdersError
    | CreateOfferFetch
    | CreateOfferData
    | CreateOfferError
    | UpdateOfferFetch
    | UpdateOfferData
    | UpdateOfferError
    | P2PUserOffersUpdate
    | UserOfferDetailFetch
    | UserOfferDetailData
    | UserOfferDetailError;

export const userOffersFetch = (payload?: UserOffersFetch['payload']): UserOffersFetch => ({
    type: P2P_USER_OFFERS_FETCH,
    payload,
});

export const userOffersData = (payload: UserOffersData['payload']): UserOffersData => ({
    type: P2P_USER_OFFERS_DATA,
    payload,
});

export const userOffersError = (error: CommonError): UserOffersError => ({
    type: P2P_USER_OFFERS_ERROR,
    error,
});

export const userOfferOrdersFetch = (payload: UserOfferOrdersFetch['payload']): UserOfferOrdersFetch => ({
    type: P2P_USER_OFFER_ORDERS_FETCH,
    payload,
});

export const userOfferOrdersData = (payload: UserOfferOrdersData['payload']): UserOfferOrdersData => ({
    type: P2P_USER_OFFER_ORDERS_DATA,
    payload,
});

export const userOfferOrdersError = (error: CommonError): UserOfferOrdersError => ({
    type: P2P_USER_OFFER_ORDERS_ERROR,
    error,
});

export const p2pUserOffersUpdate = (payload: P2PUserOffersUpdate['payload']): P2PUserOffersUpdate => ({
    type: P2P_USER_OFFERS_UPDATE,
    payload,
});

export const createOffer = (payload: CreateOfferFetch['payload']): CreateOfferFetch => ({
    type: P2P_CREATE_OFFER_FETCH,
    payload,
});

export const createOfferData = (): CreateOfferData => ({
    type: P2P_CREATE_OFFER_DATA,
});

export const createOfferError = (error: CommonError): CreateOfferError => ({
    type: P2P_CREATE_OFFER_ERROR,
    error,
});

export const updateOffer = (payload: UpdateOfferFetch['payload']): UpdateOfferFetch => ({
    type: P2P_UPDATE_OFFER_FETCH,
    payload,
});

export const updateOfferData = (payload: UpdateOfferData['payload']): UpdateOfferData => ({
    type: P2P_UPDATE_OFFER_DATA,
    payload,
});

export const updateOfferError = (error: CommonError): UpdateOfferError => ({
    type: P2P_UPDATE_OFFER_ERROR,
    error,
});

export const userOfferDetailFetch = (payload?: UserOfferDetailFetch['payload']): UserOfferDetailFetch => ({
    type: P2P_USER_OFFER_DETAIL_FETCH,
    payload
});

export const userOfferDetailData = (payload: UserOfferDetailData['payload']): UserOfferDetailData => ({
    type: P2P_USER_OFFER_DETAIL_DATA,
    payload,
});

export const userOfferDetailError = (error: CommonError): UserOfferDetailError => ({
    type: P2P_USER_OFFER_DETAIL_ERROR,
    error,
});

