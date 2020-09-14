import { RootState } from '../..';
import { MerchantKey } from './types';

export const selectMerchantKey = (state: RootState): MerchantKey =>
    state.user.merchantKey.data

export const selectMerchantKeyFetching = (state: RootState): boolean =>
    state.user.merchantKey.isFetching;
