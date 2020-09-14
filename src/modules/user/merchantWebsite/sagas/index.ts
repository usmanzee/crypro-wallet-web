// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { constants } from "../constants";

import { merchantWebsiteFetch } from './merchantWebsiteSaga';

export function* rootMerchantWebsiteSaga() {

    yield takeEvery(constants.MERCHANT_WEBSITE_FETCH, merchantWebsiteFetch);
}
