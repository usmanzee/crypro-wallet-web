import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { LogoIcon } from '../../assets/images/LogoIcon';
import logoLight from '../../assets/images/logo.png';
//import ReactNotificationCenter from 'react-notification-center';

import logo from "../../assets/images/images/logo.svg"
import logoMini from "../../assets/images/images/logo-mini.svg"
import faceImg from "../../assets/images/images/faces/face28.png"

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
    toggleSidebar,
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';
import { NavBar } from '../NavBar';

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
}

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

class Head extends React.Component<Props> {
    public render() {
        const {mobileWallet } = this.props;
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/';

        return (
            <React.Fragment>
            {shouldRenderHeader &&
                <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                        <a className="navbar-brand brand-logo" href="index.html"><img src={logo} alt="logo" /></a>
                        <a className="navbar-brand brand-logo-mini" href="index.html"><img src={logoMini} alt="logo" /></a>
                    </div>
                    <div className="navbar-menu-wrapper d-flex align-items-stretch">
                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item  dropdown d-none d-md-block">
                            <a className="nav-link dropdown-toggle" id="reportDropdown" href="#" data-toggle="dropdown" aria-expanded="false"> Wallet </a>
                            <div className="dropdown-menu navbar-dropdown" aria-labelledby="reportDropdown">
                                <a className="dropdown-item" href="#">
                                <i className="mdi mdi-file-pdf mr-2"></i>PDF </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">
                                <i className="mdi mdi-file-excel mr-2"></i>Excel </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">
                                <i className="mdi mdi-file-word mr-2"></i>doc </a>
                            </div>
                        </li>
                        <li className="nav-item  dropdown d-none d-md-block">
                            <a className="nav-link dropdown-toggle" id="projectDropdown" href="#" data-toggle="dropdown" aria-expanded="false"> Orders </a>
                            <div className="dropdown-menu navbar-dropdown" aria-labelledby="projectDropdown">
                                <a className="dropdown-item" href="#">
                                <i className="mdi mdi-eye-outline mr-2"></i>View Project </a>
                            <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">
                                <i className="mdi mdi-pencil-outline mr-2"></i>Edit Project </a>
                            </div>
                        </li>
                        <li className="nav-item nav-profile dropdown">
                            <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                            <div className="nav-profile-img">
                                <img src={faceImg} alt="image" />
                            </div>
                            <div className="nav-profile-text">
                            <p className="mb-1">Abubakar</p>
                            </div>
                            </a>
                            <div className="dropdown-menu navbar-dropdown dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="profileDropdown" data-x-placement="bottom-end">
                                <div className="p-3 text-center bg-primary">
                                    <img className="img-avatar img-avatar48 img-avatar-thumb" src={faceImg} alt="" />
                                </div>
                                <div className="p-2">
                                    <h5 className="dropdown-header text-uppercase pl-2 text-dark">User Options</h5>
                                    <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="#">
                                        <span>Inbox</span>
                                        <span className="p-0">
                                            <span className="badge badge-primary">3</span>
                                            <i className="mdi mdi-email-open-outline ml-1"></i>
                                        </span>
                                    </a>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="#">
                                    <span>Profile</span>
                                    <span className="p-0">
                                        <span className="badge badge-success">1</span>
                                        <i className="mdi mdi-account-outline ml-1"></i>
                                    </span>
                                </a>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="javascript:void(0)">
                                    <span>Settings</span>
                                    <i className="mdi mdi-settings"></i>
                                </a>
                                <div role="separator" className="dropdown-divider"></div>
                                <h5 className="dropdown-header text-uppercase  pl-2 text-dark mt-2">Actions</h5>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="#">
                                    <span>Lock Account</span>
                                    <i className="mdi mdi-lock ml-1"></i>
                                </a>
                                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" href="#">
                                    <span>Log Out</span>
                                    <i className="mdi mdi-logout ml-1"></i>
                                </a>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item nav-language dropdown d-none d-md-block">
                            <a className="nav-link dropdown-toggle" id="languageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                                <div className="nav-language-icon">
                                    <i className="flag-icon flag-icon-us" title="us" id="us"></i>
                                </div>
                                <div className="nav-language-text">
                                    <p className="mb-1">English</p>
                                </div>
                            </a>
                            <div className="dropdown-menu navbar-dropdown" aria-labelledby="languageDropdown">
                                <a className="dropdown-item" href="#">
                                    <div className="nav-language-icon mr-2">
                                        <i className="flag-icon flag-icon-ae" title="ae" id="ae"></i>
                                    </div>
                                    <div className="nav-language-text">
                                        <p className="mb-1 text-black">Arabic</p>
                                    </div>
                                </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">
                                    <div className="nav-language-icon mr-2">
                                        <i className="flag-icon flag-icon-gb" title="GB" id="gb"></i>
                                    </div>
                                    <div className="nav-language-text">
                                        <p className="mb-1 text-black">English</p>
                                    </div>
                                </a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                        
                            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
                                <i className="mdi mdi-bell-outline"></i>
                                <span className="count-symbol bg-danger"></span>
                            </a>
                            
                            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                                <h6 className="p-3 mb-0 bg-primary text-white py-4">Notifications</h6>
                                <div className="dropdown-divider"></div>
                            <a className="dropdown-item preview-item">
                                <div className="preview-thumbnail">
                                    <div className="preview-icon bg-success">
                                        <i className="mdi mdi-calendar"></i>
                                    </div>
                                </div>
                                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                    <h6 className="preview-subject font-weight-normal mb-1">Event today</h6>
                                    <p className="text-gray ellipsis mb-0"> Just a reminder that you have an event today </p>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item preview-item">
                                <div className="preview-thumbnail">
                                    <div className="preview-icon bg-warning">
                                        <i className="mdi mdi-settings"></i>
                                    </div>
                                </div>
                                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                    <h6 className="preview-subject font-weight-normal mb-1">Settings</h6>
                                    <p className="text-gray ellipsis mb-0"> Update dashboard </p>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item preview-item">
                                <div className="preview-thumbnail">
                                    <div className="preview-icon bg-info">
                                        <i className="mdi mdi-link-variant"></i>
                                    </div>
                                </div>
                                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                    <h6 className="preview-subject font-weight-normal mb-1">Launch Admin</h6>
                                    <p className="text-gray ellipsis mb-0"> New admin wow! </p>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                                <h6 className="p-3 mb-0 text-center">See all notifications</h6>
                            </div>
                        </li>
                    </ul>
                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                        <span className="mdi mdi-menu"></span>
                    </button>
                    </div>
                </nav>
                // <header className={`pg-header`}>
                //     <div className={`pg-container pg-header__content ${tradingCls}`}>
                //         <div
                //             className={`pg-sidebar__toggler ${mobileWallet && 'pg-sidebar__toggler-mobile'}`}
                //             onClick={this.openSidebar}
                //         >
                //             <span className="pg-sidebar__toggler-item"/>
                //             <span className="pg-sidebar__toggler-item"/>
                //             <span className="pg-sidebar__toggler-item"/>
                //         </div>
                //         <div onClick={e => this.redirectToLanding()} className="pg-header__logo">
                //             <div className="pg-logo">
                //                 <img src={logoLight} className="pg-logo__img" alt="Logo" />
                //                 {/* <LogoIcon className="pg-logo__img" /> */}
                //             </div>
                //         </div>
                //         {this.renderMarketToggler()}
                //         <div className="pg-header__location">
                //             {mobileWallet ? <span>{mobileWallet}</span> : <span>{window.location.pathname.split('/')[1]}</span>}
                //         </div>
                //         {this.renderMobileWalletNav()}
                //         <div className="pg-header__navbar">
                //             {this.renderMarketToolbar()}
                //             <NavBar onLinkChange={this.closeMenu}/>
                //         </div>
                //     </div>
                // </header>
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

const Header = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Head) as any) as any);

export {
    Header,
};
