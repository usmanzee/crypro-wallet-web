import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { TabPanel } from '../../components';
import { OrdersElement } from '../../containers/OrdersElement';
import { setDocumentTitle } from '../../helpers';
import {
    marketsFetch,
    ordersCancelAllFetch,
    resetOrdersHistory,
    RootState,
    selectOrdersHistory,
    selectUserLoggedIn,
} from '../../modules';
import {RangerConnectFetch, rangerConnectFetch} from '../../modules/public/ranger';
import {RangerState} from '../../modules/public/ranger/reducer';
import {selectRanger} from '../../modules/public/ranger/selectors';
import { OrderCommon } from '../../modules/types';

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

interface ReduxProps {
    list: OrderCommon[];
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
    resetOrdersHistory: typeof resetOrdersHistory;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

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
            '& svg': {
                cursor: 'pointer',
                '&:hover': {
                    '& path': {
                        fill: theme.palette.secondary.main,
                    },
                },
            }
        }
    },
    cancelAllDiv: {
        textAlign: 'right',
        background: '#fff',
    },
    cancelAllLink: {
        '&:focus': {
            outline: 'none',
            background: '#fff'
        },
        '&:hover': {
            color: theme.palette.secondary.main,
            background: '#fff'
        },
        [theme.breakpoints.only('xs')]: {
            margin: '8px 0 0 auto',
        },

    },
    tableContainer: {
        paddingTop: theme.spacing(2)
    },
});

class Orders extends React.PureComponent<Props, State> {
    // public state = { 
    //     tab: 'open', 
    //     currentTabIndex: 0,
    //     tabValue: 0
    // };
    constructor(props: Props) {
        super(props);

        this.state = {
            tab: 'open', 
            currentTabIndex: 0,
            tabValue: 0
		};
    }

    public tabMapping = ['open', 'all'];

    public componentDidMount() {
        const {
            rangerState: {connected},
            userLoggedIn,
        } = this.props;

        setDocumentTitle('Orders');
        this.props.marketsFetch();

        if (!connected) {
            this.props.rangerConnect({withAuth: userLoggedIn});
        }
    }

    public componentWillUnmount() {
        this.props.resetOrdersHistory();
    }

    public MaterialTabPanel(props: TabPanelProps) {
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
                <Box style={{ marginTop: "10px" }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
            </div>
        );
    }

    public a11yProps(index: any) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
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

    public cancelAll = () => {
        const { classes } = this.props;
        return (
            <div className={ classes.cancelAllDiv }>
                { this.props.list.length ? 
                    <Button 
                        onClick={this.handleCancelAll}
                        className={ classes.cancelAllLink }
                        endIcon={<CloseIcon />}
                    >
                        <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
                    </Button> : null
                }
            </div>
        );
    }

    public render() {
        const { classes } = this.props;

        return (
            <>
                <Box>
                    <Paper className={classes.pageHeader}>
                        <Grid container>
                            <Grid item md={12}>
                                <Typography variant="h4" display="inline">Orders</Typography>
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
                            >
                                <Tab component="a" label={this.props.intl.formatMessage({ id: 'page.body.openOrders.tab.open'})} {...this.a11yProps(0)} />
                                <Tab component="a" label={this.props.intl.formatMessage({ id: 'page.body.openOrders.tab.all'})} {...this.a11yProps(1)} />
                                
                            </this.AntTabs>
                                {this.cancelAll()}
                        </AppBar>
                        <this.MaterialTabPanel value={this.state.tabValue} index={0}>
                            <OrdersElement type="open"/>
                        </this.MaterialTabPanel>
                        <this.MaterialTabPanel value={this.state.tabValue} index={1}>
                        
                            <OrdersElement type="all"/>
                        </this.MaterialTabPanel>
                        {/* <div className="pg-orders-tab">
                            <div className="pg-orders-tab__tabs-content">
                                <TabPanel
                                    panels={this.renderTabs()}
                                    onTabChange={this.handleMakeRequest}
                                    optionalHead={this.cancelAll}
                                    currentTabIndex={this.state.currentTabIndex}
                                    onCurrentTabChange={this.onCurrentTabChange}
                                />
                            </div>
                        </div> */}
                    </Paper>
                </Box>        
            </>
        );
    }

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private handleMakeRequest = (index: number) => {
        this.renderTabs();
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }
        this.props.resetOrdersHistory();
        this.setState({ tab: this.tabMapping[index] });
    };

    private renderTabs = () => {
        const { tab } = this.state;

        return [
            {
                content: tab === 'open' ? <OrdersElement type="open"/> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.openOrders.tab.open'}),
            },
            {
                content: tab === 'all' ? <OrdersElement type="all" /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.openOrders.tab.all'}),
            },
        ];
    };

    private handleCancelAll = () => this.props.ordersCancelAll();
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    list: selectOrdersHistory(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        marketsFetch: () => dispatch(marketsFetch()),
        ordersCancelAll: () => dispatch(ordersCancelAllFetch()),
        resetOrdersHistory: () => dispatch(resetOrdersHistory()),
        rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    });

const OrdersTabScreen = injectIntl(withStyles(useStyles as {})(connect(mapStateToProps, mapDispatchToProps)(Orders)));

export {
    OrdersTabScreen,
};
