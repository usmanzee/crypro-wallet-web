import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { 
    Box, 
    Paper,
    Typography,
    Button,
    TextField,
    useMediaQuery,
    Popper,
    InputBase,
    InputLabel,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Chip,
    IconButton,
    CircularProgress
} from '@material-ui/core';
import { StyledTableCell } from '../../materialUIGlobalStyle';

import { DateRangePicker, DateRange, DateRangeDelimiter, LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"; // choose your lib

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import EditIcon from '@material-ui/icons/Edit';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import clsx from  'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';

import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT } from '../../../constants';
import { P2PVideoTutorialDialog } from '../../../components/P2P/P2PVideoTutorialDialog';
import { P2PLinks } from '../../../components/P2P/P2PLinks';
import { ConfirmDialog } from '../../../components/confirmDialog';
import { setDocumentTitle } from '../../../helpers';
import { PageHeader } from '../../../containers/PageHeader';
import { useStyles } from './style';

import { 
    Currency,
    selectCurrenciesLoading,
    selectCurrencies,
    currenciesFetch,
    Offer,
    selectP2PUserOffersFetchLoading,
    selectP2PUserOffers,
    userOffersFetch,
    selectP2PCancelOfferLoading,
    cancelOffer
} from '../../../modules';

import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
} from "react-router-dom";


  
type Props = RouterProps & InjectedIntlProps;
const P2PMyAdsComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const fullScreenPaymentDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const [sides, setSides] = React.useState([
        {'title': 'All Types', 'value': ''},
        {'title': 'Buy', 'value': 'buy'},
        {'title': 'Sell', 'value': 'sell'},
    ]);

    const [states, setStates] = React.useState([
        {'title': 'All States', 'value': ''},
        {'title': 'Active', 'value': 'active'},
        {'title': 'Offline', 'value': 'offline'},
    ]);
    const [selectedSide, setSelectedSide] = React.useState(null);
    const [selectedState, setSelectedState] = React.useState(null);
    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);
    const [loadingCryptoCurrencies, setLoadingCryptoCurrencies] = React.useState<boolean>(true);
    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = React.useState<Currency>(null);
    const [selectedUserOffer, setSelectedUserOffer] = React.useState<Offer>(null);

    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);
    const [assetAnchorEl, setAssetAnchorEl] = React.useState<null | HTMLElement>(null);
    const [typeAnchorEl, setTypeAnchorEl] = React.useState<null | HTMLElement>(null);
    const [stateAnchorEl, setStateAnchorEl] = React.useState<null | HTMLElement>(null);
    const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
    const [tablePage, setTablePage] = React.useState(0);
    const [tableRowsPerPage, setTableRowsPerPage] = React.useState(25);

    const [offlineDialogOpen, setOfflineDialogOpen] = React.useState(false);
    const [closeOfferDialogOpen, setCloseOfferDialogOpen] = React.useState(false);

    const dispatch = useDispatch();
    const currencies = useSelector(selectCurrencies);
    const currenciesLoading = useSelector(selectCurrenciesLoading);
    const userOffersLoading = useSelector(selectP2PUserOffersFetchLoading);
    const userOffers = useSelector(selectP2PUserOffers);
    const cancelOfferLoading = useSelector(selectP2PCancelOfferLoading);

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
        setSelectedSide(sides[0]);
        setSelectedState(states[0]);
    }, []);

    React.useEffect(() => {
        if(!currencies.length) {
            dispatch(currenciesFetch());
        } else {
            filterCryptoCurrencies();
        }
    }, [currencies]);

    React.useEffect(() => {
        if(cryptoCurrencies.length) {
            if(cryptoCurrencies[0].name != '') {
                let firstCurrencyOption = {} as Currency;
                firstCurrencyOption.id = 'All Assets';
                firstCurrencyOption.name = '';
                cryptoCurrencies.unshift(firstCurrencyOption);
            }
            setSelectedCryptoCurrency(cryptoCurrencies[0]);
            setLoadingCryptoCurrencies(false);
        }
    }, [cryptoCurrencies]);

    React.useEffect(() => {
        if(!userOffers.length) {
            dispatch(userOffersFetch({
                page: 0,
                limit: DEFAULT_TABLE_PAGE_LIMIT
            }));
        }
    }, [userOffers]);

    const handleVideoTurorialDialogOpen = () => {
        setVideoTutorialDialogOpen(true);
    };

    const handleVideoTurorialDialogClose = () => {
        setVideoTutorialDialogOpen(false);
    };

    const handleAssetSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setAssetAnchorEl(event.currentTarget);
    };

    const handleAssetSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (assetAnchorEl) {
            assetAnchorEl.focus();
        }
        setAssetAnchorEl(null);
    };

    const handleTypeSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setTypeAnchorEl(event.currentTarget);
    };

    const handleTypeSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (typeAnchorEl) {
            typeAnchorEl.focus();
        }
        setTypeAnchorEl(null);
    };

    const handleStateSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setStateAnchorEl(event.currentTarget);
    };

    const handleStateSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (stateAnchorEl) {
            stateAnchorEl.focus();
        }
        setStateAnchorEl(null);
    };

    const filterCryptoCurrencies = () => {
        const filteredCurrencies = currencies.filter((currency) => {
            return currency.type == 'coin';
        });
        setCryptoCurrencies(filteredCurrencies);
    }

    const handleTablePageChange = (event: unknown, newPage: number) => {
        setTablePage(newPage);
    };

    const handleTableRowsChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTableRowsPerPage(+event.target.value);
        setTablePage(0);
    };

    const applyFilters = () => {
        var filters = {
            page: 0,
            limit: DEFAULT_TABLE_PAGE_LIMIT
        };
        if(selectedCryptoCurrency.name != '') {
            filters['baseUnit'] = selectedCryptoCurrency.id.toLowerCase();
        }
        if(selectedSide.value != '') {
            filters['side'] = selectedSide.value.toLowerCase();
        }
        if(selectedState.value != '') {
            filters['state'] = selectedState.value.toLowerCase();
        }
        dispatch(userOffersFetch(filters));
    }

    const resetFilters = () => {
        setSelectedCryptoCurrency(cryptoCurrencies[0]);
        setSelectedSide(sides[0]);
        setSelectedState(states[0]);
        dispatch(userOffersFetch({
            page: 0,
            limit: DEFAULT_TABLE_PAGE_LIMIT
        }));
    }

    const handleSetOfferOfflineDialogOpen = (offer: Offer) => {
        setSelectedUserOffer(offer);
        setOfflineDialogOpen(true);
    };

    const handleSetOfferOfflineDialogClose = () => {
        setOfflineDialogOpen(false);
    };

    const handleCloseOfferDialogOpen = (offer: Offer) => {
        setSelectedUserOffer(offer);
        setCloseOfferDialogOpen(true);
    };

    const handleCloseOfferDialogClose = () => {
        setCloseOfferDialogOpen(false);
    };
    

    const setOfferStatetoOffline = () => {
        selectedUserOffer.state = 'offline';
        dispatch(cancelOffer(selectedUserOffer));
        setOfflineDialogOpen(false);
    }

    const closeOffer = () => {
        selectedUserOffer.state = 'close';
        dispatch(cancelOffer(selectedUserOffer));
        setCloseOfferDialogOpen(false);
    }

    const onEditOfferClick = (offer: Offer) => {
        history.push(`/p2p/my-offers/edit/${offer.id}`);
    }


    const assetsPopperOpen = Boolean(assetAnchorEl);
    const assetsPopperId = assetsPopperOpen ? 'assets' : undefined;

    const typePopperOpen = Boolean(typeAnchorEl);
    const typePopperId = typePopperOpen ? 'types' : undefined;

    const StatePopperOpen = Boolean(stateAnchorEl);
    const statePopperId = StatePopperOpen ? 'States' : undefined;


    const renderAssetsDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleAssetSelectClick}>
                    
            
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        {selectedCryptoCurrency ? selectedCryptoCurrency.name == '' ? selectedCryptoCurrency.id : selectedCryptoCurrency.id.toUpperCase() : ''}
                    </Typography>
                    <div className={classes.selectDownArrow}>
                        <ArrowDropDownIcon />
                    </div>
                     
                    
                </div>
                <Popper
                    id={assetsPopperId}
                    open={assetsPopperOpen}
                    anchorEl={assetAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handleAssetSelectClose}
                        disableCloseOnSelect={false}
                        value={selectedCryptoCurrency}
                        onChange={(event: any, selectedOption: Currency | null) => {
                            setSelectedCryptoCurrency(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: Currency) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.id.toUpperCase() : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={cryptoCurrencies}
                        getOptionLabel={(option: Currency) => option ? option.id.toUpperCase() : ''}
                        renderInput={(params) => (
                            <InputBase
                                ref={params.InputProps.ref}
                                inputProps={params.inputProps}
                                autoFocus
                                className={classes.inputBase}
                            />
                        )}
                    />
                </Popper>
            </>
        );
    }
    const renderTypesDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleTypeSelectClick}>
            
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        {selectedSide ? selectedSide.title : ''}
                    </Typography>
                    <div className={classes.selectDownArrow}>
                        <ArrowDropDownIcon />
                    </div>
                    
                </div>
                <Popper
                    id={typePopperId}
                    open={typePopperOpen}
                    anchorEl={typeAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handleTypeSelectClose}
                        disableCloseOnSelect={false}
                        value={selectedSide}
                        onChange={(event: any, selectedOption: any | null) => {
                            setSelectedSide(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: any) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.title : ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={sides}
                        getOptionLabel={(option: any) => option ? option.title : ''}
                        renderInput={(params) => (
                            <InputBase
                                ref={params.InputProps.ref}
                                inputProps={params.inputProps}
                                autoFocus
                                className={classes.inputBase}
                            />
                        )}
                    />
                </Popper>
            </>
        );
    }
    const renderStatesDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleStateSelectClick}>
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        {selectedState ? selectedState.title : ''}
                    </Typography>
                    <div className={classes.selectDownArrow}>
                        <ArrowDropDownIcon />
                    </div>
                    
                </div>
                <Popper
                    id={statePopperId}
                    open={StatePopperOpen}
                    anchorEl={stateAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handleStateSelectClose}
                        disableCloseOnSelect={false}
                        value={selectedState}
                        onChange={(event: any, selectedOption: any | null) => {
                            setSelectedState(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: any) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option ? option.title: ''}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={states}
                        getOptionLabel={(option: any) => option ? option.title: ''}
                        renderInput={(params) => (
                            <InputBase
                                ref={params.InputProps.ref}
                                inputProps={params.inputProps}
                                autoFocus
                                className={classes.inputBase}
                            />
                        )}
                    />
                </Popper>
            </>
        );
    }

    const renderAds = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="P2P orders table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    {`Ad Number\n Type\n Asset/Fiat`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Total Amount\n Completed Trade QTY.\n Limit`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Price\n Exchange Rate`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    Payment Method
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Last Updated\n Create Time`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    State
                                </StyledTableCell>
                                <StyledTableCell>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {userOffersLoading ? 
                            <>
                                 <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                    <CircularProgress size={20} />
                                </caption>
                            </> :
                            userOffers.length ?
                                <TableBody>
                                    {userOffers.slice(tablePage * tableRowsPerPage, tablePage * tableRowsPerPage + tableRowsPerPage).map((offer, index) => {
                                    return <TableRow hover>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>{offer.id}</Typography>
                                                <Typography variant='body1' component="div" style={{ fontWeight: 700, color: offer.side == 'buy' ? '#02C076' : 'rgb(248, 73, 96)', }}>{offer.side.toUpperCase()}</Typography>
                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                    <Typography variant='body1' style={{ color: 'grey' }}>{`${offer.base_unit.toUpperCase()}/${offer.quote_unit.toUpperCase()}`}</Typography>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                {/* <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>{offer.to}</Typography> */}
                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                    <Typography variant='body1' style={{ color: 'grey' }}>{`${offer.min_order_amount}/${offer.max_order_amount} ${offer.quote_unit.toUpperCase()}`}</Typography>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>{offer.price}</Typography>
                                                {/* <Typography variant='body1' component="div" style={{ fontWeight: 700, }}>--</Typography> */}
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ width: '50%' }}>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                                <Tooltip title="Payment Method1" arrow>
                                                    <Chip size="small" label="Payment Method1" className={classes.paymentMethodChip}/>
                                                </Tooltip>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body1' component="div">2021-08-30 03:40:23</Typography>
                                                <Typography variant='body1' component="div">2021-08-30 03:40:23</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body1' component="div" style={{ fontWeight: 700, color: '#02C076' }}>{offer.state.toUpperCase()}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ display: 'flex' }}>
                                                <Tooltip title="Offline" arrow>
                                                    <IconButton aria-label="offline" onClick={() => handleSetOfferOfflineDialogOpen(offer)}>
                                                        <SystemUpdateAltOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton aria-label="edit" onClick={() => onEditOfferClick(offer)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Close" arrow>
                                                    <IconButton aria-label="close" onClick={() => handleCloseOfferDialogOpen(offer)}>
                                                        <CancelOutlinedIcon fontSize="small" color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
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
            </>
        );
    }

   
    return (
        <>
            <PageHeader pageTitle={'My Ads'} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.tabsHeader}>
                        <div>
                            <Link to="/p2p/offers" className={classes.inActivePage}>
                                    <Typography variant="h6" component="div" display="inline">
                                        P2P
                                    </Typography>
                            </Link>
                            <Link to="/p2p/quick-trade" className={classes.inActivePage}>
                                <Typography variant="h6" component="div"  display="inline">
                                    Express
                                </Typography>   
                            </Link>
                        </div>
                        <P2PLinks handleVideoDialogOpen={handleVideoTurorialDialogOpen} />
                    </div>
                    <Box className={classes.paramsFiltersRoot}>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Asset/type
                            </InputLabel>
                            {renderAssetsDrowdown()}
                        </div>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Type
                            </InputLabel>
                            {renderTypesDrowdown()}
                        </div>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                State
                            </InputLabel>
                            {renderStatesDrowdown()}
                        </div>
                        {/* <div className={classes.dateFiltersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Created Date
                            </InputLabel>
                            <LocalizationProvider dateAdapter={DateFnsUtils}>
                                <DateRangePicker
                                    startText=""
                                    endText=""
                                    value={value}
                                    onChange={(newValue) => setValue(newValue)}
                                    renderInput={(startProps, endProps) => (
                                        <React.Fragment>
                                            <TextField variant="standard" size='small' {...startProps} helperText={null} />
                                            <DateRangeDelimiter> to </DateRangeDelimiter>
                                            <TextField variant="standard" size='small' {...endProps} helperText={null} />
                                        </React.Fragment>
                                    )}
                                />
                            </LocalizationProvider>
                           
                        </div> */}
                        <div className={classes.filterButton}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                            </InputLabel>
                            <Button variant="outlined" color="secondary" onClick={() => applyFilters()}>
                                Filter
                            </Button>
                            <Button style={{ marginLeft: '8px' }} onClick={() => resetFilters()}>Reset</Button>
                        </div>

                       
                    </Box>
                    <div style={{ margin: '8px' }}>
                        {renderAds()}
                    </div>
                </Paper>
                <P2PVideoTutorialDialog open={videoTutorialDialogOpen} handleClose={handleVideoTurorialDialogClose} />
                <ConfirmDialog title='Confirm to take the Ad offline' body= 'Once taken offline, the Ad will not be able to take in orders from users' confimButtonText="Offline" cancelButtonText="Cancel" open={offlineDialogOpen} handleClose={handleSetOfferOfflineDialogClose} handleConfirmClick={setOfferStatetoOffline} />
                <ConfirmDialog title='Confirm Closing the Ad?' body= 'Once closed, you can not edit this ad.' confimButtonText="Close" cancelButtonText="Cancel" open={closeOfferDialogOpen} handleClose={handleCloseOfferDialogClose} handleConfirmClick={closeOffer} />
            </Box>
        </>
    );    
}

export const P2PMyAdsScreen = P2PMyAdsComponent;