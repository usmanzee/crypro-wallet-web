import * as React from 'react';
import './depositCrypto.css';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button as MaterialButton,
    InputBase,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) => createStyles({
    headerPaper: {
        height: "100px", 
        padding: "32px 20px"
    },
    pagePaper: {
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    pagePaperHeader: {
        paddingBottom: theme.spacing(1),
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgb(234, 236, 239)'
    },
    activePage: {
        marginRight: theme.spacing(1),
        cursor: 'pointer',
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        paddingBottom: theme.spacing(1)
    },
    inActivePage: {
        marginLeft: theme.spacing(1),
        opacity: '0.6',
        cursor: 'pointer'
    }
}));

const DepositCrypto = () => {
    const classes = useStyles();
    return (
        <>
            <Box>
                <Paper className={classes.headerPaper}>
                    <Grid container>
                        <Grid item md={12}>
                            <Typography variant="h4" display="inline">Deposit</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Box mt={2} pl={3} pr={3} alignItems="center">
                <Paper className={classes.pagePaper}>
                    <div className={classes.pagePaperHeader}>
                        <Typography variant="h6" component="div"  display="inline" className={classes.activePage}>Crypto</Typography>
                        <Typography variant="h6" component="div"  display="inline" className={classes.inActivePage}>Fiat</Typography>
                    </div>
                </Paper>
            </Box>
        </>
    );
}

const DepositCryptoScreen = DepositCrypto;

export { DepositCryptoScreen }