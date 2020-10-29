import * as React from 'react';

// import classnames from 'classnames';
import { History } from 'history';
import { Link } from "react-router-dom";
import { FormattedMessage } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';

//import { Moon } from '../../assets/images/Moon';
//import { Sun } from '../../assets/images/Sun';
//import { colors } from '../../constants';

// import logoLight from '../../assets/images/logo.png';
import { languages } from '../../api/config';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
// import Button from 'react-bootstrap/Button'
import { headerRoutes, headerProfileRoutes } from '../../constants';

import Typography from '@material-ui/core/Typography';

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
// import { NotificationType } from '../../charting_library/charting_library.min';

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


type Props = OwnProps & ReduxProps & DispatchProps;

interface IState {
    isOpenLanguage: boolean,
    showNotification: boolean,
    notifications: Notification[],
    notificationContainer: React.RefObject<HTMLInputElement>,

} 

class NavBarComponent extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isOpenLanguage: false,
            showNotification: false,
            notifications: [],
            notificationContainer: React.createRef()
        };
        
    }
    public componentDidMount () {
        this.getNotifications();
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
        return (
            <>
                <li className="nav-item nav-profile dropdown">
                    <a className="nav-link dropdown-toggle" id="profileDropdown" href="/" data-toggle="dropdown" aria-expanded="false">
                    <div className="nav-profile-img">
                        {/* <img src={faceImg} alt="image" /> */}
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
                </li>
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
                <li className="nav-item nav-language dropdown d-none d-md-block">
                    <a className="nav-link dropdown-toggle" id="languageDropdown" data-toggle="dropdown" aria-expanded="false">
                        <div className="nav-language-icon">
                            <img
                                src={this.tryRequire(lang) && require(`../../assets/images/sidebar/${lang}.svg`)}
                                alt={`${lang}-flag-icon`}
                            />
                        </div>
                        <div className="nav-language-text">
                            <p className="mb-1" style={{ fontSize: "1.2rem" }}>{languageName}</p>
                        </div>
                    </a>
                    <div className="dropdown-menu navbar-dropdown" aria-labelledby="languageDropdown">
                        {this.getLanguageDropdownItems()}
                    </div>
                </li>
            </>
        )
    };

    private renderNotifications = () => {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return null;
        }
        const {notifications} = this.state;
        return (
            <>
                <li className="nav-item dropdown">
                    <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
                        <i className="mdi mdi-bell-outline"></i>
                        <span className="count-symbol bg-danger"></span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown" style={{ minWidth: '300px' }}>
                        <h6 className="p-3" style={{ fontSize: '16px' }}>
                            <FormattedMessage id={'page.header.navbar.notifications.title'} />
                        </h6>
                        <div className="dropdown-divider"></div>
                        {notifications.length ? 
                            <>
                            <div style={{ padding: '0px 0px 24px' }}>
                                {notifications.map((notification, index) => {
                                    return (
                                        <>
                                            <a className="dropdown-item preview-item" key={notification.id}>
                                                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="preview-subject font-weight-normal mb-1" style={{ fontSize: "1.2rem" }}>{ notification.subject }</h6>
                                                    <p className="text-gray ellipsis mb-0" style={{ fontSize: "1rem" }}>  {notification.body} </p>
                                                </div>
                                            </a>
                                            <div className="dropdown-divider"></div>
                                        </>
                                    );
                                })}
                            </div>
                            </>: 
                            <>
                                <div style={{ padding: '24px', textAlign: 'center', fontSize: '14px' }}>
                                    <Typography variant="h6">
                                        <FormattedMessage id={'page.header.navbar.notifications.empty.content1'} />
                                    </Typography>
                                    <Typography variant="body1">
                                        <FormattedMessage id={'page.header.navbar.notifications.empty.content2'} />
                                    </Typography>
                                </div>
                            </>
                        }
                        {/* <a href="#" className="text-primary">
                            <h6 className="p-3 mb-0 bg-primary text-white text-center" style={{ fontSize: '14px' }}>See all notifications</h6>
                        </a> */}
                    </div>
                </li>
            </>
        )
    }
    
    public render() {
        const { isLoggedIn } = this.props;
        return (
            <>
                <ul className="navbar-nav navbar-nav-right">
                    {headerRoutes(isLoggedIn).map(this.renderNavLinks())}
                    {this.renderLoginRegisterLinks()}
                    {this.renderProfile()}
                    {this.renderLanguages()}
                    {this.renderNotifications()}
                </ul>
            </>
            
        );
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

    // private getLightDarkMode = () => {
    //     const { colorTheme } = this.props;

    //     if (colorTheme === 'basic') {
    //         return (
    //             <React.Fragment>
    //                 <div className="switcher-item">
    //                     <Sun fillColor={colors.light.navbar.sun}/>
    //                 </div>
    //                 <div className="switcher-item switcher-item--active">
    //                     <Moon fillColor={colors.light.navbar.moon}/>
    //                 </div>
    //             </React.Fragment>
    //         );
    //     }

    //     return (
    //         <React.Fragment>
    //             <div className="switcher-item switcher-item--active">
    //                 <Sun fillColor={colors.basic.navbar.sun}/>
    //             </div>
    //             <div className="switcher-item">
    //                 <Moon fillColor={colors.basic.navbar.moon}/>
    //             </div>
    //         </React.Fragment>
    //     );
    // };

    // private handleChangeCurrentStyleMode = (value: string) => {
    //     this.props.changeColorTheme(value);
    // };
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

export const NavBar = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(NavBarComponent) as any; // tslint:disable-line
