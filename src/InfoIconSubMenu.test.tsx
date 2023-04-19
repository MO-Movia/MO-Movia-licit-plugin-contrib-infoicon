import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { InfoIconSubMenu } from './InfoIconSubMenu';
import React from 'react';

Enzyme.configure({ adapter: new Adapter() });
describe('InfoIconSubMenu', () => {
    it('should render the InfoIconSubMenu component', () => {
        const subMenuProps = {
            editorView: '' as any,
            onCancel: '' as any,
            onEdit: '' as any,
            onRemove: '' as any,
            onMouseOut: '' as any
        };
        const wrapper = shallow(<InfoIconSubMenu {...subMenuProps} />);
        const infoIconSubMenu = wrapper.instance();
        expect(infoIconSubMenu).toBeDefined();
    });
});