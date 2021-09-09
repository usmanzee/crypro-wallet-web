// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { p2pWalletsData, p2pWalletsError } from '../actions';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* p2pWalletsSaga() {
    try {
        const savingAccounts = yield call(API.get(walletsOptions), '/account/balances?account_type=p2p');
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');

        const p2pAccountsByCurrencies = currencies.map(currency => {
            let p2pAccountsInfo = savingAccounts.find(wallet => wallet.currency === currency.id);

            if (!p2pAccountsInfo) {
                p2pAccountsInfo = {
                    currency: currency.id,
                };
            }

            return ({
                ...p2pAccountsInfo,
                walletType: p2pAccountsInfo.account_type,
                name: currency.name,
                explorerTransaction: currency!.explorer_transaction,
                explorerAddress: currency!.explorer_address,
                fee: currency!.withdraw_fee,
                type: currency!.type,
                fixed: currency!.precision,
                iconUrl: currency.icon_url,
                depositEnabled: currency.deposit_enabled,
                withdrawEnabled: currency.withdrawal_enabled,
                precision: currency.precision,
                swapFee: currency.swap_fee,
                minSwapAmount: currency.min_swap_amount,
                maxSwapAmount: currency.max_swap_amount
                
            });
        });

        yield put(p2pWalletsData(p2pAccountsByCurrencies));
    } catch (error) {
        yield put(p2pWalletsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
