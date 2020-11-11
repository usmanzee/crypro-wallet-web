import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import { TabPanel } from '../../components';
import { HistoryElement } from '../../containers/HistoryElement';
import { setDocumentTitle } from '../../helpers';
import {
    fetchHistory,
    marketsFetch,
    resetHistory,
    walletsFetch,
} from '../../modules';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

interface DispatchProps {
    resetHistory: typeof resetHistory;
    fetchMarkets: typeof marketsFetch;
    fetchWallets: typeof walletsFetch;
    fetchHistory: typeof fetchHistory;
}

type Props = DispatchProps & InjectedIntlProps;

interface State {
    tab: string;
    currentTabIndex: number;
    tabValue: number;
}

const useStyles = theme => ({
    pageHeader: {
        padding: "32px 20px"
    },
    pageContent: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
        '& .cr-table-header__content': {
            display: 'none'
        },
        '& tr': {
            borderBottom: '1px solid #ddd',
            height: '50px',
            '& a': {
                color: theme.palette.text.secondary,
                '&:hover': {
                    color: theme.palette.secondary.main,
                },
            }
        }
    },
});

class History extends React.Component<Props, State> {
    // public state = {
    //     tab: 'deposits',
    //     currentTabIndex: 0,
    // };
    constructor(props: Props) {
        super(props);

        this.state = {
            tab: 'deposits', 
            currentTabIndex: 0,
            tabValue: 0
		};
    }

    public tabMapping = ['deposits', 'withdraws', 'trades'];

    public componentDidMount() {
        setDocumentTitle('History');
        this.props.fetchMarkets();
        this.props.fetchWallets();
    }

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public MaterialTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box p={3}>
                <Typography>{children}</Typography>
                </Box>
            )}
            </div>
        );
    }

    public a11yProps(index: any) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }

    public AntTabs = withStyles({
        root: {
            backgroundColor: "white",
            borderBottom: '0.1rem solid rgb(170, 170, 170)',
            boxShadow: "none"
          }
    })(Tabs);

    public handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        this.setState({
            tabValue: newValue
        })
    };

    public render() {
        const { classes } = this.props;
        return (
            <> 
                <Box>
                    <Paper className={classes.pageHeader}>
                        <Grid container>
                            <Grid item md={12}>
                                <Typography variant="h4" display="inline">History</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                <Box mt={3} pl={3} pr={3} alignItems="center">
                    <Paper className={classes.pageContent}>
                        <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
                            <this.AntTabs 
                                value={this.state.tabValue} 
                                onChange={this.handleTabChange} 
                                indicatorColor="secondary"
                                textColor="secondary"
                                variant="scrollable"
                                scrollButtons="on"
                            >
                                <Tab component="a" label={this.props.intl.formatMessage({id: 'page.body.history.deposit'})} {...this.a11yProps(0)} />
                                <Tab component="a" label={this.props.intl.formatMessage({id: 'page.body.history.withdraw'})} {...this.a11yProps(1)} />
                                <Tab component="a" label={this.props.intl.formatMessage({id: 'page.body.history.trade'})} {...this.a11yProps(2)} />
                                
                            </this.AntTabs>
                        </AppBar>
                        <this.MaterialTabPanel value={this.state.tabValue} index={0}>
                            <HistoryElement type="deposits" />
                        </this.MaterialTabPanel>
                        <this.MaterialTabPanel value={this.state.tabValue} index={1}>
                            <HistoryElement type="withdraws" />
                        </this.MaterialTabPanel>
                        <this.MaterialTabPanel value={this.state.tabValue} index={2}>
                            <HistoryElement type="trades" />
                        </this.MaterialTabPanel>
                    </Paper>
                </Box>     
                {/* <div className="pg-history-tab pg-container">
                    <div className="pg-history-tab__tabs-content">
                        <TabPanel
                            panels={this.renderTabs()}
                            onTabChange={this.handleMakeRequest}
                            currentTabIndex={this.state.currentTabIndex}
                            onCurrentTabChange={this.onCurrentTabChange}
                        />
                    </div>
                </div> */}
            </>
        );
    }

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private handleMakeRequest = (index: number) => {
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }
        this.props.resetHistory();
        this.setState({ tab: this.tabMapping[index] });
    };

    private renderTabs = () => {
        const { tab } = this.state;

        return [
            {
                content: tab === 'deposits' ? <HistoryElement type="deposits" /> : null,
                label: this.props.intl.formatMessage({id: 'page.body.history.deposit'}),
            },
            {
                content: tab === 'withdraws' ? <HistoryElement type="withdraws" /> : null,
                label: this.props.intl.formatMessage({id: 'page.body.history.withdraw'}),
            },
            {
                content: tab === 'trades' ? <HistoryElement type="trades" /> : null,
                label: this.props.intl.formatMessage({id: 'page.body.history.trade'}),
            },
        ];
    };
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchHistory: payload => dispatch(fetchHistory(payload)),
    resetHistory: () => dispatch(resetHistory()),
});

export const HistoryScreen = injectIntl(withStyles(useStyles as {})(connect(null, mapDispatchToProps)(History)));