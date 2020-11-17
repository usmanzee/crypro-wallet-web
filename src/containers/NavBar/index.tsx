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

import { headerRoutes } from '../../constants';

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
import { withStyles, Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Icon from '@material-ui/core/Icon'

import SecurityIcon from '@material-ui/icons/Security';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SettingsInputHdmiIcon from '@material-ui/icons/SettingsInputHdmi';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';

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
    selectUserFetching,
    User,
} from '../../modules';

import {getNotifications} from "../../apis/exchange";
import { lang } from 'moment';

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
    userLoading?: boolean;
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

const useStyles = (theme: Theme) => ({
    headerLink: {
        color: "#fff",
        whiteSpace: 'pre',
        "&:hover": {
            color: '#fff',
        }
    },
    dropdownLink: {
        color: "#000",
        whiteSpace: 'pre',
        "&:hover": {
            color: theme.palette.secondary.main,
            '& svg': {
                color: theme.palette.secondary.main,
            }
        },
    },
    headerContentLoader: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    notificationContainer: {
        [theme.breakpoints.only('xs')]: {
            display: 'none'
        },
    }
});

type Props = OwnProps & ReduxProps & DispatchProps & InjectedIntlProps;

interface IState {
    isOpenLanguage: boolean,
    showNotification: boolean,
    notifications: Notification[],
    notificationContainer: React.RefObject<HTMLInputElement>,

    notificationPanelEl: HTMLElement |  null;
    profilePanelEl: HTMLElement |  null;
    languagePanelEl: HTMLElement |  null;

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
            languagePanelEl: null,
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
    public handleLanguagePanelClick = (event)  => {
        this.setState({
            languagePanelEl: event.currentTarget
        });
    };
    
    public handleLanguagePanelClose = () => {
        this.setState({
            languagePanelEl: null
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
        const { isLoggedIn, classes } = this.props;
        return (
            <>
                <List style={{ display: 'flex' }}>
                    {headerRoutes(isLoggedIn).map(this.renderNavLinks())}
                </List>
                {isLoggedIn &&
                    <>
                        {this.renderProfile()}
                        {this.renderNotifications()}
                    </>
                }
                <div className={ classes.notificationContainer }>
                    {this.renderLanguages()}
                </div>
            </>
            
        );
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private renderNavLinks = () => (values: string[], index: number) => {

        const { userLoading, classes } = this.props;
        const [name, url] = values;
        return (
            <React.Fragment>
                <ListItem className={classes.headerLink} button component={Link} to={url}>
                    <ListItemText primary={userLoading ? <Skeleton width={50} className={classes.headerContentLoader}/> : this.translate(name)} />
                </ListItem>
            </React.Fragment>
        );
    };

    private renderProfile = () => {
        const { userLoading, isLoggedIn, classes } = this.props;
        const { profilePanelEl} = this.state;

        const profilePanelOpen = Boolean(profilePanelEl);
        const profilePanelId = profilePanelOpen ? 'profile-panel-popover' : undefined;
        return (
            <>
                {userLoading ? <Skeleton width={50} /> :
                    <>
                        <IconButton
                            aria-label="user"
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
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Paper>
                                <List disablePadding>
                                    {this.renderProfileLinks()}
                                    <ListItem className={classes.dropdownLink} button onClick={this.handleLogoutClick}>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={`${this.translate('page.header.navbar.logout')}`} />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Popover>
                    </>
                }
            </>
        );
    }

    private renderProfileLinks = () => {
        const { classes } = this.props;    
        const profileLinks = [
            {
                name: 'page.header.navbar.profile.security',
                url: '/profile/security',
                iconComponent: <SecurityIcon/>
            },
            {
                
                name: 'page.header.navbar.profile.identification',
                url: '/profile/identification',
                iconComponent: <PermIdentityIcon/>
            },
            {
                
                name: 'page.header.navbar.profile.referal',
                url: '/profile/referral',
                iconComponent: <GroupAddIcon/>
            },
            {
                
                name: 'page.header.navbar.profile.api_management',
                url: '/profile/api_management',
                iconComponent: <SettingsInputHdmiIcon/>
            },
            {
                
                name: 'page.header.navbar.profile.activities',
                url: '/profile/activities',
                iconComponent: <LocalActivityIcon/>
            }
        ];
        return (
            <>  
                {profileLinks.map((profileLink) => {
                    return (
                        <>
                            <ListItem button className={classes.dropdownLink} component={Link} to={profileLink.url} onClick={this.handleProfilePanelClose}>
                                <ListItemIcon>
                                    {profileLink.iconComponent}
                                </ListItemIcon>
                                <ListItemText primary={`${this.translate(profileLink.name)}`} />
                            </ListItem>
                            <Divider />
                        </>
                    );
                })}
            </>
        );
    }
    
    private renderLanguages = () => {
        
        const { lang } = this.props;
        const languageName = lang.toUpperCase();

        const { languagePanelEl} = this.state;

        const languagePanelOpen = Boolean(languagePanelEl);
        const languagePanelId = languagePanelOpen ? 'language-panel-popover' : undefined;
        return (
            <>
            <IconButton
                    aria-label="languages"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={this.handleLanguagePanelClick}
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

            <Popover
                    id={languagePanelId}
                    open={languagePanelOpen}
                    anchorEl={languagePanelEl}
                    onClose={this.handleLanguagePanelClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Paper>
                        <List style={{ width: '114px' }} disablePadding>
                            {this.getLanguageDropdownItems()}
                        </List>
                    </Paper>
                </Popover>
            </>
        )
    };

    public getLanguageDropdownItems = () => {
        const { lang, classes } = this.props;
        return (
            <>
                {languages.map((language, index) => {
                    return (
                        <>
                            <ListItem 
                                className={classes.dropdownLink} 
                                button 
                                onClick={e => this.handleChangeLanguage(language)}
                                selected={language === lang}
                            >
                                <ListItemAvatar>
                                    <img
                                        src={this.tryRequire(language) && require(`../../assets/images/sidebar/${language}.svg`)}
                                        alt={`${language}-flag-icon`}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={language.toUpperCase()} />
                            </ListItem>
                            <Divider />
                        </>
                    );
                })}
            </>
        );
    };

    private renderNotifications = () => {
        const { userLoading, classes } = this.props;
        const {notificationPanelEl, notifications} = this.state;

        const notificationPanelOpen = Boolean(notificationPanelEl);
        const notificationPanelId = notificationPanelOpen ? 'notification-panel-popover' : undefined;
        return (
            <>
                {userLoading ? <Skeleton width={50} className={classes.headerContentLoader}/> :
                    <>
                        <IconButton
                            aria-label="notifications"
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
                }
            </>
        )
    }

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

    private handleLogoutClick = () => {
        this.handleProfilePanelClose();
        this.props.logoutFetch();
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        colorTheme: selectCurrentColorTheme(state),
        lang: selectCurrentLanguage(state),
        userLoading: selectUserFetching(state),
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

export const NavBar = injectIntl(withStyles(useStyles as {})(compose(connect(mapStateToProps, mapDispatchToProps))(NavBarComponent))) as any;
