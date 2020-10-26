import { shallow } from 'enzyme';
import * as React from 'react';
import { DepositFiat } from './';


describe('DepositFiat', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<DepositFiat description={'description'} title={'text123'} uid={'42389734'} currency={'123123'} />);
    });

    it('should contains title', () => {
        const text = wrapper.find('.cr-deposit-fiat__title').text();
        expect(text).toContain('text123');
    });

    it('should contains right description', () => {
        const text = wrapper.find('.cr-deposit-fiat__description').text();
        expect(text).toContain('123123');
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
