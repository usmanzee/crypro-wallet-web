import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMarketSelectorState,
    toggleMarketSelector,
    
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';

import { withStyles, Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = (theme: Theme) => ({
    subHeader: {
        backgroundColor: '#fff',
        padding: theme.spacing(1),
        color: '#000',
        margin: `${theme.spacing(8)}px 0px ${theme.spacing(1)}px`
      },
});


interface ReduxProps {
    currentMarket: Market | undefined;
    marketSelectorOpened: boolean;
}


interface DispatchProps {
    toggleMarketSelector: typeof toggleMarketSelector;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class TradingToolbarContainer extends React.Component<Props> {

    public render() {
        const { classes } = this.props;

        const shouldRenderMarketToolbar = window.location.pathname.includes('/trading/') ? true : false;

        console.log(shouldRenderMarketToolbar);
    
        return (
            <React.Fragment>
            {shouldRenderMarketToolbar &&
                (
                    <>
                        <Paper className={classes.subHeader} elevation={1}>
                            <Grid container>
                                <Grid item md={1} style={{ marginTop: '8px' }}>
                                    {this.renderMarketToggler()}
                                </Grid>
                                <Grid item md={11}>
                                    {this.renderMarketToolbar()}
                                </Grid>
                            </Grid>
                        </Paper>
                    </>
                )
                }
          </React.Fragment>
        );
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    private renderMarketToolbar = () => {
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return <HeaderToolbar/>;
    };

    private renderMarketToggler = () => {
        const { currentMarket, marketSelectorOpened } = this.props;
        //const isLight = colorTheme === 'light';
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return (
            <div className="pg-header__market-selector-toggle" onClick={this.props.toggleMarketSelector}>
                <p className="pg-header__market-selector-toggle-value">
                    {currentMarket && currentMarket.name}
                </p>
                {marketSelectorOpened ? (
                    <img src={require(`./arrows/arrowBottom.svg`)} alt="arrow"/>
                ) : (
                    <img src={require(`./arrows/arrowRight.svg`)} alt="arrow"/>
                )}
            </div>
        );
    };

    private backWallets = () => this.props.setMobileWalletUi('');
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    marketSelectorOpened: selectMarketSelectorState(state),
    
});

export const TradingToolbar = injectIntl(withStyles(useStyles as {})(connect(mapStateToProps)(TradingToolbarContainer) as any));
