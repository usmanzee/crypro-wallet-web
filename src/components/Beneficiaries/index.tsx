import classnames from 'classnames';
import * as React from 'react';
import { FormControl, InputGroup} from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { PlusIcon } from '../../assets/images/PlusIcon';
import { TipIcon } from '../../assets/images/TipIcon';
import { TrashBin } from '../../assets/images/TrashBin';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withStyles, Theme } from '@material-ui/core/styles';
//import { CustomInput } from '../../components';
import {
    beneficiariesDelete,
    Beneficiary,
    BeneficiaryBank,
    MemberLevels,
    memberLevelsFetch,
    RootState,
    selectBeneficiaries,
    selectBeneficiariesCreate,
    selectMemberLevels,
    selectUserInfo,
    User,
} from '../../modules';
import { BeneficiariesActivateModal } from './BeneficiariesActivateModal';
import { BeneficiariesAddModal } from './BeneficiariesAddModal';
import { BeneficiariesFailAddModal } from './BeneficiariesFailAddModal';

interface ReduxProps {
    beneficiaries: Beneficiary[];
    beneficiariesAddData: Beneficiary;
    memberLevels?: MemberLevels;
    userData: User;
}

interface DispatchProps {
    deleteAddress: typeof beneficiariesDelete;
    memberLevelsFetch: typeof memberLevelsFetch;
}

interface OwnProps {
    currency: string;
    type: 'fiat' | 'coin';
    onChangeValue: (beneficiary: Beneficiary) => void;
}

interface State {
    currentWithdrawalBeneficiary: Beneficiary;
    isOpenAddressModal: boolean;
    isOpenConfirmationModal: boolean;
    isOpenDropdown: boolean;
    isOpenTip: boolean;
    isOpenFailModal: boolean;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};


const useStyles = (theme: Theme) => ({
    addAddressButton: {
        '.MuiButton-label' : {
            display: 'block'
        }
    }
    
});

