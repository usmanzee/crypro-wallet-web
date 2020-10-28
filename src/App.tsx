import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { RootState } from './modules';
import { languageMap } from './translations';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "rgb(111 33 88)",
      }
    },
    typography: {    
        fontSize: 16,
    },
  });
  

interface AppProps {
    history: History;
}

interface ReduxProps {
    lang: string;
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

type Props = AppProps & ReduxProps;

const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const CustomizationContainer = React.lazy(() => import('./containers/Customization').then(({ Customization }) => ({ default: Customization })));
const FooterContainer = React.lazy(() => import('./containers/Footer').then(({ Footer }) => ({ default: Footer })));
const HeaderContainer = React.lazy(() => import('./containers/Header').then(({ Header }) => ({ default: Header })));
const SidebarContainer = React.lazy(() => import('./containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
const TradingToolbarContainer = React.lazy(() => import('./containers/TradingToolbar').then(({ TradingToolbar }) => ({ default: TradingToolbar })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

class AppLayout extends React.Component<Props, {}, {}> {
    public componentDidMount() {
        ReactGA.pageview(history.location.pathname);
    }

    public render() {
        const { lang } = this.props;
        const shouldRenderMarketToolbar = window.location.pathname.includes('/trading/') ? true : false;
        return (
            <IntlProvider locale={lang} messages={languageMap[lang]} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            <div className="container-scroller">
                                <HeaderContainer/>
                                {/* {shouldRenderMarketToolbar && <TradingToolbarContainer />} */}
                                <div className="container-fluid page-body-wrapper">
                                    <SidebarContainer/>
                                    <CustomizationContainer/>
                                    <AlertsContainer/>
                                    <LayoutContainer/>
                                </div>
                                <FooterContainer/>
                            </div>
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
    });

// tslint:disable-next-line:no-any
export const App = connect(mapStateToProps)(AppLayout) as any;
