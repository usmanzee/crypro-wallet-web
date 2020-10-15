// tslint:disable:no-submodule-imports
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider } from 'react-redux';
import { App } from './App';
import { customLocaleData } from './custom/translations';
import './assets/css/vendor.bundle.base.css'
import './assets/css/materialdesignicons.min.css'
import './assets/css/style.css'
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
        main: "rgb(111, 33, 88)",
      },
      secondary: {
        main: "#f58220",
      },
    },

    overrides: {
        MuiButton: {
          root: {
            // "&:hover": {
            //   textDecoration: "none",
            //   color: '#fff',
            //   "@media (hover: none)": {
            //     backgroundColor: "#3C37D"
            //   }
            // },
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
        }
      },
      typography: {
        // fontFamily: "",
        // The default font size of the Material Specification.
        fontSize: 16, // px
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        // Tell Material-UI what's the font-size on the html element.
        // 16px is the default font-size used by browsers.
        htmlFontSize: 16
      }
  });
theme = responsiveFontSizes(theme);

addLocaleData([...en, ...customLocaleData]);
sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);

const render = () => ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement,
);

render();
