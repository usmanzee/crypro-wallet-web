import * as React from 'react';
import { Spinner } from 'react-bootstrap';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import {
    WalletItemProps,
    CryptoIcon,
} from '../../components';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { PageHeader } from '../../containers/PageHeader';
import { setDocumentTitle } from '../../helpers';
import { scientificToDecimal } from '../../helpers/scientificToDecimal';
import {
    RootState,
    selectUserInfo,
    selectWallets,
    User,
    walletsData,
    walletsFetch
} from '../../modules';

import { createStyles, withStyles, Theme, fade } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
// import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { globalStyle } from '../../screens/materialUIGlobalStyle';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PeopleIcon from '@material-ui/icons/People';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';
import ArrowForwardIosTwoToneIcon from '@material-ui/icons/ArrowForwardIosTwoTone';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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


interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
}

interface WalletsState {
    tablePage: number;
    tableRowsPerPage: number;
    searchedValue: string;
    hideSmallBalances: boolean;
    isTrue: boolean;
    walletsData: WalletItemProps[];
    walletsDataLoading: boolean;
    walletsTableOpen: boolean;
    tabValue: number;
}

const useStyles = theme => ({
    ...globalStyle(theme),
    tableContainer: {
        paddingTop: theme.spacing(2)
    },
    currencyIcon: {
        width: "2.5rem",
        height: "2.5rem",
        [theme.breakpoints.only('xs')]: {
            width: "1.5rem",
            height: "1.5rem",
        },
    },
    overviewActionLink: {
        // color: theme.palette.secondary.main,
        // margin: `0px ${theme.spacing(1)}px`,
        '&:hover': {
            color: theme.palette.secondary.main,
            textDecoration: 'none'
            
        },
        // [theme.breakpoints.only('xs')]: {
        //     margin: '4px 0px',
        // },
    },
    actionLink: {
        color: theme.palette.secondary.main,
        margin: `0px ${theme.spacing(1)}px`,
        '&:hover': {
            color: theme.palette.secondary.main,
        },
        [theme.breakpoints.only('xs')]: {
            margin: '4px 0px',
        },
    },
    disabledActionLink: {
        pointerEvents: 'none',
        color: '#ccc',
        margin: `0px ${theme.spacing(1)}px`,
        [theme.breakpoints.only('xs')]: {
            margin: '4px 0px',
        },
    },
    emptyTableText: {
        textAlign: 'center',
        padding: `0px ${theme.spacing(5)}px`,
    },
    renderWalletsContent: {
        marginTop: '8px'
    },
    renderWallets: {
        [theme.breakpoints.only('xs')]: {
            display: 'none',
        },
    },
    renderMobileWallets: {
        [theme.breakpoints.only('xl')]: {
            display: 'none',
        },
        [theme.breakpoints.only('lg')]: {
            display: 'none',
        },
        [theme.breakpoints.only('md')]: {
            display: 'none',
        },
        [theme.breakpoints.only('sm')]: {
            display: 'none',
        },
    },
    mobileWalletsActions: {
        display: 'flex',
        flexDirection: 'column'
    },
    mobilePagination: {
        '& p': {
            '& span': {
                display: 'none'
            }
        }
    },
    inputBase: {
        padding: 10,
        width: '100%',
        borderBottom: '1px solid #dfe2e5',
        '& input': {
          borderRadius: 4,
          backgroundColor: theme.palette.common.white,
          padding: 8,
          transition: theme.transitions.create(['border-color', 'box-shadow']),
          border: '1px solid #ced4da',
          fontSize: 14,
          '&:focus': {
            boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
          },
        },
      },
      input: {
        marginLeft: theme.spacing(1),
        flex: 1,
      },
      iconButton: {
        padding: 10,
      },
      divider: {
        height: 28,
        margin: 4,
      },

});



