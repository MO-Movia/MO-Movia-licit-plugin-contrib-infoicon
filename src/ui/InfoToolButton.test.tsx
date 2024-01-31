import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import {InfoToolButton} from './InfoToolButton';
import React from 'react';

Enzyme.configure({ adapter: new Adapter() });
let props: {
    type: 'type';
    title?: 'title';
};
it('should render the component', () => {

    const wrapper = shallow(<InfoToolButton {...props} />);
    wrapper.props = {
        type: 'type',
        title: 'title',
    };
    const InfoToolButtonRender = wrapper.instance();

    expect(InfoToolButtonRender).toBeDefined();
});