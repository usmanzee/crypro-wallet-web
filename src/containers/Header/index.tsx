import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
//import { LogoIcon } from '../../assets/images/LogoIcon';
//import ReactNotificationCenter from 'react-notification-center';

import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMarketSelectorState,
    selectMobileWalletUi,
    selectSidebarState,
    setMobileWalletUi,
    toggleMarketSelector,
    toggleSidebar
} from '../../modules';
import logoLight from '../../assets/images/logo.png';
import { HeaderToolbar } from '../HeaderToolbar';
import { NavBar } from '../NavBar';

import { createStyles, withStyles, Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = theme => ({
    subHeader: {
        backgroundColor: '#fff',
        padding: theme.spacing(1),
        color: '#000',
        margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`,
        // [theme.breakpoints.only('lg')]: {
        //     backgroundColor: 'yellow',
        // },
        // [theme.breakpoints.only('md')]: {
        //     backgroundColor: 'red',
        // },
        // [theme.breakpoints.only('sm')]: {
        //     backgroundColor: 'white',
        // },
        [theme.breakpoints.only('xs')]: {
            margin: `${theme.spacing(12)}px 0px ${theme.spacing(1)}px`,
        },
      },
});


interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    mobileWallet: string;
    sidebarOpened: boolean;
    marketSelectorOpened: boolean;
}


interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleSidebar: typeof toggleSidebar;
    toggleMarketSelector: typeof toggleMarketSelector;
}

interface HistoryProps {
    history: History;
}

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

class Head extends React.Component<Props> {

    public render() {
        const {mobileWallet, classes } = this.props;
        
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/';
        const shouldRenderMarketToolbar = window.location.pathname.includes('/trading/') ? true : false;
    
        return (
            <React.Fragment>
            {shouldRenderHeader &&
                (
                    <>
                        <div className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style={{ display: 'block' }}>
                            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                                <Link className="navbar-brand brand-logo" to="/"><img src={logoLight} alt="logo" /></Link>
                                {/* <Link className="navbar-brand brand-logo-mini" to="/"><img src={logoLight} alt="logo" /></Link> */}
                            </div>
                            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                                <NavBar onLinkChange={this.closeMenu}/>
                                {/* Menu Opener for Mobile */}
                                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                                    <span className="mdi mdi-menu"></span>
                                </button>
                            </div>
                        </div>
                        {shouldRenderMarketToolbar && 
                        (
                            <>
                                <Paper className={classes.subHeader} elevation={1} style={{ display: 'block' }}>
                                    <Grid container>
                                        <Grid item md={1} style={{ marginTop: '8px' }}>
                                            {this.renderMarketToggler()}
                                        </Grid>
                                        <Grid item md={11}>
                                            {this.renderMarketToolbar()}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </>
                        )
                        }
                    </>
                    // <header className={`pg-header`}>
                    //     <div className={`pg-container pg-header__content ${tradingCls}`}>
                    //         <div
                    //             className={`pg-sidebar__toggler ${mobileWallet && 'pg-sidebar__toggler-mobile'}`}
                    //             onClick={this.openSidebar}
                    //         >
                    //             <span className="pg-sidebar__toggler-item"/>
                    //             <span className="pg-sidebar__toggler-item"/>
                    //             <span className="pg-sidebar__toggler-item"/>
                    //         </div>
                    //         <div onClick={e => this.redirectToLanding()} className="pg-header__logo">
                    //             <div className="pg-logo">
                    //                 <img src={logoLight} className="pg-logo__img" alt="Logo" />
                    //                 {/* <LogoIcon className="pg-logo__img" /> */}
                    //             </div>
                    //         </div>
                    //         {this.renderMarketToggler()}
                    //         <div className="pg-header__location">
                    //             {mobileWallet ? <span>{mobileWallet}</span> : <span>{window.location.pathname.split('/')[1]}</span>}
                    //         </div>
                    //         {this.renderMobileWalletNav()}
                    //         <div className="pg-header__navbar">
                    //             {this.renderMarketToolbar()}
                    //             <NavBar onLinkChange={this.closeMenu}/>
                    //         </div>
                    //     </div>
                    // </header>
                )
                }
          </React.Fragment>
        );
    }

    public renderMobileWalletNav = () => {
        const {  mobileWallet } = this.props;
        //const isLight = colorTheme === 'light' ? 'Light' : '';

        return mobileWallet && (
            <div onClick={this.backWallets} className="pg-header__toggler">
                <img alt="" src={require(`./back.svg`)} />
            </div>
        );
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    private renderMarketToolbar = () => {
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return <HeaderToolbar/>;
    };

    private renderMarketToggler = () => {
        const { currentMarket, marketSelectorOpened } = this.props;
        //const isLight = colorTheme === 'light';
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return (
            <div className="pg-header__market-selector-toggle" onClick={this.props.toggleMarketSelector}>
                <p className="pg-header__market-selector-toggle-value">
                    {currentMarket && currentMarket.name}
                </p>
                {marketSelectorOpened ? (
                    <img src={require(`./arrows/arrowBottom.svg`)} alt="arrow"/>
                ) : (
                    <img src={require(`./arrows/arrowRight.svg`)} alt="arrow"/>
                )}
            </div>
        );
    };

    private redirectToLanding = () => {
        this.props.toggleSidebar(false);
        this.props.history.push('/');
    };

    private openSidebar = () => this.props.toggleSidebar(!this.props.sidebarOpened);

    private backWallets = () => this.props.setMobileWalletUi('');

    private closeMenu = (e: any) => this.props.setMobileWalletUi('');
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    mobileWallet: selectMobileWalletUi(state),
    sidebarOpened: selectSidebarState(state),
    marketSelectorOpened: selectMarketSelectorState(state),
    
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    });

const Header = injectIntl(withStyles(useStyles as {})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Head) as any)));
export {
    Header,
};
