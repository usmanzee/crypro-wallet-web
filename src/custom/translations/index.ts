import { en } from '../../translations/en';
import { ru } from './ru';
import { es } from './es';
import { zh } from './zh';
import { ml } from './ml';

import localeRu from 'react-intl/locale-data/ru';
import localeES from 'react-intl/locale-data/es';
import localeZh from 'react-intl/locale-data/zh';
import localeML from 'react-intl/locale-data/ml';

export const customLocaleData = ([...localeRu, ...localeES, ...localeZh, ...localeML]);

export type LangType = typeof en;

export const customLanguageMap = {
    ru, es, zh, ml
};
