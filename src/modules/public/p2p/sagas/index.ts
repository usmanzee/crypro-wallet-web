import { takeLatest } from 'redux-saga/effects';
import {
    P2P_OFFERS_FETCH,
    P2P_PAYMENT_METHODS_FETCH,
} from '../constants';
import { p2pOffersSaga } from './p2pOffersSaga';
import { p2pPaymentMethodsSaga } from './p2pPaymentMethodsSaga';

export function* rootP2PSaga() {
    yield takeLatest(P2P_OFFERS_FETCH, p2pOffersSaga);
    yield takeLatest(P2P_PAYMENT_METHODS_FETCH, p2pPaymentMethodsSaga);
}
