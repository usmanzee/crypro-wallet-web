import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Dropdown } from 'react-bootstrap';
import { InjectedIntlProps, FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { languages } from '../../api/config';
import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
import { SidebarIcons } from '../../assets/images/sidebar/SidebarIcons';
import { pgRoutes } from '../../constants';

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
import { withStyles, Theme } from '@material-ui/core/styles';

import {
    changeLanguage,
    changeUserDataFetch,
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectSidebarState,
    selectUserInfo,
    selectUserLoggedIn,
    toggleSidebar,
    User,
} from '../../modules';

const drawerWidth = 240;
const useStyles = (theme: Theme) => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
          flexShrink: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    drawerNone: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
    },
    drawerLink: {
        textDecoration: 'none',
        color: '#000',
        "&:hover": {
            color: '#000',
        }
    },
    drawerActiveLink: {
        textDecoration: 'none',
        color: '#000',
        background: 'rgb(250, 250, 250)',
        "&:hover": {
            color: '#000',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '0rem',
          bottom: 0,
          background: 'rgb(111 33 88)',
          width: '5px',
          margin: `${theme.spacing(1)}px 0px`
        }
    }
});


interface State {
    isOpenLanguage: boolean;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
    toggleSidebar: typeof toggleSidebar;
    logoutFetch: typeof logoutFetch;
}

interface ReduxProps {
    lang: string;
    colorTheme: string;
    isLoggedIn: boolean;
    currentMarket: Market | undefined;
    isActive: boolean;
    user: User;
}

interface OwnProps {
    onLinkChange?: () => void;
    history: History;
    changeUserDataFetch: typeof changeUserDataFetch;
    classes?: any;

    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps & InjectedIntlProps;

class SidebarContainer extends React.Component<Props, State> {
    public state = {
        isOpenLanguage: false,
    };

    public render() {
        const { classes, mobileOpen, handleDrawerToggle } = this.props;
        const showSidebar = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/' && !window.location.pathname.includes('/trading');
    
        return (
            <>
                    <nav className={showSidebar ? classes.drawer : classes.drawerNone}>
                        <Hidden smUp implementation="css">
                        <Drawer
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true,
                            }}
                        >
                            <this.DrawerContent />
                        </Drawer>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            <this.DrawerContent />
                        </Drawer>
                        </Hidden>
                    </nav>
            </>
        );
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public DrawerContent = () => {
        const address = this.props.history.location ? this.props.history.location.pathname : '';
        const { isLoggedIn, classes } = this.props;
        return (  
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {this.renderNewProfileLink()}
                </List>
                <Divider />
                <List>
                    {pgRoutes(isLoggedIn).map(this.renderNewNavItems(address))}
                </List>
            </div>
        );
    }

    public renderNewNavItems = (address: string) => (values: string[], index: number) => {
        const { currentMarket, classes } = this.props;

        const [name, url, img] = values;
        
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        const isActive = (url === '/trading/' && address.includes('/trading')) || address === url;

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });
        return (
            <React.Fragment>
                <ListItem className={isActive ? classes.drawerActiveLink : classes.drawerLink} button component={Link} to={path}>
                    <ListItemIcon>
                        <SidebarIcons 
                            name={img}
                            className={iconClassName}
                        />
                    </ListItemIcon>
                    <ListItemText primary={this.translate(name)} />
                </ListItem>
            </React.Fragment>
        );
    };

    public renderNewProfileLink = () => {
        const { isLoggedIn, location, classes } = this.props;
        const address = location ? location.pathname : '';
        const isActive = address === '/profile';

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return isLoggedIn && (
            <React.Fragment>
                <ListItem className={isActive ? classes.drawerActiveLink : classes.drawerLink} button component={Link} to='/profile'>
                    <ListItemIcon>
                        <ProfileIcon 
                            className={iconClassName}
                        />
                    </ListItemIcon>
                    <ListItemText primary={this.translate('page.header.navbar.profile')} />
                </ListItem>
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currentMarket: selectCurrentMarket(state),
    lang: selectCurrentLanguage(state),
    isActive: selectSidebarState(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        logoutFetch: () => dispatch(logoutFetch()),
        changeUserDataFetch: payload => dispatch(changeUserDataFetch(payload)),
    });

    const Sidebar = injectIntl(withStyles(useStyles as {})(withRouter(connect(mapStateToProps, mapDispatchToProps)(SidebarContainer) as any)));
// const Sidebar = withRouter(connect(mapStateToProps, mapDispatchToProps)(SidebarContainer) as any) as any;

export {
    Sidebar,
};
