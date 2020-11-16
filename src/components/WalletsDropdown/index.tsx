import * as React from 'react';
import {
    Typography,
} from '@material-ui/core';
import { fade, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { WalletItemProps } from '../WalletItem';
import { CryptoIcon } from '../CryptoIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    currencySelect: {
        display: 'flex',
    },
    currencyIcon: {
        width: "25px", 
        height: "25px", 
        [theme.breakpoints.only('sm')]: {
            width: "20px", 
            height: "20px",
            marginTop: theme.spacing(1)
        },
        [theme.breakpoints.only('xs')]: {
            width: "20px",
            height: "20px",
            marginTop: theme.spacing(1)
        },
    },
    walletCurrencyTag: {
        margin: '0 4px',
        [theme.breakpoints.only('sm')]: {
            fontSize: '14px',
            marginTop: theme.spacing(1)
        },
        [theme.breakpoints.only('xs')]: {
            fontSize: '14px',
            marginTop: theme.spacing(1)
        },
    },
    walletCurrencyName: {
        marginTop: '5px',
        [theme.breakpoints.only('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.only('xs')]: {
            display: 'none'
        },
    },
    popper: {
      border: '1px solid rgba(27,31,35,.15)',
      boxShadow: '0 3px 12px rgba(27,31,35,.15)',
      borderRadius: 3,
    //   width: 300,
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
    walletDropdownClick(event: React.MouseEvent<HTMLElement>): void;
    walletDropdownChange(event: React.MouseEvent<HTMLElement>, option: WalletItemProps | null | undefined): void;
    walletDropdownClose(event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason): void;
}
export const WalletsDropdown = (props: WalletDropdownProps) => {
    const { anchorEl, popperId, popperOpen, wallets, selectedWallet, walletDropdownClick, walletDropdownChange, walletDropdownClose } = props;
    const classes = useStyles();
    return (
        <>
        <div onClick={walletDropdownClick} className={classes.currencySelect}>
            {selectedWallet ? 
                (<>
                    {selectedWallet.iconUrl ? (<img src={`${ selectedWallet.iconUrl } `} className={classes.currencyIcon} alt="currency"/>) : (<CryptoIcon code={selectedWallet.currency.toUpperCase()} />)}
                    <Typography variant="h6" component="div" display="inline" className={classes.walletCurrencyTag}>
                        { selectedWallet.currency.toUpperCase() }
                    </Typography>
                    {/* <Typography variant="body2" component="div" display="inline" className={classes.walletCurrencyName}>
                        { selectedWallet.name }
                    </Typography> */}
                    <ArrowDropDownIcon style={{ marginTop: '4px' }}/> 
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
                            {option && option.iconUrl ? (<img src={`${ option.iconUrl } `} className={classes.currencyIcon} alt="currency"/>) : (<CryptoIcon code={optionCurrency} />)}
                            <div>
                                <Typography variant="h6" component="div" display="inline" className={classes.walletCurrencyTag}>
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