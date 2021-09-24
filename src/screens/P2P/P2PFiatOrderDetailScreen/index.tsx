import * as React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button  from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Badge from '@material-ui/core/Badge';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';


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
import { ConfirmDialog } from '../../../components/confirmDialog';
import { P2PLinks } from '../../../components/P2P/P2PLinks';
import { setDocumentTitle } from '../../../helpers';

import { 
    User,
    P2POrder,
    Offer,
    P2PChat,
    selectUserLoggedIn,
    selectUserInfo,
    UserPaymentMethod,
    p2pOrderFetch,
    selectP2POrderLoading,
    selectP2PCreatedOrder,
    p2pOrdersUpdateFetch,
    selectP2PUpdateOrderSuccess,
    selectP2PChat
} from '../../../modules';

import {RangerState} from '../../../modules/public/ranger/reducer';
import {selectRanger} from '../../../modules/public/ranger/selectors';
import {RangerConnectFetch, rangerConnectFetch} from '../../../modules/public/ranger';

import { CommonError } from '../../../modules/types';
import { WalletHistory } from '../../../containers/Wallets/History';
import * as PublicDataAPI from '../../../apis/public_data';

import {
    useParams,
    useHistory
} from "react-router-dom";
import { P2POffers } from '../../../components';

type Props = RouterProps & InjectedIntlProps;
const P2PFiatOrderDetailComponent = (props: Props) => {
    const defaultSide = 'buy';
    const defaultCurrency = 'USDT';
    //Props
    const classes = useStyles();
    
    //Params
    let params = useParams();
    const orderId = params['id'];
    //History
    let history = useHistory();

    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const messagesEndRef = React.useRef(null)

    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<UserPaymentMethod>(null);
    const [chatDialogopen, setChatDialogOpen] = React.useState(false);
    const [transferedDialogOpen, setTransferedDialogOpen] = React.useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
    const [videoTutorialDialogOpen, setVideoTutorialDialogOpen] = React.useState(false);

    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    const rangerState = useSelector(selectRanger);
    const P2POrderLoading = useSelector(selectP2POrderLoading);
    const P2POrder = useSelector(selectP2PCreatedOrder);
    const P2PUpdateOrderSuccess = useSelector(selectP2PUpdateOrderSuccess);
    const P2PChat = useSelector(selectP2PChat);

    const Ref = React.useRef(null);
  
    // The state for our timer
    const [timer, setTimer] = React.useState('00:00:00');

    React.useEffect(() => {
        setDocumentTitle('Buy and Sell Crypto on P2P');
        // scrollToBottom();
    }, []);

    React.useEffect(() => {
        dispatch(p2pOrderFetch({
            id: orderId
        }));
    }, []);

    React.useEffect(() => {
       if (!rangerState.connected) {
            dispatch(rangerConnectFetch({withAuth: userLoggedIn}));
        }
    }, []);

    React.useEffect(() => {
       if(P2POrder) {
           setSelectedPaymentMethod(P2POrder.payment_methods[0]);
           if(P2POrder.status.toLowerCase() == 'active') {
                clearTimer(getEndTime());
           }
       }
    }, [P2POrder]);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethodBySlug(event.target.value);
        // setSelectedPaymentMethod((event.target as HTMLInputElement).value);
    };

    const setPaymentMethodBySlug = (slug: string) => {
        var searchedMethod = P2POrder.payment_methods.find((method) => {
            return method.payment_method.slug.toLowerCase() == slug.toLowerCase()
        });
        setSelectedPaymentMethod(searchedMethod);
    }

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 * 60 * 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        } else {
            //Clear interval and Cancel Order on timer ends
            if (Ref.current) clearInterval(Ref.current);
            handleOrderCancel();
        }
    }

    const clearTimer = (e) => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getEndTime = () => {
        let end = new Date();
        end.setSeconds(end.getSeconds() + Number(P2POrder.offer.time_limit)*60);
        return end;
    }

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

    const handleTransfaredDialogOpen = () => {
        setTransferedDialogOpen(true);
    };

    const handleTransferedDialogClose = () => {
    setTransferedDialogOpen(false);
    };

    const handleCancelDialogOpen = () => {
        setCancelDialogOpen(true);
    }

    const handleCancelDialogClose = () => {
        setCancelDialogOpen(false);
    }

    const handleOrderCancel = () => {
        dispatch(p2pOrdersUpdateFetch({
            // id: P2POrder.id,
            id: 1,
            status: 'cancelled'
        }));
        setCancelDialogOpen(false);
    }

    const renderPaymentDetails = () => {
        if(P2POrder.status.toLowerCase() == 'active') 
            return <div>
                <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid rgb(230, 232, 234)', }}>
                    <Typography variant="subtitle1" component="div" style={{ marginBottom: '8px' }}>
                        Please confirm that you have successfully transferred the money to the seller through the following payment method.
                    </Typography>
                    <Alert severity="warning" icon={false}>
                        The following is the sellers' payment info. Please make sure the money is transferred from an account you own, matching your verified name. Money will NOT be transferred automatically by the platform.
                    </Alert>
                    {selectedPaymentMethod 
                    ? <div className={classes.paymentMethods}>
                        <FormControl component="fieldset" style={{ marginTop: '8px' }}>
                            <RadioGroup aria-label="payment_methods" name="payment_methods" value={selectedPaymentMethod.payment_method.slug} onChange={handlePaymentMethodChange}>
                                {P2POrder.payment_methods.map((method) => {
                                    return <FormControlLabel value={method.payment_method.slug} control={<Radio />} label={method.payment_method.name} className={ selectedPaymentMethod.payment_method.slug == method.payment_method.slug ? classes.activePaymentMethodTab : classes.paymentMethodTab } />
                                })}
                            </RadioGroup>
                        </FormControl>
                        {renderPaymentMethodDetail(selectedPaymentMethod)}
                    </div> : ''}
                    {/* <div className={classes.mobilePaymentMethods}>
                        {P2POrder.payment_methods.map((method) => {
                        return (
                            <>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="payment_method"
                                        id="payment_method"
                                        >
                                        <Typography>{method.payment_method.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {renderPaymentMethodDetail(method)}
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        ); 
                        })}
                    </div> */}
                </div>
                <div style={{ display: 'flex', margin: '8px 0px 0px 0px' }}>
                    <Typography variant="h6" style={{ fontWeight: 700 }}>Payment to be made</Typography>
                    {/* <Typography variant="h6" className={classes.paymentTimer}>00:13:12</Typography> */}
                    <Typography variant="h6" className={classes.paymentTimer}>{timer}</Typography>

                </div>
                <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)', marginBottom: '8px' }}>Please make payment within {P2POrder.offer.time_limit} mints, otherwise, the order will be cancelled.</Typography>
                <Alert severity="warning">
                    <AlertTitle>ATTENTION!</AlertTitle>
                    After making the fiat transfer, please click the button below to inform the seller to received payment, fail to do so will result in automatically cancellation of order and potentially loss of all your asset!
                </Alert>
                <div style={{ display: 'flex', margin: '16px 8px' }}>
                    <Button variant="contained" color="secondary" onClick={() => handleTransfaredDialogOpen()}>
                        Transferred, Next
                    </Button>
                    <Button color="secondary" onClick={() => handleCancelDialogOpen()}>Cancel Order</Button>
                </div>
            </div>
            else if(P2POrder.status.toLowerCase() == 'cancelled')
                return <div>
                    <div style={{ border:"1px solid rgb(230, 232, 234)", padding: '16px', borderRadius: '8px', margin: '8px 0px' }}>
                        <Typography variant="body1" style={{  }}>Payment method can't be displayed for this order.</Typography>
                    </div>
                    <Typography variant="h5" style={{ fontWeight: 700 }}>Order Cancelled</Typography>
                    <Typography variant="subtitle2" style={{  }}>If you have any questions, please contact customer service.</Typography>
                </div>
            else if(P2POrder.status.toLowerCase() == 'completted')
                return <div>
                <div style={{ border:"1px solid rgb(230, 232, 234)", padding: '16px', borderRadius: '8px', margin: '8px 0px' }}>
                    <Typography variant="body1" style={{  }}>Payment method can't be displayed for this order.</Typography>
                </div>
                <Typography variant="h5" style={{ fontWeight: 700 }}>Order Completed</Typography>
                <Typography variant="subtitle2" style={{  }}>Assets are now in P2P account.</Typography>
            </div>
            else
                return<Typography variant="h6" style={{ fontWeight: 700 }}>Could not get order details</Typography>
    }

    const renderPaymentMethodDetail = (method: UserPaymentMethod) => {
        if(method) {

            const paymentDetailsObj = JSON.parse(method.user_payment_detail);
            return (
                <>
                    <div className={classes.paymentMethodDetail}>
                        {Object.entries(paymentDetailsObj).map(([key, value]) => {
                            return (
                                <>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Typography variant="body1" style={{ color: 'rgb(174, 180, 188)' }}>{key}</Typography>
                                        <Typography variant="body1" style={{ fontWeight: 700 }}>{value}</Typography>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </>
            );
        } else {
            return null;
        }
    }

    const renderChatAdvertiserName = () => {
        return (
            <>
                 <div className={classes.advertiserChatName}>
                    <Typography variant="h6" style={{ fontWeight: 700, marginLeft: '8px' }}>{P2POrder.offer.name.toUpperCase()}</Typography>
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
                    {P2PChat.map((chat: P2PChat) => {
                        return (
                            <>
                                <div style={{ marginBottom: '16px' }}>
                                    <div className={chat.sender_uid == user.uid ? classes.messageLeftDiv : classes.messageRightDiv}>
                                        <div className={chat.sender_uid == user.uid ? classes.messageLeft : classes.messageRight}>{chat.message}{chat.id}</div>
                                    </div>
                                    {chat.attachment_url ? 
                                        <div className={chat.sender_uid == user.uid ? classes.imgLeftDiv : classes.imgRightDiv}>
                                        <img height="100" width="100" src={chat.attachment_url} style={{ borderRadius: '8%' }}/>
                                    </div> : ""
                                    }
                                    
                                </div>
                            </>
                        );
                    })}
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

    const pageTitle = P2POrder ? `${P2POrder.offer.side.toUpperCase()} ${P2POrder.offer.quote_unit.toUpperCase()}` : 'P2P Order';

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
                    {!P2POrder  
                    ? <CircularProgress /> 
                    : <div className={classes.contentDiv}>
                        <div className={classes.orderDetailDiv}>
                            <div className={classes.orderDetail}>
                                <div className={classes.orderPriceDetail}>
                                    <Typography variant="h6" style={{ color: 'rgb(174, 180, 188)' }}>
                                        Amount
                                    </Typography>
                                    <Typography variant="h5" style={{ color: 'rgb(2, 192, 118)' }}>
                                        {`${P2POrder.amount} ${P2POrder.offer.quote_unit.toUpperCase()}`}
                                    </Typography>
                                </div>
                                <div className={classes.orderPriceDetail}>
                                    <Typography variant="h6" style={{ color: 'rgb(174, 180, 188)' }}>
                                        Price
                                    </Typography>
                                    <Typography variant="h6">
                                        {`${P2POrder.offer.price} ${P2POrder.offer.quote_unit.toUpperCase()}`}
                                    </Typography>
                                </div>
                                <div className={classes.orderPriceDetail}>
                                    <Typography variant="h6" style={{ color: 'rgb(174, 180, 188)' }}>
                                        Quantity
                                    </Typography>
                                    <Typography variant="h6">
                                        {`${P2POrder.offer.available_amount} ${P2POrder.offer.base_unit.toUpperCase()}`}
                                    </Typography>
                                </div>
                            </div>
                            {renderPaymentDetails()}
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
                    }
                </Paper>
                <P2PVideoTutorialDialog open={videoTutorialDialogOpen} handleClose={handleVideoTurorialDialogClose} />
                <ConfirmDialog title='Cancel Order' body= 'Are you sure you want to cancel this order?' confimButtonText="Yes" cancelButtonText="No" open={cancelDialogOpen} handleClose={handleCancelDialogClose} handleConfirmClick={handleOrderCancel} />
                <Dialog 
                    fullScreen={fullScreenDialog}
                    fullWidth={true}
                    maxWidth='xs'
                    onClose={handleTransferedDialogClose} 
                    aria-labelledby="customized-dialog-title" 
                    open={transferedDialogOpen}
                >
                    <DialogTitle id="customized-dialog-title">
                        <div style={{ display: 'flex' }}>
                            <Typography variant="h6">Confirm Successful Payment</Typography>
                            <IconButton className={classes.dialogCloseButton} aria-label="close" onClick={handleTransferedDialogClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <DialogContent dividers>
                    <Typography gutterBottom>
                        Please confirm that payment has been made to the seller. Malicious click will lead to account frozen.
                    </Typography>
                    <div style={{ margin: '8px 0px' }}>
                        {renderPaymentMethodDetail(selectedPaymentMethod)}
                    </div>
                    <Typography gutterBottom>
                        WARNING! if you click transfered, next without making the payment, your account will be suspended.
                    </Typography>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={handleTransferedDialogClose} color="default">
                        Cancel
                    </Button>
                    <Button autoFocus onClick={handleTransferedDialogClose} color="secondary">
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );    
}

export const P2PFiatOrderDetailScreen = P2PFiatOrderDetailComponent;