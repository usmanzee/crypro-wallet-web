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
   
  }),
);