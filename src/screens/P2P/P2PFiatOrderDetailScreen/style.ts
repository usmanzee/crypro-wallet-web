import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { globalStyle } from '../../materialUIGlobalStyle';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...globalStyle(theme),
    tabsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing(0.5),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: theme.palette.text.disabled
    },
    activePage: {
        color: '#000',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '8px',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
    inActivePage: {
        color: '#000',
        marginRight: theme.spacing(2),
        opacity: '0.6',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
            opacity: '1.0',
        },
    },
    videoLink: {
        [theme.breakpoints.up('sm')]: {
            color: '#000',
            marginLeft: theme.spacing(2),
            cursor: 'pointer',
            '&:hover': {
                textDecoration: 'none',
                color: '#000',
                opacity: '0.6',
            },
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },
    mobileVideoLink: {
        [theme.breakpoints.up('sm')]: {
           display: 'none'
        },
    },
    moreLink: {
        color: '#000',
        marginLeft: theme.spacing(2),
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
            opacity: '0.6',
        },
    },
    contentDiv: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex', 
            justifyContent: 'space-between'
        },
        [theme.breakpoints.down('sm')]: {
        },
    },
    orderDetailDiv: {
        [theme.breakpoints.up('sm')]: {
            width: "60%"
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%"
        },
    },
    orderDetail: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex', 
            margin: '24px 0px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '12px 0px',
            display: 'flex', 
            justifyContent: 'space-between'
        },
    },
    orderPriceDetail: {
        [theme.breakpoints.up('sm')]: {
            marginRight: '24px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '0px 4px',
        },
    },
    paymentMethodTab: {
        margin: '0px',
        padding: '8px 8px 8px 0px',
        border: '1px solid rgb(230, 232, 234)',
        backgroundColor: 'rgb(250, 250, 250)',
        cursor: 'pointer'
    },
    activePaymentMethodTab: {
        margin: '0px',
        padding: '8px 8px 8px 0px',
        border: '1px solid rgb(230, 232, 234)',
        cursor: 'pointer'
    },
    paymentMethods: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },
    mobilePaymentMethods: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex', 
            flexDirection: 'column'
        },
    },
    paymentMethodDetail: {
        [theme.breakpoints.up('sm')]: {
            margin: '16px',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '0px',
        },
    },
    paymentTimer: {
        fontWeight: 700,
        color: theme.palette.secondary.main,
        marginLeft: '8px'
    },
    advertiserChatName: {
        boxSizing: 'border-box',
        margin: '0px',
        minWidth: '0px',
        display: 'flex',
        height: '96px',
        backgroundColor: 'rgb(255, 255, 255)',
        boxShadow: 'rgb(0 0 0 / 8%) 0px 2px 4px',
        width: '100%',
        position: 'relative',
        alignItems: 'center'
    },
    chatDiv: {
        [theme.breakpoints.up('sm')]: {
            boxSizing: 'border-box',
            margin: '0px',
            display: 'flex',
            height: '680px',
            flexDirection: 'column',
            width: "39%"
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },
    mobileChatDiv: {
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            position: 'fixed',
            bottom: '0px',
            right: '0px', 
            margin: '24px 24px 48px 24px',
        },
    },
    mobileChatButton: {
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            height: "60px",
            lineHeight: "60px",  
            width: "60px",  
            fontWeight: "bold",
            borderRadius: "50%",
            backgroundColor: theme.palette.secondary.main,
            color: "white",
            textAlign: "center",
            cursor: "pointer",
        },
    },
    chatWrap: {
        background: 'rgb(250, 250, 250)',
        overflow: 'auto',
        flex: '1 1 0%',
        padding: '16px',
        boxShadow: 'rgb(0 0 0 / 8%) 0px 2px 4px'
    },
    
    messageLeftDiv: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '16px !important',
    },
    messageLeft: {
        borderRadius: "8px 0px 8px 8px",
        maxWidth: "344px",
        background: "rgba(240, 185, 11, 0.18)",
        lineHeight: "24px",
        padding: "10px 16px",
        marginLeft: "8px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "14px"
    },
    messageRightDiv: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '16px !important',
    },
    messageRight: {
        borderRadius: "8px 0px 8px 8px",
        maxWidth: "344px",
        background: "rgb(255, 255, 255)",
        lineHeight: "24px",
        padding: "10px 16px",
        marginLeft: "8px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "14px"
    },
    senderDiv: {
        boxSizing: 'border-box',
        margin: '0px',
        minWidth: '0px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '8px 12px',
        background: 'rgb(255, 255, 255)',
        boxShadow: 'rgb(0 0 0 / 8%) 0px 2px 4px, rgb(0 0 0 / 8%) 0px 0px 4px'
    },
    senderInputWrap: {
        width: '100%',
        fontSize: '0px'
    },
    inputArea: {
        background: 'rgb(255, 255, 255)',
        border: '1px solid rgb(234, 236, 239)',
        boxSizing: 'border-box',
        borderRadius: '4px',
    }
  }),
);