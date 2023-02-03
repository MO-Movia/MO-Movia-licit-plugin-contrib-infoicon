/* eslint-disable */

import { InfoIconPlugin } from './index';
import { schema, builders } from 'prosemirror-test-builder';
import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorView } from 'prosemirror-view';
import {
    Schema,
} from 'prosemirror-model';
import InfoIconView from './infoIconView';

class TestPlugin extends Plugin {
    constructor() {
        super({
            key: new PluginKey('TestPlugin'),
        });
    }
}

describe('Info Plugin', () => {
    const info = {
        from: 0,
        to: 9,
        description: 'Test description',
        infoIcon: 'faIcon'
    }

    const before = 'hello';
    const after = ' world';
    const mySchema = new Schema({
        nodes: schema.spec.nodes,
        marks: schema.spec.marks
    });
    const plugin = new InfoIconPlugin();
    const effSchema = plugin.getEffectiveSchema(mySchema);

    const newInfoIconNode = effSchema.node(
        effSchema.nodes.infoicon,
        info
    );
    plugin.initButtonCommands();
    const { doc, p } = builders(mySchema, { p: { nodeType: 'paragraph' } });

    it('should create infoplugin', () => {
        const state = EditorState.create({
            doc: doc(p(newInfoIconNode)),
            schema: effSchema,
            plugins: [plugin],
        });
        const dom = document.createElement('div');
        document.body.appendChild(dom);

        const view = new EditorView(
            { mount: dom },
            {
                state: state,
            }
        );
        const cView = new InfoIconView(
            view.state.doc.nodeAt(0).child(0),
            view,
            undefined
        );
        plugin.getState(state)
        expect(state.doc.nodeAt(0));
    });
    it('should call initKeyCommands', () => {
        expect(plugin.initKeyCommands());
    });
});
