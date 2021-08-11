import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

export const globalStyle = theme => ({
    pageRoot: {
        padding: theme.spacing(2),
        [theme.breakpoints.only('xs')]: {
            padding: theme.spacing(1),
        },
    },
    pageContent: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
        [theme.breakpoints.only('xs')]: {
            padding: theme.spacing(1),
        },
    },
    pageContentHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: theme.palette.text.disabled
    },
});

export const StyledTableCell = withStyles((theme: Theme) =>
createStyles({
    head: {
        backgroundColor: "rgb(228 224 224)",
        color: theme.palette.common.black,
        fontSize: 14,
    },
    body: {
        fontSize: 14,
    },
}),
)(TableCell); 