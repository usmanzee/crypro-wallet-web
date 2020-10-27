import cx from 'classnames';
import * as React from 'react';

export interface CryptoIconProps {
    code: string;
    className?: string;
    children?: React.ReactNode;
    width?: string;
}

const findIcon = (code: string): string => {
  try {
    return require(`../../../node_modules/cryptocurrency-icons/svg/color/${code.toLowerCase()}.svg`);
  } catch (err){
    return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
  }
};

export const CryptoIcon: React.FunctionComponent<CryptoIconProps> = props => {
    const { code, className = '', children,  width} = props;

    return (
        <span className={cx('cr-crypto-icon', className)}>
          <img width={width} src={findIcon(code)} alt="crypto-icon"/> {children}
        </span>
    );
};
