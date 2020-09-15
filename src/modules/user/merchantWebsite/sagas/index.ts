// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { constants } from "../constants";

import { merchantWebsiteFetch } from './merchantWebsiteSaga';
import { merchantWebsiteUpdateSaga } from './merchantWebsiteUpdateSaga';

export function* rootMerchantWebsiteSaga() {

    yield takeEvery(constants.MERCHANT_WEBSITE_FETCH, merchantWebsiteFetch);
    yield takeEvery(constants.MERCHANT_WEBSITE_UPDATE, merchantWebsiteUpdateSaga);
}
