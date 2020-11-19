import * as React from 'react';

import { History } from 'history';
import { Link } from "react-router-dom";
import * as moment from 'moment';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';

import { languages } from '../../api/config';

import { headerRoutes } from '../../constants';
import {
    localeDate,
} from '../../helpers';

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
import Badge from '@material-ui/core/Badge';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withStyles, Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
    },
    notificationHeader: {
        // borderBottom: `1px solid ${theme.palette.text.secondary}`,
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        backgroundColor: theme.palette.background.default
    },
    notificationContent: {
        maxWidth: '100%', 
        maxHeight: '50vh',
        overflowY: 'auto'
    },
    notificationBody: {
        margin: '8px 0px',
        width: '250px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    learnMore: {
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.secondary.dark
        }
    }
});

type Props = OwnProps & ReduxProps & DispatchProps & InjectedIntlProps;

interface IState {
    notifications: Notification[],
    notificationPanelEl: HTMLElement |  null;
    profilePanelEl: HTMLElement |  null;
    languagePanelEl: HTMLElement |  null;
    showNotificationDetail: boolean;
    notificationDetail: Notification | null | undefined;
} 

class NavBarComponent extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            notifications: [],
            notificationPanelEl: null,
            profilePanelEl: null,
            languagePanelEl: null,
            showNotificationDetail: false,
            notificationDetail: null,
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

    public handleNotificationDetailClickOpen = (notificationId: number) => {
        const detail = this.searchNotfication(notificationId);
        this.setState({
            notificationDetail: detail
        });
        this.setState({
            showNotificationDetail: true
        });
    };
    
    public handleNotificationDetailClose = () => {
        this.setState({
            showNotificationDetail: false
        });
    };

    public searchNotfication = (notificationId: number) => {
        return this.state.notifications.find(notification => notification.id === notificationId);
    }

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
        const {notificationPanelEl, notifications, showNotificationDetail, notificationDetail} = this.state;
        const TEXT_LENGTH = 100;

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
                            {notifications.length ? 
                                <Badge color="error" variant="dot">
                                    <NotificationsNoneIcon onClick={this.handleNotificationPanelClick}/>
                                </Badge>
                                :
                                <NotificationsNoneIcon />
                            }
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
                            <div>
                                <Paper elevation={1} square className={classes.notificationHeader}>
                                    <Typography variant="h6">
                                        <FormattedMessage id={'page.header.navbar.notifications.title'} />
                                    </Typography>
                                </Paper>
                                <Paper elevation={0} className={classes.notificationContent}>
                                    {notifications.length ? 
                                        <>
                                            <List>
                                                {notifications.map((notification, index) => {
                                                    const showLoadMore = notification.body.length > TEXT_LENGTH;
                                                    return (
                                                        <>
                                                            <ListItem alignItems="flex-start" button onClick={() => this.handleNotificationDetailClickOpen(notification.id)}>
                                                                <ListItemText
                                                                    primary= {
                                                                        <>
                                                                            <Typography variant="body1" color="textPrimary">
                                                                                {`${notification.subject}`}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                    secondary={
                                                                        <>
                                                                            <Typography
                                                                                component="div"
                                                                                variant="body2"
                                                                                color="textSecondary"
                                                                                className={classes.notificationBody}
                                                                            >
                                                                                {notification.body}
                                                                                {/* {`${notification.body.slice(0, TEXT_LENGTH)}`}
                                                                                {notification.body.length > TEXT_LENGTH ?
                                                                                        <>
                                                                                            <Typography variant="subtitle2" component="span" color="textPrimary" className={classes.learnMore}>
                                                                                                <FormattedMessage id={'learn.more'} />
                                                                                            </Typography>
                                                                                        </>
                                                                                        :
                                                                                        ''
                                                                                    } */}
                                                                            </Typography>

                                                                                <Typography variant="body1" color="textPrimary">
                                                                                    {moment(notification.created_at).fromNow()}
                                                                                </Typography>
                                                                        </>
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
                            </div>
                        </Popover>
                    </>
                }

                <Dialog
                    open={showNotificationDetail}
                    onClose={this.handleNotificationDetailClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{ padding: '8px 24px' }}>
                        {notificationDetail ? notificationDetail.subject : ''}
                        <Typography variant="body2">
                            {notificationDetail ? localeDate(notificationDetail.created_at, 'fullDate') : ''}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText id="alert-dialog-description">
                            {notificationDetail ? notificationDetail.body : ''}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ flexDirection: 'column' }}>
                        <Button variant="contained" color="secondary" fullWidth onClick={this.handleNotificationDetailClose}>
                            <FormattedMessage id={'page.header.navbar.notifications.detail.seen.button.text'} />
                        </Button>
                    </DialogActions>
                </Dialog>
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
