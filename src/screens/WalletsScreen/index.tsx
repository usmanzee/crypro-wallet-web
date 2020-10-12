import classnames from 'classnames';
import * as React from 'react';
import { Button, Dropdown, DropdownButton,FormControl,InputGroup, Spinner } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchRate, getExchangeHistory, postExchange } from '../../apis/exchange';
//fetchRate
import { Blur, CurrencyInfo, Decimal, DepositCrypto, DepositFiat, DepositTag, SummaryField, TabPanel, WalletItemProps, WalletList, CryptoIcon } from '../../components';
import { Withdraw, WithdrawProps } from '../../containers';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { formatCCYAddress, setDocumentTitle } from '../../helpers';
//import MaterialTable from "material-table";
import { alertPush, beneficiariesFetch, Beneficiary, currenciesFetch, Currency, RootState, selectBeneficiariesActivateSuccess, selectBeneficiariesDeleteSuccess, selectCurrencies, selectHistory, selectMobileWalletUi, selectUserInfo, selectWalletAddress, selectWallets, selectWalletsAddressError, selectWalletsLoading, selectWithdrawSuccess, setMobileWalletUi, User, WalletHistoryList, walletsAddressFetch, walletsData, walletsFetch, walletsWithdrawCcyFetch } from '../../modules';
import { CommonError } from '../../modules/types';


import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button as MaterialButton,
    InputBase,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    FormGroup,
    FormControlLabel,
    InputAdornment
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';


interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawSuccess: boolean;
    addressDepositError?: CommonError;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    selectedWalletAddress: string;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    currenciesFetch: typeof currenciesFetch;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WalletsState {
    activeIndex: number;
    rid: string;
    otpCode: string;
    amount: string;
    beneficiary: Beneficiary;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    bchAddress?: string;
    filteredWallets?: WalletItemProps[] | null;
    tab: string;
    withdrawDone: boolean;
    total: string;
    currentTabIndex: number;
    askAmount: string;
    bidAmount: string;
    askCurrency: string;
    bidCurrency: string;
    history: [];

    tablePage: number;
    tableRowsPerPage: number;
    searchedValue: string;
    hideSmallBalances: boolean;
    isTrue: boolean;
    walletsData: WalletItemProps[];
}

