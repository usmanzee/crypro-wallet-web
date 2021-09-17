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
    contentDiv: {
      maxWidth: '90%',
      margin: 'auto',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
      },
    },
    sidesDiv: {
      display: "flex",
      width: '100%',
      lineHeight: '48px',
      // border: '1px solid rgb(174, 180, 188)',
      borderRadius: '5px',
      marginBottom: '16px',
    },
    activeSide: {
        width: '50%',
        textAlign: 'center',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 700
    },
    inActiveSide: {
        width: '50%',
        textAlign: 'center',
        fontSize: '16px',
        backgroundColor: 'rgb(245, 245, 245)',
        color: 'rgb(174, 180, 188)',
        cursor: 'pointer'
    },
    stepLabel: {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      },
    },
    filtersDiv: {
      [theme.breakpoints.only('xl')]: {
          margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
          width: "15%",
      },
      [theme.breakpoints.only('lg')]: {
          margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
          width: "20%",
      },
      [theme.breakpoints.down('md')]: {
          width: '100%',
      }
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
    linkLabel: {
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.secondary.main,
        },
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
    amountInput: {
      '& .MuiOutlinedInput-root': { 
          '& fieldset': {           
              border: '1px solid rgba(0, 0, 0, 0.12)',
          },
          '&:hover fieldset': {
              border: '1px solid rgba(0, 0, 0, 0.12)',
          },
          '&.Mui-focused fieldset': {
              border: '1px solid rgba(0, 0, 0, 0.12)',
          },
      },
    },
    amountFieldActionButtons: {
        cursor: 'pointer',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        padding: '12px 4px',
        borderRadius: '2px'
    },
    stepsButtonsDiv: {
      marginTop: '16px',
      textAlign: 'right',
    },
    secondStepContentDiv: {
      [theme.breakpoints.up('md')]: {
          width: "50%",
      },
      [theme.breakpoints.down('md')]: {
          width: '100%',
      }
    },
    registerDaysInput: {
      textAlign: 'center',
      marginTop: '-8px',
      width: '70px'
    },
    holdingDaysInput: {
      textAlign: 'center',
      marginTop: '-8px',
      width: '70px'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    paymentMethodDiv: {
      border: '1px solid rgb(230, 232, 234)', 
      borderRadius: '4px', 
      padding: '16px', 
      margin: '16px 0px',
      cursor: 'pointer',
      '&:hover': {
        borderColor : theme.palette.secondary.main,
      },
    },
    editPaymentMethodLink: {
      textDecoration: 'none',
      color: 'rgb(94, 102, 115)',
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
    addPaymentMethodButton: {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
    }
  }),
);