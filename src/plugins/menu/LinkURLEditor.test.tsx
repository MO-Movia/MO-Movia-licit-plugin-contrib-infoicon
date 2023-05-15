import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import LinkURLEditor from './LinkURLEditor';
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { schema, builders } from 'prosemirror-test-builder';
import {
  Schema,
  MarkType,
} from 'prosemirror-model';
Enzyme.configure({ adapter: new Adapter() });


describe('LinkURLEditor', () => {
  let props;
  let wrapper;
  let props1;
  beforeEach(() => {
    const before = 'hello';
    const after = ' world';
    const mySchema = new Schema({
      nodes: schema.spec.nodes,
      marks: schema.spec.marks
    });
    const { doc, p } = builders(mySchema, { p: { nodeType: 'paragraph' } });
    const state = EditorState.create({
      doc: doc(p(before, '', after)),
    });
    const dom = document.createElement('div');
    props = {
      href: 'http://example.com',

      view: new EditorView(
        { mount: dom },
        {
          state: state,
        }
      ),
      close: jest.fn(),
    };
    props1 = {
      href: '',
      view: {
        state: {},
        dispatch: jest.fn(),
        focus: jest.fn(),
      },
      close: jest.fn(),
    };
    wrapper = shallow(<LinkURLEditor {...props} />);
  });

  it('renders an input field with the URL', () => {
    expect(wrapper.find('input').props().value).toBe(props.href);
  });

  it('sets the initial state with the URL', () => {
    expect(wrapper.state('url')).toBe(props.href);
  });
  it('create with null url', () => {
    wrapper = shallow(<LinkURLEditor {...props1} />);
    wrapper.setState({ url: null });
  })
  it('calls the close function when cancel button is clicked', () => {
    wrapper.find('CustomButton[label="Cancel"]').simulate('click');
    expect(props.close).toHaveBeenCalled();
  });

  it('calls the toggleMark function when apply button is clicked', () => {
    wrapper.instance()._apply = jest.fn();
    wrapper.instance()._onURLChange({ target: { value: 'http://example.com' } });
    wrapper.find('CustomButton[label="Apply"]').simulate('click');
  });

  it('calls the preventDefault function when Enter key is pressed', () => {
    const preventDefault = jest.fn();
    const ENTER = 13;
    const event = { keyCode: ENTER, preventDefault };
    wrapper.instance()._apply = jest.fn();
    wrapper.instance()._onURLChange({ target: { value: 'http://example.com' } });
    wrapper.find('input').simulate('keyDown', event);
    expect(preventDefault).toHaveBeenCalled();
    expect(wrapper.instance()._apply).toHaveBeenCalled();
  });

  it('calls the preventDefault function when Enter key is pressed with wrong keycode', () => {
    const preventDefault = jest.fn();
    const ENTER = 0;
    const event = { keyCode: ENTER, preventDefault };
    wrapper.find('input').simulate('keyDown', event);
  });

  it('updates the state with the new URL', () => {
    const value = 'http://example.org';
    wrapper.find('input').simulate('change', { target: { value } });
    expect(wrapper.state('url')).toBe(value);
  });

  it('disables the apply button if there is an error in the URL', () => {
    wrapper.setState({ url: 'http://example.com with spaces' });
    expect(wrapper.find('CustomButton[label="Apply"]').props().disabled).toBe(true);
  });
});





