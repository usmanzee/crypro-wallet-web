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
      maxWidth: '70%',
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
    linkLabel: {
        display: 'flex',
        cursor: 'pointer',
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