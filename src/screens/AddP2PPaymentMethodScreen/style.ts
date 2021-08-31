import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { globalStyle } from '../materialUIGlobalStyle';

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
      maxWidth: '30%',
      margin: 'auto',
      [theme.breakpoints.down('md')]: {
        maxWidth: '40%',
      },
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
      },
    },
    paymentMethodColor: {
        width: '4px', 
        height: '16px', 
        borderRadius: '4px', 
        backgroundColor: theme.palette.primary.main,
        margin: '4px 4px 0px 0px'
    },
   
  }),
);