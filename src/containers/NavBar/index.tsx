import * as React from 'react';

import { History } from 'history';
import { Link } from "react-router-dom";
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';

import { languages } from '../../api/config';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { headerRoutes, headerProfileRoutes } from '../../constants';

import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {
    changeColorTheme,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    changeUserDataFetch,
    changeLanguage,
    logoutFetch,
    selectUserInfo,
    selectUserLoggedIn,
    User,
} from '../../modules';

import {getNotifications} from "../../apis/exchange";

interface Notification {
    id: number,
    subject: string,
    body: string,
    expire_at: Date,
    status: boolean,
    created_at: Date,
    updated_at: Date,
}

export interface ReduxProps {
    colorTheme: string;
    lang: string;
    isLoggedIn: boolean;
    user: User;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
    changeLanguage: typeof changeLanguage;
    logoutFetch: typeof logoutFetch;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
    changeUserDataFetch: typeof changeUserDataFetch;
}


type Props = OwnProps & ReduxProps & DispatchProps & InjectedIntlProps;

interface IState {
    isOpenLanguage: boolean,
    showNotification: boolean,
    notifications: Notification[],
    notificationContainer: React.RefObject<HTMLInputElement>,

    notificationPanelEl: HTMLElement |  null;
    profilePanelEl: HTMLElement |  null;

} 

