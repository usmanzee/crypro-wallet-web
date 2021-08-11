import { combineReducers } from 'redux';
// tslint:disable-next-line no-submodule-imports
import { all, call } from 'redux-saga/effects';
import { publicReducer, userReducer } from './app';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { ColorThemeState } from './public/colorTheme';
import { ConfigsState, rootConfigsSaga } from './public/configs';
import { CurrenciesState, rootCurrenciesSaga } from './public/currencies';
import { CustomizationState, rootCustomizationSaga } from './public/customization';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';
import {
    DepthIncrementState,
    DepthState,
    OrderBookState,
    rootOrderBookSaga,
} from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { CustomizationUpdateState, rootCustomizationUpdateSaga } from './user/customization';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { HistoryState, rootHistorySaga } from './user/history';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { NewHistoryState, rootNewHistorySaga } from './user/newHistory';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { rootWalletsSaga, WalletsState } from './user/wallets';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';
import { rootExchangeSaga, ExchangeState } from './user/Exchange';
import { MerchanProfileState,  rootMerchantProfileSaga} from './user/merchantProfile';
import { MerchantKeyState, rootMerchantKeySaga } from './user/merchantKey';
import { MerchantWebsiteState, rootMerchantWebsiteSaga } from './user/merchantWebsite';
import { MerchantPaymentsState, rootMerchantPaymentsSaga } from './user/merchantPayments';

import { P2PState, rootP2PSaga } from './public/p2p';
import { PaymentMethodState, rootPaymentMethodSaga } from './user/paymentMethod';
import { P2POffersState, rootP2POffersSaga } from './user/p2pOffers';
import { P2PTransfersState, rootP2PTransfersSaga } from './user/p2pTransfers';
import { P2POrdersState, rootP2POrdersSaga } from './user/p2pOrders';
import { P2PDisputeState, rootP2PDisputeSaga } from './user/p2pDispute';

export * from './public/markets';
export * from './public/orderBook';
export * from './public/colorTheme';
export * from './public/configs';
export * from './public/currencies';
export * from './public/customization';
export * from './public/i18n';
export * from './public/kline';
export * from './public/alert';
export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/customization';
export * from './user/wallets';
export * from './user/profile';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/userActivity';
export * from './user/history';
export * from './user/newHistory';
export * from './user/kyc';
export * from './user/emailVerification';
export * from './user/withdrawLimit';
export * from './public/memberLevels';
export * from './user/Exchange';

export * from './user/merchantProfile';
export * from './user/merchantKey';
export * from './user/merchantWebsite';
export * from './user/merchantPayments';

export * from './public/p2p';
export * from './user/paymentMethod';
export * from './user/p2pOffers';
export * from './user/p2pOrders';
export * from './user/p2pTransfers';
export * from './user/p2pDispute';

export interface RootState {
    public: {
        colorTheme: ColorThemeState;
        configs: ConfigsState;
        currencies: CurrenciesState;
        customization: CustomizationState;
        recentTrades: RecentTradesState;
        markets: MarketsState;
        orderBook: OrderBookState;
        depth: DepthState;
        incrementDepth: DepthIncrementState;
        ranger: RangerState;
        i18n: LanguageState;
        alerts: AlertState;
        kline: KlineState;
        rgl: GridLayoutState;
        memberLevels: MemberLevelsState;

        p2p: P2PState;
    };
    user: {
        auth: AuthState;
        beneficiaries: BeneficiariesState;
        customizationUpdate: CustomizationUpdateState;
        orders: OrdersState;
        password: PasswordState;
        profile: ProfileState;
        label: LabelState;
        wallets: WalletsState;
        documents: DocumentsState;
        identity: IdentityState;
        phone: PhoneState;
        history: HistoryState;
        newHistory: NewHistoryState;
        apiKeys: ApiKeysState;
        userActivity: UserActivityState;
        ordersHistory: OrdersHistoryState;
        openOrders: OpenOrdersState;
        sendEmailVerification: EmailVerificationState;
        captchaKeys: GeetestCaptchaState;
        withdrawLimit: WithdrawLimitState;
        exchange: ExchangeState;
        merchantProfile: MerchanProfileState;
        merchantKey: MerchantKeyState;
        merchantWebsite: MerchantWebsiteState;
        merchantPayments: MerchantPaymentsState;

        paymentMethod: PaymentMethodState;
        p2pOffers: P2POffersState;
        p2pTransfers: P2PTransfersState;
        p2pOrders: P2POrdersState;
        p2pDispute: P2PDisputeState;
    };
}

export const rootReducer = combineReducers({
    public: publicReducer,
    user: userReducer,
});

export function* rootSaga() {
    yield all([
        call(rootApiKeysSaga),
        call(rootAuthSaga),
        call(rootBeneficiariesSaga),
        call(rootConfigsSaga),
        call(rootCurrenciesSaga),
        call(rootCustomizationSaga),
        call(rootCustomizationUpdateSaga),
        call(rootEmailVerificationSaga),
        call(rootGeetestCaptchaSaga),
        call(rootHandleAlertSaga),
        call(rootHistorySaga),
        call(rootKlineFetchSaga),
        call(rootLabelSaga),
        call(rootMarketsSaga),
        call(rootMemberLevelsSaga),
        call(rootNewHistorySaga),
        call(rootOpenOrdersSaga),
        call(rootOrderBookSaga),
        call(rootOrdersHistorySaga),
        call(rootOrdersSaga),
        call(rootPasswordSaga),
        call(rootProfileSaga),
        call(rootRecentTradesSaga),
        call(rootSendCodeSaga),
        call(rootSendDocumentsSaga),
        call(rootSendIdentitySaga),
        call(rootUserActivitySaga),
        call(rootWalletsSaga),
        call(rootWithdrawLimitSaga),
        call(rootExchangeSaga),
        call(rootMerchantProfileSaga),
        call(rootMerchantKeySaga),
        call(rootMerchantWebsiteSaga),
        call(rootMerchantPaymentsSaga),

        call(rootP2PSaga),
        call(rootPaymentMethodSaga),
        call(rootP2POffersSaga),
        call(rootP2POrdersSaga),
        call(rootP2PTransfersSaga),
        call(rootP2PDisputeSaga),
    ]);
}
