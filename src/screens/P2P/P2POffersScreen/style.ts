import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { globalStyle } from '../../materialUIGlobalStyle';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...globalStyle(theme),
    activePage: {
        color: '#000',
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '12px',
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
        },
    },
    activeCurrency: {
        color: theme.palette.secondary.main,
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        paddingBottom: '12px',
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
        // backgroundColor: '#F5F5F5',
        color: theme.palette.secondary.main
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
        padding: `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px`,
        borderRadius: '4px',
        backgroundColor: '#e0e0e0',
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
        // color: theme.palette.secondary.main
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
    }
  }),
);