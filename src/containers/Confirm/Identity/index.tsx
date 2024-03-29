import cr from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { languages } from '../../../api/config';
import { CustomInput, DropdownComponent } from '../../../components';
import { formatDate, isDateInFuture } from '../../../helpers';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles, Theme } from '@material-ui/core/styles';

import {
    Label,
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectLabelData,
    selectSendIdentitySuccess,
    selectUserInfo,
    sendIdentity,
    User,
} from '../../../modules';
import { nationalities } from '../../../translations/nationalities';

import * as countries from 'i18n-iso-countries';

interface ReduxProps {
    sendSuccess?: string;
    lang: string;
    labels: Label[];
    user: User;
}

interface DispatchProps {
    sendIdentity: typeof sendIdentity;
    labelFetch: typeof labelFetch;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface IdentityState {
    city: string;
    country: string;
    countryOfBirth: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    metadata: {
        nationality: string,
    };
    postcode: string;
    residentialAddress: string;
    cityFocused: boolean;
    dateOfBirthFocused: boolean;
    firstNameFocused: boolean;
    lastNameFocused: boolean;
    postcodeFocused: boolean;
    residentialAddressFocused: boolean;

    dataNationalities: string[];
    dataCountries: string[];
}

const useStyles = (theme: Theme) => ({
    autocompleteInput: {
        '& .MuiSvgIcon-root': {
            marginRight: theme.spacing(2)
        }
    }
    
});

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class IdentityComponent extends React.Component<Props, IdentityState> {
    public state = {
        city: '',
        country: '',
        countryOfBirth: '',
        dateOfBirth: '',
        firstName: '',
        lastName: '',
        metadata: {
            nationality: '',
        },
        postcode: '',
        residentialAddress: '',
        cityFocused: false,
        dateOfBirthFocused: false,
        firstNameFocused: false,
        lastNameFocused: false,
        postcodeFocused: false,
        residentialAddressFocused: false,

        dataNationalities: [],
        dataCountries: []
    };

    public componentDidMount = () => {
        const { lang } = this.props;
        this.formatCountriesData();
        this.formatNationalitiesData();
    }

    public formatCountriesData = () => {
        const { lang } = this.props;
        this.setState({
            dataCountries: Object.values(countries.getNames(lang))
        }, () => {
            this.setState({
                country: this.state.dataCountries[0],
                countryOfBirth: countries.getAlpha2Code(this.state.dataCountries[0], this.props.lang),
            })
        });
    }

    public formatNationalitiesData = () => {
        const { lang } = this.props;

        this.setState({
            dataNationalities:  nationalities.map(value => this.translate(value))
        }, () => {
            this.setState({
                metadata: { nationality: this.state.dataNationalities[0] },
            })
        });
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        const { sendSuccess } = this.props;

        if (!prev.sendSuccess && sendSuccess) {
            this.props.labelFetch();
        }
    }

    public render() {
        const { sendSuccess, lang } = this.props;
        const {
            city,
            country,
            dateOfBirth,
            firstName,
            lastName,
            postcode,
            residentialAddress,
            cityFocused,
            dateOfBirthFocused,
            firstNameFocused,
            lastNameFocused,
            postcodeFocused,
            residentialAddressFocused,
            countryOfBirth,
            metadata,

            dataCountries,
            dataNationalities
        } = this.state;
        const { classes } = this.props;

        const cityGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': cityFocused,
            'pg-confirm__content-identity-col-row-content--wrong': city && !this.handleValidateInput('city', city),
        });

