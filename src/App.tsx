import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { 
    RootState, 
    selectUserLoggedIn
} from './modules';
import { languageMap } from './translations';
import CssBaseline from '@material-ui/core/CssBaseline';

interface AppProps {
    history: History;
}

interface ReduxProps {
    lang: string;
    isLoggedIn: boolean;
}

const gaKey = gaTrackerKey();
const history = createBrowserHistory();

if (gaKey) {
    ReactGA.initialize(gaKey);
    history.listen(location => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}
interface IState {
    mobileOpen: boolean;
}

type Props = AppProps & ReduxProps;

const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const CustomizationContainer = React.lazy(() => import('./containers/Customization').then(({ Customization }) => ({ default: Customization })));
const FooterContainer = React.lazy(() => import('./containers/Footer').then(({ Footer }) => ({ default: Footer })));
const HeaderContainer = React.lazy(() => import('./containers/Header').then(({ Header }) => ({ default: Header })));
const SidebarContainer = React.lazy(() => import('./containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
const TradingToolbarContainer = React.lazy(() => import('./containers/TradingToolbar').then(({ TradingToolbar }) => ({ default: TradingToolbar })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

class AppLayout extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
           mobileOpen: false,
        };
    }
    public componentDidMount() {
        ReactGA.pageview(history.location.pathname);
    }

    public handleDrawerToggle = () => {
        this.setState({
            mobileOpen: !this.state.mobileOpen
        });
    };


    public render() {
        const { lang } = this.props;
        const { mobileOpen } = this.state;
        const shouldRenderMarketToolbar = window.location.pathname.includes('/trading/') ? true : false;
        return (
            <IntlProvider locale={lang} messages={languageMap[lang]} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            <div style={{ display: 'flex' }}>
                                <CssBaseline />
                                <HeaderContainer 
                                    handleDrawerToggle = {this.handleDrawerToggle} 
                                />
                                    <SidebarContainer
                                        mobileOpen = {mobileOpen} 
                                        handleDrawerToggle = {this.handleDrawerToggle} 
                                    />
                                    <CustomizationContainer/>
                                    <AlertsContainer/>
                                    <LayoutContainer/>
                            </div>
                            <FooterContainer/>
                        </React.Suspense>
                    </ErrorWrapper>
                </Router>
            </IntlProvider>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        lang: state.public.i18n.lang,
        isLoggedIn: selectUserLoggedIn(state),
    });

// tslint:disable-next-line:no-any
export const App = connect(mapStateToProps)(AppLayout) as any;
