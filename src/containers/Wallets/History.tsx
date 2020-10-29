import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { History, Pagination, WalletItemProps } from '../../components';
import { Decimal } from '../../components/Decimal';
//import { Table, Thead,  Tr, Th, } from 'react-super-responsive-table'
//import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { 
    localeDate 
    // preciseData,
    // setDepositStatusColor,
    // setWithdrawStatusColor,
    // uppercase,
} from '../../helpers';
import LaunchIcon from '@material-ui/icons/Launch';
import {
    currenciesFetch,
    Currency,
    fetchHistory,
    resetHistory,
    RootState,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectNextPageExists,
    selectWallets,
    WalletHistoryList,
} from '../../modules';
import { FailIcon } from './FailIcon';
import { SucceedIcon } from './SucceedIcon';

export interface HistoryProps {
    label: string;
    type: string;
    currency: string;
}

export interface ReduxProps {
    currencies: Currency[];
    list: WalletHistoryList;
    wallets: WalletItemProps[];
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchHistory: typeof fetchHistory;
    resetHistory: typeof resetHistory;
}

interface IState {
    historyListData: WalletHistoryList;
    historyListDataLoading: boolean;
}

export type Props = HistoryProps & ReduxProps & DispatchProps & InjectedIntlProps;

export class WalletTable extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            historyListData: [],
            historyListDataLoading: true
        };
    }

    public componentDidMount() {
        const {
            currencies,
            currency,
            type,
        } = this.props;
        this.props.fetchHistory({ page: 0, currency, type, limit: 6 });

        if (currencies.length === 0) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillReceiveProps(nextProps) {
        const {
            currencies,
            currency,
            type,
            list,
        } = this.props;

        if (list.length === 0 && nextProps.list.length > 0) {
            this.setState({
                historyListData: nextProps.list,
                historyListDataLoading: true,
            });
        }

        if (nextProps.currency !== currency || nextProps.type !== type) {
            this.props.resetHistory();
            this.props.fetchHistory({ page: 0, currency: nextProps.currency, type, limit: 6 });
        }

        if (nextProps.currencies.length === 0 && nextProps.currencies !== currencies) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public render() {
        const { label, list, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;
        const { historyListData } = this.state;

        if (!list.length) {
            return null;
        }
        return (
            <div className="pg-history-elem__wallet">
                <div className="pg-history-elem__label">
                    <strong>
                        {this.props.intl.formatMessage({ id: `page.body.history.${label}` })}
                    </strong>
                </div>
                <History headers={this.getHeaders()} data={this.retrieveData(historyListData)} />
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </div>
        );
    }
    private getHeaders = () => {
        switch (this.props.type) {
          case 'deposits':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.status'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid'}),
              ];
          case 'withdraws':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.address'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.status'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.fee'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid'}),
              ];
          default:
              return [];
        }
    };

    private onClickPrevPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: Number(page) - 1, currency, type, limit: 6 });
    };

    private onClickNextPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: Number(page) + 1, currency, type, limit: 6 });
    };
    private retrieveData = (list) => {
        const {
            currency,
            currencies,
            type,
            intl,
            wallets,
        } = this.props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };
                if (list.length === 0) {
                    return [[intl.formatMessage({ id: 'page.noDataToShow' }), '', '']];
                }
        switch (type) {
            case 'deposits': {
                return list.sort((a, b) => {
                    return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
                }).map((item, index) => {
                    const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
                    const confirmations = type === 'deposits' && item.confirmations;
                    const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
                    const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
                    const state = 'state' in item ? this.formatTxState(item.state, confirmations, minConfirmations) : '';
                    const blockchainLink = this.getBlockchainLink(currency, item.rid);
                    return [
                        localeDate(item.created_at, 'fullDate'),
                        state,
                        <Decimal key={index} fixed={fixed}>{amount}</Decimal>,
                        <div className="pg-history-elem__hide" key={item.rid}><a href={blockchainLink} target="_blank" rel="noopener noreferrer">{<LaunchIcon/>}</a></div>
                    ];
                });    
            }
            case 'withdraws': {
                return list.sort((a, b) => {
                    return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
                }).map((item, index) => {
                    const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
                    const confirmations = type === 'deposits' && item.confirmations;
                    const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
                    const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
                    const state = 'state' in item ? this.formatTxState(item.state, confirmations, minConfirmations) : '';
                    const blockchainLink = this.getBlockchainLink(currency, item.blockchain_txid);
                    const AddressLink = this.getAddressLink(currency, item.rid);
                    return [
                        localeDate(item.created_at, 'fullDate'),
                        <div className="pg-history-elem__hide" key={item.rid }><a href={AddressLink} target="_blank" rel="noopener noreferrer">{item.rid}</a></div>,
                        state,
                        <Decimal key={index} fixed={fixed}>{amount}</Decimal>,
                        <Decimal key={index} fixed={fixed}>{item.fee}</Decimal>,
                        <div className="pg-history-elem__hide" key={item.blockchain_txid }><a href={blockchainLink} target="_blank" rel="noopener noreferrer">{<LaunchIcon/>}</a></div>
                    ];
                });
            }
            default: {
                return [];
            }
        }
    };

    // private retrieveData = list => {
    //     const {
    //         currency,
    //         currencies,
    //         intl,
    //         type,
    //         wallets,
    //     } = this.props;
    //     console.log('list', type);
    //     const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };
    //     if (list.length === 0) {
    //         return [[intl.formatMessage({ id: 'page.noDataToShow' }), '', '']];
    //     }
        
    //     return list.sort((a, b) => {
    //         return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
    //     }).map((item, index) => {
    //         const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
    //         const confirmations = type === 'deposits' && item.confirmations;
    //         const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
    //         const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
    //         const state = 'state' in item ? this.formatTxState(item.state, confirmations, minConfirmations) : '';
            
    //         const blockchainLink = this.getBlockchainLink(currency, item.txid);

    //         return [
    //             localeDate(item.created_at, 'fullDate'),
    //             state,
    //             <Decimal key={index} fixed={fixed}>{amount}</Decimal>,
    //             <div className="pg-history-elem__hide" key={item.txid || item.rid}><a href={blockchainLink} target="_blank" rel="noopener noreferrer">{<LaunchIcon/>}</a></div>
    //         ];
    //     });
    //};
    private getBlockchainLink = (currency: string, txid: string, rid?: string) => {
        const { wallets } = this.props;
        const currencyInfo = wallets && wallets.find(wallet => wallet.currency === currency);
        if (currencyInfo) {
            if (txid && currencyInfo.explorerTransaction) {
                return currencyInfo.explorerTransaction.replace('#{txid}', txid);
            }
            if (rid && currencyInfo.explorerAddress) {
                return currencyInfo.explorerAddress.replace('#{address}', rid);
            }
        }
        return '';
    };
    private getAddressLink = (currency: string,  rid?: string) => {
        const { wallets } = this.props;
        const currencyInfo = wallets && wallets.find(wallet => wallet.currency === currency);
        if (currencyInfo) {
            if (rid && currencyInfo.explorerAddress) {
                return currencyInfo.explorerAddress.replace('#{address}', rid);
            }
        }
        return '';
    };

    private formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
        const statusMapping = {
            succeed: <SucceedIcon />,
            failed: <FailIcon />,
            accepted: <SucceedIcon />,
            collected: <SucceedIcon />,
            canceled: <FailIcon />,
            rejected: <FailIcon />,
            processing: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' }),
            prepared: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' }),
            submitted: (confirmations !== undefined && minConfirmations !== undefined) ? (
                `${confirmations}/${minConfirmations}`
            ) : (
                this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' })
            ),
            skipped: <SucceedIcon />,
        };

        return statusMapping[tx];
    };
}


export const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    list: selectHistory(state),
    wallets: selectWallets(state),
    fetching: selectHistoryLoading(state),
    page: selectCurrentPage(state),
    firstElemIndex: selectFirstElemIndex(state, 6),
    lastElemIndex: selectLastElemIndex(state, 6),
    nextPageExists: selectNextPageExists(state, 6),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchCurrencies: () => dispatch(currenciesFetch()),
        fetchHistory: params => dispatch(fetchHistory(params)),
        resetHistory: () => dispatch(resetHistory()),
    });

export const WalletHistory = injectIntl(connect(mapStateToProps, mapDispatchToProps)(WalletTable));
