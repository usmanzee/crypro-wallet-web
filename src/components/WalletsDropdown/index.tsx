import * as React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { fade, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';

import { WalletItemProps } from '../WalletItem';
import { CryptoIcon } from '../CryptoIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    currencySelect: {
        display: 'flex',
        width: 300,
        cursor: 'pointer',
        // margin:' 8px 0px',
        padding: `12px ${theme.spacing(1)}px`,
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: 'rgb(230, 232, 234)',
        borderStyle: 'solid',
        [theme.breakpoints.only('sm')]: {
            width: 'auto',
        },
        [theme.breakpoints.only('xs')]: {
            width: 'auto',
        },
    },
    currencyIcon: {
        width: "25px", 
        height: '25px'
    },
    popper: {
      border: '1px solid rgba(27,31,35,.15)',
      boxShadow: '0 3px 12px rgba(27,31,35,.15)',
      borderRadius: 3,
      width: 300,
      zIndex: 1,
      fontSize: 13,
      color: '#586069',
      backgroundColor: '#f6f8fa',
    },
    selectWalletHeader: {
        borderBottom: '1px solid #e1e4e8',
        padding: '8px 10px',
        fontWeight: 600,
    },
    inputBase: {
      padding: 10,
      width: '100%',
      borderBottom: '1px solid #dfe2e5',
      '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: '1px solid #ced4da',
        fontSize: 14,
        '&:focus': {
          boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
          borderColor: theme.palette.primary.main,
        },
      },
    },
  }),
);

export interface WalletDropdownProps {
    anchorEl: HTMLElement | null;
    popperOpen: boolean;
    popperId: string | undefined;
    wallets: WalletItemProps[];
    selectedWallet: WalletItemProps | null | undefined;
    setAnchorEl(target: HTMLElement | null): void;
    setSelectedWallet(option: WalletItemProps | null): void;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    walletDropdownClick(event: React.MouseEvent<HTMLElement>): void;
    walletDropdownChange(event: React.MouseEvent<HTMLElement>, option: WalletItemProps | null | undefined): void;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    walletDropdownClose(event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason): void;
}
export const WalletsDropdown = (props: WalletDropdownProps) => {
    const { anchorEl, setAnchorEl, popperId, popperOpen, wallets, selectedWallet, setSelectedWallet, walletDropdownClick, walletDropdownChange, walletDropdownClose } = props;
    const classes = useStyles();
    return (
        <>
        <div className={classes.currencySelect} onClick={walletDropdownClick}>
            {selectedWallet ? 
                (<>
                    {selectedWallet.iconUrl ? (<img src={`${ selectedWallet.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon code={selectedWallet.currency.toUpperCase()} />)}
                    <Typography variant="h6" component="div" display="inline" style={{ margin: '0 4px' }}>
                        { selectedWallet.currency.toUpperCase() }
                    </Typography>
                    <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                        { selectedWallet.name }
                    </Typography> 
                </>) :
                ""
            }
        </div>
            <Popper
                id={popperId}
                open={popperOpen}
                anchorEl={anchorEl}
                placement="bottom-start"
                className={classes.popper}
            >
                <div className={classes.selectWalletHeader}>
                    {/* <FormattedMessage id={'page.body.withdraw.select.title'} /> */}
                    Select Wallet
                </div>
                <Autocomplete
                    open
                    onClose={walletDropdownClose}
                    disableCloseOnSelect={false}
                    value={selectedWallet}
                    onChange={(event: any, selectedOption: WalletItemProps | null) => {
                        // setSelectedWallet(selectedOption);
                        walletDropdownChange(event, selectedOption)
                    }}
                    noOptionsText="No Records Found"
                    renderOption = {(option: WalletItemProps) => {
                        const optionCurrency = option ? option.currency.toUpperCase() : '';
                        return <React.Fragment>
                            {option && option.iconUrl ? (<img src={`${ option.iconUrl } `} className={classes.currencyIcon}/>) : (<CryptoIcon code={optionCurrency} />)}
                            <div>
                                <Typography variant="h6" component="div" display="inline" style={{ margin: '0px 4px' }}>
                                    { option ? option.currency.toUpperCase(): '' }
                                </Typography>
                                <Typography variant="body2" component="div" display="inline" style={{ marginTop: '5px' }}>
                                    { option ? option.name : '' }
                                </Typography>
                            </div>
                        </React.Fragment>
                    }}
                    options={wallets}
                    getOptionLabel={(option: WalletItemProps) => option ? option.name: ''}
                    renderInput={(params) => (
                    <InputBase
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        autoFocus
                        className={classes.inputBase}
                    />
                    )}
                />
            </Popper>
        </>
    );
}