type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class WalletsComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            tablePage: 0,
            tableRowsPerPage: 25,
            searchedValue: '',
            hideSmallBalances: false,
            isTrue: false,
            walletsData: this.props.wallets,
            walletsDataLoading: true,
            walletsTableOpen: false,
            tabValue: 0
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private pageTitle = this.translate('page.body.wallets.title');
    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');
        this.changeTab();
        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        const {
            wallets,
        } = this.props;

        if (wallets.length === 0 && next.wallets.length > 0) {

            this.setState({
                walletsData: next.wallets,
                walletsDataLoading: false,
            });
        }
    }

    public componentDidUpdate(prevProps, nextProps) {
        if (this.props.match.params.tabName !== prevProps.match.params.tabName) {
            this.changeTab();
        }
    }

    public changeTab = () => {
        const tabName = this.props.match.params.tabName;
        console.log(tabName);
        let activeTab = this.state.tabValue;
        if(tabName === 'overview') {
            activeTab = 0;
        }
        else if(tabName === 'spot') {
            activeTab = 1
        }
        else if(tabName === 'saving') {
            activeTab = 2
        }
        else if(tabName === 'p2p') {
            activeTab = 3
        }
        else {
            this.props.history.push('/wallets/overview');
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
        
        switch(newValue) {
            case 0:
                this.props.history.push('/wallets/overview');
                return;
            case 1:
                this.props.history.push('/wallets/spot');
                return;
            case 2:
                this.props.history.push('/wallets/saving');
                return;
            case 3:
                this.props.history.push('/wallets/p2p');
                return;
            default:
                this.props.history.push('/wallets/overview');
                return;
        }
        
    };

    public render() {
        const { wallets, classes } = this.props;
        const {
            searchedValue,
            hideSmallBalances,
        } = this.state;

        const headerActionLinks = [
            ['page.body.wallets.action.deposit', '/wallet/deposit/crypto'],
            ['page.body.wallets.action.withdraw', '/wallet/withdraw/crypto'],
        ];
        return (
            <React.Fragment>
                <PageHeader pageTitle={this.pageTitle} actionsLinks={headerActionLinks} />
                {wallets.length ? <EstimatedValue wallets={wallets} /> : ''}

                <Box className={classes.pageRoot} alignItems="center">
                    <Paper className={classes.pageContent}>
                        <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
                            <AntTabs 
                                value={this.state.tabValue} 
                                onChange={this.handleTabChange} 
                                indicatorColor="secondary"
                                textColor="secondary"
                                // variant="scrollable"
                                // scrollButtons="on"
                            >
                                <Tab component="a" label='Overview' {...a11yProps(0)} />
                                <Tab component="a" label='Spot' {...a11yProps(1)} />
                                <Tab component="a" label='Saving' {...a11yProps(3)} />
                                <Tab component="a" label='P2P' {...a11yProps(2)} />
                            </AntTabs>
                        </AppBar>
                        <TabPanel value={this.state.tabValue} index={0}>
                            {this.renderOverviewContent('overview')}
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={1}>
                            {this.renderWalletContent('spot')}
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={2}>
                            {this.renderWalletContent('saving')}
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={3}>
                            {this.renderWalletContent('P2P')}
                        </TabPanel>
                    </Paper>
                </Box>
            </React.Fragment>
        );
    }

    private renderWalletContent = (tabName: string) => {
        const { wallets, classes } = this.props;
        const {
            searchedValue,
            hideSmallBalances,
        } = this.state;
        const searchInputPlaceHolder = this.props.intl.formatMessage({ id: 'page.body.wallets.input.search.placeholder' })
        return (
            <div className={classes.renderWalletsContent}>
                <Paper component="form" style={{ display: 'flex', flexDirection: 'row' }}>
                    <IconButton aria-label="menu">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        fullWidth={true}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}
                        autoComplete='off'
                        value={searchedValue}
                        onChange={this.handleInputSearchChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={hideSmallBalances}
                                onChange={this.handleHideSmallBalancesCheckboxChange}
                                name="hideSmallBalances"
                                color="primary"
                            />
                        }
                        style={{ margin: '0px' }}
                        label={<FormattedMessage id={'page.body.wallets.checkbox.label.hide_balance'} />}
                    />
                </Paper>
                 {/* <TextField
                        // className={classes.inputBase}
                        placeholder={searchInputPlaceHolder || 'Search'}
                        name="search"
                        autoComplete='off'
                        value={searchedValue}
                        onChange={this.handleInputSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                /> */}
                
                
                <div>
                    {tabName}
                </div>
                <div className={classes.renderWallets}>
                    {this.renderWalletsTable()}
                </div>
                <div className={classes.renderMobileWallets}>
                    {this.renderWalletsMobileTable()}
                </div>
            </div>
        );
    }

    private StyledTableCell = withStyles((theme: Theme) =>
        createStyles({
            head: {
                backgroundColor: "rgb(228 224 224)",
                color: theme.palette.common.black,
                fontSize: 14,
            },
            body: {
                fontSize: 14,
            },
        }),
    )(TableCell);

    private renderOverviewContent = (tabName: string) => {
        const { classes } = this.props;
        return (
            <>
                <TableContainer className={classes.tableContainer}>
                    <Table aria-label="simple table">
                            <TableBody>
                                <TableRow hover>
                                    <this.StyledTableCell>
                                        <Link to={`/wallets/spot`} className={classes.overviewActionLink}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <ScatterPlotIcon style={{ fontSize: 25, color: 'grey', marginRight: '8px' }}/>
                                                    <div>
                                                        <span style={{ fontSize: 14, color: 'grey' }}>Spot</span>
                                                        <div style={{ display: 'flex', color: 'black'}}>
                                                            <span style={{ fontSize: 16, fontWeight: 600 }}>0.00000000</span>
                                                            <span style={{ fontSize: 14, marginLeft: '4px' }}>BTC</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ArrowForwardIosTwoToneIcon style={{ fontSize: 20, color: 'grey' }} />
                                            </div>
                                        </Link>
                                    </this.StyledTableCell>
                                </TableRow>
                                <TableRow hover>
                                    <this.StyledTableCell>
                                    <Link to={`/wallets/saving`} className={classes.overviewActionLink}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <PeopleIcon style={{ fontSize: 25, color: 'grey', marginRight: '8px' }}/>
                                                <div>
                                                    <span style={{ fontSize: 14, color: 'grey' }}>Saving</span>
                                                    <div style={{ display: 'flex', color: 'black'}}>
                                                        <span style={{ fontSize: 16, fontWeight: 600 }}>0.00000000</span>
                                                        <span style={{ fontSize: 14, marginLeft: '4px' }}>BTC</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowForwardIosTwoToneIcon style={{ fontSize: 20, color: 'grey' }} />
                                        </div>
                                    </Link>
                                        </this.StyledTableCell>
                                    </TableRow>
                                <TableRow hover>
                                    <this.StyledTableCell>
                                    <Link to={`/wallets/p2p`} className={classes.overviewActionLink}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <AccountBalanceWalletIcon style={{ fontSize: 25, color: 'grey', marginRight: '8px' }}/>
                                                <div>
                                                    <span style={{ fontSize: 14, color: 'grey' }}>P2P</span>
                                                    <div style={{ display: 'flex', color: 'black'}}>
                                                        <span style={{ fontSize: 16, fontWeight: 600 }}>0.00000000</span>
                                                        <span style={{ fontSize: 14, marginLeft: '4px' }}>BTC</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowForwardIosTwoToneIcon style={{ fontSize: 20, color: 'grey' }} />
                                        </div>
                                    </Link>
                                    </this.StyledTableCell>
                                </TableRow>
                            </TableBody>
                    </Table>
                </TableContainer>
            </>
        )
    }
    private renderWalletsTable = () => {
        const { tablePage, tableRowsPerPage, walletsData, walletsDataLoading } = this.state;
        const { classes } = this.props;
        return (
            <>
                <TableContainer className={classes.tableContainer}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.coin'} />
                                </this.StyledTableCell>
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.total'} />
                                </this.StyledTableCell>
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.available'} />
                                </this.StyledTableCell>
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.locked'} />
                                </this.StyledTableCell>
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.actions'} />
                                </this.StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {walletsData.length ?

                            <TableBody>
                                {walletsData.slice(tablePage * tableRowsPerPage, tablePage * tableRowsPerPage + tableRowsPerPage).map((wallet, index) => {
                                    const walletBalance: number = Number(wallet.balance) ? Number(wallet.balance) : 0.0000;
                                    const walletLocked: number = Number(wallet.locked) ? Number(wallet.locked) : 0.0000;
                                    const total: number = walletBalance + walletLocked;

                                    return <TableRow hover key={wallet.currency}>
                                        <this.StyledTableCell>
                                            {wallet.iconUrl ? (<img src={`${wallet.iconUrl} `} className={classes.currencyIcon} />) : (<CryptoIcon className={classes.currencyIcon} code={wallet.currency.toUpperCase()} />)}
                                            <span style={{ margin: "0 8px" }}>{wallet.currency.toUpperCase()}</span>
                                            <small>{wallet.name}</small>
                                        </this.StyledTableCell>
                                        <this.StyledTableCell>
                                            {+total.toFixed(wallet.precision)}
                                        </this.StyledTableCell>
                                        <this.StyledTableCell>{wallet.balance}</this.StyledTableCell>
                                        <this.StyledTableCell>{wallet.locked}</this.StyledTableCell>
                                        <this.StyledTableCell>
                                            <Link to={wallet.type === 'coin' ? `/wallet/deposit/crypto/${wallet.currency}` : `/wallet/deposit/fiat/${wallet.currency}`} className={wallet.depositEnabled ? classes.actionLink : classes.disabledActionLink}>
                                                <FormattedMessage id={'page.body.wallets.action.deposit'} />
                                            </Link>
                                            <Link to={wallet.type === 'coin' ? `/wallet/withdraw/crypto/${wallet.currency}` : `/wallet/withdraw/fiat/${wallet.currency}`} className={wallet.withdrawEnabled ? classes.actionLink : classes.disabledActionLink}>
                                                <FormattedMessage id={'page.body.wallets.action.withdraw'} />
                                            </Link>
                                            <Link to={`swap`} className={classes.actionLink}>
                                                <FormattedMessage id={'page.body.wallets.action.buy'} />
                                            </Link>
                                            <Link to={`trading`} className={classes.actionLink}>
                                                <FormattedMessage id={'page.body.wallets.action.trade'} />
                                            </Link>
                                        </this.StyledTableCell>
                                    </TableRow>
                                })}

                            </TableBody>
                            :
                            <>
                                {walletsDataLoading ?
                                    <>
                                        <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                            <CircularProgress size={20} /> :
                                        </caption>
                                    </> :
                                    <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                        <FormattedMessage id={'no.record.found'} />
                                    </caption>
                                }
                            </>
                        }
                    </Table>
                </TableContainer>

                {walletsData.length ?
                    <TablePagination
                        labelRowsPerPage={<FormattedMessage id={'page.body.swap.history.table.pagination.text.rows_per_page'} />}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={walletsData.length}
                        rowsPerPage={tableRowsPerPage}
                        page={tablePage}
                        onChangePage={this.handleTablePageChange}
                        onChangeRowsPerPage={this.handleTableRowsChangePerPage}
                    /> :
                    ""
                }
            </>
        )
    }
    private renderWalletsMobileTable = () => {
        const { tablePage, tableRowsPerPage, walletsData, walletsDataLoading, walletsTableOpen } = this.state;
        const { classes } = this.props;
        return (
            <>
                <TableContainer className={classes.tableContainer}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <this.StyledTableCell />
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.coin'} />
                                </this.StyledTableCell>
                                <this.StyledTableCell>
                                    <FormattedMessage id={'page.body.wallets.table.header.actions'} />
                                </this.StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {walletsData.length ?

                            <TableBody>
                                {walletsData.slice(tablePage * tableRowsPerPage, tablePage * tableRowsPerPage + tableRowsPerPage).map((wallet, index) => {
                                    return (
                                        <>
                                            <this.CollapsableTable wallet={wallet} />
                                        </>
                                    )
                                })}

                            </TableBody>
                            :
                            <>
                                {walletsDataLoading ?
                                    <>
                                        <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                            <CircularProgress size={15} /> :
                                        </caption>
                                    </> :
                                    <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                        <FormattedMessage id={'no.record.found'} />
                                    </caption>
                                }
                            </>
                        }
                    </Table>
                </TableContainer>

                {walletsData.length ?
                    <TablePagination
                        className={classes.mobilePagination}
                        labelRowsPerPage={<FormattedMessage id={'page.body.swap.history.table.pagination.text.rows_per_page'} />}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={walletsData.length}
                        rowsPerPage={tableRowsPerPage}
                        page={tablePage}
                        onChangePage={this.handleTablePageChange}
                        onChangeRowsPerPage={this.handleTableRowsChangePerPage}
                    /> :
                    ""
                }
            </>
        )
    }

    private CollapsableTable = (props: { wallet: WalletItemProps }) => {
        const { classes } = this.props;
        const { wallet } = props;
        const [open, setOpen] = React.useState(false);

        const walletBalance: number = Number(wallet.balance) ? Number(wallet.balance) : 0.0000;
        const walletLocked: number = Number(wallet.locked) ? Number(wallet.locked) : 0.0000;
        const total: number = walletBalance + walletLocked;

        return (
            <>
                <TableRow hover key={wallet.currency}>
                    <this.StyledTableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </this.StyledTableCell>
                    <this.StyledTableCell>
                        {wallet.iconUrl ? (<img src={`${wallet.iconUrl} `} className={classes.currencyIcon} />) : (<CryptoIcon className={classes.currencyIcon} code={wallet.currency.toUpperCase()} />)}
                        <span style={{ margin: "0 8px" }}>{wallet.currency.toUpperCase()}</span>
                        <small>{wallet.name}</small>
                    </this.StyledTableCell>
                    <this.StyledTableCell className={classes.mobileWalletsActions}>
                        <Link to={wallet.type === 'coin' ? `/wallet/deposit/crypto/${wallet.currency}` : `/wallet/deposit/fiat/${wallet.currency}`} className={wallet.depositEnabled ? classes.actionLink : classes.disabledActionLink}>
                            <FormattedMessage id={'page.body.wallets.action.deposit'} />
                        </Link>
                        <Link to={wallet.type === 'coin' ? `/wallet/withdraw/crypto/${wallet.currency}` : `/wallet/withdraw/fiat/${wallet.currency}`} className={wallet.withdrawEnabled ? classes.actionLink : classes.disabledActionLink}>
                            <FormattedMessage id={'page.body.wallets.action.withdraw'} />
                        </Link>
                        <Link to={`swap`} className={`${classes.actionLink} ${classes.actionLink}`}>
                            <FormattedMessage id={'page.body.wallets.action.buy'} />
                        </Link>
                        <Link to={`trading`} className={`${classes.actionLink} ${classes.actionLink}`}>
                            <FormattedMessage id={'page.body.wallets.action.trade'} />
                        </Link>
                    </this.StyledTableCell>
                </TableRow>

                <TableRow key={`${wallet.currency}_mobile`}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <this.StyledTableCell><FormattedMessage id={'page.body.wallets.table.header.total'} /></this.StyledTableCell>
                                            <this.StyledTableCell><FormattedMessage id={'page.body.wallets.table.header.available'} /></this.StyledTableCell>
                                            <this.StyledTableCell><FormattedMessage id={'page.body.wallets.table.header.locked'} /></this.StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <this.StyledTableCell>
                                                {+total.toFixed(wallet.precision)}
                                            </this.StyledTableCell>
                                            <this.StyledTableCell>{wallet.balance}</this.StyledTableCell>
                                            <this.StyledTableCell>{wallet.locked}</this.StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    }

    private handleTablePageChange = (event: unknown, newPage: number) => {

        this.setState({
            tablePage: newPage
        });
    };

    private handleTableRowsChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            tableRowsPerPage: (+event.target.value),
            tablePage: 0
        })
    };
    private handleHideSmallBalancesCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ hideSmallBalances: event.target.checked }, () => {
            this.filteredRecords();
        });
    };

    private handleInputSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        this.setState({ searchedValue: event.target.value }, () => {
            this.filteredRecords();
        });
    }

    private filteredRecords = () => {
        const { wallets } = this.props;
        const { searchedValue, hideSmallBalances } = this.state;
        let filteredData = [];

        filteredData = wallets.filter(e => {
            return (e.currency.includes(searchedValue.toLowerCase()) || e.name.toLowerCase().includes(searchedValue)) && (hideSmallBalances ? e.balance > 0 : e);
        })
        this.setState({
            walletsData: filteredData
        });

    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    clearWallets: () => dispatch(walletsData([])),
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(withStyles(useStyles as {})(withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any)));
