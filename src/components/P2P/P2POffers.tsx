import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { makeStyles, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import { 
    Box, 
    Typography,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    InputLabel,
    TextField,
    InputAdornment,
    FormControl,
    FormHelperText,
    Dialog,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    CircularProgress,
    TablePagination
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@material-ui/icons/Close';

import { StyledTableCell } from '../../screens/materialUIGlobalStyle';

import {
    WalletItemProps,
    CryptoIcon,
} from '../../components';

import { 
    selectUserLoggedIn,
    Offer,
} from '../../modules';

import {
    useParams,
    useHistory
} from "react-router-dom";

export interface P2POffersProps {
    offersLoading: boolean;
    offers: Offer[];
    tablePage: number;
    tableRowsPerPage: number;
    handleTablePageChange: () => void;
    handleTableRowsChangePerPage: () => void;
    wallets: WalletItemProps[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    renderp2pOffers: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    renderMobileP2pOffers: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        }
    },
    advertiserName: {
        marginBottom: '8px', color: theme.palette.secondary.main
    },
    paymentMethodChip: {
        margin: `${theme.spacing(0.5)}px`,
        fontSize: '8px',
        height: theme.spacing(2)
    },
    inputLabel: {
        fontWeight: 500,
        margin: `${theme.spacing(1)}px 0px`
    },
    maxButton: {
        cursor: 'pointer',
        color: theme.palette.primary.main
    },
    numberInput: {
        '& input[type=number]': {
          '-moz-appearance': 'textfield'
      },
      '& input[type=number]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
      '& input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
    },
    inputAdornmentDivider: {
        height: '16px',
        margin: '4px'
    },
  }),
);

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
type Props = P2POffersProps & InjectedIntlProps;

