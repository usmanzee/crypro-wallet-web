// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { constants } from "../constants";

import { merchantKeyFetch } from './merchantKeySaga';

export function* rootMerchantKeySaga() {

    yield takeEvery(constants.MERCHANT_KEY_FETCH, merchantKeyFetch);
}