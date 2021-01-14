// tslint:disable:no-submodule-imports
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider } from 'react-redux';
import { App } from './App';
import { customLocaleData } from './custom/translations';
import './index.css';
import { rootSaga } from './modules';
import { rangerSagas } from './modules/public/ranger';
import { rangerMiddleware, sagaMiddleware, store } from './store';

import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        light: 'rgb(111, 33, 88, 0.6)',
        main: "rgb(111, 33, 88, 0.85)",
        dark: "rgb(111, 33, 88)",
      },
      secondary: {
        light: 'rgb(245, 130, 32, 0.6)',
        main: "rgb(245, 130, 32, 0.85)",
        dark: "rgb(245, 130, 32)",
      },
    },

    overrides: {
        MuiButton: {
          root: {
          },
          containedPrimary: {
            color: "#fff",
            "&:disabled": {
              color: "#fff",
              backgroundColor: "rgb(111, 33, 88)",
              opacity: 0.5
            },
          },
          containedSecondary: {
            color: "#fff",
            "&:disabled": {
              color: "#fff",
              backgroundColor: "#f58220",
              opacity: 0.5
            },
          },
          outlinedPrimary: {
            color: "#f58220",
              "&:hover": {
                color: 'rgb(111, 33, 88)',
            }
          },
          outlinedSecondary: {
            color: "#f58220",
              "&:hover": {
                color: '#f58220',
            }
          },
          colorInherit: {
            color: "#fff"
          }
        },
      },
      typography: {
        fontSize: 16,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        htmlFontSize: 16
      }
  });
theme = responsiveFontSizes(theme);

addLocaleData([...en, ...customLocaleData]);
sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);

Sentry.init({ dsn: "https://62680c1c8f834779a046e567dec7503a@o175277.ingest.sentry.io/1258341" });

const render = () => ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement,
);

render();
