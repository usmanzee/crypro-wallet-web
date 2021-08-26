export const PG_TITLE_PREFIX = 'B4U Wallet';

export const pgRoutes = (isLoggedIn: boolean, isLight?: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`, '/trading'],
        ['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`, '/wallet'],
        ['P2P Trade', '/p2p/offers', `p2p-trade${isLight ? 'Light' : ''}`, '/p2p/offers'],
        ['page.header.navbar.buy_sell', '/swap', `swap${isLight ? 'Light' : ''}`, '/swap'],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`, '/orders'],
        ['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`, '/history'],
    ];
    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin', `signin${isLight ? 'Light' : ''}`],
        ['page.header.signUp', '/signup', `signup${isLight ? 'Light' : ''}`],
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
    ];

    return isLoggedIn ? routes : routesUnloggedIn;
};
export const headerRoutes = (isLoggedIn: boolean, isLight?: boolean): string[][] => {
    const loggedOutroutes = [
        ['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
    ];
    const loggedoutRoutes = [
        ['page.header.navbar.signIn', '/signin', `signIn${isLight ? 'Light' : ''}`],
        ['page.header.signUp', '/signup', `signUp${isLight ? 'Light' : ''}`],
    ];

    return isLoggedIn ? loggedOutroutes : loggedoutRoutes;
};

export const profileTabs = (): string[][] => {
    const tabs = [
        ['Profile', '/profile'],
        ['Security', '/profile/security'],
        ['Identification', '/profile/identification'],
        ['Activities', '/profile/activities'],
    ];

    return tabs;
};

export const DEFAULT_CCY_PRECISION = 4;
export const STORAGE_DEFAULT_LIMIT = 50;
export const ORDER_BOOK_DEFAULT_SIDE_LIMIT = 25;
export const DEFAULT_TRADING_VIEW_INTERVAL = '15';
export const VALUATION_PRIMARY_CURRENCY = 'USD';
export const VALUATION_SECONDARY_CURRENCY = 'BTC';
export const DEFAULT_WALLET_CURRENCY = 'BTC';


export const MOON_PAY_URL = 'https://buy-staging.moonpay.io';
export const MOON_PAY_PUBLIC_KEY = 'pk_test_4tW5NgbaBAFE8nhJKXt3razQZqVnL1Ul';

export const PASSWORD_ENTROPY_STEP = 6;

export const GLOBAL_PLATFORM_CURRENCY = 'USDT';
export const DEFAULT_TABLE_PAGE_LIMIT = 25;

export const colors = {
    light: {
        chart: {
            primary: '#fff',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            sun: 'var(--icons)',
            moon: 'var(--primary-text-color)',
        },
        orderBook: {
            asks: 'var(--asks-level-4)',
            bids: 'var(--bids-level-4)',
        },
        depth: {
            fillAreaAsk: '#fa5252',
            fillAreaBid: '#12b886',
            gridBackgroundStart: '#1a243b',
            gridBackgroundEnd: '#1a243b',
            strokeAreaAsk: '#fa5252',
            strokeAreaBid: '#12b886',
            strokeGrid: '#B8E9F5',
            strokeAxis: '#cccccc',
        },
    },
    basic: {
        chart: {
            primary: 'var(--rgb-body-background-color)',
            up: 'var(--rgb-bids)',
            down: 'var(--rgb-asks)',
        },
        navbar: {
            sun: 'var(--primary-text-color)',
            moon: 'var(--icons)',
        },
        orderBook: {
            asks: 'var(--asks-level-4)',
            bids: 'var(--bids-level-4)',
        },
        depth: {
            fillAreaAsk: 'var(--rgb-asks)',
            fillAreaBid: 'var(--rgb-bids)',
            gridBackgroundStart: 'var(--rgb-asks)',
            gridBackgroundEnd: 'var(--rgb-asks)',
            strokeAreaAsk: 'var(--rgb-asks)',
            strokeAreaBid: 'var(--rgb-bids)',
            strokeGrid: 'var(--rgb-secondary-contrast-cta-color)',
            strokeAxis: 'var(--rgb-primary-text-color)',
        },
    },
};
