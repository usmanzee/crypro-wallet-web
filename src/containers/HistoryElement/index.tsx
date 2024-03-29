import * as React from 'react';
import { Spinner } from 'react-bootstrap';

import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import LinkOffIcon from '@material-ui/icons/LinkOff';

import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import { compose } from 'redux';
import { History, Pagination, CopyTag } from '../../components';
import { Decimal } from '../../components/Decimal';
import {
    localeDate,
    preciseData,
    setDepositStatusColor,
    setTradesType,
    setWithdrawStatusColor,
    uppercase,
} from '../../helpers';
import {
    alertPush,
    currenciesFetch,
    Currency,
    fetchHistory,
    Market,
    RootState,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectMarkets,
    selectNextPageExists,
    selectWallets,
    Wallet,
    WalletHistoryList,
} from '../../modules';

interface HistoryProps {
    type: string;
}

interface ReduxProps {
    currencies: Currency[];
    marketsData: Market[];
    wallets: Wallet[];
    list: WalletHistoryList;
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchHistory: typeof fetchHistory;
    fetchAlert: typeof alertPush;
}

type Props = HistoryProps & ReduxProps & DispatchProps & InjectedIntlProps;

class HistoryComponent extends React.Component<Props> {
    public componentDidMount() {
        const { currencies, type } = this.props;
        this.props.fetchHistory({ page: 0, type, limit: 25 });

        if (currencies.length === 0) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies } = this.props;

        if (nextProps.currencies.length === 0 && nextProps.currencies !== currencies) {
            this.props.fetchCurrencies();
        }
    }

    public render() {
        const { list, fetching } = this.props;

        return (
          <div className={`pg-history-elem ${list.length ? '' : 'pg-history-elem-empty'}`}>
              {fetching && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
              {list.length ? this.renderContent() : null}
              {!list.length && !fetching ? <p className="pg-history-elem__empty">{this.props.intl.formatMessage({id: 'page.noDataToShow'})}</p> : null}
          </div>
        );
    }

    public renderContent = () => {
        const { type, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;

        return (
            <React.Fragment>
                <History headers={this.renderHeaders(type)} data={this.retrieveData()}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
        );
    };

    private onClickPrevPage = () => {
        const { page, type } = this.props;
        this.props.fetchHistory({ page: Number(page) - 1, type, limit: 25 });
    };

    private onClickNextPage = () => {
        const { page, type } = this.props;
        this.props.fetchHistory({ page: Number(page) + 1, type, limit: 25 });
    };

    private renderHeaders = (type: string) => {
        switch (type) {
          case 'deposits':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.currency'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.status'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid'}),
              ];
          case 'withdraws':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.address'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.currency'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.fee'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.status'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.txid'}),
              ];
          case 'trades':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.side'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.market'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.price'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.total'}),
              ];
          default:
              return [];
        }
    };


    private retrieveData = () => {
        const { type, list } = this.props;

        return [...list]
            .map(item => this.renderTableRow(type, item));
    };

    private renderTableRow = (type, item) => {
        const {
            currencies,
            intl,
            marketsData,
            wallets,
        } = this.props;
        switch (type) {
            case 'deposits': {
                const { amount, confirmations, created_at, currency, txid } = item;
                const blockchainLink = this.getBlockchainLink(currency, txid);
                const wallet = wallets.find(obj => obj.currency === currency);
                const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
                const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
                const state = (item.state === 'submitted' && confirmations !== undefined && minConfirmations !== undefined) ? (
                    `${confirmations}/${minConfirmations}`
                ) : (
                    intl.formatMessage({id: `page.body.history.deposit.content.status.${item.state}`})
                );

                return [
                    localeDate(created_at, 'fullDate'),
                    currency && currency.toUpperCase(),
                    wallet && preciseData(amount, wallet.fixed),
                    <span style={{ color: setDepositStatusColor(item.state) }} key={txid}>{state}</span>,
                    // <div className="pg-history-elem__hide" key={txid}>
                    //     <a href={blockchainLink} target="_blank" rel="noopener noreferrer">{txid}</a>
                    // </div>,
                    <div className="pg-history-elem__hide" key={item.rid}>
                        {txid ? 
                            <CopyTag text={txid} disabled={false} />
                            : ''
                        }
                        {txid ? 
                            <>
                                <a href={blockchainLink} target="_blank" rel="noopener noreferrer">
                                    <LaunchIcon />
                                </a>
                            </> : 
                            <IconButton aria-label="launch" disabled style={{ padding: '0px' }}>
                                <LaunchIcon />
                            </IconButton>
                        }
                    </div>
                ];
            }
            case 'withdraws': {
                const { blockchain_txid, created_at, currency, amount, fee, rid } = item;
                const state = intl.formatMessage({ id: `page.body.history.withdraw.content.status.${item.state}` });
                const blockchainLink = this.getBlockchainLink(currency, blockchain_txid, rid);
                const wallet = wallets.find(obj => obj.currency === currency);

                return [
                    <div className="pg-history-elem__hide" key={blockchain_txid || rid}><a href={blockchainLink} target="_blank" rel="noopener noreferrer">{blockchain_txid || rid}</a></div>,
                    localeDate(created_at, 'fullDate'),
                    uppercase(currency),
                    wallet && preciseData(amount, wallet.fixed),
                    fee,
                    <span style={{ color: setWithdrawStatusColor(item.state) }} key={blockchain_txid || rid}>{state}</span>,
                    <div className="pg-history-elem__hide" key={item.rid}>
                        {blockchain_txid ? 
                            <CopyTag text={blockchain_txid} disabled={false} />
                            : ''
                        }
                        {blockchain_txid ? 
                            <>
                                <a href={blockchainLink} target="_blank" rel="noopener noreferrer">
                                    {<LaunchIcon/>}
                                </a>
                            </> : 
                            <IconButton aria-label="launch" disabled style={{ padding: '0px' }}>
                                <LaunchIcon />
                            </IconButton>
                        }
                    </div>
                ];
            }
            case 'trades': {
                const { id, created_at, side, market, price, amount, total } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) ||
                    { name: '', price_precision: 0, amount_precision: 0 };
                const marketName = marketToDisplay ? marketToDisplay.name : market;
                const sideText = setTradesType(side).text.toLowerCase() ? intl.formatMessage({id: `page.body.history.trade.content.side.${setTradesType(side).text.toLowerCase()}`}) : '';

                return [
                    localeDate(created_at, 'fullDate'),
                    <span style={{ color: setTradesType(side).color }} key={id}>{sideText}</span>,
                    marketName,
                    <Decimal key={id} fixed={marketToDisplay.price_precision}>{price}</Decimal>,
                    <Decimal key={id} fixed={marketToDisplay.amount_precision}>{amount}</Decimal>,
                    <Decimal key={id} fixed={marketToDisplay.amount_precision}>{total}</Decimal>,
                ];
            }
            default: {
                return [];
            }
        }
    };

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
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    marketsData: selectMarkets(state),
    wallets: selectWallets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    page: selectCurrentPage(state),
    firstElemIndex: selectFirstElemIndex(state, 25),
    lastElemIndex: selectLastElemIndex(state, 25),
    nextPageExists: selectNextPageExists(state, 25),
});


export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchCurrencies: () => dispatch(currenciesFetch()),
        fetchHistory: params => dispatch(fetchHistory(params)),
        fetchAlert: payload => dispatch(alertPush(payload)),
    });

export const HistoryElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(HistoryComponent) as any; // tslint:disable-line
