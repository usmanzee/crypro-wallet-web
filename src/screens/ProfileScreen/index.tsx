import * as React from 'react';
import classnames from 'classnames';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { ProfileApiKeys, ProfileVerification } from '../../containers';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileAuthDetails } from '../../containers/ProfileAuthDetails';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { setDocumentTitle } from '../../helpers';

import {
    Box,
    Grid,
    Paper,
    Typography,
    Switch,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Theme, withStyles} from '@material-ui/core/styles';
import { profileTabs } from '../../constants';

const useStyles = (theme: Theme) => ({
    headerPaper: {
        height: "100px", 
        padding: "32px 20px"
    },
    pagePaper: {
        padding: `${theme.spacing(2)}px`,
    },
    pagePaperHeader: {
        // display: 'flex',
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    activePage: {
        color: '#000',
        marginRight: theme.spacing(5),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '10px',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
    inActivePage: {
        color: '#000',
        marginRight: theme.spacing(5),
        opacity: '0.6',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
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
}

type Props = RouterProps & InjectedIntlProps;

class ProfileComponent extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
			tabValue: 0
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
        if(tabName === 'security') {
            activeTab = 0;
        }
        else if(tabName === 'identification') {
            activeTab = 1
        }
        else if(tabName === 'referral') {
            activeTab = 2
        }
        else if(tabName === 'api_management') {
            activeTab = 3
        }
        else if(tabName === 'activities') {
            activeTab = 4
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

    public render() {
        const { classes } = this.props;
        const address = this.props.history.location ? this.props.history.location.pathname : '';
        return (
            <>
            <Box>
                <Paper className={classes.headerPaper}>
                    <Grid container>
                        <Grid item md={12}>
                            <Typography variant="h4" display="inline">
                                Profile Management
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Box mt={2} pl={3} pr={3} alignItems="center">
                <Paper className={classes.pagePaper}>
                    <div className={classes.pagePaperHeader}>
                        <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
                            <AntTabs 
                                value={this.state.tabValue} 
                                onChange={this.handleTabChange} 
                                indicatorColor="secondary"
                                textColor="secondary"
                                variant="scrollable"
                            >
                                <Tab component="a" label="Profile / Security" {...a11yProps(0)} />
                                <Tab component="a" label="Identification" {...a11yProps(1)} />
                                <Tab component="a" label="Referral" {...a11yProps(2)} />
                                <Tab component="a" label="API Management" {...a11yProps(3)} />
                                <Tab component="a" label="Activity" {...a11yProps(4)} />
                            </AntTabs>
						</AppBar>
                        <TabPanel value={this.state.tabValue} index={0}>
                            <ProfileAuthDetails/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={1}>
                            <ProfileVerification/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={2}>
                            <ReferralProgram/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={3}>
                            <ProfileApiKeys/>
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={4}>
                            <ProfileAccountActivity/>
                        </TabPanel>
                        {/* {profileTabs().map(this.renderTabs(address))} */}
                    </div>
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

    public renderTabs = (address: string) => (values: string[], index: number) => {
        const { classes } = this.props;
        const [name, url] = values;

        const isActive =  address === url;
        const menuStyle = classnames({
            [classes.activePage] : isActive,
            [classes.inActivePage] : !isActive
        })
        return (
            <>
                <Link to={url} className={menuStyle}>
                    <Typography variant="h6" component="div" >
                        {/* <FormattedMessage id={'page.body.deposit.tabs.crypto'} /> */}
                        {name}
                    </Typography>
                </Link>
            </>
        );
    }
}

// tslint:disable-next-line:no-any
export const ProfileScreen = injectIntl(withStyles(useStyles as {})(withRouter(ProfileComponent as any)));