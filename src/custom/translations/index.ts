import { en } from '../../translations/en';
import { ru } from './ru';
import { es } from './es';

import localeRu from 'react-intl/locale-data/ru';
import localeES from 'react-intl/locale-data/es';

export const customLocaleData = ([...localeRu, ...localeES]);

export type LangType = typeof en;

export const customLanguageMap = {
    ru, es
};
