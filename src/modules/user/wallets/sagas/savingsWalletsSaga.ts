// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { savingsWalletsData, savingsWalletsError } from '../actions';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* savingsWalletsSaga() {
    try {
        const savingAccounts = yield call(API.get(walletsOptions), '/account/balances?account_type=saving');
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');

        const savingAccountsByCurrencies = currencies.map(currency => {
            let savingAccountsInfo = savingAccounts.find(wallet => wallet.currency === currency.id);

            if (!savingAccountsInfo) {
                savingAccountsInfo = {
                    currency: currency.id,
                };
            }

            return ({
                ...savingAccountsInfo,
                walletType: savingAccountsInfo.account_type,
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

        yield put(savingsWalletsData(savingAccountsByCurrencies));
    } catch (error) {
        yield put(savingsWalletsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
