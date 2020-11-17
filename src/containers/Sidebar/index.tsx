import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
import { SidebarIcons } from '../../assets/images/sidebar/SidebarIcons';
import { pgRoutes } from '../../constants';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';

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
    selectUserFetching,
    User,
} from '../../modules';

const drawerWidth = 240;
const useStyles = (theme: Theme) => ({
    drawer: {
        zIndex: 0,
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
        opacity: '0.85',
        "&:hover": {
            color: theme.palette.secondary.main,
            '& svg': {
                '& path': {
                    fill: theme.palette.secondary.main,
                }
            }
        }
    },
    drawerActiveLink: {
        textDecoration: 'none',
        color: '#000',
        background: 'rgb(250, 250, 250)',
        "&:hover": {
            color: theme.palette.text.primary,
        },
        '& svg': {
            '& path': {
                fill: theme.palette.text.primary,
            }
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '0rem',
            bottom: 0,
            background: theme.palette.secondary.main,
            width: '5px',
            height: '44px',
            [theme.breakpoints.only('xs')]: {
                height: '48px',
            },
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
    userLoading?: boolean;
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
                    {this.renderProfileLink()}
                    <Divider />
                </List>
                <List>
                    {pgRoutes(isLoggedIn).map(this.renderNavItems(address))}
                </List>
            </div>
        );
    }

    public renderNavItems = (address: string) => (values: string[], index: number) => {

        const { currentMarket, mobileOpen, handleDrawerToggle, classes, userLoading } = this.props;
        
        const [name, url, img, optionalURL] = values;
        
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        const isActive = (address.includes(url) || address.includes(optionalURL))

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });
        return (
            <React.Fragment>
                <ListItem className={isActive ? classes.drawerActiveLink : classes.drawerLink} button component={Link} to={path} onClick={mobileOpen ? handleDrawerToggle : undefined }>
                    <ListItemIcon>
                        {userLoading ? 
                            <Skeleton width={50}/> :
                            <SidebarIcons 
                                name={img}
                                className={iconClassName}
                            />
                        }
                    </ListItemIcon>
                    <ListItemText primary={userLoading ? <Skeleton /> : this.translate(name)} />
                </ListItem>
            </React.Fragment>
        );
    };

    public renderProfileLink = () => {
        const { isLoggedIn, mobileOpen, handleDrawerToggle, location, classes, userLoading } = this.props;
        const address = location ? location.pathname : '';
        const isActive = address.includes('/profile');

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return isLoggedIn && (
            <React.Fragment>
                <ListItem className={isActive ? classes.drawerActiveLink : classes.drawerLink} button component={Link} to='/profile' onClick={mobileOpen ? handleDrawerToggle : undefined }>
                    <ListItemIcon>
                        {userLoading ? 
                            <Skeleton width={50}/> :
                            <ProfileIcon 
                                className={iconClassName}
                            />
                        }
                    </ListItemIcon>
                    <ListItemText primary={userLoading ? <Skeleton /> : this.translate('page.header.navbar.profile')} />
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
    userLoading: selectUserFetching(state),
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
