import { en } from '../../translations/en';
import { ru } from './ru';
import { es } from './es';
import { zh } from './zh';

import localeRu from 'react-intl/locale-data/ru';
import localeES from 'react-intl/locale-data/es';
import localeZh from 'react-intl/locale-data/zh';

export const customLocaleData = ([...localeRu, ...localeES, ...localeZh]);

export type LangType = typeof en;

export const customLanguageMap = {
    ru, es, zh
};
