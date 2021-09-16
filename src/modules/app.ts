import { combineReducers } from 'redux';
import { alertReducer  } from './public/alert';
import { changeColorThemeReducer  } from './public/colorTheme';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { fiatCurrenciesReducer } from './public/fiatCurrencies';
import { customizationReducer } from './public/customization';
import { gridLayoutReducer } from './public/gridLayout/reducer';
import { changeLanguageReducer  } from './public/i18n';
import { klineReducer  } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import {
    depthReducer,
    incrementDepthReducer,
    orderBookReducer,
} from './public/orderBook';
import { rangerReducer  } from './public/ranger/reducer';
import { recentTradesReducer  } from './public/recentTrades';
import { apiKeysReducer } from './user/apiKeys';
import { authReducer  } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { customizationUpdateReducer } from './user/customization';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { historyReducer  } from './user/history';
import {
    documentsReducer,
    identityReducer,
    labelReducer,
    phoneReducer,
} from './user/kyc';
import { newHistoryReducer } from './user/newHistory';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer  } from './user/orders';
import { ordersHistoryReducer  } from './user/ordersHistory';
import { passwordReducer  } from './user/password';
import { profileReducer  } from './user/profile';
import { userActivityReducer  } from './user/userActivity';
import { walletsReducer  } from './user/wallets';
import { withdrawLimitReducer  } from './user/withdrawLimit';
import { exchangeReducer  } from './user/Exchange';
import { merchantProfileReducer  } from './user/merchantProfile';
import { merchantKeyReducer  } from './user/merchantKey';
import { merchantWebsiteReducer  } from './user/merchantWebsite';
import { merchantPaymentsReducer  } from './user/merchantPayments';

import { p2pReducer } from './public/p2p';
import { paymentMethodReducer } from './user/paymentMethod';
import { p2pOffersReducer } from './user/p2pOffers';
import { p2pTransfersReducer } from './user/p2pTransfers';
import { p2pOrdersReducer } from './user/p2pOrders';
import { p2pDisputeReducer } from './user/p2pDispute';
import { savingsPlansReducer } from './public/savings';

export const publicReducer = combineReducers({
    colorTheme: changeColorThemeReducer,
    configs: configsReducer,
    currencies: currenciesReducer,
    fiatCurrencies: fiatCurrenciesReducer,
    customization: customizationReducer,
    recentTrades: recentTradesReducer,
    markets: marketsReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    incrementDepth: incrementDepthReducer,
    ranger: rangerReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    alerts: alertReducer,
    rgl: gridLayoutReducer,
    memberLevels: memberLevelsReducer,
    p2p: p2pReducer,
    savingsPlans: savingsPlansReducer,
});

export const userReducer = combineReducers({
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    customizationUpdate: customizationUpdateReducer,
    label: labelReducer,
    orders: ordersReducer,
    password: passwordReducer,
    profile: profileReducer,
    wallets: walletsReducer,
    phone: phoneReducer,
    identity: identityReducer,
    documents: documentsReducer,
    history: historyReducer,
    newHistory: newHistoryReducer,
    apiKeys: apiKeysReducer,
    userActivity: userActivityReducer,
    ordersHistory: ordersHistoryReducer,
    openOrders: openOrdersReducer,
    sendEmailVerification: sendEmailVerificationReducer,
    captchaKeys: getGeetestCaptchaReducer,
    withdrawLimit: withdrawLimitReducer,
    exchange: exchangeReducer,
    merchantProfile: merchantProfileReducer,
    merchantKey: merchantKeyReducer,
    merchantWebsite: merchantWebsiteReducer,
    merchantPayments: merchantPaymentsReducer,

    paymentMethod: paymentMethodReducer,
    p2pOffers: p2pOffersReducer,
    p2pTransfers: p2pTransfersReducer,
    p2pOrders: p2pOrdersReducer,
    p2pDispute: p2pDisputeReducer,
});
