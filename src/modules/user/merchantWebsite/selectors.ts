import { RootState } from '../..';
import { MerchantWebsite } from './types';

export const selectMerchantWebsite = (state: RootState): MerchantWebsite =>
    state.user.merchantWebsite.data;

export const selectMerchantWebsiteFetching = (state: RootState): boolean =>
    state.user.merchantWebsite.isFetching;
