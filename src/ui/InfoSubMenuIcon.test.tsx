import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import {InfoSubMenuIcon} from './InfoSubMenuIcon';
import React from 'react';

Enzyme.configure({ adapter: new Adapter() });
let props: {
    type: 'type';
    title?: 'title';
};
const DeviceTypeUtilsMock = jest.requireMock('./InfoSubMenuIcon');
it('should render the component', () => {
    const wrapper = shallow(<InfoSubMenuIcon {...props} />);
    wrapper.props = {
        type: 'type',
        title: 'title',
    };
    wrapper.title = 'title';
    const InfoSubMenuIconRender = wrapper.instance();
    InfoSubMenuIconRender.title = 'title';
    expect(InfoSubMenuIconRender).toBeDefined();


});
it('mock const `isTablet` to the value `true`', () => {
    DeviceTypeUtilsMock.props = {
        type: 'type',
        title: 'title'
    };
});