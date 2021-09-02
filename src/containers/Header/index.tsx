import { History } from 'history';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

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

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';

import { withStyles, Theme } from '@material-ui/core/styles';

const drawerWidth = 240;
const useStyles = (theme: Theme) => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('md')]: {
                width: `calc(100%)`,
                zIndex: theme.zIndex.drawer + 1
        }
      
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },

    subHeader: {
        backgroundColor: '#fff',
        padding: theme.spacing(1),
        color: '#000',
        zIndex: theme.zIndex.drawer + 1,
        margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`,
        [theme.breakpoints.only('xs')]: {
            margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`,
        },
    },
    toolbarDiv: {
        [theme.breakpoints.only('xs')]: {
            display: 'none'
        },
    },
    logoLink: {
        [theme.breakpoints.only('xs')]: {
            display: 'none'
        }
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
    handleDrawerToggle: () => void;
}

interface IState {
    notificationPanelEl: HTMLElement |  null;
    profilePanelEl: HTMLElement |  null;
}

const HideOnScroll = (props) => {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

class Head extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            notificationPanelEl: null,
            profilePanelEl: null,
        };
    } 

    public handleNotificationPanelClick = (event)  => {
        this.setState({
            notificationPanelEl: event.currentTarget
        });
    };
    
    public handleNotificationPanelClose = () => {
        this.setState({
            notificationPanelEl: null
        });
    };

    public handleProfilePanelClick = (event)  => {
        this.setState({
            profilePanelEl: event.currentTarget
        });
    };
    
    public handleProfilePanelClose = () => {
        this.setState({
            profilePanelEl: null
        });
    };

    public render() {
        const {mobileWallet, classes, handleDrawerToggle } = this.props;
        
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        // const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/';
        const shouldRenderHeader = window.location.pathname !== '/';
        const shouldRenderMarketToolbar = window.location.pathname.includes('/trading/') ? true : false;
    
        return (
            <React.Fragment>
            {shouldRenderHeader &&
                (
                    <>
                        {/* <HideOnScroll {...this.props}> */}
                            <AppBar position="fixed" className={classes.appBar}>
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={handleDrawerToggle}
                                        className={classes.menuButton}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Link to="/" className={classes.logoLink}>
                                        <img src={logoLight} alt="logo" style={{ width: '50px', marginRight: '24px' }}/>
                                    </Link>
                                    <NavBar />
                                </Toolbar>
                            </AppBar>
                        {/* </HideOnScroll> */}
                            {shouldRenderMarketToolbar && 
                            (
                                <>
                                    <AppBar className={classes.subHeader}>
                                        <Grid container>
                                            <Grid item md={1} style={{ marginTop: '8px' }}>
                                                {this.renderMarketToggler()}
                                            </Grid>
                                            <Grid item md={11}>
                                                <div className={classes.toolbarDiv}>
                                                    {this.renderMarketToolbar()}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </AppBar>
                                </>
                            )
                            } 
                        {/* <div className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style={{ display: 'block' }}>
                            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                                <Link className="navbar-brand brand-logo" to="/"><img src={logoLight} alt="logo" /></Link>
                            </div>
                            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                            <NavBar onLinkChange={this.closeMenu}/>
                            
                            <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                                    <span className="mdi mdi-menu"></span>
                                </button>
                            </div>
                        </div>
                        */}
                    </>
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
