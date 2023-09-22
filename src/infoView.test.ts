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
import {InfoIconView} from './infoIconView';
import { InfoIconCommand } from './infoIconCommand';
import { node } from 'webpack';
import { createPopUp } from '@modusoperandi/licit-ui-commands';
import {InfoIconDialog} from './infoIconDialog';

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
        document.body.appendChild(tooltip);

        const clickEvent = new MouseEvent('mouseclick', {
            clientX: 281,
            clientY: 125,
        });
        const getNodePosEx = jest.spyOn(cView, 'getNodePosEx');
        getNodePosEx.mockReturnValue(12);
        const isPNodeNull = jest.spyOn(cView, 'isPNodeNull');
        isPNodeNull.mockReturnValue(true);
        cView.getNodePosition(clickEvent);
        // Call the close function
        cView.close();
        cView.setContentRight(clickEvent, errorinfodiv, tooltip, ttContent);

    });

    it('Infoiconview call selectNode', () => {
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
        const getNodePosEx = jest.spyOn(cView, 'getNodePosEx');
        getNodePosEx.mockReturnValue(12);
        const targetElement = document.createElement('div');
        targetElement.className = 'fa'
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        targetElement.dispatchEvent(event);
        cView._popUp_subMenu = createPopUp(
            InfoIconDialog,
            cView.createInfoObject(view, 1),
            {
                modal: true,
                IsChildDialog: false,
                autoDismiss: false,
            }
        );
        cView.selectNode(event as MouseEvent);
    });
});

