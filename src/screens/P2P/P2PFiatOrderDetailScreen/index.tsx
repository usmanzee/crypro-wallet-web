import * as React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Button  from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import clsx from  'clsx';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Badge from '@material-ui/core/Badge';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import ChatIcon from '@material-ui/icons/Chat';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";
import { RouterProps } from 'react-router';
import { PageHeader } from '../../../containers/PageHeader';
import { StyledTableCell } from '../../materialUIGlobalStyle';
import { useStyles } from './style';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useDispatch, useSelector } from 'react-redux';

import { P2PVideoTutorialDialog } from '../../../components/P2P/P2PVideoTutorialDialog';
import { P2PLinks } from '../../../components/P2P/P2PLinks';
import { setDocumentTitle } from '../../../helpers';

import {
    // useDocumentTitle,
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
const P2PFiatOrderDetailComponent = (props: Props) => {
    const defaultSide = 'buy';
    const defaultCurrency = 'USDT';
    //Props
    const classes = useStyles();
    
    //Params
    let params = useParams();
    //History
    let history = useHistory();

    const messagesEndRef = React.useRef(null)

    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('payment_method1');
    const [chatDialogopen, setChatDialogOpen] = React.useState(false);
    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);

    const dispatch = useDispatch();
    const allPaymentMethods = useSelector(selectP2PPaymentMethodsData);

    useP2PPaymentMethodsFetch();
    useUserPaymentMethodsFetch();

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
        scrollToBottom();
    }, []);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod((event.target as HTMLInputElement).value);
    };

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    const handleChatDialogOpen = () => {
        setChatDialogOpen(true);
        scrollToBottom();
    };

    const handleChatDialogClose = () => {
        setChatDialogOpen(false);
    };

    const handleVideoTurorialDialogOpen = () => {
        setVideoTutorialDialogOpen(true);
    };

    const handleVideoTurorialDialogClose = () => {
        setVideoTutorialDialogOpen(false);
    };

    const renderPaymentMethodDetail = () => {
        return (
            <>
                <div className={classes.paymentMethodDetail}>
                    <div style={{ marginBottom: '8px' }}>
                        <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)' }}>Name</Typography>
                        <Typography variant="body1" style={{ fontWeight: 700 }}>Muhammad Asim</Typography>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)' }}>Bank Account Number</Typography>
                        <Typography variant="body1" style={{ fontWeight: 700 }}>12312321332323</Typography>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)' }}>Bank Name</Typography>
                        <Typography variant="body1" style={{ fontWeight: 700 }}>Askari Bank</Typography>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)' }}>Branch Name</Typography>
                        <Typography variant="body1" style={{ fontWeight: 700 }}>Model Town Branch</Typography>
                    </div>
                </div>
            </>
        );
    }

    const renderChatAdvertiserName = () => {
        return (
            <>
                 <div className={classes.advertiserChatName}>
                    <Typography variant="h6" style={{ fontWeight: 700, marginLeft: '8px' }}>Advertiser Name</Typography>
                </div>
            </>
        );
    }
    const renderChatInput = () => {
        return (
            <>
                <div className={classes.senderDiv}>
                    <div className={classes.senderInputWrap}>
                        <TextField
                            id="outlined-multiline-flexible"
                            placeholder="Write a message..."
                            multiline
                            fullWidth
                            size='small'
                            rowsMax={4}
                            // value={value}
                            // onChange={handleChange}
                            variant="outlined"
                            className={classes.inputArea}
                        />
                    </div>
                    <IconButton aria-label="add-multimedia">
                        <AddIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="send">
                        <SendIcon />
                    </IconButton>
                </div>
            </>
        );
    }

    const renderChat = () => {
        return (
            <>
                <div className={classes.chatWrap}>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageRightDiv}>
                        <div className={classes.messageRight}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageLeftDiv}>
                        <div className={classes.messageLeft}>Hello, send payment</div>
                    </div>
                    <div className={classes.messageRightDiv}>
                        <div className={classes.messageRight}>Hello </div>
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            </>
        );
    }

    const renderChatDialog = () => {
        return (
            <>
                <Dialog
                    fullScreen
                    open={chatDialogopen}
                    onClose={handleChatDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Advertiser Name</Typography>
                            <CloseIcon onClick={e => handleChatDialogClose()} style={{ cursor: 'pointer', }}/>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <Box style={{ height: '450px',}}>
                            {renderChat()}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        {renderChatInput()}
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    const pageTitle = 'Buy USDT';

    return (
        <>
            <PageHeader pageTitle={pageTitle} />
            <Box className={classes.pageRoot} alignItems="center">
                <Paper className={classes.pageContent} >
                    <div className={classes.tabsHeader}>
                        <div>
                            <Link to="/p2p-trade" className={classes.inActivePage}>
                                    <Typography variant="h6" component="div" display="inline">
                                        P2P
                                    </Typography>
                            </Link>
                            <Link to="/quick-trade" className={classes.inActivePage}>
                                <Typography variant="h6" component="div"  display="inline">
                                    Express
                                </Typography>   
                            </Link>
                        </div>
                        <P2PLinks handleVideoDialogOpen={handleVideoTurorialDialogOpen} />
                    </div>
                    <div className={classes.contentDiv}>
                        <div className={classes.orderDetailDiv}>
                            <div className={classes.orderDetail}>
                                <div className={classes.orderPriceDetail}>
                                    <Typography variant="h6" style={{ color: 'rgb(174, 180, 188)' }}>
                                        Amount
                                    </Typography>
                                    <Typography variant="h5" style={{ color: 'rgb(2, 192, 118)' }}>
                                        ₨ 5000.00
                                    </Typography>
                                </div>
                                <div className={classes.orderPriceDetail}>
                                    <Typography variant="h6" style={{ color: 'rgb(174, 180, 188)' }}>
                                        Price
                                    </Typography>
                                    <Typography variant="h6">
                                        167.64 PKR
                                    </Typography>
                                </div>
                                <div className={classes.orderPriceDetail}>
                                    <Typography variant="h6" style={{ color: 'rgb(174, 180, 188)' }}>
                                        Quantity
                                    </Typography>
                                    <Typography variant="h6">
                                        298.98 USDT
                                    </Typography>
                                </div>
                            </div>
                            <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid rgb(230, 232, 234)', }}>
                                <Typography variant="subtitle1" component="div" style={{ marginBottom: '8px' }}>
                                    Please confirm that you have successfully transferred the money to the seller through the following payment method.
                                </Typography>
                                <Alert severity="warning" icon={false}>
                                    The following is the sellers' payment info. Please make sure the money is transferred from an account you own, matching your verified name. Money will NOT be transferred automatically by the platform.
                                </Alert>
                                <div className={classes.paymentMethods}>
                                    <FormControl component="fieldset" style={{ marginTop: '8px' }}>
                                        <RadioGroup aria-label="gender" name="gender1" value={selectedPaymentMethod} onChange={handlePaymentMethodChange}>
                                            <FormControlLabel value="payment_method1" control={<Radio />} label="Payment Method1" className={ selectedPaymentMethod == 'payment_method1' ? classes.activePaymentMethodTab : classes.paymentMethodTab } />
                                            <FormControlLabel value="payment_method2" control={<Radio />} label="Payment Method2" className={ selectedPaymentMethod == 'payment_method2' ? classes.activePaymentMethodTab : classes.paymentMethodTab } />
                                            <FormControlLabel value="payment_method3" control={<Radio />} label="Payment Method2" className={ selectedPaymentMethod == 'payment_method3' ? classes.activePaymentMethodTab : classes.paymentMethodTab } />
                                            <FormControlLabel value="payment_method4" control={<Radio />} label="Payment Method4" className={ selectedPaymentMethod == 'payment_method4' ? classes.activePaymentMethodTab : classes.paymentMethodTab } />
                                        </RadioGroup>
                                    </FormControl>
                                    {renderPaymentMethodDetail()}
                                </div>
                                <div className={classes.mobilePaymentMethods}>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            >
                                            <Typography>Payment Method1</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {renderPaymentMethodDetail()}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                            >
                                            <Typography>Payment Method1</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {renderPaymentMethodDetail()}
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                            <div style={{ display: 'flex', margin: '8px 0px 0px 0px' }}>
                                <Typography variant="h6" style={{ fontWeight: 700 }}>Payment to be made</Typography>
                                <Typography variant="h6" className={classes.paymentTimer}>00:13:12</Typography>
                            </div>
                            <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)', marginBottom: '8px' }}>Please make payment within 15:00 mints, otherwise, the order will be cancelled.</Typography>
                            <Alert severity="warning">
                                <AlertTitle>ATTENTION!</AlertTitle>
                                After making the fiat transfer, please click the button below to inform the seller to received payment, fail to do so will result in automatically cancellation of order and potentially loss of all your asset!
                            </Alert>
                            <div style={{ display: 'flex', margin: '16px 0px' }}>
                                <Button variant="contained" color="secondary">
                                    Transferred, Next
                                </Button>
                                <Button color="secondary">Cancel Order</Button>
                            </div>
                        </div>
                        <div className={classes.chatDiv}>
                            {renderChatAdvertiserName()}
                            {renderChat()}
                            {renderChatInput()}
                        </div>
                        <div className={classes.mobileChatDiv}>
                            <div className={classes.mobileChatButton}>
                                <Badge color="error" variant="dot">
                                    <ChatIcon onClick={e => handleChatDialogOpen()}/>
                                </Badge>
                                {renderChatDialog()}
                            </div>
                        </div>
                    </div>
                </Paper>
                <P2PVideoTutorialDialog open={videoTutorialDialogOpen} handleClose={handleVideoTurorialDialogClose} />
            </Box>
        </>
    );    
}

export const P2PFiatOrderDetailScreen = P2PFiatOrderDetailComponent;