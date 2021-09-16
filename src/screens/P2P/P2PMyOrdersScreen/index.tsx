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
const P2PMyOrdersComponent = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreenPaymentDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = React.useState(false);
    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);
    const [paymentMethodAnchorEl, setPaymentMethodAnchorEl] = React.useState<null | HTMLElement>(null);
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

    const handlePaymentMethodSelectClick = (event: React.MouseEvent<HTMLElement>) => {
        setPaymentMethodAnchorEl(event.currentTarget);
    };

    const handlePaymentMethodSelectClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
        if (paymentMethodAnchorEl) {
            paymentMethodAnchorEl.focus();
        }
        setPaymentMethodAnchorEl(null);
    };

    const paymentMethodPopperOpen = Boolean(paymentMethodAnchorEl);
    const paymentMethodPopperId = paymentMethodPopperOpen ? 'payment_methods' : undefined;


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

    const renderOrders = () => {
        return (
            <>
                <TableContainer>
                    <Table aria-label="P2P orders table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    {`Side \n\nAsset/type`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Amount`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {`Price & Quantity`}
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
                            <TableRow hover>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, color: 'rgb(248, 73, 96)' }}>SELL</Typography>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, fontSize: '16px' }}>USDT</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, fontSize: '18px' }}>1500.00</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700 }}>198.00</Typography>
                                        <Typography variant='body1' component="div" style={{ fontWeight: 700, }}>7.56</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ width: '50%' }}>
                                            <Typography variant="body1">Advertiser name</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div">2021-08-30 03:40:23</Typography>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ }}>
                                        <Typography variant='body1' component="div" style={{ }}>Cancelled</Typography>
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
                            {renderPaymentMethodDrowdown()}
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
                            {renderPaymentMethodDrowdown()}
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