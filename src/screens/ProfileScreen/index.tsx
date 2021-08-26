import * as React from 'react';
import classnames from 'classnames';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { ProfileApiKeys, ProfileVerification, ProfileP2PPaymentMethod } from '../../containers';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileAuthDetails } from '../../containers/ProfileAuthDetails';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { setDocumentTitle } from '../../helpers';
import { PageHeader } from '../../containers/PageHeader';

import {
    Box,
    Paper,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Theme, withStyles, useTheme} from '@material-ui/core/styles';
import { globalStyle } from '../../screens/materialUIGlobalStyle';
import { profileTabs } from '../../constants';

const useStyles = (theme: Theme) => ({
    ...globalStyle(theme),
   
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box>
                {children}
            </Box>
        )}
        </div>
    );
}
  
function a11yProps(index: any) {
    return {
      id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
  
const AntTabs = withStyles({
    root: {
      backgroundColor: "white",
      borderBottom: '0.1rem solid rgb(170, 170, 170)',
      boxShadow: "none"
    }
  })(Tabs);

interface IState {
	tabValue: number;
    paymentMethodDialogOpen: boolean;
}

type Props = RouterProps & InjectedIntlProps;

class ProfileComponent extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);
        this.state = {
			tabValue: 0,
            paymentMethodDialogOpen: false
		};
    }

    public componentDidMount() {
        setDocumentTitle('Profile');
        this.changeTab();
    }

    componentDidUpdate(prevProps, nextProps) {
        if (this.props.match.params.tabName !== prevProps.match.params.tabName) {
            this.changeTab();
        }
    }

    public changeTab = () => {
        const tabName = this.props.match.params.tabName;
        let activeTab = this.state.tabValue;
        if(tabName === 'payment') {
            activeTab = 0;
        }
        if(tabName === 'security') {
            activeTab = 1;
        }
        else if(tabName === 'identification') {
            activeTab = 2
        }
        else if(tabName === 'referral') {
            activeTab = 3
        }
        else if(tabName === 'api_management') {
            activeTab = 4
        }
        else if(tabName === 'activities') {
            activeTab = 5
        }
        else {
            activeTab = 0
        }
        this.setState({
            tabValue: activeTab
        });
    }

    public goBack = () => {
        this.props.history.goBack();
    };

    public handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        this.setState({
            tabValue: newValue
        })
    };

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public render() {
        const { classes } = this.props;
        const address = this.props.history.location ? this.props.history.location.pathname : '';
        const pageTitle = this.translate('page.body.profile.title');

        return (
            <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                        <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
                            <AntTabs 
                                value={this.state.tabValue} 
                                onChange={this.handleTabChange} 
                                indicatorColor="secondary"
                                textColor="secondary"
                                variant="scrollable"
                                scrollButtons="on"
                            >
                                {/* <Tab component="a" label={this.translate('Payment')} {...a11yProps(0)} /> */}
                                <Tab component="a" label='Payment' {...a11yProps(0)} />
                                <Tab component="a" label={this.translate('page.body.profile.tabs.security')} {...a11yProps(1)} />
                                <Tab component="a" label={this.translate('page.body.profile.tabs.identification')} {...a11yProps(2)} />
                                <Tab component="a" label={this.translate('page.body.profile.tabs.referral')} {...a11yProps(3)} />
                                <Tab component="a" label={this.translate('page.body.profile.tabs.api_management')} {...a11yProps(4)} />
                                <Tab component="a" label={this.translate('page.body.profile.tabs.activity')} {...a11yProps(5)} />
                            </AntTabs>
						</AppBar>
                        <TabPanel value={this.state.tabValue} index={0}>
                            <ProfileP2PPaymentMethod />
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={1}>
                            <ProfileAuthDetails/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={2}>
                            <ProfileVerification/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={3}>
                            <ReferralProgram/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={4}>
                            <ProfileApiKeys/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={5}>
                            <ProfileAccountActivity/>
                        </TabPanel>
                    </Paper>
                </Box>
                {/* <div className="container pg-profile-page">
                    <div className="pg-profile-page__details">
                        <div className="row pg-profile-page-header pg-profile-page-header-first">
                            <h3 className="col-12">
                                <FormattedMessage id="page.body.profile.header.account"/>
                            </h3>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6 mx-0">
                                <div className="row col-12 mx-0">
                                    <ProfileAuthDetails/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <ProfileVerification/>
                            </div>
                        </div>
                        <div className="row px-4">
                            <div className="col-12 mx-0">
                                <ReferralProgram/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <ProfileApiKeys/>
                        </div>
                        <div className="col-12">
                            <ProfileAccountActivity/>
                        </div>
                    </div>
                </div> */}
            </>
        );
    }
}

// tslint:disable-next-line:no-any
export const ProfileScreen = injectIntl(withStyles(useStyles as {}, { withTheme: true })(withRouter(ProfileComponent as any)));