const P2POffersComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    let history = useHistory();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
    const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        offersLoading,
        offers,
        tablePage,
        tableRowsPerPage,
        handleTablePageChange,
        handleTableRowsChangePerPage,
        wallets
    } = props;

    const [offerDialogOpen, setOfferDialogOpen] = React.useState(false);
    const [selectedOffer, setSelectedOffer] = React.useState<Offer>(null);
    const [selectedWallet, setSelectedWallet] = React.useState<WalletItemProps>(null);

    const [buyAmount, setBuyAmount] = React.useState<string>('');
    const [sellAmount, setSellAmount] = React.useState<string>('');
    
    const [buyAmountErrorMessage, setBuyAmountErrorMessage] = React.useState<string>('');
    
    const [receivableBuyAmount, setReceivableBuyAmount] = React.useState<string>('');
    const [receivableSellAmount, setReceivableSellAmount] = React.useState<string>('');
    
    const [receivableSellAmountErrorMessage, setReceivableSellAmountErrorMessage] = React.useState<string>('');

    const loggedIn = useSelector(selectUserLoggedIn);

    React.useEffect(() => {
        calculateBuyReceivableOnAmountChange(buyAmount);
        handleBuyAmountError(buyAmount);
    }, [buyAmount]);

    React.useEffect(() => {
        calculateBuyAmountOnReceivableChange(receivableBuyAmount);
        handleBuyAmountError(buyAmount);
    }, [receivableBuyAmount]);

    React.useEffect(() => {
        calculateSellReceivableOnAmountChange(sellAmount);
        handleSellReceivableAmountError(receivableSellAmount);
    }, [sellAmount]);


    React.useEffect(() => {
        calculateSellAmountOnReceivableChange(receivableSellAmount);
        handleSellReceivableAmountError(receivableSellAmount);
    }, [receivableSellAmount]);
    

    const handleOfferClick = (offer: Offer) => {
        setSelectedOffer(offer);
        handleOfferDialogOpen();
        if(offer.side == 'sell') {
            setSelectedWallet(getWalletByCurrencyName(offer.base_unit));
        }
    }

    const getWalletByCurrencyName = (currencyId: string) => {
        return wallets.find((wallet: WalletItemProps) => {
            console.log(wallet.currency);
            return wallet.currency.toLowerCase() == currencyId.toLowerCase()
        });
    }

    const handleOfferDialogOpen = () => {
        if(loggedIn) {
            setBuyAmount('');
            setBuyAmountErrorMessage('');
            setReceivableBuyAmount('');
            setSellAmount('');
            setReceivableSellAmount('');
            setReceivableSellAmountErrorMessage('');
            setOfferDialogOpen(true);
        } else {
            history.push('/signin');
        }
    };

    const handleOfferDialogClose = () => {
        setOfferDialogOpen(false);
    };

    const setBuyAllAmount = () => {
        setBuyAmount(selectedOffer.max_order_amount);
    }

    const setSellAllAmount = () => {
        setSellAmount(selectedWallet.balance.toString());
    }

    const handleBuyAmountChange = (event) => {
        const value = event.target.value;
        setBuyAmount(value);
    }
    
    const handleReceivableBuyAmountChange = (event) => {
        const value = event.target.value;
        setReceivableBuyAmount(value);
    }

    const handleSellAmountChange = (event) => {
        const value = event.target.value;
        setSellAmount(value);
    }

    const handleReceivableSellAmountChange = (event) => {
        const value = event.target.value;
        setReceivableSellAmount(value);
    }

    const handleBuyAmountError = (amount: string) => {
        let errorMsg = '';
        if (amount) {
            if (Number(amount) < Number(selectedOffer.min_order_amount) || Number(amount) > Number(selectedOffer.max_order_amount)) {
                errorMsg = `Buy limit: ${selectedOffer.min_order_amount}-${selectedOffer.max_order_amount} ${selectedOffer.quote_unit.toUpperCase()}`
            }
        } else {
            errorMsg = '';
        }
        setBuyAmountErrorMessage(`${errorMsg}`);
    }

    const handleSellReceivableAmountError = (amount: string) => {
        let errorMsg = '';
        if (amount) {
            if (Number(amount) < Number(selectedOffer.min_order_amount) || Number(amount) > Number(selectedOffer.max_order_amount)) {
                errorMsg = `Buy limit: ${selectedOffer.min_order_amount}-${selectedOffer.max_order_amount} ${selectedOffer.quote_unit.toUpperCase()}`
            }
        } else {
            errorMsg = '';
        }
        setReceivableSellAmountErrorMessage(`${errorMsg}`);
    }

    const calculateBuyAmountOnReceivableChange = (amount: string) => {
        if(selectedOffer) {
            var changedAmount = Number(amount)*Number(selectedOffer.price);
            if(Number(amount) > 0) {
                setBuyAmount(changedAmount.toString());
            } else {
                setBuyAmount('');
            }
        }
    }

    const calculateBuyReceivableOnAmountChange = (amount: string) => {
        if(selectedOffer) {
            var receivable = Number(amount)/Number(selectedOffer.price);
            if(Number(amount) > 0) {
                setReceivableBuyAmount(receivable.toString());
            } else {
                setReceivableBuyAmount('');
            }
        }
    }

    const calculateSellAmountOnReceivableChange = (amount: string) => {
        if(selectedOffer) {
            var changedAmount = Number(amount)/Number(selectedOffer.price);
            if(Number(amount) > 0) {
                setSellAmount(changedAmount.toString());
            } else {
                setSellAmount('');
            }
        }
    }

    const calculateSellReceivableOnAmountChange = (amount: string) => {
        if(selectedOffer) {
            var receivable = Number(amount)*Number(selectedOffer.price);
            if(Number(amount) > 0) {
                setReceivableSellAmount(receivable.toString());
            } else {
                setReceivableSellAmount('');
            }
        }
    }

    const isBuyFormInvalid = () => {
        return (Number(buyAmount) <= 0 || Number(receivableBuyAmount) <= 0 || (buyAmountErrorMessage != ''));
    }

    const isSellFormInvalid = () => {
        return (Number(sellAmount) <= 0 || Number(receivableSellAmount) <= 0 || (receivableSellAmountErrorMessage != ''));
    }

    const handleBuyFormSubmit = () => {

    }

    const handleSellFormSubmit = () => {

    }

    const renderMobileOffers = () => {
        return (
            <>
                {offersLoading ? 
                <div style={{ textAlign:"center", margin:"60px 0px" }}>
                    <CircularProgress size={40} />
                </div> :
                    offers.length ? 
                    offers.slice(tablePage * tableRowsPerPage, tablePage * tableRowsPerPage + tableRowsPerPage).map((offer, index) => {
                        return <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                    <Link target="_blank" to={`/p2p/advertiserDetail/${offer.member.uid}`} style={{ textDecoration: 'none' }}>
                                        <span className={classes.advertiserName}>
                                            {offer.member.uid}
                                        </span>
                                    </Link>
                                <div style={{ display: 'flex',}}>
                                    <small style={{ color: 'grey' }}>804 Oders</small>
                                    <small style={{ marginLeft: '8px', color: 'grey' }}>98.89% completion</small>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Price</span>
                                        <div style={{ display: 'flex', marginLeft: '8px', marginRight: '8px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600 }}>{offer.price}</span>
                                            <span style={{ fontWeight: 400, fontSize: 10, marginLeft: '4px',  color: 'grey' }}>{offer.quote_unit.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Available</span>
                                        <div style={{ display: 'flex', marginRight: '8px', alignItems: 'center'}}>
                                            <span style={{ fontWeight: 600,  marginLeft: '8px' }}>{`${offer.available_amount}`}</span>
                                            <span style={{ fontWeight: 400, fontSize: 10, marginLeft: '4px',  color: 'grey' }}>{offer.base_unit.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Limit</span>
                                        <div style={{ display: 'flex', marginRight: '8px'}}>
                                        <span style={{ fontWeight: 600,  marginLeft: '8px' }}>{`${offer.quote_unit.toUpperCase()}${offer.min_order_amount}-${offer.quote_unit.toUpperCase()}${offer.max_order_amount}`}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="contained" style={{ color: 'white', backgroundColor: offer.side == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', fontSize: 14, margin: 'auto 0px' }} onClick={() => handleOfferClick(offer)}>{offer.side}</Button>
                            </div>
                            <div style={{ display: 'flex', marginTop: '8px', flexWrap: 'wrap' }}>
                                <Tooltip title="Payment Method1" arrow>
                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                </Tooltip>
                                <Tooltip title="Payment Method2" arrow>
                                    <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                                </Tooltip>
                                <Tooltip title="Payment Method3" arrow>
                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                </Tooltip>
                                <Tooltip title="Payment Method3" arrow>
                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                </Tooltip>
                                <Tooltip title="Payment Method3" arrow>
                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                </Tooltip>
                                <Tooltip title="Payment Method3" arrow>
                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                </Tooltip>
                            </div>
                            <Divider style={{ margin: '16px 0px' }} />
                        </div>
                    })
                    :
                    <FormattedMessage id={'no.record.found'} />
                }

                {offers.length ?
                    <TablePagination
                        labelRowsPerPage={<FormattedMessage id={'page.body.swap.history.table.pagination.text.rows_per_page'} />}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={offers.length}
                        rowsPerPage={tableRowsPerPage}
                        page={tablePage}
                        onChangePage={handleTablePageChange}
                        onChangeRowsPerPage={handleTableRowsChangePerPage}
                    /> :
                    ""
                }
            </>
        );
    }

    const renderOffers = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="P2P orders table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Advertisers
                                </StyledTableCell>
                                <StyledTableCell>
                                    Price
                                </StyledTableCell>
                                <StyledTableCell>
                                    Limit/Available
                                </StyledTableCell>
                                <StyledTableCell>
                                    Payment
                                </StyledTableCell>
                                <StyledTableCell>
                                    Trade
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {offersLoading ? 
                            <>
                                <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                    <CircularProgress size={20} />
                                </caption>
                            </> : 
                            offers.length ?
                                <TableBody>
                                    {offers.slice(tablePage * tableRowsPerPage, tablePage * tableRowsPerPage + tableRowsPerPage).map((offer, index) => {
                                    return <TableRow hover>
                                        <StyledTableCell>
                                            <div style={{ display: 'flex', flexDirection: 'column'}}>
                                                    <Link target="_blank" to={`/p2p/advertiserDetail/${offer.member.uid}`} style={{ textDecoration: 'none' }}>
                                                        <span className={classes.advertiserName}>
                                                            {offer.member.uid}
                                                        </span>
                                                    </Link>
                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                    <small style={{ color: 'grey' }}>804 Oders</small>
                                                    <small style={{ marginLeft: '8px', color: 'grey' }}>98.89% completion</small>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                                <span style={{ fontWeight: 600, }}>{offer.price}</span>
                                                <span style={{ fontWeight: 400, fontSize: 10, marginLeft: '4px',  color: 'grey' }}>{offer.quote_unit.toUpperCase()}</span>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ display: 'flex', flexDirection: 'column'}}>
                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                    <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Available</span>
                                                    <span style={{ fontWeight: 600,  marginLeft: '8px' }}>{`${offer.available_amount} ${offer.base_unit.toUpperCase()}`}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                    <span style={{ fontWeight: 400, fontSize: 12, color: 'grey'}}>Limit</span>
                                                    <span style={{ fontWeight: 600,  marginLeft: '8px' }}>{`${offer.quote_unit.toUpperCase()}${offer.min_order_amount}-${offer.quote_unit.toUpperCase()}${offer.max_order_amount}`}</span>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method2" arrow>
                                                    <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method3" arrow>
                                                    <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button variant="contained" style={{ color: 'white', backgroundColor: offer.side == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', fontSize: 14 }} onClick={() => handleOfferClick(offer)}>{offer.side}</Button>
                                        </StyledTableCell>
                                    </TableRow>
                                    })}
                                </TableBody>
                                :
                                <>
                                    <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                        <FormattedMessage id={'no.record.found'} />
                                    </caption>
                                </>
                            }
                        
                    </Table>
                </TableContainer>
                {offers.length ?
                    <TablePagination
                        labelRowsPerPage={<FormattedMessage id={'page.body.swap.history.table.pagination.text.rows_per_page'} />}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={offers.length}
                        rowsPerPage={tableRowsPerPage}
                        page={tablePage}
                        onChangePage={handleTablePageChange}
                        onChangeRowsPerPage={handleTableRowsChangePerPage}
                    /> :
                    ""
                }
            </>
        );
    }

    const renderOfferDetailDialogTitle = () => {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{`${selectedOffer.side == 'buy' ? 'Buy' : 'Sell'} ${selectedOffer.base_unit.toUpperCase()}`}</Typography>
                    <CloseIcon onClick={e => handleOfferDialogClose()} style={{ cursor: 'pointer', }}/>
                </div>
            </>
        );
    }

    const renderBuyForm = () => {
        return (
            <>
                 <div style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="sell" className={classes.inputLabel}>
                        I want to pay
                    </InputLabel>
                    <FormControl variant="outlined" fullWidth error={buyAmountErrorMessage != ''}>
                        <TextField
                            className={classes.numberInput}
                            id="outlined-full-width"
                            placeholder={`${selectedOffer.min_order_amount} - ${selectedOffer.max_order_amount}`}
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={buyAmount}
                            onChange={(e) => {
                                handleBuyAmountChange(e)
                            }}
                            error={buyAmountErrorMessage != ''}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <span className={classes.maxButton} onClick={() => setBuyAllAmount()}>
                                        {/* <FormattedMessage id={'page.body.swap.input.tag.max'} /> */}
                                        All
                                    </span>
                                    <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                    <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>{selectedOffer.quote_unit.toUpperCase()}</Typography>
                                </InputAdornment>,
                            }}
                        />
                        {buyAmountErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{buyAmountErrorMessage}</FormHelperText>}
                    </FormControl>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="sell" className={classes.inputLabel}>
                        I will receive
                    </InputLabel>
                    <TextField
                        className={classes.numberInput}
                        id="outlined-full-width"
                        placeholder='0.00'
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="number"
                        value={receivableBuyAmount}
                        onChange={(e) => {
                            handleReceivableBuyAmountChange(e)
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>{selectedOffer.base_unit.toUpperCase()}</Typography>
                            </InputAdornment>,
                        }}
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <Button
                        style={{ width: '40%', marginRight: '8px' }}
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={handleOfferDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        disabled={isBuyFormInvalid()}
                        onClick={handleBuyFormSubmit}
                    >
                        {`Buy ${selectedOffer.base_unit.toUpperCase()}`}
                    </Button>
                </div>
            </>
        );
    }

    const renderSellForm = () => {
        return (
            <>
                 <div style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="sell" className={classes.inputLabel}>
                        I want to sell
                    </InputLabel>
                    <FormControl variant="outlined" fullWidth>
                        <TextField
                            className={classes.numberInput}
                            id="outlined-full-width"
                            placeholder='0.00'
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={sellAmount}
                            onChange={(e) => {
                                handleSellAmountChange(e)
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <span className={classes.maxButton} onClick={() => setSellAllAmount()}>
                                        {/* <FormattedMessage id={'page.body.swap.input.tag.max'} /> */}
                                        All
                                    </span>
                                    <Divider className={classes.inputAdornmentDivider} orientation="vertical" style={{ margin: '0px 8px' }} />
                                    <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>{selectedOffer.base_unit.toUpperCase()}</Typography>
                                </InputAdornment>,
                            }}
                        />
                    </FormControl>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="sell" className={classes.inputLabel}>
                        I will receive
                    </InputLabel>
                    <FormControl variant="outlined" fullWidth error={receivableSellAmountErrorMessage != ''}>
                        <TextField
                            className={classes.numberInput}
                            id="outlined-full-width"
                            placeholder={`${selectedOffer.min_order_amount} - ${selectedOffer.max_order_amount}`}
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            value={receivableSellAmount}
                            onChange={(e) => {
                                handleReceivableSellAmountChange(e)
                            }}
                            error={receivableSellAmountErrorMessage != ''}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <Typography variant="button" display="inline" style={{ color: 'rgb(112, 122, 138)' }}>{selectedOffer.quote_unit.toUpperCase()}</Typography>
                                </InputAdornment>,
                            }}
                        />
                        {receivableSellAmountErrorMessage && <FormHelperText id="sell-text" style={{ marginLeft: '0px', fontSize: 14 }}>{receivableSellAmountErrorMessage}</FormHelperText>}
                    </FormControl>
                </div>
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <Button
                        style={{ width: '40%', marginRight: '8px' }}
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={handleOfferDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isSellFormInvalid()}
                        color="primary"
                        variant="contained"
                        fullWidth
                        // onClick={handleFromSubmit}
                    >
                        {`Sell ${selectedOffer.base_unit.toUpperCase()}`}
                    </Button>
                </div>
            </>
        );
    }

    const renderOfferDetailsPaymentMethods = () => {
        return (
            <>
                <div style={{ marginTop: '12px'}}>
                    <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Seller’s payment method</Typography>
                    <div>
                        <Tooltip title="Payment Method1" arrow>
                            <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                        </Tooltip>
                        <Tooltip title="Payment Method2" arrow>
                            <Chip size="small" label="Payment Method2" className={classes.paymentMethodChip}/>
                        </Tooltip>
                        <Tooltip title="Payment Method3" arrow>
                            <Chip size="small" label="Payment Method3" className={classes.paymentMethodChip}/>
                        </Tooltip>
                    </div>
                </div>
            </>
        );
    }

    const renderOfferDetailsTerms = () => {
        return (
            <>
                <div style={{ marginTop: '8px' }}>
                    <Typography variant="h6" display="inline">Terms and conditions</Typography>
                    <div style={{ marginTop: '8px' }}>
                        <Typography variant="body1" display="inline" paragraph={true} style={{color: 'rgb(112, 122, 138)', whiteSpace: 'pre-line'}}>
                            {selectedOffer.note}
                        </Typography>
                    </div>
                </div>
            </>
        );
    }

    const advertisementDetailDialog = () => {
        return (
            <>
                <Dialog
                    fullWidth={true}
                    maxWidth='md'
                    open={offerDialogOpen}
                    onClose={handleOfferDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {renderOfferDetailDialogTitle()}
                    </DialogTitle>
                    <DialogContent>
                        <Box style={{ height: '450px',}}>
                            <div style={{ display: 'flex' ,width: '100%' }}>
                                <div style={{ width: '55%', overflowY: 'auto', height: '440px', paddingRight: '16px' }}>
                                    <div id="transition-modal-title">
                                        <Link target="_blank" to={`/p2p/advertiserDetail/${selectedOffer.member.uid}`} style={{ textDecoration: 'none', marginRight: '8px' }}>
                                            <span className={classes.advertiserName}>
                                                {selectedOffer.member.uid}
                                            </span>
                                        </Link>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>105 orders</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>100.00% completion</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '12px', justifyContent: 'space-between' }}>
                                        <div style={{  }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Price</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px', color: '#02C076' }}>{`${selectedOffer.price} ${selectedOffer.quote_unit.toUpperCase()}`}</Typography>
                                            {/* <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>16 s</Typography> */}
                                        </div>
                                        <div style={{  }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Available</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>{`${selectedOffer.available_amount} ${selectedOffer.base_unit.toUpperCase()}`}</Typography>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '12px', justifyContent: 'space-between' }}>
                                        <div style={{  }}>
                                            <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Payment Time Limit</Typography>
                                            <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>{selectedOffer.time_limit} Minutes</Typography>
                                        </div>
                                    </div>
                                    {renderOfferDetailsPaymentMethods()}
                                    {renderOfferDetailsTerms()}
                                </div>
                                <div style={{ width: '45%', paddingLeft: '16px' }}>
                                   {selectedOffer.side == 'buy' ? renderBuyForm() : renderSellForm()}
                                </div>
                            </div>
                        </Box>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    const mobileAdvertisementDetailDialog = () => {
        return (
            <>
                <Dialog
                    fullScreen
                    open={offerDialogOpen}
                    onClose={handleOfferDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {renderOfferDetailDialogTitle()}
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <div style={{ width: '100%' }}>
                                <div style={{}}>
                                    <Link target="_blank" to={`/p2p/advertiserDetail/${selectedOffer.member.uid}`} style={{ textDecoration: 'none', marginRight: '8px' }}>
                                            <span className={classes.advertiserName}>
                                                {selectedOffer.member.uid}
                                            </span>
                                        </Link>
                                    <div id="transition-modal-title">
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>105 orders</Typography>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>100.00% completion</Typography>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px',}}>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Price</Typography>
                                        <Typography variant="button" display="inline" style={{ marginRight: '8px', color: '#02C076' }}>{`${selectedOffer.price} ${selectedOffer.quote_unit.toUpperCase()}`}</Typography>
                                        {/* <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>16 s</Typography> */}
                                    </div>
                                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between'}}>
                                        <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Available</Typography>
                                        <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>{`${selectedOffer.available_amount} ${selectedOffer.base_unit.toUpperCase()}`}</Typography>
                                    </div>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    {selectedOffer.side == 'buy' ? renderBuyForm() : renderSellForm()}
                                </div>
                                <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" display="inline" style={{ marginRight: '8px', color: 'rgb(112, 122, 138)' }}>Payment Time Limit</Typography>
                                    <Typography variant="button" display="inline" style={{ marginRight: '8px' }}>{selectedOffer.time_limit} Minutes</Typography>
                                </div>
                                {renderOfferDetailsPaymentMethods()}
                                {renderOfferDetailsTerms()}
                            </div>
                        </Box>
                    </DialogContent>
                </Dialog>
            </>
        );
    }


    return (
        <>
            <div>
                <div className={classes.renderp2pOffers}>
                    {renderOffers()}
                </div>
                <div className={classes.renderMobileP2pOffers}>
                    {renderMobileOffers()}
                </div>
            </div>
            {selectedOffer ? isMobileScreen ? mobileAdvertisementDetailDialog() : advertisementDetailDialog() : ''}
        </>
    );
};

export const P2POffers = injectIntl(P2POffersComponent)

