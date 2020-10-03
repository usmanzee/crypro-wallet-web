import * as React from 'react';

import { Link } from "react-router-dom";
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';
//import { Moon } from '../../assets/images/Moon';
//import { Sun } from '../../assets/images/Sun';
//import { colors } from '../../constants';

import logoLight from '../../assets/images/logo.png';
import { languages } from '../../api/config';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Button from 'react-bootstrap/Button'

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

import * as ExchangeApi from "../../apis/exchange";
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
    public async componentDidMount () {

        try {
            await ExchangeApi.getNotifications().then((responseData) => {
                this.setState({
                    notifications: responseData
                });
              });
        } catch (error) {
          console.log(error);
        }
    };
    private renderNavLinks = () => {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return null;
        }
        return (
            <>
                {/* <button className="navbar-toggler navbar-toggler align-self-center" type="button" >
                    <span className="mdi mdi-menu"></span>
                </button> */}
                <div className="search-field d-xl-block">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/wallets">Wallets</Link>
                        </li>          
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders">Orders</Link>
                        </li>
                    </ul>
                </div> 
            </>
        );
    }

    private renderLoginRegisterLinks = () => {
        const { isLoggedIn } = this.props;
        if(isLoggedIn) {
            return null;
        }
        return (
            <>
                <li className="nav-item">
                    <Link className="nav-link" to="/signin">Sign In</Link>
                </li>
                <li className="nav-item">
                    <Link className="register-link" to="/signup">Register</Link>
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
                    <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                    <div className="nav-profile-img">
                        {/* <img src={faceImg} alt="image" /> */}
                        <AccountCircleIcon fontSize="large" />
                    </div>
                    <div className="nav-profile-text">
                    <p className="mb-1" style={{ fontSize: "1.2rem" }}>Profile</p>
                    </div>
                    </a>
                    <div className="dropdown-menu navbar-dropdown dropdown-menu-right p-0 border-0" aria-labelledby="profileDropdown" data-x-placement="bottom-end">
                        <div className="p-3">
                            <Link className="dropdown-item py-3 d-flex align-items-center justify-content-between" to="/profile">
                                <span>{user.email}</span>
                                <ArrowRightIcon fontSize="large"/>
                            </Link>
                        </div>
                        <div role="separator" className="dropdown-divider"></div>
                        <div className="p-2">
                            <Link className="dropdown-item py-1 d-flex align-items-center justify-content-between" to="/profile">
                                <span>Security</span>
                                <i className="mdi mdi-shield-outline"></i>
                            </Link>
                            <Link className="dropdown-item py-1 d-flex align-items-center justify-content-between" to="/profile">
                                <span>Identification</span>
                                <i className="mdi mdi-folder-account"></i>
                            </Link>
                            <Link className="dropdown-item py-1 d-flex align-items-center justify-content-between" to="/profileavascript:void(0)">
                                <span>API Management</span>
                                <i className="mdi mdi-settings"></i>
                            </Link>
                            <Link className="dropdown-item py-1 d-flex align-items-center justify-content-between" to="/profile">
                                <span>Referal</span>
                                <i className="mdi mdi-account-plus"></i>
                            </Link>
                            <div role="separator" className="dropdown-divider"></div>
                            <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" onClick={this.props.logoutFetch}>
                                <span>Log Out</span>
                                <i className="mdi mdi-logout ml-1"></i>
                            </a>
                        </div>
                    </div>
                </li>
            </>
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
                        <h6 className="p-3 mb-0 bg-primary-dull text-white py-4" style={{ fontSize: '1.3rem' }}>Notifications</h6>
                        {notifications.map((notification, index) => {
                            return (
                                <>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                            <h6 className="preview-subject font-weight-normal mb-1" style={{ fontSize: "1.2rem" }}>{ notification.subject }</h6>
                                            <p className="text-gray ellipsis mb-0" style={{ fontSize: "1rem" }}>  {notification.body} </p>
                                        </div>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                </>
                            );
                        })}
                        <a href="#" className="text-primary">
                            <h6 className="p-3 mb-0 text-center" style={{ fontSize: '1.2rem' }}>See all notifications</h6>
                        </a>
                    </div>
                </li>
            </>
        )
    }
    
    public render() {

        return (
            <>
                <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center" onClick={e => this.redirectToLanding()}>
                        <a className="navbar-brand brand-logo"><img src={logoLight} alt="logo" /></a>
                        <a className="navbar-brand brand-logo-mini"><img src={logoLight} alt="logo" /></a>
                    </div>
                    <div className="navbar-menu-wrapper d-flex align-items-stretch">
                        <ul className="navbar-nav navbar-nav-right">
                            
                            {this.renderNavLinks()}
                            {this.renderLoginRegisterLinks()}
                            {this.renderProfile()}
                            {this.renderLanguages()}
                            {this.renderNotifications()}
                        </ul>

                        {/* Menu Opener for Mobile */}
                        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                            <span className="mdi mdi-menu"></span>
                        </button>
                    </div>
                </nav>
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
        // this.props.history.push('/');
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
