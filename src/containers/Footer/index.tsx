import * as React from 'react';
import { RouterProps } from 'react-router';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import WalletLogo from '../../assets/images/B4uwallet.svg';
import Paper from '@material-ui/core/Paper';

const TelegramIcon = require('../../assets/images/landing/social/Telegram.svg');
const LinkedInIcon = require('../../assets/images/landing/social/LinkedIn.svg');
const TwitterIcon = require('../../assets/images/landing/social/Twitter.svg');
const YouTubeIcon = require('../../assets/images/landing/social/YouTube.svg');
const RedditIcon = require('../../assets/images/landing/social/Reddit.svg');
const FacebookIcon = require('../../assets/images/landing/social/Facebook.svg');
const MediumIcon = require('../../assets/images/landing/social/Medium.svg');
const CoinMarketIcon = require('../../assets/images/landing/social/CoinMarket.svg');

type Props = RouterProps & InjectedIntlProps; 

class FooterComponent extends React.Component<Props> {

    private handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    private translate = (key: string) => this.props.intl.formatMessage({id: key});
    
    public render() {
        const pathName = this.props.history.location.pathname;
        if (pathName.startsWith('/confirm') || pathName.startsWith('/trading')) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                {/* <footer className="pg-footer"> */}
                <Paper style={{ margin: '8px 0px' }}>

                    <div className="pg-landing-screen__footer">
                        <div className="pg-landing-screen__footer__wrap">
                            <div className="pg-landing-screen__footer__wrap__left" onClick={e => this.handleScrollTop()}>
                                {/* <LogoIcon /> */}
                                <img src={WalletLogo} className="pg-logo__img" alt="Logo" />
                            </div>
                            <div className="pg-landing-screen__footer__wrap__navigation">
                                <div className="pg-landing-screen__footer__wrap__navigation__col">
                                    <Link to="/trading/">{this.translate('page.body.landing.footer.exchange')}</Link>
                                    <Link to="/wallets">{this.translate('page.body.landing.footer.wallets')}</Link>
                                    <Link to="/fee">{this.translate('page.body.landing.footer.fees')}</Link>
                                </div>
                                <div className="pg-landing-screen__footer__wrap__navigation__col">
                                    <a href="/">{this.translate('page.body.landing.footer.faq')}</a>
                                    <a href="https://b4uwallet.com/contact">{this.translate('page.body.landing.footer.support')}</a>
                                    <a href="https://b4uwallet.com/privacy-policy">{this.translate('page.body.landing.footer.privacy')}</a>
                                </div>
                                <div className="pg-landing-screen__footer__wrap__navigation__col">
                                    <a href="https://b4uwallet.com/about-us">{this.translate('page.body.landing.footer.about')}</a>
                                    <Link to="/">{this.translate('page.body.landing.footer.community')}</Link>
                                    <Link to="/">{this.translate('page.body.landing.footer.info')}</Link>
                                </div>
                            </div>
                            <div className="pg-landing-screen__footer__wrap__social">
                                <div className="pg-landing-screen__footer__wrap__social__row">
                                    <a href="https://t.me/b4uwallets" target="_blank">
                                        <img src={TelegramIcon} alt="Telegram" />
                                    </a>
                                    <a href="https://my.linkedin.com/company/b4uwallet" target="_blank">
                                        <img src={LinkedInIcon} alt="LinkedIn" />
                                    </a>
                                    <a href="https://twitter.com/b4uwallet_b4u" target="_blank">
                                        <img src={TwitterIcon} alt="Twitter" />
                                    </a>
                                    <a href="https://www.youtube.com/channel/UCrLMS0MFlNkozPBBuX75j8w/" target="_blank">
                                        <img src={YouTubeIcon} alt="YouTube" />
                                    </a>
                                </div>
                                <div className="pg-landing-screen__footer__wrap__social__row">
                                    <Link to="" target="_blank">
                                        <img src={RedditIcon} alt="Reddit" />
                                    </Link>
                                    <a href="https://www.facebook.com/B4uwalletofficial" target="_blank">
                                        <img src={FacebookIcon} alt="Facebook" />
                                    </a>
                                    <a href="https://medium.com/@b4uwalllet" target="_blank">
                                        <img src={MediumIcon} alt="MediumIcon" />
                                    </a>
                                    <Link to="/" target="_blank">
                                        <img src={CoinMarketIcon} alt="CoinMarket" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <span className="pg-landing-screen__footer__rights">{this.translate('page.body.landing.footer.rights')}</span>
                    </div>
                        {/* </footer> */}
                </Paper>
            </React.Fragment>
        );
    }
}

// tslint:disable-next-line:no-any
export const Footer = withRouter(injectIntl(FooterComponent as any)) as any;