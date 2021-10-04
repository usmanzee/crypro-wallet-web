import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
	P2P_USER_OFFER_ORDERS_FETCH,
    P2P_USER_OFFERS_FETCH,
    P2P_CREATE_OFFER_FETCH,
    P2P_UPDATE_OFFER_FETCH,
    P2P_USER_OFFER_DETAIL_FETCH,
} from '../constants';
import { userOfferOrdersSaga, userOffersSaga } from './userOffersSaga';
import { updateOfferSaga } from './updateOfferSaga';
import { createOfferSaga } from './createOfferSaga';
import { userOfferDetailSaga } from './userOfferDetailSaga';

export function* rootP2POffersSaga() {
    yield takeLatest(P2P_USER_OFFERS_FETCH, userOffersSaga);
    yield takeLatest(P2P_USER_OFFER_ORDERS_FETCH, userOfferOrdersSaga);
    yield takeLatest(P2P_CREATE_OFFER_FETCH, createOfferSaga);
    yield takeEvery(P2P_UPDATE_OFFER_FETCH, updateOfferSaga);
    yield takeEvery(P2P_USER_OFFER_DETAIL_FETCH, userOfferDetailSaga);
}
