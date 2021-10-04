import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { Offer } from '../../../modules';
import { insertOrUpdate } from './helpers';
import { CommonError } from '../../types';
import { OfferNestedOrders, P2POffersActions } from './actions';
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

export interface P2POffersState {
    createOffer: {
        loading: boolean;
        success: boolean;
        error?: CommonError;
    };
    updateOffer: {
        list: Offer[];
        loading: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    offers: {
        page: number;
        total: number;
        list: Offer[];
        state: string;
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    offerOrders: {
        data?: OfferNestedOrders;
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    offerDetail: {
        fetchingOfferDetail: boolean;
        data: Offer;
        error?:CommonError 
    }
}

export const initialP2POffersState: P2POffersState = {
    createOffer: {
        loading: false,
        success: false,
    },
    updateOffer: {
        list: [],
        loading: false,
        success: false,
    },
    offers: {
        page: 0,
        total: 0,
        list: [],
        state: '',
        fetching: false,
        success: false,
    },
    offerOrders: {
        fetching: false,
        success: false,
    },
    offerDetail: {
        fetchingOfferDetail: false,
        data: null,
    }
};

export const offersFetchReducer = (state: P2POffersState['offers'], action: P2POffersActions) => {
    switch (action.type) {
        case P2P_USER_OFFERS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
                page: action.payload.page,
                state: action.payload.state,
                error: undefined,
            };
        case P2P_USER_OFFERS_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                total: action.payload.total,
                fetching: false,
                success: true,                
            };
        case P2P_USER_OFFERS_UPDATE:
            return {
                ...state,
                list: sliceArray(insertOrUpdate(state.list, action.payload, state.state), defaultStorageLimit()),
            };
        case P2P_USER_OFFERS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                total: 0,
                list: [],
                state: '',
                error: action.error,
            };
        default:
            return state;
    }
};

export const offerOrdersFetchReducer = (state: P2POffersState['offerOrders'], action: P2POffersActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_ORDERS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
                data: undefined,
                error: undefined,
            };
        case P2P_USER_OFFER_ORDERS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
            };
        case P2P_USER_OFFER_ORDERS_ERROR:
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

const createOfferReducer = (state: P2POffersState['createOffer'], action: P2POffersActions) => {
    switch (action.type) {
        case P2P_CREATE_OFFER_FETCH:
            return {
                ...state,
                loading: true,
            };
        case P2P_CREATE_OFFER_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                error: undefined,
            };
        case P2P_CREATE_OFFER_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const updateOfferReducer = (state: P2POffersState['updateOffer'], action: P2POffersActions) => {
    switch (action.type) {
        case P2P_UPDATE_OFFER_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_UPDATE_OFFER_DATA:
            return {
                ...state,
                list: action.payload,
                loading: false,
                success: true,
                error: undefined,
            };
        case P2P_UPDATE_OFFER_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const offerDetailFetchReducer = (state: P2POffersState['offerDetail'], action: P2POffersActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_DETAIL_FETCH:
            return {
                ...state,
                fetchingOfferDetail: true,
            };
        case P2P_USER_OFFER_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetchingOfferDetail: false,
            };
        case P2P_USER_OFFER_DETAIL_ERROR:
            return {
                ...state,
                fetchingOfferDetail: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pOffersReducer = (state = initialP2POffersState, action: P2POffersActions) => {
    switch (action.type) {
        case P2P_CREATE_OFFER_FETCH:
        case P2P_CREATE_OFFER_DATA:
        case P2P_CREATE_OFFER_ERROR:
            const createOfferState = { ...state.createOffer };

            return {
                ...state,
                createOffer: createOfferReducer(createOfferState, action),
            };
        case P2P_UPDATE_OFFER_FETCH:
        case P2P_UPDATE_OFFER_DATA:
        case P2P_UPDATE_OFFER_ERROR:
            const cancelOfferState = { ...state.updateOffer };

            return {
                ...state,
                cancelOffer: updateOfferReducer(cancelOfferState, action),
            };
        case P2P_USER_OFFERS_FETCH:
        case P2P_USER_OFFERS_DATA:
        case P2P_USER_OFFERS_ERROR:
        case P2P_USER_OFFERS_UPDATE:
            const userOffersFetchState = { ...state.offers };

            return {
                ...state,
                offers: offersFetchReducer(userOffersFetchState, action),
            };
        case P2P_USER_OFFER_ORDERS_FETCH:
        case P2P_USER_OFFER_ORDERS_DATA:
        case P2P_USER_OFFER_ORDERS_ERROR:
            const userOfferOrdersFetchState = { ...state.offerOrders };

            return {
                ...state,
                offerOrders: offerOrdersFetchReducer(userOfferOrdersFetchState, action),
            };

        case P2P_USER_OFFER_DETAIL_FETCH:
        case P2P_USER_OFFER_DETAIL_DATA:
        case P2P_USER_OFFER_DETAIL_ERROR:
            const getUserOfferDetail = { ...state.offerDetail };

            return {
                ...state,
                offerDetail: offerDetailFetchReducer(getUserOfferDetail, action),
            };
        default:
            return state;
    }
};
