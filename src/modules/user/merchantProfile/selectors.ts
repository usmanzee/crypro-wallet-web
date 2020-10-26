import { RootState } from '../..';
import { MerchantProfile } from './types';

export const selectMerchantData = (state: RootState): MerchantProfile =>
    state.user.merchantProfile.data;

export const selectMerchantFetching = (state: RootState): boolean =>
    state.user.merchantProfile.isFetching;
