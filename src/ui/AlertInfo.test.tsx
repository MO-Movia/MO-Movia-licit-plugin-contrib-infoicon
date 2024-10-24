import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import {AlertInfo} from './AlertInfo';
import React from 'react';

Enzyme.configure({ adapter: new Adapter() });

it('should render the AlertInfo component', () => {
    const alertProps = {
        initialValue: {},
        title: 'string',
        content: 'string',
        close: () => {
            return null;
        },
    };
    const wrapper = shallow(<AlertInfo {...alertProps} />);
    const AlertInfoRender = wrapper.instance();
    expect(AlertInfoRender).toBeDefined();
});

it('should render the AlertInfo component without title and content', () => {

    const alertProps1 = {
        initialValue: {},
        title: '',
        content: '',
        close: () => {
            return null;
        },
    };
    const wrapper = shallow(<AlertInfo {...alertProps1} />);
    const alertInfoRender = wrapper.instance();
    alertInfoRender.componentWillUnmount();
    alertInfoRender._cancel();
    expect(alertInfoRender).toBeDefined();
});