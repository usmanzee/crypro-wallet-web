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

import { connect } from "react-redux";

import {
    RootState,
    selectMerchantPayments,
    MerchantPayment
} from '../../modules';

import {
    merchantPaymentsFetch,
} from '../../modules/user/merchantPayments';

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

interface ReduxProps {
    merchantPayments: MerchantPayment;
}

const MerchantPaymentsComponent = (props) => {
    const classes = useStyles();
    const { merchantPayments } = props;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        props.fetchMerchantPayments();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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
                                { merchantPayments.length ? (
                                    <>
                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                            <TableRow>
                                                <StyledTableCell>TxId</StyledTableCell>
                                                <StyledTableCell>Payment Address</StyledTableCell>
                                                <StyledTableCell>Order ID</StyledTableCell>
                                                <StyledTableCell>Amount</StyledTableCell>
                                                <StyledTableCell>Status</StyledTableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {merchantPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment, index) => (
                                                <TableRow hover key={index}>
                                                <StyledTableCell>{payment.txid}</StyledTableCell>
                                                <StyledTableCell>{payment.payment_address}</StyledTableCell>
                                                <StyledTableCell>{payment.order_id}</StyledTableCell>
                                                <StyledTableCell>{payment.amount}</StyledTableCell>
                                                <StyledTableCell>{payment.status}</StyledTableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={merchantPayments.length}
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
        </>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    merchantPayments: selectMerchantPayments(state),
});
const mapDispatchToProps = dispatch => ({
    fetchMerchantPayments: () => dispatch(merchantPaymentsFetch()),
});

const MerchantPaymentsContainer = connect(mapStateToProps, mapDispatchToProps)(MerchantPaymentsComponent)

export {
    MerchantPaymentsContainer
}