import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import {InfoIconDialog} from './infoIconDialog';
import {
    Schema
} from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { schema, builders } from 'prosemirror-test-builder';
import * as React from 'react';
import { InfoIconPlugin } from './index';
Enzyme.configure({ adapter: new Adapter() });
const infoIconProps = {
    infoIcon: { name: 'fa-facebook', unicode: '#12fc3' },
    description: 'test Des',
    editorView: '' as any,
    mode: 1,
    from: 0,
    to: 1,
    faIcons: [{ name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }, { name: 'fa-facebook-1', unicode: '#15dss4' }],
    selectedIconName: 'fa-facebook',
    isOpen: true,
    isEditorEmpty: false,
    isButtonEnabled: false,
    close: () => {
        return null;
    },
};
describe('InfoIconDialog ', () => {

    it('should render the InfoIconDialog component', () => {
        const expectedContent = document.createElement('div');
        expectedContent.id = 'content';
        jest.spyOn(document, 'getElementById').mockReturnValue(expectedContent);
        const expectedEditor = document.createElement('div');
        expectedEditor.id = 'editor';
        jest.spyOn(document, 'querySelector').mockReturnValue(expectedEditor);
        const plugin = new InfoIconPlugin();
        const mySchema = new Schema({
            nodes: schema.spec.nodes,
            marks: schema.spec.marks
        });
        const effSchema = plugin.getEffectiveSchema(mySchema);
        const { doc, p } = builders(mySchema, { p: { nodeType: 'paragraph' } });
        const before = 'hello';
        const after = ' world';
        const infoIconObj = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            infoIcon: ''
        };
        const newCitationNode = effSchema.node(
            effSchema.nodes.infoicon,
            infoIconObj
        );
        EditorState.create({
            doc: doc(p(before, newCitationNode, after)),
            schema: effSchema,
            plugins: [plugin],
        });

        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const infoIconDialog = wrapper.instance();
        infoIconDialog._cancel();
        infoIconDialog._insert();
        expect(infoIconDialog).toBeDefined();
    });

    it('should return the getFaIconCount', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        expect(instance.getFaIconCount()).toEqual(0);

    });

    it('should update the infoIcon state when a different icon is clicked', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const initialInfoIcon = instance.state.infoIcon;
        const clickedIcon = { unicode: 'some-unicode' };
        instance.selectInfoIcon(clickedIcon);
        expect(instance.state.infoIcon).toEqual(clickedIcon);
        expect(instance.state.infoIcon).not.toEqual(initialInfoIcon);
    });

    it('should set the infoIcon state to null when the same icon is clicked', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const clickedIcon = { unicode: instance.state.infoIcon?.unicode };
        instance.selectInfoIcon(clickedIcon);
        expect(instance.state.infoIcon).toBeNull();
    });

    it('should toggle the isOpen state when togglePopover is called', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const initialIsOpenState = instance.state.isOpen;
        instance.togglePopover();
        expect(instance.state.isOpen).toEqual(!initialIsOpenState);
    });

    it('should call validateInsert', () => {
        const infoIconProps = {
            infoIcon: { name: '', unicode: '' },
            description: '',
            editorView: '' as any,
            mode: 2,
            from: 0,
            to: 1,
            faIcons: [],
            selectedIconName: '',
            isOpen: false,
            isEditorEmpty: true,
            isButtonEnabled: true,
            close: () => {
                return null;
            },
        };
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        expect(instance.validateInsert()).toBeUndefined();

        const instance1 = wrapper.instance() as InfoIconDialog;
        instance1.setState({ infoIcon: null });
        instance1.validateInsert();
        expect(instance.validateInsert()).toBeUndefined();
    });

    it('should call insertButtonEnble and isEditorEmpty set to true', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const mockJson = { 'type': 'doc', 'content': [{ 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'a' }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'a' }] }] };
        instance.insertButtonEnble(mockJson);
        expect(instance.state.isEditorEmpty).toEqual(false);
    });

    it('should call insertButtonEnble and isEditorEmpty set to false', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const mockJson = { 'type': 'doc', 'content': [{ 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'a' }] }] };
        instance.insertButtonEnble(mockJson);
        expect(instance.state.isEditorEmpty).toEqual(false);
    });

    it('should call insertButtonEnble with null content', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const mockJson = { 'type': 'doc', 'content': [] };
        instance.insertButtonEnble(mockJson);
        expect(instance.state.isEditorEmpty).toEqual(false);
    });


    it('should render the InfoIconDialog in mode 2(edit)', () => {
        const infoIconProps = {
            infoIcon: { name: 'fa fa-500px', unicode: '&#xf26e;' },
            description: '',
            editorView: '' as any,
            mode: 2,
            from: 0,
            to: 1,
            faIcons: [],
            selectedIconName: 'fa-img',
            isOpen: false,
            isEditorEmpty: true,
            isButtonEnabled: true,
            close: () => {
                return null;
            },
        };
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        instance._onAdd('' as any);
        instance._onRemove();
        expect(instance).toBeDefined();
    });

    it('should call insertButtonEnble and content is undefined', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const mockJson = { 'type': 'doc', 'content': [{ 'type': 'paragraph', 'content': undefined }] };
        instance.insertButtonEnble(mockJson);
        expect(instance.state.isEditorEmpty).toEqual(true);
    });

    it('should set pointerEvents to "unset" if isEditable is true', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const infoIconForm = document.createElement('div');
        infoIconForm.id = 'infoPopup';
        infoIconForm.style.setProperty('pointerEvents', 'unset');
        instance.disableInfoWIndow(true);
        expect(infoIconForm.style.pointerEvents).toBe('');
    });

    it('should setVisible value when calling setVisible fn', () => {
        const wrapper = shallow(<InfoIconDialog {...infoIconProps} />);
        const instance = wrapper.instance() as InfoIconDialog;
        const initialIsOpenState = instance.state.isOpen;
        instance.setVisible(true);
        expect(instance.state.isOpen).toEqual(initialIsOpenState);
    });
});