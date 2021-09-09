import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { globalStyle } from '../materialUIGlobalStyle';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...globalStyle(theme),
    pageHeader: {
        padding: "32px 20px"
    },
    actionLink: {
        margin: '0px 4px'
    },
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
    paramsFiltersRoot: {
        display: 'flex',
        padding: '0px 8px',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
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

    filtersDiv: {
        [theme.breakpoints.only('xl')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
            width: "10%",
        },
        [theme.breakpoints.only('lg')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
            width: "10%",
        },
        [theme.breakpoints.only('md')]: {
            width: '100%',
        },
        [theme.breakpoints.only('sm')]: {
            width: '100%',
        },
    },
    dateFiltersDiv: {
        [theme.breakpoints.only('xl')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
        },
        [theme.breakpoints.only('lg')]: {
            margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
        },
        [theme.breakpoints.only('md')]: {
        },
        [theme.breakpoints.only('sm')]: {
        },
    },
    inputLabel: {
        fontWeight: 500,
        margin: `${theme.spacing(1)}px 0px`
    },

    paymentMethodChip: {
        margin: `${theme.spacing(0.5)}px`,
        fontSize: '8px',
        height: theme.spacing(2)
    },
    actionsMargin: {
        margin: theme.spacing(1),
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
      '& .MuiOutlinedInput-root': { 
          '& fieldset': {           
            borderLeft: `1px solid rgba(0, 0, 0, 0.12)`,
            borderTop: `1px solid rgba(0, 0, 0, 0.12)`,
            borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
            borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
          },
          '&:hover fieldset': {
              borderLeft: `1px solid ${theme.palette.secondary.main}`,
              borderTop: `1px solid ${theme.palette.secondary.main}`,
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
              borderRight: `1px solid ${theme.palette.secondary.main}`,
          },
          '&.Mui-focused fieldset': {
            borderLeft: `1px solid ${theme.palette.secondary.main}`,
            borderTop: `1px solid ${theme.palette.secondary.main}`,
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
            borderRight: `1px solid ${theme.palette.secondary.main}`,
          },
      },
    },
    maxButton: {
        cursor: 'pointer',
        color: theme.palette.primary.main
    },
    inputAdornmentDivider: {
        height: '16px',
        margin: '4px'
    },
  }),
);