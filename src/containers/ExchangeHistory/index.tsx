import * as React from 'react';
import { makeStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';

export interface ExchangeHistoryProps {
    in_currency_id: string;
    out_currency_id: string;
    in_amount: string;
    out_amount_requested: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}
interface ComponentProps {
    // colums: string[];
    rows: ExchangeHistoryProps[];
}

const useStyles = makeStyles({
    tablePaper: {
        padding: '16px 16px'
    }
});

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: "rgb(228 224 224)",
            color: theme.palette.common.black,
            fontSize: 13,
        },
        body: {
            fontSize: 13,
        },
    }),
)(TableCell);

type Props = ComponentProps & InjectedIntlProps;
const ExchangeHistoryComponent = (props: Props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {rows} = props;

  return (
      <>
        <Box mt={2}>
            <Paper className={classes.tablePaper}>
                <Typography variant="h4" gutterBottom>
                    <FormattedMessage id={'page.body.swap.history.title.buy_sell_history'} />
                </Typography>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell><FormattedMessage id={'page.body.swap.history.table.column.sell'} /></StyledTableCell>
                                <StyledTableCell><FormattedMessage id={'page.body.swap.history.table.column.amount'} /></StyledTableCell>
                                <StyledTableCell><FormattedMessage id={'page.body.swap.history.table.column.buy'} /></StyledTableCell>
                                <StyledTableCell><FormattedMessage id={'page.body.swap.history.table.column.amount'} /></StyledTableCell>
                                <StyledTableCell><FormattedMessage id={'page.body.swap.history.table.column.status'} /></StyledTableCell>
                                <StyledTableCell><FormattedMessage id={'page.body.swap.history.table.column.date'} /></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {rows.length ? 
                        <>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <StyledTableCell>
                                                {row.in_currency_id.toUpperCase()}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.in_amount}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.out_currency_id.toUpperCase()}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.out_amount_requested}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.status}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.created_at}
                                            </StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            </> : 
                            <>
                                <caption style={{ textAlign: 'center', padding: '40px 0px', fontSize: '14px' }}>
                                    <FormattedMessage id={'no.record.found'} />
                                </caption>
                            </>
                        }
                        
                    </Table>
                </TableContainer>
                {rows.length ?
                    <TablePagination
                        labelRowsPerPage={<FormattedMessage id={'page.body.swap.history.table.pagination.text.rows_per_page'} />}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    /> : ""
                }
            </Paper>
        </Box>
      </>
  );
}

export const ExchangeHistory = injectIntl(ExchangeHistoryComponent)