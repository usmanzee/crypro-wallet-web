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
    activeCurrency: {
        color: theme.palette.secondary.main,
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '8px',
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.secondary.main,
        },
    },
    inActiveCurrency: {
        color: '#000',
        marginRight: theme.spacing(2),
        opacity: '0.6',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },

    advertiserName: {
        marginBottom: '8px', color: theme.palette.secondary.main
    },
    sideGroup: {
        margin: '12px 0px 8px 8px', 
    },
    paramsFiltersRoot: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    cryptoFiltersRoot: {
        display: "flex", 
        overflow: 'auto',
        whiteSpace: 'nowrap',
        [theme.breakpoints.up('md')]: {
            marginLeft: '24px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '8px',
            marginTop: '8px'
        },
    },
    filtersRoot: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            margin: `${theme.spacing(2)}px 0px ${theme.spacing(2)}px 0px`,
        },
    },
    filtersDiv: {
        [theme.breakpoints.only('xl')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
            width: "15%",
        },
        [theme.breakpoints.only('lg')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
            width: "15%",
        },
        [theme.breakpoints.only('md')]: {
            width: '100%',
        },
        [theme.breakpoints.only('sm')]: {
            width: '100%',
        },
    },
    inputLabel: {
        fontWeight: 500,
        margin: `${theme.spacing(1)}px 0px`
    },
    searchAmountInput: {
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
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
    maxButton: {
        cursor: 'pointer',
        color: theme.palette.primary.main
    },
    amountSearchButton: {
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    selectDropdown: {
        display: 'flex',
        cursor: 'pointer',
        padding: `0px ${theme.spacing(0.5)}px`,
        lineHeight: '3.1em',
        borderRadius: '4px',
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        [theme.breakpoints.only('sm')]: {
            width: 'auto',
        },
        [theme.breakpoints.only('xs')]: {
            width: 'auto',
        },
    },
    popper: {
        border: '1px solid rgba(27,31,35,.15)',
        boxShadow: '0 3px 12px rgba(27,31,35,.15)',
        borderRadius: 3,
        zIndex: 1,
        fontSize: 13,
        color: '#586069',
        backgroundColor: '#f6f8fa',
    },
    header: {
        borderBottom: '1px solid #e1e4e8',
        padding: '8px 10px',
        fontWeight: 600,
    },
    inputBase: {
        padding: 10,
        width: '100%',
        borderBottom: '1px solid #dfe2e5',
        '& input': {
            borderRadius: 4,
            backgroundColor: theme.palette.common.white,
            padding: 8,
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            border: '1px solid #ced4da',
            fontSize: 14,
            '&:focus': {
                boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    renderp2pOffers: {
        [theme.breakpoints.only('xs')]: {
            display: 'none',
        },
    },
    renderMobileP2pOffers: {
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
    currencyCode: {
        margin: '0px 4px'
    },
    currencyName: {
        margin: '2px 1px'
    },
    selectDownArrow: {
        marginLeft: 'auto',
        marginRight: '0'
    },
    paymentMethodChip: {
        margin: `${theme.spacing(0.5)}px`,
        fontSize: '8px',
        height: theme.spacing(2)
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    moddalCancelButton: {
        width: '40%', 
        marginRight: '8px',
        color: theme.palette.primary.main,
    },
    renderAdvertisementDetail: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    renderMobileAdvertisementDetail: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        }
    },
    advantagesQuestionsDiv: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex', 
            justifyContent: 'space-between'
        },
        [theme.breakpoints.down('sm')]: {
            
        },
    },
    questionsDetail: {
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'column',
            width: '23%'
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    }
  }),
);