type Props = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
class BeneficiariesComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentWithdrawalBeneficiary: defaultBeneficiary,
            isOpenAddressModal: false,
            isOpenConfirmationModal: false,
            isOpenDropdown: false,
            isOpenTip: false,
            isOpenFailModal: false,
        };
    }

    public componentDidMount() {
        const { currency, beneficiaries, memberLevels } = this.props;
        if (currency && beneficiaries.length) {
            const filtredBeneficiaries = this.handleFilterByState(this.handleFilterByCurrency(beneficiaries, currency));
            if (filtredBeneficiaries.length) {
                this.handleSetCurrentAddress(filtredBeneficiaries[0]);
            }
        }

        if (!memberLevels) {
            this.props.memberLevelsFetch();
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { currency, beneficiaries } = this.props;

        if ((nextProps.currency && nextProps.currency !== currency) ||
            (nextProps.beneficiaries.length && nextProps.beneficiaries !== beneficiaries)) {
            const filtredBeneficiaries = this.handleFilterByState(this.handleFilterByCurrency(nextProps.beneficiaries, nextProps.currency));

            if (filtredBeneficiaries.length) {
                this.handleSetCurrentAddress(filtredBeneficiaries[0]);
            }
        }
    }

    public render() {
        const {
            currency,
            type,
            beneficiaries,
            beneficiariesAddData,
        } = this.props;
        const {
            currentWithdrawalBeneficiary,
            isOpenAddressModal,
            isOpenConfirmationModal,
            isOpenFailModal,
        } = this.state;

        const filtredBeneficiaries = this.handleFilterByState(this.handleFilterByCurrency(beneficiaries, currency));

        return (
            <div className="pg-beneficiaries">
                <span className="pg-beneficiaries__title">{type === 'coin' ? this.translate('page.body.wallets.beneficiaries.title') : this.translate('page.body.wallets.beneficiaries.fiat.title')}</span>
                {filtredBeneficiaries.length ? this.renderAddressDropdown(filtredBeneficiaries, currentWithdrawalBeneficiary, type) : this.renderAddAddress()}
                {isOpenAddressModal && (
                    <BeneficiariesAddModal
                        currency={currency}
                        type={type}
                        handleToggleAddAddressModal={this.handleToggleAddAddressModal}
                        handleToggleConfirmationModal={this.handleToggleConfirmationModal}
                    />
                )}
                {isOpenConfirmationModal && (
                    <BeneficiariesActivateModal
                        beneficiariesAddData={beneficiariesAddData}
                        handleToggleConfirmationModal={this.handleToggleConfirmationModal}
                    />
                )}
                {isOpenFailModal && (
                    <BeneficiariesFailAddModal handleToggleFailModal={this.handleToggleFailModal} />
                )}
            </div>
        );
    }

    private renderAddAddress = () => {
        return (
            <>
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<AddIcon />}
                        style={{ margin: '0px 8px 8px' }}
                        onClick={this.handleClickToggleAddAddressModal()}
                    >
                        {this.translate('page.body.wallets.beneficiaries.addAddress')}
                    </Button>
                </div>
                {/* <div className="pg-beneficiaries__add" onClick={this.handleClickToggleAddAddressModal()}>
                    <span className="pg-beneficiaries__add__label">{this.translate('page.body.wallets.beneficiaries.addAddress')}</span>
                    <PlusIcon className="pg-beneficiaries__add__icon" />
                </div> */}
            </>
        );
    };

    private renderDropdownItem = (item: Beneficiary, index: number, type: 'fiat' | 'coin') => {
        if (type === 'fiat') {
            return (
                <div key={index} className="pg-beneficiaries__dropdown__body__item item">
                    <div className="item__left" onClick={this.handleClickSelectAddress(item)}>
                        <span className="item__left__title">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}</span>
                        <span className="item__left__address">{item.name}</span>
                    </div>
                    <div className="item__left" onClick={this.handleClickSelectAddress(item)}>
                        <span className="item__left__title">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.fullName')}</span>
                        <span className="item__left__address">{item.data ? (item.data as BeneficiaryBank).full_name : ''}</span>
                    </div>
                    <div className="item__right">
                        <span className="item__right__delete" onClick={this.handleClickDeleteAddress(item)}><TrashBin/></span>
                    </div>
                </div>
            );
        }

        return (
            <div key={index} className="pg-beneficiaries__dropdown__body__item item">
                <div className="item__left" onClick={this.handleClickSelectAddress(item)}>
                    <span className="item__left__title">{this.translate('page.body.wallets.beneficiaries.dropdown.name')}</span>
                    <span className="item__left__address">{item.name}</span>
                </div>
                <div className="item__right">
                    <span className="item__right__delete" onClick={this.handleClickDeleteAddress(item)}><TrashBin/></span>
                </div> 
            </div>
        );
    };

    private renderDropdownBody = (beneficiaries: Beneficiary[], type: 'fiat' | 'coin') => {
        const dropdownBodyClassName = classnames('pg-beneficiaries__dropdown__body', {
            'fiat-body': type === 'fiat',
        });

        return (
            <div className={dropdownBodyClassName}>
                {beneficiaries && beneficiaries.map((item, index) => this.renderDropdownItem(item, index, type))}
                <div className="pg-beneficiaries__dropdown__body__add add" onClick={this.handleClickToggleAddAddressModal()}>
                    <span className="add__label">{this.translate('page.body.wallets.beneficiaries.addAddress')}</span>
                    <PlusIcon className="add__icon" />
                </div>
            </div>
        );
    };

    private renderDropdownTipCryptoNote = (note: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.tipDescription')}</span>
                <span className="tip__content__block__value">{note}</span>
            </div>
        );
    }; 

    private renderDropdownTipCrypto = (currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="pg-beneficiaries__dropdown__tip tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.tipAddress')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.data.address}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.tipName')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && this.renderDropdownTipCryptoNote(currentWithdrawalBeneficiary.description)}
                    </div>
                </div>
            );
        }

        return;
    };

    private renderDropdownTipFiatDescription = (description: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.description')}</span>
                <span className="tip__content__block__value">{description}</span>
            </div>
        );
    };

    private renderDropdownTipFiat = (currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="pg-beneficiaries__dropdown__tip tip fiat-tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && this.renderDropdownTipFiatDescription(currentWithdrawalBeneficiary.description)}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.account')}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).account_number}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.bankOfBeneficiary')}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).bank_name}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return;
    };

    private renderAddressDropdown = (beneficiaries: Beneficiary[], currentWithdrawalBeneficiary: Beneficiary, type: 'fiat' | 'coin') => {
        const { isOpenDropdown, isOpenTip } = this.state;

        const dropdownClassName = classnames('pg-beneficiaries__dropdown', {
            'pg-beneficiaries__dropdown--open': isOpenDropdown,
        });

        if (type === 'fiat') {
            return (
                <>
                <div style={{ display: 'block'}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<AddIcon />}
                        style={{ margin: '0px 8px 8px' }}
                        onClick={this.handleClickToggleAddAddressModal()}
                    >
                        {this.translate('page.body.wallets.beneficiaries.addAddress')}
                    </Button>
                    <Autocomplete
                        fullWidth
                        disableClearable
                        options={beneficiaries}
                        onChange={(event: any, newValue: Beneficiary) => {
                            this.handleSetCurrentAddress(newValue)
                        }}
                        getOptionLabel={(option) => option.name}
                        value={currentWithdrawalBeneficiary}
                        style={{ padding: '8px 8px' }}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Select Beneficiary" placeholder="Favorites" />
                        )}
                    />
                </div>
                {/* <div className={dropdownClassName}>
                    <div className="pg-beneficiaries__dropdown__select fiat-select select" onClick={this.handleToggleDropdown}>
                    <div className="select__left">
                            <span className="select__left__title">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}</span>
                            <span className="select__left__address">{currentWithdrawalBeneficiary.name}</span>
                            <span className="select__left__title">{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.fullName')}</span>
                            <span className="select__left__address">{currentWithdrawalBeneficiary.data ? (currentWithdrawalBeneficiary.data as BeneficiaryBank).full_name : ''}</span>
                        </div>
                        <div className="select__right">
                        <span className="select__right__tip" onMouseOver={this.handleToggleTip} onMouseOut={this.handleToggleTip}><TipIcon/></span>
                        <span className="select__right__select">{this.translate('page.body.wallets.beneficiaries.dropdown.select')}</span>
                        <span className="select__right__chevron"><ChevronIcon /></span>
                        </div>
                    </div>
                    {isOpenDropdown && this.renderDropdownBody(beneficiaries, type)}
                    {isOpenTip && this.renderDropdownTipFiat(currentWithdrawalBeneficiary)}
                </div> */}
                </>
            );
        }

        return (
            <div className={dropdownClassName}>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <div className="pg-beneficiaries__dropdown__select select" onClick={this.handleToggleDropdown}>
                    <div className="select__left">
                        <span className="select__left__title">{this.translate('page.body.wallets.beneficiaries.dropdown.name')}</span>
                        <span className="select__left__address"><span>{currentWithdrawalBeneficiary.name}</span></span>
                    </div>
                    <div className="select__right">
                    <span className="select__right__tip" onMouseOver={this.handleToggleTip} onMouseOut={this.handleToggleTip}><TipIcon/></span>
                    <span className="select__right__select">{this.translate('page.body.wallets.beneficiaries.dropdown.select')}</span>
                    <span className="select__right__chevron"><ChevronIcon /></span>
                    </div>
                </div> 
                {isOpenDropdown && this.renderDropdownBody(beneficiaries, type)}
                {isOpenTip && this.renderDropdownTipCrypto(currentWithdrawalBeneficiary)} 
            </div>
        );
    };

    private handleClickDeleteAddress = (item: Beneficiary) => () => {
        this.handleDeleteAddress(item);
    };

    private handleClickSelectAddress = (item: Beneficiary) => () => {
        this.handleSetCurrentAddress(item);
    };

    private handleClickToggleAddAddressModal = () => () => {
        const { memberLevels, userData } = this.props;

        if (userData.level < memberLevels.withdraw.minimum_level) {
            this.handleToggleFailModal();
        } else {
            this.handleToggleAddAddressModal();
        }
    };

    private handleDeleteAddress = (item: Beneficiary) => {
        const payload = {
            id: item.id,
        };

        this.props.deleteAddress(payload);
    };

     private handleFilterByCurrency = (beneficiaries: Beneficiary[], currency: string) => {
         if (beneficiaries.length && currency) {
            return beneficiaries.filter(item => item.currency.toLowerCase() === currency.toLowerCase());
         }

         return [];
     };

    private handleFilterByState = (beneficiaries: Beneficiary[]) => {
        if (beneficiaries.length) {
            return beneficiaries.filter(item => item.state.toLowerCase() === 'active');
        }

        return [];
    };

    private handleSetCurrentAddress = (item: Beneficiary) => {
        if (item.data) {
            this.setState({
                currentWithdrawalBeneficiary: item,
                isOpenDropdown: false,
            });
            this.props.onChangeValue(item);
        }
    };

    private handleToggleAddAddressModal = () => {
        this.setState(prevState => ({
            isOpenAddressModal: !prevState.isOpenAddressModal,
        }));
    };

    private handleToggleConfirmationModal = () => {
        this.setState(prevState => ({
            isOpenConfirmationModal: !prevState.isOpenConfirmationModal,
        }));
    };

    private handleToggleFailModal = () => {
        this.setState(prevState => ({
            isOpenFailModal: !prevState.isOpenFailModal,
        }));
    };

    private handleToggleDropdown = () => {
        this.setState(prevState => ({
            isOpenDropdown: !prevState.isOpenDropdown,
        }));
    };

    private handleToggleTip = () => {
        this.setState(prevState => ({
            isOpenTip: !prevState.isOpenTip,
        }));
    };

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    beneficiaries: selectBeneficiaries(state),
    beneficiariesAddData: selectBeneficiariesCreate(state),
    memberLevels: selectMemberLevels(state),
    userData: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    deleteAddress: payload => dispatch(beneficiariesDelete(payload)),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
});

// tslint:disable-next-line:no-any
export const Beneficiaries = injectIntl(withStyles(useStyles as {})(connect(mapStateToProps, mapDispatchToProps)(BeneficiariesComponent) as any));
