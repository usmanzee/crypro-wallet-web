import * as React from "react";

import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as MerchantApi from "../../apis/merchant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    //   marginTop: "10px"
    },
    paper: {
      
    },
    header: {
        fontSize: "20px",
        lineHeight: "1.5",
        color: "rgb(111 33 88)",
        padding: "20px 0px",
        margin: "0px 20px",
        borderBottom: "1px solid rgb(233, 236, 240)"
    },
    body: {
        fontSize: "16px",
        padding: "30px 20px",
        width: "100%"
    },
    bodyEmpty: {
    },
    paymentDetails: {
        color: "rgb(111 33 88)",
        cursor: "pointer",
        marginRight: "15px"
    }
  }),
);

const StyledTableCell = withStyles((theme: Theme) =>
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

const MerchantPayments = () => {
    const classes = useStyles();

    const [payments, setPayments] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(10);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false); 

    React.useEffect(() => {
        MerchantApi.getMerchantPaymanets().then((response) => {
            console.log(response.data);
            setPayments(response.data);
        });
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Box className={classes.root}>
                <Paper elevation={5} className={classes.paper}>
                    <div className={classes.header}>
                        <h3>Payments</h3>
                    </div>
                    <Grid>
                        <Grid item md={12} container>
                            <div className={classes.body}>
                                { payments.length ? (
                                    <>
                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                            <TableRow>
                                                <StyledTableCell>TxId</StyledTableCell>
                                                <StyledTableCell>Order ID</StyledTableCell>
                                                <StyledTableCell>Amount</StyledTableCell>
                                                <StyledTableCell>Status</StyledTableCell>
                                                <StyledTableCell>Action</StyledTableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment, index) => (
                                                <TableRow hover key={index}>
                                                <StyledTableCell component="th" scope="row">
                                                    {payment.txid}
                                                </StyledTableCell>
                                                <StyledTableCell>{payment.order_id}</StyledTableCell>
                                                <StyledTableCell>{payment.amount}</StyledTableCell>
                                                <StyledTableCell>{payment.status}</StyledTableCell>
                                                <StyledTableCell>
                                                <Tooltip title="View Details" placement="top-start">
                                                    <ViewAgendaIcon className={classes.paymentDetails} onClick={handleClickOpen}/>
                                                </Tooltip>
                                                </StyledTableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={payments.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                    </>
                                ) : (
                                    <>
                                    <div className={classes.bodyEmpty}>
                                        <Typography variant="h5" align="center">
                                            You haven't received any payments yet
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom align="center">
                                            Your incoming payments will be displayed here.
                                        </Typography>
                                    </div>
                                    </>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Payment details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                           Content description here
                        </DialogContentText>
                                Content of dialog here
                    </DialogContent>
                <DialogActions>
                    Actions here if any
                </DialogActions>
            </Dialog>
        </>
    );
}

export {
    MerchantPayments
}