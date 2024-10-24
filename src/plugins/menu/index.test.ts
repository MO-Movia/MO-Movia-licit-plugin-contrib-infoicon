import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';
import Plugin from './index';

describe('Plugin', () => {
  it('should return null if editor view does not have a parent node', () => {
    const state = EditorState.create({
      schema,
      doc: schema.node('paragraph', {}, [schema.text('Hello, world!')]),
    });
    const plugin = Plugin();

   new EditorView(null, {
      state,
      plugins:[plugin] ,
    });
  });
});