        const dateOfBirthGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': dateOfBirthFocused,
            'pg-confirm__content-identity-col-row-content--wrong': dateOfBirth && !this.handleValidateInput('dateOfBirth', dateOfBirth),
        });

        const firstNameGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': firstNameFocused,
            'pg-confirm__content-identity-col-row-content--wrong': firstName && !this.handleValidateInput('firstName', firstName),
        });

        const lastNameGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': lastNameFocused,
            'pg-confirm__content-identity-col-row-content--wrong': lastName && !this.handleValidateInput('lastName', lastName),
        });

        const postcodeGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': postcodeFocused,
            'pg-confirm__content-identity-col-row-content--wrong': postcode && !this.handleValidateInput('postcode', postcode),
        });

        const residentialAddressGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': residentialAddressFocused,
            'pg-confirm__content-identity-col-row-content--wrong': residentialAddress && !this.handleValidateInput('residentialAddress', residentialAddress),
        });

        // const dataNationalities = nationalities.map(value => {
        //     return this.translate(value);
        // });
        const onSelectNationality = value => this.selectNationality(dataNationalities[value]);

        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));

        /* tslint:enable */

        // const dataCountries = Object.values(countries.getNames(lang));
        
        const onSelectCountry = (value) => {   
            this.selectCountry(dataCountries[value]);
        }

        return (
          <div className="pg-confirm__content-identity">
            <div className="pg-confirm__content-identity-forms">
                <div className="pg-confirm__content-identity-col">
                    <div className="pg-confirm__content-identity-col-row">
                        <fieldset className={firstNameGroupClass}>
                            <CustomInput
                                type="string"
                                inputValue={firstName}
                                placeholder={this.translate('page.body.kyc.identity.firstName')}
                                handleChangeInput={e => this.handleChange(e, 'firstName')}
                                autoFocus={true}
                                label={firstName ? this.translate('page.body.kyc.identity.firstName') : ''}
                                defaultLabel={firstName ? this.translate('page.body.kyc.identity.firstName') : ''}
                                handleFocusInput={this.handleFieldFocus('firstName')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <fieldset className={lastNameGroupClass}>
                            <CustomInput
                                type="string"
                                inputValue={lastName}
                                handleChangeInput={e => this.handleChange(e, 'lastName')}
                                placeholder={this.translate('page.body.kyc.identity.lastName')}
                                label={lastName ? this.translate('page.body.kyc.identity.lastName') : ''}
                                defaultLabel={lastName ? this.translate('page.body.kyc.identity.lastName') : ''}
                                handleFocusInput={this.handleFieldFocus('lastName')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <fieldset className={dateOfBirthGroupClass}>
                            {dateOfBirth && <legend>{this.translate('page.body.kyc.identity.dateOfBirth')}</legend>}
                            <MaskInput
                                className="pg-confirm__content-identity-col-row-content-number"
                                maskString="00/00/0000"
                                mask="00/00/0000"
                                onChange={this.handleChangeDate}
                                onFocus={this.handleFieldFocus('dateOfBirth')}
                                onBlur={this.handleFieldFocus('dateOfBirth')}
                                value={dateOfBirth}
                                placeholder={this.translate('page.body.kyc.identity.dateOfBirth')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <Autocomplete
                            fullWidth
                            disableClearable
                            options={dataNationalities}
                            onChange={(event: any, newValue: any) => {
                                this.selectNationality(newValue)
                            }}
                            getOptionLabel={(option) => option}
                            value={metadata.nationality}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    className={classes.autocompleteInput}
                                    label={this.translate('page.body.kyc.identity.nationality')}
                                />
                            )}
                        />
                        {/* <div className="pg-confirm__content-identity-col-row-content">
                            <div className="pg-confirm__content-identity-col-row-content-label">
                                {metadata.nationality && this.translate('page.body.kyc.identity.nationality')}
                            </div>
                            <DropdownComponent
                                className="pg-confirm__content-identity-col-row-content-number-dropdown"
                                list={dataNationalities}
                                onSelect={onSelectNationality}
                                placeholder={this.translate('page.body.kyc.identity.nationality')}
                            />
                        </div> */}
                    </div>
                </div>
                <div className="pg-confirm__content-identity-col pg-confirm__content-identity-col-right">
                    <div className="pg-confirm__content-identity-col-row">
                        <fieldset className={residentialAddressGroupClass}>
                            <CustomInput
                                type="string"
                                inputValue={residentialAddress}
                                placeholder={this.translate('page.body.kyc.identity.residentialAddress')}
                                label={residentialAddress ? this.translate('page.body.kyc.identity.residentialAddress') : ''}
                                defaultLabel={residentialAddress ? this.translate('page.body.kyc.identity.residentialAddress') : ''}
                                handleChangeInput={e => this.handleChange(e, 'residentialAddress')}
                                handleFocusInput={this.handleFieldFocus('residentialAddress')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <Autocomplete
                            fullWidth
                            disableClearable
                            options={dataCountries}
                            onChange={(event: any, newValue: any) => {
                                this.selectCountry(newValue)
                            }}
                            getOptionLabel={(option) => {
                                return option;
                            }}
                            value={country}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    className={classes.autocompleteInput}
                                    label={this.translate('page.body.kyc.identity.CoR')}
                                />
                            )}
                        />
                        {/* <div className="pg-confirm__content-identity-col-row-content">
                            <div className="pg-confirm__content-identity-col-row-content-label">
                                {countryOfBirth && this.translate('page.body.kyc.identity.CoR')}
                            </div>
                            <DropdownComponent
                                className="pg-confirm__content-identity-col-row-content-number-dropdown"
                                list={dataCountries}
                                onSelect={onSelectCountry}
                                placeholder={this.translate('page.body.kyc.identity.CoR')}
                            />
                        </div> */}
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <fieldset className={cityGroupClass}>
                            <CustomInput
                                type="string"
                                inputValue={city}
                                handleChangeInput={e => this.handleChange(e, 'city')}
                                placeholder={this.translate('page.body.kyc.identity.city')}
                                label={city ? this.translate('page.body.kyc.identity.city') : ''}
                                defaultLabel={city ? this.translate('page.body.kyc.identity.city') : ''}
                                handleFocusInput={this.handleFieldFocus('city')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <fieldset className={postcodeGroupClass}>
                            <CustomInput
                                label={postcode ? this.translate('page.body.kyc.identity.postcode') : ''}
                                defaultLabel={postcode ? this.translate('page.body.kyc.identity.postcode') : ''}
                                type="string"
                                inputValue={postcode}
                                handleChangeInput={e => this.handleChange(e, 'postcode')}
                                onKeyPress={this.handleConfirmEnterPress}
                                placeholder={this.translate('page.body.kyc.identity.postcode')}
                                handleFocusInput={this.handleFieldFocus('postcode')}
                            />
                        </fieldset>
                    </div>
                </div>
              </div>
              {sendSuccess && <p className="pg-confirm__success">{this.translate(sendSuccess)}</p>}
              <div className="pg-confirm__content-deep">
                    <Button
                        onClick={this.sendData}
                        disabled={this.handleCheckButtonDisabled()}
                        size="lg"
                        variant="primary"
                        type="button"
                        block={true}
                    >
                        {this.translate('page.body.kyc.next')}
                    </Button>
              </div>
          </div>
        );
    }

    private scrollToElement = (displayedElem: number) => {
            const element: HTMLElement = document.getElementsByClassName('pg-confirm__content-identity-col-row')[displayedElem] as HTMLElement;
            element && element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    };

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'city':
                    this.setState({
                        cityFocused: !this.state.cityFocused,
                    });
                    this.scrollToElement(6);
                    break;
                case 'dateOfBirth':
                    this.setState({
                        dateOfBirthFocused: !this.state.dateOfBirthFocused,
                    });
                    this.scrollToElement(2);
                    break;
                case 'firstName':
                    this.setState({
                        firstNameFocused: !this.state.firstNameFocused,
                    });
                    this.scrollToElement(0);
                    break;
                case 'lastName':
                    this.setState({
                        lastNameFocused: !this.state.lastNameFocused,
                    });
                    this.scrollToElement(1);
                    break;
                case 'postcode':
                    this.setState({
                        postcodeFocused: !this.state.postcodeFocused,
                    });
                    this.scrollToElement(7);
                    break;
                case 'residentialAddress':
                    this.setState({
                        residentialAddressFocused: !this.state.residentialAddressFocused,
                    });
                    this.scrollToElement(4);
                    break;
                default:
                    break;
            }
        };
    };

    private handleChange = (value: string, key: string) => {
            // @ts-ignore
            this.setState({
                [key]: value,
            });
    };

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !this.handleCheckButtonDisabled()) {
            event.preventDefault();
            this.sendData();
        }
    };

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: formatDate(e.target.value),
        });
    };

    private selectNationality = (value: string) => {
        this.setState({
            metadata: { nationality: value },
        });
    };

    private selectCountry = (value: string) => {
        this.setState({
            country: value,
            countryOfBirth: countries.getAlpha2Code(value, this.props.lang),
        });
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'firstName':
                const firstNameRegex = new RegExp(`^[a-zA-Z]{1,100}$`);

                return value.match(firstNameRegex) ? true : false;
            case 'lastName':
                const lastNameRegex = new RegExp(`^[a-zA-Z]{1,100}$`);

                return value.match(lastNameRegex) ? true : false;
            case 'residentialAddress':
                const residentialAddressRegex = new RegExp(`^[a-zA-Z0-9,.;/\\s]+$`);

                return value.match(residentialAddressRegex) ? true : false;
            case 'city':
                const cityRegex = new RegExp(`^[a-zA-Z]+$`);

                return value.match(cityRegex) ? true : false;
            case 'postcode':
                const postcodeRegex = new RegExp(`^[0-9]{1,12}$`);

                return value.match(postcodeRegex) ? true : false;
            case 'dateOfBirth':
                if (value.length === 10) {
                    return moment(value, 'DD/MM/YYYY').unix() < (Date.now() / 1000);
                }

                return false;
            default:
                return true;
        }
    };

    private handleCheckButtonDisabled = () => {
        const {
            city,
            dateOfBirth,
            firstName,
            lastName,
            postcode,
            residentialAddress,
            countryOfBirth,
            metadata,
        } = this.state;

        const firstNameValid = this.handleValidateInput('firstName', firstName);
        const lastNameValid = this.handleValidateInput('lastName', lastName);
        const residentialAddressValid = this.handleValidateInput('residentialAddress', residentialAddress);
        const cityValid = this.handleValidateInput('city', city);
        const postcodeValid = this.handleValidateInput('postcode', postcode);
        const dateOfBirthValid = this.handleValidateInput('dateOfBirth', dateOfBirth);

        return (
            !firstNameValid
            || !lastNameValid
            || !metadata.nationality
            || !residentialAddressValid
            || !countryOfBirth
            || !cityValid
            || !postcodeValid
            || !dateOfBirthValid
        );
    };

    private sendData = () => {
        const dob = !isDateInFuture(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob,
            address: this.state.residentialAddress,
            postcode: this.state.postcode,
            city: this.state.city,
            country: this.state.countryOfBirth,
            metadata: JSON.stringify({
                nationality: this.state.metadata.nationality,
            }),
            confirm: true,
        };

        this.props.sendIdentity(profileInfo);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    sendSuccess: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    labels: selectLabelData(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        sendIdentity: payload => dispatch(sendIdentity(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line
export const Identity = injectIntl(withStyles(useStyles as {})(connect(mapStateToProps, mapDispatchProps)(IdentityComponent) as any));
