import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { 
    WalletItemProps,
    CryptoIcon 
} from '../../components';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { setDocumentTitle } from '../../helpers';
import { 
    RootState, 
    selectUserInfo, 
    selectWallets, 
    User, 
    walletsData, 
    walletsFetch 
} from '../../modules';

import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button as MaterialButton,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Collapse,
    Checkbox,
    FormGroup,
    FormControlLabel,
    InputAdornment,
    IconButton
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

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
}

const useStyles = theme => ({
    headerPaper: {
        padding: "32px 20px"
    },
    withdrawButton: {
        margin: `0px ${theme.spacing(1)}px`,
    },
    pagePaper: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    },
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
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private pageTitle = this.translate('page.body.wallets.title');
    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');

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

    public render() {
        const { wallets, classes} = this.props;
        const {
            searchedValue, 
            hideSmallBalances,
        } = this.state;

        const searchInputPlaceHolder = this.props.intl.formatMessage({ id: 'page.body.wallets.input.search.placeholder' })
        return (
            <React.Fragment>
                <Box>
                    <Paper className={classes.headerPaper}>
                        <Grid container>
                            <Grid item xs={4} sm={6} md={8} lg={10}>
                                <Typography variant="h4" display="inline">{this.pageTitle}</Typography>
                            </Grid>
                            <Grid className={classes.headeractionButton} item xs={8} sm={6} md={4} lg={2}>
                                <Link to="/wallet/deposit/crypto" style={{ textDecoration: 'none' }}>
                                    <MaterialButton variant="contained" color="secondary" size="small">
                                        <FormattedMessage id={'page.body.wallets.action.deposit'} />
                                    </MaterialButton>
                                </Link>
                                <Link to="/wallet/withdraw/crypto" style={{ textDecoration: 'none' }}>
                                    <MaterialButton className={classes.withdrawButton} variant="outlined" color="secondary" size="small">
                                        <FormattedMessage id={'page.body.wallets.action.withdraw'} />
                                    </MaterialButton>
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                {wallets.length && <EstimatedValue wallets={wallets} />}

                <Box mt={2} pl={3} pr={3} alignItems="center">
                    <Paper className={classes.pagePaper}>
                         <FormGroup row>
                            <TextField 
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
                        </FormGroup>
                        <div className={classes.renderWallets}>
                            {this.renderWalletsTable()}
                        </div>
                        <div className={classes.renderMobileWallets}>
                            {this.renderWalletsMobileTable()}
                        </div>
                    </Paper>
                </Box>
            </React.Fragment>
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
                                    const walletBalance: number = wallet.balance ? +wallet.balance : 0.0000;
                                    const walletLocked: number = wallet.locked ? +wallet.locked : 0.0000;
                                    return <TableRow hover key={wallet.currency}>
                                        <this.StyledTableCell>
                                            {wallet.iconUrl ? (<img src={`${ wallet.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon className={classes.currencyIcon} code={wallet.currency.toUpperCase()} />)}
                                            <span style={{ margin: "0 8px" }}>{wallet.currency.toUpperCase()}</span>
                                            <small>{wallet.name}</small>
                                        </this.StyledTableCell>
                                        <this.StyledTableCell>{+walletBalance + walletLocked}</this.StyledTableCell>
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
                                            <Spinner animation="border" variant="primary" /> :
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
                                            <Spinner animation="border" variant="primary" /> :
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
        const walletBalance: number = wallet.balance ? +wallet.balance : 0.0000;
        const walletLocked: number = wallet.locked ? +wallet.locked : 0.0000;

        return (
            <>
                <TableRow hover key={wallet.currency}>
                    <this.StyledTableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </this.StyledTableCell>
                    <this.StyledTableCell>
                        {wallet.iconUrl ? (<img src={`${ wallet.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon className={classes.currencyIcon} code={wallet.currency.toUpperCase()} />)}
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
                                        <this.StyledTableCell>Total</this.StyledTableCell>
                                        <this.StyledTableCell>Available</this.StyledTableCell>
                                        <this.StyledTableCell>Locked</this.StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <this.StyledTableCell>{+walletBalance + walletLocked}</this.StyledTableCell>
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
        const {wallets} = this.props;
        const { searchedValue, hideSmallBalances } = this.state;
        let filteredData = [];

        filteredData = wallets.filter(e => {
            return (e.currency.includes(searchedValue) || e.name.toLowerCase().includes(searchedValue)) && (hideSmallBalances ? e.balance > 0 : e);
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
