// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { constants } from "../constants";

import { merchantProfileFetch } from './merchantProfileSaga';

export function* rootMerchantProfileSaga() {

    yield takeEvery(constants.MERCHANT_PROFILE_FETCH, merchantProfileFetch);
}
