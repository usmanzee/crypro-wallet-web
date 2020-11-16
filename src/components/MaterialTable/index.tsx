import classNames from 'classnames';
import * as React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';

export type CellData = string | number | React.ReactNode | undefined;

export interface TableState {
    /**
     * Selected filter
     */
    activeFilter?: string;
    /**
     * Filtered data
     */
    resultData?: CellData[][];
    /**
     * Key of selected row
     */
    selectedRowKey?: string;
}

interface TableProps {
    /**
     * Data which is used to render Table. The first element
     * of array is used to render table head unless `noHead`
     * is true. the rest is used to render Table body.
     *
     * All the elements of an array should have the same length.
     */
    data: CellData[][];
    /**
     * Renders table head.
     */
    header?: React.ReactNode[];
    /**
     * Row's unique key, could be a number - element's index in data
     */
    rowKeyIndex?: number;
    /**
     * Key of selected row, could be a string
     */
    selectedKey?: string;
    /**
     * Callback called when a row is selected
     */
    onSelect?: (key: string) => void;
    /**
     * Header which is displayed above the table
     */
    titleComponent?: React.ReactNode;
    /**
     * Defines whether row background shows or not, and calculates width of it
     */
    rowBackground?: (row: number) => React.CSSProperties;
    /**
     * Defines from what side row background starts `(left, right)`
     * @default 'left'
     */
    side?: 'left' | 'right';
    /**
     * Sets row background color
     */
    rowBackgroundColor?: string;
    /**
     * Sets colspan count for empty table
     */
    colSpan?: number;
}

/**
 * Cryptobase Table overrides default table
 */
class MaterialTable extends React.Component<TableProps, TableState> {
    constructor(props: TableProps) {
        super(props);

        this.state = {
            activeFilter: undefined,
            resultData: undefined,
            selectedRowKey: props.selectedKey,
        };
    }

    public componentDidMount() {
    }

    public render() {
        const { data, header, rowKeyIndex } = this.props;

        this.ensureDataIsValid(data);

        return (
                <>
                    <TableContainer>
                        <Table>
                            {header && header.length && this.renderHead(header)}
                            <TableBody>
                                {this.renderBody(data, rowKeyIndex)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
        );
    }

    private StyledTableCell = withStyles((theme: Theme) =>
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

    private renderRowCells(row: CellData[]) {

        return row && row.length ?
            row.map((c, index: number) =>
                <this.StyledTableCell key={index} colSpan={row.length === 1 ? this.props.colSpan : undefined}>{c}</this.StyledTableCell>) : [];
    }

    private handleSelect = (key: string) => () => {
        const { onSelect } = this.props;

        if (onSelect) {
            this.setState({
                selectedRowKey: key,
            }, () => {
                if (onSelect) {
                    onSelect(key);
                }
            });
        }
    };

    private renderHead(row: CellData[]) {
        const cells = row.map((c, index) => <this.StyledTableCell key={index}>{c}</this.StyledTableCell>);

        return (
            <>
                <TableHead>
                    <TableRow>
                            {cells}
                    </TableRow>
                </TableHead>
            </>
        );
    }

    private renderBody(rows: CellData[][], rowKeyIndex: number | undefined) {
        const { resultData, selectedRowKey } = this.state;

        const rowClassName = (key: string) => classNames({
            'cr-table__row--selected': selectedRowKey === key,
        });

        const dataToBeMapped = resultData || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndex !== undefined) ? r[rowKeyIndex] : i);

            return (
                <>
                    <TableRow hover
                        key={rowKey}
                        onClick={this.handleSelect(rowKey)}
                    >
                        {this.renderRowCells(r)}
                    </TableRow>
                </>
            );
        });

        return (
            <>
                {rowElements}
            </>
        );
    }

    private ensureDataIsValid(data: CellData[][]) {
        const length = data[0].length;
        const len = data.length;
        for (let i = 0; i < len; i += 1) {
            if (data[i].length !== length) {
                throw Error('Array elements must have the same length');
            }
        }
    }
}

export {
    MaterialTable,
};