const useStyles = theme => ({
    searchInputTable: {
        opacity: '0.6',
        padding: `0px ${theme.spacing(1)}px`,
        fontSize: '1.3rem',
        backgroundColor: '#f2f2f2',
        borderRadius: "2px",
        border: `1px solid #fff`,
        
        "&.Mui-focused": {
            border: `1px solid ${theme.palette.primary.main}`
        },
        '& .MuiSvgIcon-root': {
            marginRight: theme.spacing(1)
        }
    },
    headerPaper: {
        // height: "100px", 
        padding: "32px 20px"
    },
    headeractionButton: {
        // margin: `0px 8px`,
    },
    withdrawButton: {
        margin: `0px ${theme.spacing(1)}px`,
    },
    pagePaper: {
        // height: "120px", 
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    },
    tableContainer: {
        paddingTop: theme.spacing(2)
    },
    currencyIcon: {
        width: "2.5rem", 
        height: "2.5rem"
    },
    actionLink: {
        color: theme.palette.secondary.main,
        margin: `0px ${theme.spacing(1)}px`,
        '&:hover': {
            color: theme.palette.secondary.main,
        }
    },
    disabledActionLink: {
        pointerEvents: 'none',
        color: '#ccc',
        margin: `0px ${theme.spacing(1)}px`,
    },
    emptyTableText: {
        textAlign: 'center',
        padding: `0px ${theme.spacing(5)}px`,
    }
});

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class WalletsComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            rid: '',
            amount: '',
            beneficiary: defaultBeneficiary,
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: '',
            currentTabIndex: 0,
            askAmount:'',
            bidAmount:'0',
            askCurrency: 'btc',
            bidCurrency: 'btc',
            history: [],
            tablePage: 0,
            tableRowsPerPage: 25,
            searchedValue: '',
            hideSmallBalances: false,
            isTrue: false,
            walletsData: this.props.wallets
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private pageTitle = this.translate('page.body.wallets.title');
    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');
        const { wallets, fetchAddress } = this.props;
        const { selectedWalletIndex } = this.state;

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (wallets.length > 0) {
            this.props.fetchBeneficiaries();
        }

        if (selectedWalletIndex === -1 && wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            wallets[0].type === 'coin' && wallets[0].balance && fetchAddress({ currency: wallets[0].currency });
        }

        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }
        //this.exchangeHistory();
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        const {
            wallets,
            beneficiariesActivateSuccess,
            beneficiariesDeleteSuccess,
            withdrawSuccess,
        } = this.props;

        this.setState({
            walletsData: wallets
        });
        this.filteredRecords();

        if (wallets.length === 0 && next.wallets.length > 0) {
            this.setState({
                selectedWalletIndex: 0,
            });
            // this.props.fetchBeneficiaries();
            next.wallets[0].type === 'coin' && next.wallets[0].balance && this.props.fetchAddress({ currency: next.wallets[0].currency });
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if ((next.beneficiariesActivateSuccess && !beneficiariesActivateSuccess) ||
            (next.beneficiariesDeleteSuccess && !beneficiariesDeleteSuccess)) {
            this.props.fetchBeneficiaries();
        }
    }
     private async exchangeHistory () {

         try {
             const data = await getExchangeHistory();
             if (data.length > 0){

                 this.setState({history: data});
             }

         } catch (error) {

         }

     }

    public render() {
        const { wallets, historyList, mobileWalletChosen, walletsLoading } = this.props;
        const {
            rid,
            beneficiary,
            total,
            selectedWalletIndex,
            filteredWallets,
            withdrawSubmitModal,
            withdrawConfirmModal,
            currentTabIndex,
            walletsData
        } = this.state;

        const formattedWallets = wallets.map((wallet: WalletItemProps) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

        let confirmationAddress = '';
        if (wallets[selectedWalletIndex]) {
            confirmationAddress = wallets[selectedWalletIndex].type === 'fiat' ? (
                beneficiary.name
            ) : (
                rid
                //beneficiary.data ? (beneficiary.data.address as string) : ''
            );
        }

        return (
            <React.Fragment>
                {/* {wallets.length && <EstimatedValue wallets={wallets} />} */}
                {this.renderWalletTable()}
                {/* <div className="pg-container pg-wallet">
                    <div className="text-center">
                        {walletsLoading && <Spinner animation="border" variant="primary" />}
                    </div>
                    <div className={`row no-gutters pg-wallet__tabs-content ${!historyList.length && 'pg-wallet__tabs-content-height'}`}>
                        <div className={`col-md-4 col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                            <WalletList
                                onWalletSelectionChange={this.onWalletSelectionChange}
                                walletItems={filteredWallets || formattedWallets}
                                activeIndex={this.state.activeIndex}
                                onActiveIndexChange={this.onActiveIndexChange}
                            />
                        </div>
                        <div className={`pg-wallet__tabs col-md-7 col-sm-12 col-12 ${!mobileWalletChosen && 'd-none d-md-block'}`}>
                            <TabPanel
                                panels={this.renderTabs()}
                                onTabChange={this.onTabChange}
                                currentTabIndex={currentTabIndex}
                                onCurrentTabChange={this.onCurrentTabChange}
                            />
                        </div>
                    </div>
                    <ModalWithdrawSubmit
                        show={withdrawSubmitModal}
                        currency={selectedCurrency}
                        onSubmit={this.toggleSubmitModal}
                    />
                    <ModalWithdrawConfirmation
                        show={withdrawConfirmModal}
                        amount={total}
                        currency={selectedCurrency}
                        rid={confirmationAddress}
                        onSubmit={this.handleWithdraw}
                        onDismiss={this.toggleConfirmModal}
                    />
                </div> */}
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

    private disableActionLink = (walletIndex) => {
        const { wallets } = this.props;

        return wallets[walletIndex].type === 'fiat' || wallets[walletIndex].balance;
    }

    private renderWalletTable = () => {
        const { tablePage, tableRowsPerPage, searchedValue, hideSmallBalances, walletsData } = this.state;
        const { wallets } = this.props;
        const { classes } = this.props;
        const searchInputPlaceHolder = this.props.intl.formatMessage({ id: 'page.body.wallets.input.search.placeholder' })
        return  <>
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
                                {/* <MaterialButton variant="outlined" color="secondary" href="#outlined-buttons">
                                    <FormattedMessage id={'page.body.wallets.action.transfer'} />
                                </MaterialButton> */}
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
                                // className={ classes.searchInputTable }
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
                                // startAdornment={
                                //     <SearchIcon fontSize="small" />
                                // }
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={hideSmallBalances}
                                    // onClick={this.handleHideSmallBalancesCheckboxClick}
                                    onChange={this.handleHideSmallBalancesCheckboxChange}
                                    name="hideSmallBalances"
                                    color="primary"
                                />
                                }
                                style={{ margin: '0px' }}
                                label={<FormattedMessage id={'page.body.wallets.checkbox.label.hide_balance'} />}
                            />
                        </FormGroup>
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
                                                    <Link to={`trading`} className={classes.actionLink}>
                                                        <FormattedMessage id={'page.body.wallets.action.trade'} />
                                                    </Link>
                                                </this.StyledTableCell>
                                            </TableRow>
                                        })}
                                        
                                    </TableBody> :
                                    <>
                                        <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                            <FormattedMessage id={'no.record.found'} />
                                        </caption>
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
                    </Paper>
                </Box>
                </>
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
        this.setState({
            hideSmallBalances: event.target.checked
        });
        this.filteredRecords();
    };

    private handleInputSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            searchedValue: event.target.value
        });
        this.filteredRecords();
    }

    private filteredRecords = () => {
        const {wallets} = this.props;
        const { searchedValue, hideSmallBalances, walletsData } = this.state;
        let filteredData = [];

        filteredData = wallets.filter(e => {
            return (e.currency.includes(searchedValue) || e.name.toLowerCase().includes(searchedValue)) && (hideSmallBalances ? e.balance > 0 : e);
        })

        this.setState({
            walletsData: filteredData
        });
    
    }

    private onTabChange = (index, label) => this.setState({ tab: label });

    private onActiveIndexChange = index => this.setState({ activeIndex: index });

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
            withdrawDone: true,
        }));
    };

    private toggleConfirmModal = (rid?: string, amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
        this.setState((state: WalletsState) => ({
            rid: rid || '',
            amount: amount || '',
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            withdrawDone: false,
        }));
    };

    private renderTabs() {
        const { tab, selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }

        const showWithdraw = wallets[selectedWalletIndex].type === 'fiat' || wallets[selectedWalletIndex].balance;

        return [
            {
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit(showWithdraw) : null,
                label: this.translate('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.withdraw') ? this.renderWithdraw() : null,
                label: this.translate('page.body.wallets.tabs.withdraw'),
                disabled: !showWithdraw,
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.convert') ? this.renderExchange() : null,
                label: this.translate('page.body.wallets.tabs.convert'),
                disabled: !showWithdraw,
            },
        ];
    }

    private handleWithdraw = () => {
        const { selectedWalletIndex, otpCode, beneficiary, rid, total } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
        if (this.props.wallets[selectedWalletIndex].type === 'coin'){
        const withdrawRequest = {
            rid,
            amount: total,
            currency: currency.toLowerCase(),
            otp: otpCode,
        };
        this.props.walletsWithdrawCcy(withdrawRequest);
        } else{
            const withdrawRequest = {
                amount: total,
                currency: currency.toLowerCase(),
                otp: otpCode,
                beneficiary_id: beneficiary.id,
            };
            this.props.walletsWithdrawCcy(withdrawRequest);
        }
        this.toggleConfirmModal();
    };

    private handleOnCopy = () => {
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    private handleGenerateAddress = () => {
        const { selectedWalletIndex } = this.state;
        console.log(selectedWalletIndex);
        const { wallets } = this.props;

        if (!wallets[selectedWalletIndex].address && wallets.length && wallets[selectedWalletIndex].type !== 'fiat') {
            this.props.fetchAddress({ currency: wallets[selectedWalletIndex].currency });
        }
    };

    private renderDeposit = (isAccountActivated: boolean) => {
        const { addressDepositError, wallets, user, selectedWalletAddress, currencies } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyItem = (currencies && currencies.find(item => item.id === currency)) || { min_confirmations: 6 };
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
                                                   { confirmations: currencyItem.min_confirmations });
        const error = addressDepositError ?
            this.props.intl.formatMessage({id: addressDepositError.message}) :
            this.props.intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.error'});
        const walletAddress = formatCCYAddress(currency, selectedWalletAddress);

        const buttonLabel = `
            ${this.translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${currency.toUpperCase()} ${this.translate('page.body.wallets.tabs.deposit.ccy.button.address')}
        `;
        const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
            'pg-blur-deposit-crypto--active': isAccountActivated,
        });

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    {currencyItem && currencyItem.deposit_enabled === false ? (
                        <Blur
                            className={blurCryptoClassName}
                            text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
                        />
                    ) : null}
                    <DepositCrypto
                        data={walletAddress.split('?dt=').length === 2 ? walletAddress.split('?dt=')[0] : walletAddress}
                        handleOnCopy={this.handleOnCopy}
                        error={error}
                        text={text}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        handleGenerateAddress={this.handleGenerateAddress}
                        buttonLabel={buttonLabel}
                        isAccountActivated={isAccountActivated}
                    />
                    {walletAddress.split('?dt=').length === 2 ?
                        <DepositTag
                        data={walletAddress.split('?dt=')[1]}
                        handleOnCopy={() => {navigator.clipboard.writeText(walletAddress.split('?dt=')[1]);}}
                        error={error}
                        text={'Add Destination Tag in your deposit'}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={'Destination Tag'}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        />:null
                    }
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    {currencyItem && currencyItem.deposit_enabled === false ? (
                        <Blur
                            className="pg-blur-deposit-fiat"
                            text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
                        />
                    ) : null}
                    <DepositFiat title={this.title} description={this.description} uid={user ? user.uid : ''} currency={currency}/>
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        }
    };

    private renderWithdraw = () => {
        const { currencies, user, wallets, walletsError } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyItem = (currencies && currencies.find(item => item.id === currency));

        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {currencyItem && currencyItem.withdrawal_enabled === false ? (
                    <Blur
                        className="pg-blur-withdraw"
                        text={this.translate('page.body.wallets.tabs.withdraw.disabled.message')}
                    />
                ) : null}
                {this.renderWithdrawContent()}
                {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
            </React.Fragment>
        );
    };

    private renderExchange = () => {
        // const { walletsError, user, wallets } = this.props;
        const { walletsError, wallets } = this.props;
        //console.log('wallets', wallets)
        // const { selectedWalletIndex } = this.state;
        // const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

        return (
            <React.Fragment>
                {/* <CurrencyInfo wallet={wallets[selectedWalletIndex]}/> */}
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {this.renderExchangeContent(wallets)}
                {/* {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />} */}
                {this.state.history.length > 0 ?
            <div>
            {/* <MaterialTable
          columns={[
              //@ts-ignore
            { title: "Date", field: "created_at", type: "datetime" },
            { title: "From",
            field: "in_amount",
            //@ts-ignore
            render: rowData => <p>{rowData.in_amount} {rowData.in_currency_id.toUpperCase()}</p>
            },
            { title: "To",
            field: "out_amount_requested",
            //@ts-ignore
            render: rowData => <p>{rowData.out_amount_requested} {rowData.out_currency_id.toUpperCase()}</p> },
            {
              title: "Status",
              field: "status",

            }
          ]}
          data={this.state.history}
          title="Buy and Sell History"
        /> */}
        </div> :null}
            </React.Fragment>
        );
    };

    private renderWithdrawContent = () => {
        const { withdrawDone, selectedWalletIndex } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { user: { level, otp }, wallets } = this.props;
        const wallet = wallets[selectedWalletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;
        const balance = wallets[selectedWalletIndex].balance;

        const withdrawProps: WithdrawProps = {
            withdrawDone,
            balance,
            currency,
            fee,
            onClick: this.toggleConfirmModal,
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            type,
            withdrawAddressLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.address' }),
            withdrawAmountLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
        };

        return otp ? <Withdraw {...withdrawProps} /> : this.isOtpDisabled();
    };


    private isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <Button
                    block={true}
                    onClick={this.redirectToEnable2fa}
                    size="lg"
                    variant="primary"
                >
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                </Button>
            </React.Fragment>
        );
    };


    private redirectToEnable2fa = () => this.props.history.push('/security/2fa', { enable2fa: true });


    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || (level === 1 && is2faEnabled);
    }

    private onWalletSelectionChange = (value: WalletItemProps) => {
        const { wallets } = this.props;
        const { tab } = this.state;
        const depositTab = { label: this.renderTabs()[0].label, index: 0 };

        if (!value.address && wallets.length && value.balance && value.type !== 'fiat') {
            this.props.fetchAddress({ currency: value.currency });
        } else if (tab !== depositTab.label && value.type !== 'fiat') {
            this.onTabChange(depositTab.index, depositTab.label);
            this.onCurrentTabChange(depositTab.index);
        }

        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase(),
        );

        this.setState({ selectedWalletIndex: nextWalletIndex, withdrawDone: false });
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
    //exchange componenents
     private handleChangeAsk(event) {
         this.setState({askCurrency: event});
         this.getRate(event, this.state.bidCurrency, this.state.askAmount);

       }
     private handleChangeBid(event) {
             this.setState({bidCurrency: event});
             this.getRate(this.state.askCurrency, event, this.state.askAmount);
     }
    private renderExchangeContent =wallets => {

        const { className } = this.props;
        const {askAmount, bidAmount, askCurrency, bidCurrency} = this.state;
        const cx = classnames('cr-withdraw', className);
        const bidCurrencyList = wallets.map((item, i) => {
            return (
                <Dropdown.Item key={i} eventKey={item.currency}
                onSelect= {() =>this.handleChangeBid(item.currency) }> 
                <CryptoIcon className="cr-wallet-item__icon" code={item.currency.toUpperCase()}>
                {item.name}
                </CryptoIcon>
                </Dropdown.Item>
            );
            }, this);

        const currencyList = wallets.length > 0
        && wallets.map((item, i) => {
                                        return (
                                            <Dropdown.Item key={i} eventKey={item.currency}
                                            onSelect= {() =>this.handleChangeAsk(item.currency)}> 
                                            <CryptoIcon className="cr-wallet-item__icon" code={item.currency.toUpperCase()}>
                                            {item.name}
                                            </CryptoIcon>
                                            </Dropdown.Item>
                                        );
                                        }, this);


        return (
        <div className={cx}>
        <div className="cr-withdraw-column">
            <div className="exchange-container">
                    <div className="col-xs-12 col-sm-5">
                        <InputGroup>
                            <DropdownButton
                                as={InputGroup.Prepend}
                                title={<span><i><CryptoIcon  className="cr-wallet-item__icon" code={askCurrency.toUpperCase()}/></i>{askCurrency.toUpperCase()}</span>}
                                id="input-group-dropdown-2"
                                >
                                {currencyList}
                            </DropdownButton>
                            <FormControl
                            size="lg"
                            type="number"
                            value={askAmount}
                            placeholder="Enter amount"
                            aria-label="Enter Amount"
                            aria-describedby="basic-addon2"
                            onChange={(event) => this.handleChangeInputAmountAsk(event.target.value)}
                            />
                        </InputGroup>
                    </div>
                    <div className="col-xs-12 col-sm-1 switch_container">
                        <span className="icon" 
                        onClick={this.switchCurrency}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-5">
                    <InputGroup>
                        <DropdownButton
                            as={InputGroup.Prepend}
                            title={<span>
                                <i><CryptoIcon  className="cr-wallet-item__icon" code={bidCurrency.toUpperCase()}/></i>{bidCurrency.toUpperCase()}</span>}
                            id="input-group-dropdown-2"
                            >
                            {bidCurrencyList}
                        </DropdownButton>
                        <FormControl
                        size="lg"
                        type="number"
                        value= {bidAmount}
                        placeholder="Enter amount"
                        aria-label="Enter Amount"
                        //onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChangeInputAmountBid(e)}
                        onChange={(event) => this.handleChangeInputAmountBid(event.target.value)}
                        />
                    </InputGroup>
                    </div>
        </div>
        <div>
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={'Fee'}
                            content={this.renderFee()}
                        />
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={'Total Amount you get'}
                            content={this.renderTotal()}
                        />
                    </div>
                    <div className="cr-withdraw__deep">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={this.handleClick}
                            disabled={!Boolean(this.state.askAmount)}
                        >
                            {'Submit'}
                        </Button>
                    </div>

        </div>
        </div>

        );
    };

    private switchCurrency = () => {
        this.setState({askCurrency: this.state.bidCurrency, bidCurrency: this.state.askCurrency});
    };

    private handleClick = async () => {
        const res = await  postExchange(this.state.bidCurrency, this.state.askCurrency,  this.state.askAmount);
        try {
            if (res.status === 201){
                toast.success('Success Notification !', {
                    position: 'top-right',
                  });
                  this.setState({askAmount: '', bidAmount: '0'});
                  this.exchangeHistory();
            }

        } catch (error) {
            toast.error('Insufficient Balance!', {
                position: 'top-right',
              });

        }
    };
       private handleChangeInputAmountAsk =  (text: string) =>{
          this.setState({askAmount: text});
          this.getRate(this.state.askCurrency, this.state.bidCurrency, text);

      };
     private getRate = async (ask: string, bid: string, text: string) => {
         const res = await fetchRate( bid, ask, text);
         try {
             this.setState({bidAmount: 'Loading ....'});
             console.log('err', res);
         if (res.status === 201){
             console.log('response', res);
             this.setState({bidAmount: res.data});


         }else{
             console.log('error', res);

         }

         } catch (error) {
             console.log(error);

         }


     };
      private handleChangeInputAmountBid = (event) =>{
      this.setState({bidAmount: event});

      };
    private renderFee = () => {
        // const {fixed} = this.props;
        const {bidCurrency} = this.state;

        return (
            <span>
                <Decimal fixed={5}>{Number(this.state.bidAmount) * 0.05}</Decimal> {bidCurrency.toUpperCase()}
            </span>
        );
    };

    private renderTotal = () => {
        // const total = this.state.total;
        //  const {fixed} = this.props;
        const {bidCurrency} = this.state;

        // return total ? (
            return  <span>
                <Decimal fixed={8}>{Number(this.state.bidAmount) - Number(this.state.bidAmount) * 0.05}</Decimal> {bidCurrency.toUpperCase()}
            </span>;
        // ) : <span>0 {bidCurrency.toUpperCase()}</span>;
    };


}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    addressDepositError: selectWalletsAddressError(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    selectedWalletAddress: selectWalletAddress(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchBeneficiaries: () => dispatch(beneficiariesFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(withStyles(useStyles as {})(withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any)));
