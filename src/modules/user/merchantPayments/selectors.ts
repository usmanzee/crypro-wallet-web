import { RootState } from '../..';
import { MerchantPayment } from './types';

export const selectMerchantPayments = (state: RootState): MerchantPayment =>
    state.user.merchantPayments.data;

export const selectMerchantPaymentsFetching = (state: RootState): boolean =>
    state.user.merchantPayments.isFetching;
