// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { walletsData, walletsError } from '../actions';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsSaga() {
    try {
        const accounts = yield call(API.get(walletsOptions), '/account/balances');
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');

        const accountsByCurrencies = currencies.map(currency => {
            let walletInfo = accounts.find(wallet => wallet.currency === currency.id);

            if (!walletInfo) {
                walletInfo = {
                    currency: currency.id,
                };
            }

            return ({
                ...walletInfo,
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

        // const cryptoAccountsByCurrencies = accountsByCurrencies.filter((account) => {
        //     return account.type === 'coin'
        // })

        yield put(walletsData(accountsByCurrencies));
    } catch (error) {
        yield put(walletsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
