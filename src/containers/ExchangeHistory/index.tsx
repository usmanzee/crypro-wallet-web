import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

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
        <div className={classes.root}>
            <Typography variant="h4" gutterBottom>
                <FormattedMessage id={'page.body.swap.history.title.swap_history'} />
            </Typography>
            <Paper>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell><FormattedMessage id={'page.body.swap.history.table.column.sell'} /></TableCell>
                                <TableCell><FormattedMessage id={'page.body.swap.history.table.column.amount'} /></TableCell>
                                <TableCell><FormattedMessage id={'page.body.swap.history.table.column.buy'} /></TableCell>
                                <TableCell><FormattedMessage id={'page.body.swap.history.table.column.amount'} /></TableCell>
                                <TableCell><FormattedMessage id={'page.body.swap.history.table.column.status'} /></TableCell>
                                <TableCell><FormattedMessage id={'page.body.swap.history.table.column.date'} /></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                        <TableCell>
                                            {row.in_currency_id.toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            {row.in_amount}
                                        </TableCell>
                                        <TableCell>
                                            {row.out_currency_id.toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            {row.out_amount_requested}
                                        </TableCell>
                                        <TableCell>
                                            {row.status}
                                        </TableCell>
                                        <TableCell>
                                            {row.created_at}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    labelRowsPerPage={<FormattedMessage id={'page.body.swap.history.table.pagination.text.rows_per_page'} />}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
      </>
  );
}

export const ExchangeHistory = injectIntl(ExchangeHistoryComponent)