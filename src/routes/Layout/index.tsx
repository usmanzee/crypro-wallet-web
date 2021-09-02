import { History } from 'history';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { minutesUntilAutoLogout, sessionCheckInterval } from '../../api';
import { ExpiredSessionModal } from '../../components';
import { WalletsFetch } from '../../containers';
import { toggleColorTheme } from '../../helpers';
//import loadable from '@loadable/component';
// Material UI Components
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, Theme } from '@material-ui/core/styles';
//Material UI Components END

import {
    configsFetch,
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    toggleChartRebuild,
    User,
    userFetch,
    walletsReset,
} from '../../modules';
import {
    CustomizationDataInterface,
    customizationFetch,
    selectCustomizationData,
} from '../../modules/public/customization';
import {
    ChangeForgottenPasswordScreen,
    ConfirmScreen,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    HistoryScreen,
    LandingScreen,
    MasspayScreen,
    OrdersTabScreen,
    ProfileScreen,
    ProfileTwoFactorAuthScreen,
    SignInScreen,
    SignUpScreen,
    TradingScreen,
    VerificationScreen,
    WalletsScreen,
    FeeScreen,
    DepositCryptoScreen,
    DepositFiatScreen,
    WithdrawCryptoScreen,
    WithdrawFiatScreen,
    SwapScreen,
    MerchantScreen,
    BuyCryptoScreen,
    P2POffersScreen,
    P2PAdvertiserDetailScreen,
    ExpressOfferScreen,
    P2PFiatOrderDetailScreen,
    P2PPostAdScreen,
    AddP2PPaymentMethodScreen,
    P2PMyAdsScreen,
    P2PMyOrdersScreen,
    SavingsOffersScreen
} from '../../screens';

// const ChangeForgottenPasswordScreen = loadable(() => import('../../screens/ChangeForgottenPasswordScreen'));
// const ConfirmScreen = loadable(() => import('../../screens/ConfirmScreen'));
// const EmailVerificationScreen = loadable(() => import('../../screens/EmailVerification'));
// const ForgotPasswordScreen = loadable(() => import('../../screens/ForgotPassword'));
// const HistoryScreen = loadable(() => import('../../screens/History'));
// const LandingScreen = loadable(() => import('../../screens/LandingScreen'));
// const OrdersTabScreen = loadable(() => import('../../screens/OrdersTabScreen'));
// const ProfileScreen = loadable(() => import('../../screens/ProfileScreen'));
// const ProfileTwoFactorAuthScreen = loadable(() => import('../../screens/ProfileTwoFactorAuthScreen'));
// const SignInScreen = loadable(() => import('../../screens/SignInScreen'));
// const SignUpScreen = loadable(() => import('../../screens/SignUpScreen'));
// const TradingScreen = loadable(() => import('../../screens/TradingScreen'));
// const VerificationScreen = loadable(() => import('../../screens/VerificationScreen'));
// const WalletsScreen = loadable(() => import('../../screens/WalletsScreen'));
interface ReduxProps {
    colorTheme: string;
    currentMarket?: Market;
    customization?: CustomizationDataInterface;
    user: User;
    isLoggedIn: boolean;
    userLoading?: boolean;
}

interface DispatchProps {
    fetchConfigs: typeof configsFetch;
    fetchCustomization: typeof customizationFetch;
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
}

interface OwnProps {
    history: History;
}

interface LayoutState {
    isShownExpSessionModal: boolean;
}

const useStyles = (theme: Theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        minHeight: 'calc(100vh - 95px)'
        // margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`,
    },
    loader: {
        position: 'absolute', 
        top: '40%'
    }
});

export type LayoutProps = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;

const renderLoader = () => (
    <>
    <div className="pg-loader-container">
        {/* <Spinner className="pg-loader-container__loader" animation="border" variant="primary"/> */}
        <CircularProgress className="pg-loader-container__loader" />
    </div>
    </>
);

