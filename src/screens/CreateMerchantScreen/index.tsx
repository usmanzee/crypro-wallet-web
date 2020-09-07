import * as React from 'react';
import "./merchant.css";

import { MerchantProfile } from "../../containers/MerchantProfile";
import { MerchantApiKeys } from "../../containers/MerchantApiKeys";
import { MerchantWebsite } from "../../containers/MerchantWebsite";

import Container from '@material-ui/core/Container';

const CreateMerchantScreen = () => {

  return (
    <>
      <Container>
        <MerchantProfile />
        <MerchantApiKeys />
        <MerchantWebsite />
      </Container>
    </>
  );
}


export {
    CreateMerchantScreen
}; 