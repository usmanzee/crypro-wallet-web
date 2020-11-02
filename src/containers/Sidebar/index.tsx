import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { languages } from '../../api/config';
import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
import { SidebarIcons } from '../../assets/images/sidebar/SidebarIcons';
import { pgRoutes } from '../../constants';


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

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps;

class SidebarContainer extends React.Component<Props, State> {
    public state = {
        isOpenLanguage: false,
    };

    public render() {
        const { isLoggedIn, isActive, lang, classes, mobileOpen, handleDrawerToggle } = this.props;
        const { isOpenLanguage } = this.state;

        const address = this.props.history.location ? this.props.history.location.pathname : '';
        const languageName = lang.toUpperCase();

        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        const sidebarClassName = classnames('pg-sidebar-wrapper', {
            'pg-sidebar-wrapper--active': isActive,
            'pg-sidebar-wrapper--hidden': !isActive,
        });
        // const sideBarHidden = isActive ? false : true
        const shouldRenderSidebar = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/' && !window.location.pathname.includes('/trading');
        const newSidebarClassName = classnames('sidebar sidebar-offcanvas', {
            'd-lg-none': !shouldRenderSidebar,
            '': shouldRenderSidebar,
        });

        return (
            <>
                {/* <nav className={newSidebarClassName}>
                    <ul className="nav">
                        {this.renderNewProfileLink()}
                        {pgRoutes(isLoggedIn).map(this.renderNewNavItems(address))}
                    </ul>
                </nav> */}
                <nav className={classes.drawer} aria-label="mailbox folders">
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

    public DrawerContent = () => {
        const { classes } = this.props;
        return (  
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List>
            </div>
        );
    }

    public renderNewNavItems = (address: string) => (values: string[], index: number) => {
        const { currentMarket } = this.props;

        const [name, url, img] = values;
        
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        const isActive = (url === '/trading/' && address.includes('/trading')) || address === url;

        const sidebarClassName = classnames('nav-item', {
            'active': isActive,
            '': !isActive,
        });
        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });
        return (
            <React.Fragment>
                <li className={sidebarClassName} key={`key_${index}`}>
                    <Link to={path} className="nav-link">
                        <SidebarIcons
                            className={iconClassName}
                            name={img}
                        />
                        <FormattedMessage id={name} />
                    </Link>
                </li>
            </React.Fragment>
        );
    };

    public renderNewProfileLink = () => {
        const { isLoggedIn, location } = this.props;
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const address = location ? location.pathname : '';
        const isActive = address === '/profile';

        const sideBarClassName = classnames('nav-item', {
            'active': isActive,
        });

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return isLoggedIn && (
            <React.Fragment>
                <li className={sideBarClassName}>
                    <Link to="/profile" className="nav-link">
                        <ProfileIcon className={iconClassName} />
                        <FormattedMessage id={'page.header.navbar.profile'} />
                    </Link>
                </li>
            </React.Fragment>
        );
    };

    public renderNavItems = (address: string) => (values: string[], index: number) => {
        const { currentMarket } = this.props;

        const [name, url, img] = values;
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        const isActive = (url === '/trading/' && address.includes('/trading')) || address === url;

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return (
            <Link to={path} key={index} onClick={handleLinkChange} className={`${isActive && 'route-selected'}`}>
                <div className="pg-sidebar-wrapper-nav-item">
                    <div className="pg-sidebar-wrapper-nav-item-img-wrapper">
                        <SidebarIcons
                            className={iconClassName}
                            name={img}
                        />
                    </div>
                    <p className="pg-sidebar-wrapper-nav-item-text">
                        <FormattedMessage id={name} />
                    </p>
                </div>
            </Link>
        );
    };

    public renderProfileLink = () => {
        const { isLoggedIn, location } = this.props;
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const address = location ? location.pathname : '';
        const isActive = address === '/profile';

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return isLoggedIn && (
            <div className="pg-sidebar-wrapper-profile">
                <Link to="/profile" onClick={handleLinkChange} className={`${isActive && 'route-selected'}`}>
                    <div className="pg-sidebar-wrapper-profile-link">
                        <ProfileIcon className={iconClassName} />
                        <p className="pg-sidebar-wrapper-profile-link-text">
                            <FormattedMessage id={'page.header.navbar.profile'} />
                        </p>
                    </div>
                </Link>
            </div>
        );
    };

    public renderLogout = () => {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return null;
        }

        return (
            <div className="pg-sidebar-wrapper-logout">
                <div className="pg-sidebar-wrapper-logout-link" onClick={this.props.logoutFetch}>
                    <LogoutIcon className="pg-sidebar-wrapper-logout-link-img" />
                    <p className="pg-sidebar-wrapper-logout-link-text">
                        <FormattedMessage id={'page.body.profile.content.action.logout'} />
                    </p>
                </div>
            </div>
        );
    };

    public getLanguageDropdownItems = () => {
        return languages.map((l: string) =>
            <Dropdown.Item onClick={e => this.handleChangeLanguage(l)}>
                <div className="dropdown-row">
                    <img
                        src={this.tryRequire(l) && require(`../../assets/images/sidebar/${l}.svg`)}
                        alt={`${l}-flag-icon`}
                    />
                    <span>{l.toUpperCase()}</span>
                </div>
            </Dropdown.Item>,
        );
    };

    private tryRequire = (name: string) => {
        try {
            require(`../../assets/images/sidebar/${name}.svg`);

            return true;
        } catch (err) {
            return false;
        }
    };


    private handleChangeLanguage = (language: string) => {
        const { user, isLoggedIn } = this.props;

        if (isLoggedIn) {
            const data = user.data && JSON.parse(user.data);

            if (data && data.language && data.language !== language) {
                const payload = {
                    ...user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                this.props.changeUserDataFetch({ user: payload });
            }
        }

        this.props.changeLanguage(language);
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
