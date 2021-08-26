import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { globalStyle } from '../../screens/materialUIGlobalStyle';

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
        marginRight: theme.spacing(5),
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
        marginRight: theme.spacing(5),
        opacity: '0.6',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
            color: '#000',
        },
    },
    p2pInfoDiv: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex', 
            justifyContent: 'space-between',
        },
    },
    p2pInfo: {
        [theme.breakpoints.up('sm')]: {
            width: '60%'
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginBottom: '8px',
        },
    },
    paymentMethodDialogTitle: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex', 
            justifyContent: 'space-between',
        },
        [theme.breakpoints.down('sm')]: {
        },
    },
    paymentMethodInfoDiv: {
        display: 'flex', 
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'space-between'
        },
       
    },
    paymentMethodsDiv: {
        width: '4px', 
        height: '14px', 
        borderRadius: '4px', 
        backgroundColor: theme.palette.primary.main,
        margin: '4px 4px 0px 0px'
    },
    paymentMethodLink: {
        textDecoration: 'none', 
        fontSize: '16px',
        color: "black",
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.secondary.main
        },
    }
   
  }),
);