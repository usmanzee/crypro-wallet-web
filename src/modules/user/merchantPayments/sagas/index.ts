// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { constants } from "../constants";

import { merchantProfileFetch } from './merchantPaymentSaga';

export function* rootMerchantPaymentsSaga() {

    yield takeEvery(constants.MERCHANT_PAYMENTS_FETCH, merchantProfileFetch);
}
