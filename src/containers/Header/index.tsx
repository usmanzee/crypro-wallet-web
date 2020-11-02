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

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import Popover from '@material-ui/core/Popover';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';

const drawerWidth = 240;
const useStyles = (theme: Theme) => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
          flexShrink: 0,
        },
      },
      appBar: {
        [theme.breakpoints.up('sm')]: {
          width: `calc(100%)`,
          // marginLeft: drawerWidth,
          zIndex: theme.zIndex.drawer + 1
        }
      
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
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
        margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`,
        [theme.breakpoints.only('xs')]: {
            margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`,
        },
    },
    toolbarDiv: {
        [theme.breakpoints.only('xs')]: {
            display: 'none'
        },
    }
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

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

class Head extends React.Component<Props> {

    public render() {
        const {mobileWallet, classes, handleDrawerToggle } = this.props;
        
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/';
        const shouldRenderMarketToolbar = window.location.pathname.includes('/trading/') ? true : false;
    
        return (
            <React.Fragment>
            {shouldRenderHeader &&
                (
                    <>
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
                                <Typography variant="h6" className={classes.title}>
                                    B4U Wallet
                                </Typography>
                                <div>
                                    <List style={{ display: 'flex' }}>
                                        <ListItem button>
                                            <ListItemText primary='list1' />
                                        </ListItem>
                                        <ListItem button>
                                            <ListItemText primary='list2' />
                                        </ListItem>
                                        <ListItem button>
                                            <ListItemText primary='list3' />
                                        </ListItem>
                                        {/* <ListItem button onClick={(e) => handleNotificationPanelClick(e)}>
                                            <NotificationsNoneIcon />
                                        </ListItem> */}
                                        {/* <ListItem button>
                                            <Button aria-describedby={notificationPanelId} variant="contained" onClick={handleNotificationPanelClick}>
                                                Open
                                            </Button>
                                        </ListItem> */}
                                    </List>
                                </div>
                            </Toolbar>
                        </AppBar>
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
                        {shouldRenderMarketToolbar && 
                        (
                            <>
                                <Paper className={classes.subHeader} elevation={1} style={{ display: 'block' }}>
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
                                </Paper>
                            </>
                        )
                        } */}
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
