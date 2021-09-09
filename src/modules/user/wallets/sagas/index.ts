// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    WALLETS_ADDRESS_FETCH,
    WALLETS_FETCH,
    WALLETS_WITHDRAW_CCY_FETCH,
    SAVINGS_WALLETS_FETCH,
    P2P_WALLETS_FETCH
} from '../constants';
import { walletsAddressSaga } from './walletsAddressSaga';
import { walletsSaga } from './walletsSaga';
import { savingsWalletsSaga } from './savingsWalletsSaga';
import { p2pWalletsSaga } from './p2pWalletsSaga';
import { walletsWithdrawCcySaga } from './walletsWithdrawSaga';

export function* rootWalletsSaga() {
    yield takeEvery(WALLETS_FETCH, walletsSaga);
    yield takeEvery(SAVINGS_WALLETS_FETCH, savingsWalletsSaga);
    yield takeEvery(P2P_WALLETS_FETCH, p2pWalletsSaga);
    yield takeEvery(WALLETS_ADDRESS_FETCH, walletsAddressSaga);
    yield takeEvery(WALLETS_WITHDRAW_CCY_FETCH, walletsWithdrawCcySaga);
}
