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
    IconButton
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

import { P2PVideoTutorialDialog } from '../../../components/P2P/P2PVideoTutorialDialog';
import { P2PLinks } from '../../../components/P2P/P2PLinks';
import { setDocumentTitle } from '../../../helpers';
import { PageHeader } from '../../../containers/PageHeader';
import { useStyles } from './style';


import {
    useP2PPaymentMethodsFetch,
    useUserPaymentMethodsFetch,
} from '../../../hooks';

import { 
    Offer,
    P2POrderCreate,
    p2pOrdersCreateFetch,
    selectP2PCreatedOrder,
    selectP2PCreateOrderSuccess,
    selectP2PPaymentMethodsData,
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
    const fullScreenPaymentDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = React.useState(false);
    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);
    const [assetAnchorEl, setAssetAnchorEl] = React.useState<null | HTMLElement>(null);
    const [paymentMethodAnchorEl, setPaymentMethodAnchorEl] = React.useState<null | HTMLElement>(null);
    const [statusAnchorEl, setStatusAnchorEl] = React.useState<null | HTMLElement>(null);
    const [value, setValue] = React.useState<DateRange<Date>>([null, null]);

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
    }, []);


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

    const handlePaymentMethodSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setPaymentMethodAnchorEl(event.currentTarget);
    };

    const handlePaymentMethodSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (paymentMethodAnchorEl) {
            paymentMethodAnchorEl.focus();
        }
        setPaymentMethodAnchorEl(null);
    };

    const handleStatusSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setStatusAnchorEl(event.currentTarget);
    };

    const handleStatusSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (statusAnchorEl) {
            statusAnchorEl.focus();
        }
        setStatusAnchorEl(null);
    };

    const assetsPopperOpen = Boolean(assetAnchorEl);
    const assetsPopperId = assetsPopperOpen ? 'assets' : undefined;

    const paymentMethodPopperOpen = Boolean(paymentMethodAnchorEl);
    const paymentMethodPopperId = paymentMethodPopperOpen ? 'payment_methods' : undefined;

    const statusPopperOpen = Boolean(statusAnchorEl);
    const statusPopperId = statusPopperOpen ? 'status' : undefined;


    const renderAssetsDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleAssetSelectClick}>
                    
            
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        
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
                        // value={selectedPaymentMethod}
                        onChange={(event: any, selectedOption: string | null) => {
                            // setSelectedPaymentMethod(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: string) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={['USDT', 'BTC', 'RSC']}
                        getOptionLabel={(option: string) => option}
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
    const renderPaymentMethodDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handlePaymentMethodSelectClick}>
                    
            
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        
                    </Typography>
                    <div className={classes.selectDownArrow}>
                        <ArrowDropDownIcon />
                    </div>
                     
                    
                </div>
                <Popper
                    id={paymentMethodPopperId}
                    open={paymentMethodPopperOpen}
                    anchorEl={paymentMethodAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handlePaymentMethodSelectClose}
                        disableCloseOnSelect={false}
                        // value={selectedPaymentMethod}
                        onChange={(event: any, selectedOption: string | null) => {
                            // setSelectedPaymentMethod(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: string) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={['USDT', 'BTC', 'RSC']}
                        getOptionLabel={(option: string) => option}
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
    const renderStatusDrowdown = () => {

        return (
            <> 
                <div className={classes.selectDropdown} onClick={handleStatusSelectClick}>
                    
            
                    <Typography variant="subtitle1" component="div" className={classes.currencyCode}>
                        
                    </Typography>
                    <div className={classes.selectDownArrow}>
                        <ArrowDropDownIcon />
                    </div>
                     
                    
                </div>
                <Popper
                    id={statusPopperId}
                    open={statusPopperOpen}
                    anchorEl={statusAnchorEl}
                    placement="bottom-start"
                    className={classes.popper}
                >
                    <div className={classes.header}>
                        Select
                    </div>
                    <Autocomplete
                        open
                        onClose={handleStatusSelectClose}
                        disableCloseOnSelect={false}
                        // value={selectedPaymentMethod}
                        onChange={(event: any, selectedOption: string | null) => {
                            // setSelectedPaymentMethod(selectedOption);
                        }}
                        noOptionsText="No Records Found"
                        renderOption={(option: string) => {
                            return <React.Fragment>
                                <div style={{ display: 'flex' }}>
                                    <Typography variant="subtitle2" component="div" className={classes.currencyName}>
                                        {option}
                                    </Typography>

                                </div>
                            </React.Fragment>
                        }}
                        options={['USDT', 'BTC', 'RSC']}
                        getOptionLabel={(option: string) => option}
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
                                    Status
                                </StyledTableCell>
                                <StyledTableCell>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>1232354542346</Typography>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, color: 'rgb(248, 73, 96)' }}>SELL</Typography>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <Typography variant='body1' style={{ color: 'grey' }}>USDT</Typography>
                                            <Typography variant='body1' style={{ color: 'grey' }}>/</Typography>
                                            <Typography variant='body1' style={{ marginLeft: '8px', color: 'grey' }}>PKR</Typography>
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>170.00</Typography>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>0.00</Typography>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <Typography variant='body1' style={{ color: 'grey' }}>1500.00-150,0000.00 PKR</Typography>
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>198.00</Typography>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, }}>--</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ width: '50%' }}>
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
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, color: '#02C076' }}>Published</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ display: 'flex' }}>
                                        <Tooltip title="Download" arrow>
                                            <IconButton aria-label="download">
                                                <SystemUpdateAltOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit" arrow>
                                            <IconButton aria-label="edit">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <IconButton aria-label="delete">
                                                <CancelOutlinedIcon fontSize="small" color="error" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </StyledTableCell>
                            </TableRow>
                        </TableBody>
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
                            {renderPaymentMethodDrowdown()}
                        </div>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                                Status
                            </InputLabel>
                            {renderStatusDrowdown()}
                        </div>
                        <div className={classes.dateFiltersDiv}>
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
                           
                        </div>
                        <div className={classes.filtersDiv}>
                            <InputLabel htmlFor="fiat_currency" className={classes.inputLabel}>
                               
                            </InputLabel>
                            <Button variant="outlined" color="secondary">
                                Filter
                            </Button>
                            <Button style={{ marginLeft: '8px' }}>Reset</Button>
                        </div>

                       
                    </Box>
                    <div style={{ margin: '8px' }}>
                        {renderAds()}
                    </div>
                </Paper>
                <P2PVideoTutorialDialog open={videoTutorialDialogOpen} handleClose={handleVideoTurorialDialogClose} />
            </Box>
        </>
    );    
}

export const P2PMyAdsScreen = P2PMyAdsComponent;