/* eslint-disable */

import { InfoIconPlugin } from './index';
import MenuPlugin, { markActive, getLink } from './plugins/menu/index';

import { schema, builders } from 'prosemirror-test-builder';
import { Plugin, PluginKey, EditorState, TextSelection } from 'prosemirror-state';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorView } from 'prosemirror-view';
import {
    Schema,
    MarkType,
} from 'prosemirror-model';
import InfoIconView from './infoIconView';
import { InfoIconCommand } from './infoIconCommand';
import { node } from 'webpack';

class TestPlugin extends Plugin {
    constructor() {
        super({
            key: new PluginKey('TestPlugin'),
        });
    }
}

describe('Info Plugin Extended', () => {
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

    
    it('Infoiconview call createInfoIconTooltip', () => {
        const before = 'hello';
        const after = ' world';

        const state = EditorState.create({
            doc: doc(p(before, newInfoIconNode, after)),
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
            view.state.doc.nodeAt(6),
            view,
            undefined as any
        );
        const ttContent = document.createElement('div');
        ttContent.id = 'tooltip-content';
        ttContent.innerHTML = '"<p>test <a href="ingo" title="ingo">ingo</a> icon</p>"';
        const errorinfodiv = document.createElement('div');
        errorinfodiv.className = 'ProseMirror czi-prosemirror-editor';
        const tooltip = document.createElement('div');;
        tooltip.className = 'molcit-infoicon-tooltip';


        const clickEvent = new MouseEvent('mouseclick', {
            clientX: 281,
            clientY: 125,
        });

        cView.setContentRight(clickEvent, errorinfodiv, tooltip, ttContent);
         
    });
}); 

