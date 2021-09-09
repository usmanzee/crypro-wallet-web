import { RootState } from '../..';
import { CommonError } from '../../types';
import { Offer } from './types';

/* P2P Offers fetch */
export const selectP2POffers = (state: RootState): Offer[] =>
    state.public.p2p.offers.list;

export const selectP2POffersFetchLoading = (state: RootState): boolean =>
    state.public.p2p.offers.fetching;

export const selectP2POffersFetchSuccess = (state: RootState): boolean =>
    state.public.p2p.offers.success;

export const selectP2POffersFetchError = (state: RootState): CommonError | undefined =>
    state.public.p2p.offers.error;

export const selectP2POffersTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.offers.timestamp;

export const selectShouldFetchP2POffers = (state: RootState): boolean =>
    !selectP2POffersTimestamp(state) && !selectP2POffersFetchLoading(state);

export const selectP2POffersTotalNumber = (state: RootState): number =>
    state.public.p2p.offers.total;

export const selectP2POffersCurrentPage = (state: RootState): number =>
    state.public.p2p.offers.page;

export const selectP2POffersPageCount = (state: RootState, limit): number =>
    Math.ceil(state.public.p2p.offers.total / limit);

export const selectP2POffersFirstElemIndex = (state: RootState, limit): number =>
    (state.public.p2p.offers.page * limit) + 1;

export const selectP2POffersLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.public.p2p.offers.page * limit) + limit > selectP2POffersTotalNumber(state)) {
        return selectP2POffersTotalNumber(state);
    } else {
        return (state.public.p2p.offers.page * limit) + limit;
    }
};

export const selectP2POffersNextPageExists = (state: RootState, limit: number): boolean =>
    (state.public.p2p.offers.page + 1) < selectP2POffersPageCount(state, limit);