const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    const renderCustomerComponent = props => <CustomComponent {...props} />;

    if (isLogged) {
        return <Route {...rest} render={renderCustomerComponent} />;
    }

    return (
        <Route {...rest}>
            <Redirect to={'/signin'} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged) {
        return <Route {...rest}><Redirect to={'/wallets'} /></Route>;
    }

    const renderCustomerComponent = props => <CustomComponent {...props} />;

    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
    public static eventsListen = [
        'click',
        'keydown',
        'scroll',
        'resize',
        'mousemove',
        'TabSelect',
        'TabHide',
    ];

    public timer;
    public walletsFetchInterval;

    constructor(props: LayoutProps) {
        super(props);
        this.initListener();

        this.state = {
            isShownExpSessionModal: false,
        };
    }

    public componentDidMount() {
        this.props.fetchConfigs();
        this.props.userFetch();
        this.initInterval();
        this.check();
    }

    public componentDidUpdate(prevProps: LayoutProps) {
        const { customization, isLoggedIn, history } = this.props;

        if (!isLoggedIn && prevProps.isLoggedIn) {
            this.props.walletsReset();
            if (!history.location.pathname.includes('/trading')) {
                history.push('/trading/');
            }
        }

        if (customization && customization !== prevProps.customization) {
            this.handleApplyCustomization(customization);
        }
    }

    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});

    public render() {
        const {
            colorTheme,
            isLoggedIn,
            userLoading,
            classes,
        } = this.props;
        const { isShownExpSessionModal } = this.state;

        // const tradingCls = window.location.pathname.includes('/trading') ? 'trading-layout' : '';
        toggleColorTheme(colorTheme);

        return (
            <>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Switch>
                            <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                            <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/confirmation" component={VerificationScreen} />
                            <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />
                            <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/forgot_password" component={ForgotPasswordScreen} />
                            <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/password_reset" component={ChangeForgottenPasswordScreen} />
                            <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/email-verification" component={EmailVerificationScreen} />
                            <Route exact={true} path="/trading/:market?" component={TradingScreen} />
                            <Route exact={true} path="/" component={LandingScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersTabScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history" component={HistoryScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/:tabName/:paymentName/:paymentMethodId" component={AddP2PPaymentMethodScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/:tabName/:paymentName" component={ProfileScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/:tabName" component={ProfileScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:tabName" component={WalletsScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallet/deposit/crypto/:currency?" component={DepositCryptoScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallet/deposit/fiat/:currency?" component={DepositFiatScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallet/withdraw/crypto/:currency?" component={WithdrawCryptoScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallet/withdraw/fiat/:currency?" component={WithdrawFiatScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/swap" component={SwapScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/masspay" component={MasspayScreen} />
                            <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/security/2fa" component={ProfileTwoFactorAuthScreen} />
                            <Route path="/fee" component={FeeScreen} />
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/merchant" component={MerchantScreen}/>
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/buy-crypto" component={BuyCryptoScreen}/>
                            <Route exact path="/p2p/offers" component={P2POffersScreen}/>
                            <Route exact path="/p2p/offers/:side" component={P2POffersScreen}/>
                            <Route exact path="/p2p/offers/:side/:currency" component={P2POffersScreen}/>
                            <Route exact path="/p2p/advertiserDetail/:id" component={P2PAdvertiserDetailScreen}/>

                            <Route exact path="/p2p/quick-trade" component={ExpressOfferScreen}/>
                            <Route exact path="/p2p/quick-trade/:side" component={ExpressOfferScreen}/>
                            <Route exact path="/p2p/quick-trade/:side/:currency" component={ExpressOfferScreen}/>
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/p2p/fiat-order/:id" component={P2PFiatOrderDetailScreen}/>
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/p2p/post-ad" component={P2PPostAdScreen}/>
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/p2p/my-ads" component={P2PMyAdsScreen}/>
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/p2p/my-orders" component={P2PMyOrdersScreen}/>
                            <PrivateRoute exact loading={userLoading} isLogged={isLoggedIn} path="/savings" component={SavingsOffersScreen}/>
                            <Route path="**"><Redirect to="/trading/" /></Route>
                        </Switch>
                        {isLoggedIn && <WalletsFetch/>}
                        {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
                    </main>
            </>
        );
    }

    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
        }

        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    private initListener = () => {
        this.reset();
        for (const type of LayoutComponent.eventsListen) {
            document.body.addEventListener(type, this.reset);
        }
    };

    private reset = () => {
        this.setLastAction(Date.now());
    };

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, parseFloat(sessionCheckInterval()));
    };

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
        if (isTimeout && user.email) {
            if (user.state === 'active') {
                this.handleChangeExpSessionModalState();
            }

            this.props.logout();
        }
    };

    private handleSubmitExpSessionModal = () => {
        const { history } = this.props;
        this.handleChangeExpSessionModalState();
        history.push('/signin');
    };

    private handleRenderExpiredSessionModal = () => (
        <ExpiredSessionModal
            title={this.translate('page.modal.expired.title')}
            buttonLabel={this.translate('page.modal.expired.submit')}
            handleChangeExpSessionModalState={this.handleChangeExpSessionModalState}
            handleSubmitExpSessionModal={this.handleSubmitExpSessionModal}
        />
    );

    private handleChangeExpSessionModalState = () => {
        this.setState({
            isShownExpSessionModal: !this.state.isShownExpSessionModal,
        });
    };

    private handleApplyCustomization = (customization: CustomizationDataInterface) => {
        const rootElement = document.documentElement;
        const parsedSettings = customization && customization.settings ? JSON.parse(customization.settings) : null;

        if (rootElement && parsedSettings && parsedSettings.theme_colors) {
            parsedSettings.theme_colors.reduce((result, item) => {
                const newItemColor = item.value;

                if (newItemColor) {
                    rootElement.style.setProperty(item.key, item.value);
                }

                return result;
            }, {});

            this.props.toggleChartRebuild();
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    customization: selectCustomizationData(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    userLoading: selectUserFetching(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchConfigs: () => dispatch(configsFetch()),
    fetchCustomization: () => dispatch(customizationFetch()),
    logout: () => dispatch(logoutFetch()),
    toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
});

// tslint:disable-next-line no-any
const Layout = injectIntl(withStyles(useStyles as {})(withRouter(connect(mapStateToProps, mapDispatchToProps)(LayoutComponent) as any) as any));

export {
    Layout,
};
