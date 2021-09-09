
import { RootState } from '../../index';
import { PaymentMethodsState } from './reducer';
import { PaymentMethod } from './types';

const selectPaymentMethodsState = (state: RootState): PaymentMethodsState => state.public.paymentMethods;

export const selectPaymentMethods = (state: RootState): PaymentMethod[] =>
    selectPaymentMethodsState(state).list;

export const selectPaymentMethodsLoading = (state: RootState): boolean | undefined =>
    selectPaymentMethodsState(state).loading;