class NavBarComponent extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isOpenLanguage: false,
            showNotification: false,
            notifications: [],
            notificationContainer: React.createRef(),

            notificationPanelEl: null,
            profilePanelEl: null,
        };
        
    }
    public componentDidMount () {
        this.getNotifications();
    };

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

    public getNotifications = async () => {
        try {
            const response = await getNotifications();
            if(response.status === 200) {
                this.setState({
                    notifications: response.data
                });
            }

        } catch (error) {
        }
    }

    public render() {
        const { isLoggedIn } = this.props;
        return (
            <>
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
                </List>
                {this.renderProfile()}
                {this.renderNotifications()}
                {this.renderLanguages()}
                {/* <ul className="navbar-nav navbar-nav-right">
                    {headerRoutes(isLoggedIn).map(this.renderNavLinks())}
                    {this.renderLoginRegisterLinks()}
                </ul> */}
            </>
            
        );
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private renderNavLinks = () => (values: string[], index: number) => {

        const [name, url] = values;
        return (
            <React.Fragment>
                <li className="nav-item" key={`key_${index}`}>
                    <Link className="nav-link" to={url}>
                        <FormattedMessage id={name} />
                    </Link>
                </li>
            </React.Fragment>
        );
    };

    private renderLoginRegisterLinks = () => {
        const { isLoggedIn } = this.props;
        if(isLoggedIn) {
            return null;
        }
        return (
            <>
                <li className="nav-item">
                    <Link className="nav-link" to="/signin">
                        <FormattedMessage id={'page.header.navbar.signIn'} />
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="register-link" to="/signup">
                        <FormattedMessage id={'page.header.signUp'} />
                    </Link>
                </li>
            </>
        );
    }
    private renderProfile = () => {
        const { isLoggedIn, user } = this.props;
        if (!isLoggedIn) {
            return null;
        }
        const { profilePanelEl , notifications} = this.state;

        const profilePanelOpen = Boolean(profilePanelEl);
        const profilePanelId = profilePanelOpen ? 'profile-panel-popover' : undefined;
        return (
            <>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={this.handleProfilePanelClick}
                    color="inherit"
                >
                    <AccountCircle />
                    <ArrowDropDownIcon />
                </IconButton>
                <Popover
                    id={profilePanelId}
                    open={profilePanelOpen}
                    anchorEl={profilePanelEl}
                    onClose={this.handleProfilePanelClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Paper style={{ width: '200px' }}>
                        <List component="nav" disablePadding>
                            <ListItem button>
                            <ListItemAvatar>
                                <PersonOutlineIcon />
                            </ListItemAvatar>
                                <ListItemText primary="Profile" />
                            </ListItem>
                            <ListItem button onClick={this.props.logoutFetch}>
                                <ListItemAvatar>
                                    <ExitToAppIcon />
                                </ListItemAvatar>
                                <ListItemText primary={`${this.translate('page.header.navbar.logout')}`} />
                            </ListItem>
                        </List>
                    </Paper>
                </Popover>
                {/* <li className="nav-item nav-profile dropdown">
                    <a className="nav-link dropdown-toggle" id="profileDropdown" href="/" data-toggle="dropdown" aria-expanded="false">
                    <div className="nav-profile-img">
                        <AccountCircleIcon fontSize="large" />
                    </div>
                    <div className="nav-profile-text">
                    <p className="mb-1" style={{ fontSize: "1.2rem" }}>
                        <FormattedMessage id={'page.header.navbar.profile'} />
                    </p>
                    </div>
                    </a>
                    <div className="dropdown-menu navbar-dropdown dropdown-menu-right p-0 border-0" aria-labelledby="profileDropdown" data-x-placement="bottom-end">
                        <div className="p-3">
                            <Link className="dropdown-item py-3 d-flex align-items-center justify-content-between" to="/profile">
                                <span>{user.email}</span>
                                <ArrowRightIcon fontSize="large"/>
                            </Link>
                            {headerProfileRoutes(isLoggedIn).map(this.renderProfileLinks())}
                        </div>
                        <div className="p-2">
                            <div role="separator" className="dropdown-divider"></div>
                            <span className="dropdown-item py-1 d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }} onClick={this.props.logoutFetch}>
                                <span><FormattedMessage id={'page.header.navbar.logout'} /></span>
                                <i className="mdi mdi-logout ml-1"></i>
                            </span>
                        </div>
                    </div>
                </li> */}
            </>
        );
    }
    

    public renderProfileLinks = () => (values: string[], index: number) => {
        // const [name, url, iconClassName] = values;
        return (
            <React.Fragment>
                {/* <Link className="dropdown-item py-1 d-flex align-items-center justify-content-between" to={url}>
                    <span><FormattedMessage id={name} /></span>
                    <i className={iconClassName}></i>
                </Link> */}
            </React.Fragment>
        );
    }
    private renderLanguages = () => {
        
        const { lang } = this.props;
        const languageName = lang.toUpperCase();
        
        return (
            <>
            <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={this.handleProfilePanelClick}
                    color="inherit"
                >
                <img
                    src={this.tryRequire(lang) && require(`../../assets/images/sidebar/${lang}.svg`)}
                    alt={`${lang}-flag-icon`}
                    style={{ marginRight: '8px' }}
                />
                <p className="mb-1" style={{ fontSize: "1.2rem" }}>{languageName}</p>
                <ArrowDropDownIcon />
            </IconButton>
                {/* <li className="nav-item nav-language dropdown d-none d-md-block">
                    <a className="nav-link dropdown-toggle" id="languageDropdown" data-toggle="dropdown" aria-expanded="false">
                        <div className="nav-language-icon">
                        </div>
                        <div className="nav-language-text">
                        </div>
                    </a>
                    <div className="dropdown-menu navbar-dropdown" aria-labelledby="languageDropdown">
                        {this.getLanguageDropdownItems()}
                    </div>
                </li> */}
            </>
        )
    };

    private renderNotifications = () => {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return null;
        }
        const {notificationPanelEl, notifications} = this.state;

        const notificationPanelOpen = Boolean(notificationPanelEl);
        const notificationPanelId = notificationPanelOpen ? 'notification-panel-popover' : undefined;
        return (
            <>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={this.handleNotificationPanelClick}
                    color="inherit"
                >
                    <NotificationsNoneIcon />
                </IconButton>
                <Popover
                    id={notificationPanelId}
                    open={notificationPanelOpen}
                    anchorEl={notificationPanelEl}
                    onClose={this.handleNotificationPanelClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Paper style={{ padding: '16px' }}>
                        <Typography variant="h6">
                            <FormattedMessage id={'page.header.navbar.notifications.title'} />
                        </Typography>
                        <Divider />
                        {notifications.length ? 
                            <>
                                <List>
                                    {notifications.map((notification, index) => {
                                        return (
                                            <>
                                            <ListItem alignItems="flex-start" button>
                                                <ListItemText
                                                    primary= {`${notification.subject}`}
                                                    secondary={
                                                        <React.Fragment>
                                                        {`${notification.body}`}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            {index !== (notifications.length - 1) ? <Divider /> : ''}
                                            </>
                                        );
                                    })}
                                </List>
                            </>:
                            <div style={{ padding: '40px 0px', textAlign: 'center', fontSize: '14px' }}>
                                <Typography variant="h6">
                                    <FormattedMessage id={'page.header.navbar.notifications.empty.content1'} />
                                </Typography>
                                <Typography variant="body1">
                                    <FormattedMessage id={'page.header.navbar.notifications.empty.content2'} />
                                </Typography>
                            </div>
                        }
                    </Paper>
                </Popover>
            </>
        )
    }

    public getLanguageDropdownItems = () => {
        return (
            <>
                {languages.map((language, index) => {
                    return (
                        <>
                            <a className="dropdown-item" onClick={e => this.handleChangeLanguage(language)}>
                                <div className="nav-language-icon mr-2">
                                    <img
                                        src={this.tryRequire(language) && require(`../../assets/images/sidebar/${language}.svg`)}
                                        alt={`${language}-flag-icon`}
                                    />
                                </div>
                                <div className="nav-language-text">
                                    <p className="mb-1 text-black">{language.toUpperCase()}</p>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                        </>
                    );
                })}
            </>
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

    private redirectToLanding = () => {
        this.props.history.push('/');
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        colorTheme: selectCurrentColorTheme(state),
        lang: selectCurrentLanguage(state),
        user: selectUserInfo(state),
        isLoggedIn: selectUserLoggedIn(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeColorTheme: payload => dispatch(changeColorTheme(payload)),
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        logoutFetch: () => dispatch(logoutFetch()),
        changeUserDataFetch: payload => dispatch(changeUserDataFetch(payload)),
    });

export const NavBar = injectIntl(compose(connect(mapStateToProps, mapDispatchToProps))(NavBarComponent)) as any;
