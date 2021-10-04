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
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT } from '../../../constants';

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

import { P2PVideoTutorialDialog } from '../../../components/P2P/P2PVideoTutorialDialog';
import { P2PLinks } from '../../../components/P2P/P2PLinks';
import { setDocumentTitle } from '../../../helpers';
import { PageHeader } from '../../../containers/PageHeader';
import { useStyles } from './style';

import { 
    User,
    P2POrder,
    Offer,
    selectUserLoggedIn,
    selectUserInfo,
    Currency,
    selectCurrenciesLoading,
    selectCurrencies,
    currenciesFetch,
    selectP2PTradesHistoryData,
    selectP2PTradesHistoryLoading,
    p2pTradesHistoryFetch,
    UserPaymentMethod,
    p2pOrdersUpdateFetch,
    selectP2PUpdateOrderSuccess,
} from '../../../modules';

import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
} from "react-router-dom";


  
type Props = RouterProps & InjectedIntlProps;
const P2PMyOrdersComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreenPaymentDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const [sides, setSides] = React.useState([
        {'title': 'All Types', 'value': ''},
        {'title': 'Buy', 'value': 'buy'},
        {'title': 'Sell', 'value': 'sell'},
    ]);

    const [statuses, setStatuses] = React.useState([
        {'title': 'All statuses', 'value': ''},
        {'title': 'Paid', 'value': 'paid'},
        {'title': 'Unpaid', 'value': 'unpaid'},
        {'title': 'Completed', 'value': 'completed'},
        {'title': 'Cancelled', 'value': 'cancelled'},
        {'title': 'Appealing', 'value': 'appealing'},
    ]);

    const [selectedSide, setSelectedSide] = React.useState(null);
    const [selectedStatus, setSelectedStatus] = React.useState(null);
    const [cryptoCurrencies, setCryptoCurrencies] = React.useState<Currency[]>([]);
    const [loadingCryptoCurrencies, setLoadingCryptoCurrencies] = React.useState<boolean>(true);
    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = React.useState<Currency>(null);

    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);

    const [assetAnchorEl, setAssetAnchorEl] = React.useState<null | HTMLElement>(null);
    const [typeAnchorEl, setTypeAnchorEl] = React.useState<null | HTMLElement>(null);
    const [stateAnchorEl, setStateAnchorEl] = React.useState<null | HTMLElement>(null);

    const dispatch = useDispatch();
    const currencies = useSelector(selectCurrencies);
    const currenciesLoading = useSelector(selectCurrenciesLoading);
    const p2pTradeHistory = useSelector(selectP2PTradesHistoryData);
    const p2pTradeHistoryLoading = useSelector(selectP2PTradesHistoryLoading);

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
    }, []);

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
        setSelectedSide(sides[0]);
        setSelectedStatus(statuses[0]);
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
        dispatch(p2pTradesHistoryFetch({
            page: 0,
            limit: DEFAULT_TABLE_PAGE_LIMIT
        }));
    }, []);

    const filterCryptoCurrencies = () => {
        const filteredCurrencies = currencies.filter((currency) => {
            return currency.type == 'coin';
        });
        setCryptoCurrencies(filteredCurrencies);
    }

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
        if(selectedStatus.value != '') {
            filters['status'] = selectedStatus.value.toLowerCase();
        }
        dispatch(p2pTradesHistoryFetch(filters));
    }

    const resetFilters = () => {
        setSelectedCryptoCurrency(cryptoCurrencies[0]);
        setSelectedSide(sides[0]);
        setSelectedStatus(statuses[0]);
        dispatch(p2pTradesHistoryFetch({
            page: 0,
            limit: DEFAULT_TABLE_PAGE_LIMIT
        }));
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
    const renderStatusesDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleStateSelectClick}>
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        {selectedStatus ? selectedStatus.title : ''}
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
                        value={selectedStatus}
                        onChange={(event: any, selectedOption: any | null) => {
                            setSelectedStatus(selectedOption);
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
                        options={statuses}
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

    const renderOrders = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="P2P orders table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    {`Asset/type`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Fiat Amount`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Price`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    Crypto amount	
                                </StyledTableCell>
                                <StyledTableCell>
                                    Counterparty
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Created at`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Status`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {p2pTradeHistoryLoading
                            ?  
                                <>
                                    <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                        <CircularProgress size={20} />
                                    </caption>
                                </> 
                       : 
                       p2pTradeHistory.map((p2pOrder: P2POrder) => {
                           return (
                               <>
                                    <TableRow hover>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body2' component="div" style={{ fontWeight: 700, color: p2pOrder.side.toLowerCase() == 'buy' ? '#02C076' : 'rgb(248, 73, 96)' }}>{p2pOrder.side.toUpperCase()}</Typography>
                                                <Typography variant='body2' component="div" style={{  }}>{p2pOrder.offer.base_unit.toUpperCase()}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body2' component="div" style={{ fontWeight: 700 }}>{`${p2pOrder.amount} ${p2pOrder.offer.quote_unit.toUpperCase()}`}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body2' component="div" style={{ }}>{`${p2pOrder.offer.price} ${p2pOrder.offer.quote_unit.toUpperCase()}`}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body2' component="div" style={{  }}>{`${p2pOrder.amount} ${p2pOrder.offer.base_unit.toUpperCase()}`}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ width: '50%' }}>
                                                    <Typography variant="body2">{p2pOrder.offer.name.toUpperCase()}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body2' component="div">{p2pOrder.created_at}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ }}>
                                                <Typography variant='body2' component="div" style={{ fontWeight: 700 }}>{p2pOrder.status.toUpperCase()}</Typography>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Link target="blank" to={`/p2p/fiat-order/${p2pOrder.id}`} className={classes.actionLink}>
                                                Contact
                                            </Link>
                                        </StyledTableCell>
                                    </TableRow>
                               </>
                           );
                        })
                       }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }

   
    return (
        <>
            <PageHeader pageTitle={'Orders'} />
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
                        <P2PLinks activeOrdersLink={true} handleVideoDialogOpen={handleVideoTurorialDialogOpen} />
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
                                Status
                            </InputLabel>
                            {renderStatusesDrowdown()}
                        </div>
                        <div className={classes.filterButtonsDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                            </InputLabel>
                            <Button variant="outlined" color="secondary" onClick={() => applyFilters()} className={classes.filterButton}>
                                Filter
                            </Button>
                            <Button variant="outlined" style={{ marginLeft: '8px' }} onClick={() => resetFilters()} className={classes.filterButton}>
                                Reset
                            </Button>
                        </div>
                    </Box>
                    <div style={{ margin: '8px' }}>
                        {renderOrders()}
                    </div>
                </Paper>
                <P2PVideoTutorialDialog open={videoTutorialDialogOpen} handleClose={handleVideoTurorialDialogClose} />
            </Box>
        </>
    );    
}

export const P2PMyOrdersScreen = P2PMyOrdersComponent;