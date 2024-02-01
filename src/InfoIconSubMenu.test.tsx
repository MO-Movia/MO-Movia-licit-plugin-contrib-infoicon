import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { InfoIconSubMenu } from './InfoIconSubMenu';
import React from 'react';
import {EditorView} from 'prosemirror-view';

Enzyme.configure({ adapter: new Adapter() });
function myVoidFunction(): void {
    // Function body
    // This function doesn't return any value
}
describe('InfoIconSubMenu', () => {
    it('should render the InfoIconSubMenu component', () => {
        const subMenuProps = {
            editorView: {} as unknown as EditorView,
            onCancel: myVoidFunction,
            onEdit: myVoidFunction,
            onRemove: myVoidFunction,
            onMouseOut: myVoidFunction
        };
        const wrapper = shallow(<InfoIconSubMenu {...subMenuProps} />);
        const infoIconSubMenu = wrapper.instance();
        expect(infoIconSubMenu).toBeDefined();
    });
});