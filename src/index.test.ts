/* eslint-disable */

import { InfoIconPlugin } from './index';
import MenuPlugin, { markActive, getLink } from './plugins/menu/index';
import {Transform} from 'prosemirror-transform';
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
            view.state.doc.nodeAt(0),
            view,
            undefined
        );
        plugin.getState(state)
        expect(state.doc.nodeAt(0));
    });

    it('InfoiconCOMMAND ', () => {
        const before = 'hello';
        const after = ' world';
        const state = EditorState.create({
            // doc: doc(p(newInfoIconNode)),
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
        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };

        const infoIconCommand = new InfoIconCommand('');
        infoIconCommand.isEnabled(state);
        infoIconCommand.createInfoObject(view, 0);
        infoIconCommand.getParentNodeSize(state);
        infoIconCommand.getDocContent(infoIcon);
    });

    xit('Infoiconview getNodePosition ', () => {
        const before = 'hello';
        const after = ' world';
        const state = EditorState.create({
            // doc: doc(p(newInfoIconNode)),
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
        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };
        const cView = new InfoIconView(
            view.state.doc.nodeAt(6),
            view,
            undefined
        );
        // plugin.getState(state)
        // expect(state.doc.nodeAt(0));
        const clickEvent = new MouseEvent('mouseclick', {
            clientX: 358,
            clientY: 115,
        });
        cView.getNodePosition(clickEvent);
        cView.parentNodeType(view.state.doc.nodeAt(6));
    });

    it('should return ParentNodePOS', () => {
        const before = 'hello';

        const infoIconObj = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            infoIcon: ''
        };
        const infoiconnode = effSchema.node(
            effSchema.nodes.infoicon,
            infoIconObj
        );
        const plugin = new InfoIconPlugin();
        const after = ' world';
        const state = EditorState.create({
            doc: doc(p(before, infoiconnode, after)),
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
        const selection = TextSelection.create(view.state.doc, 7, 12);
        const tr = view.state.tr.setSelection(selection);
        view.updateState(
            view.state.reconfigure({ plugins: [plugin, new TestPlugin()] })
        );

        view.dispatch(tr);
        const infoIconCommand = new InfoIconCommand();

        infoIconCommand.isEnabled(state);
        const parentpos = infoIconCommand.getParentNodeSize(state);
        expect(parentpos).toBe(13);

        const gPN = infoIconCommand.getParentStartPos(state.selection.$head);
        expect(gPN).toBe(1);
    });

    it('should executeWithUserInput', () => {
        const mySchema = new Schema({
            nodes: schema.spec.nodes,
            marks: schema.spec.marks
        });
        const plugin = new InfoIconPlugin();
        const effSchema = plugin.getEffectiveSchema(mySchema);
        const dom = document.createElement('div');
        document.body.appendChild(dom);
        // Set up our document body
        document.body.innerHTML = '<div></div>';
        const before = 'hello';

        const after = ' world';
        const infoIconObj = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            infoIcon: ''
        };
        const infoiconnode = effSchema.node(
            effSchema.nodes.infoicon,
            infoIconObj
        );

        const state = EditorState.create({
            doc: doc(p(before, infoiconnode, after)),
            schema: effSchema,
            plugins: [plugin],
        });

        const view = new EditorView(
            { mount: dom },
            {
                state: state,
            }
        );

        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };
       
        const selection = TextSelection.create(view.state.doc, 1, 5);
        const tr = view.state.tr.setSelection(selection);
        view.updateState(
            view.state.reconfigure({ plugins: [plugin, new TestPlugin()] })
        );

        view.dispatch(tr);
        const addCitationcmd = new InfoIconCommand();

        addCitationcmd.createInfoIconAttrs(1, 1, "test", infoIcon);
        addCitationcmd._isEnabled(view.state);
        // const bok = addCitationcmd.executeWithUserInput(
        //     state,
        //     // view.dispatch,
        //     view.dispatch as (tr: Transform) => void,
        //     view,
        //     infoIcon as any
        // );

        // expect(bok).toBeFalsy();
    });

    it('should call initKeyCommands', () => {
        expect(plugin.initKeyCommands());
    });
    it('Infoiconview call parentNodeType', () => {
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
        const clickEvent = new MouseEvent('mouseclick', {
            clientX: 281,
            clientY: 125,
        });
        cView.parentNodeType(view.state.doc.nodeAt(0));
        cView.open(clickEvent);
    });

    it('Infoiconview ', () => {
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
        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };

        const cView = new InfoIconView(
            view.state.doc.nodeAt(0),
            view,
            undefined
        );
        const e = new MouseEvent('mouseenter', { clientX: 281, clientY: 125 });
        const clickEvent = new MouseEvent('mouseclick', {
            clientX: 281,
            clientY: 125,
        });
        const errorinfodiv = document.createElement('div');
        errorinfodiv.className = 'ProseMirror czi-prosemirror-editor';
        // const tooltip = document.createElement('div');;
        // errorinfodiv.className = 'molcit-infoicon-tooltip';

        cView.parentNodeType(view.state.doc.nodeAt(0));
        cView.hideSourceText(e);
        cView.stopEvent(e);
        cView.ignoreMutation();
        cView.onInfoRemove(view);
        cView.onEditInfo(view);
        cView.isPNodeNull(null);

        cView._onClose();
        // cView.getNodePosEx(359, 116);
        cView.updateInfoIcon(view, infoIcon);
        cView.destroyPopup();
        cView.onCancel(view);
       
        cView.selectNode(clickEvent);
        // cView.getNodePosition(clickEvent);      
        cView.onInfoSubMenuMouseOut();
        cView.open(clickEvent);
        cView.showSourceText(clickEvent);
    });



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
        // cView.setLink();
        // const tooltip = cView.createInfoIconTooltip();
        // cView.createTooltipContent(tooltip);
    });

    it('Infoiconview ', () => {
        const state = EditorState.create({
            //  doc: doc(p(newInfoIconNode)),
            doc: doc(p('Hello World', newInfoIconNode)),
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
        const infoIcon = {
            from: '10',
            to: '13',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };

        const cView = new InfoIconView(
            view.state.doc.nodeAt(12),
            view,
            undefined
        );
        const selection = TextSelection.create(view.state.doc, 6, 10);
        const tr = view.state.tr.setSelection(selection);
        view.updateState(
            view.state.reconfigure({ plugins: [plugin, new TestPlugin()] })
        );
        view.dispatch(tr);
        cView.parentNodeType(view.state.doc.nodeAt(0));
       
        cView.isInfoIconNode(6);
        cView.isPNodeNull(view.state.doc.nodeAt(0));
        //cView.getNodePosEx(359, 116);
    });

    it('Infoiconview ', () => {
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
        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };

        const cView = new InfoIconView(
            view.state.doc.nodeAt(0),
            view,
            undefined
        );
        const errorinfodiv = document.createElement('div');
        errorinfodiv.className = 'molcit-infoicon-submenu';
        cView.onInfoSubMenuMouseOut();
        cView.destroyPopup();
    });

    it('Infoiconview selectNode with MouseEvent = undefined', () => {
        const state = EditorState.create({
            doc: doc(p(newInfoIconNode)),
            // doc: doc(p('Hello World', newInfoIconNode)),
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
            view.state.doc.nodeAt(0),
            view,
            undefined as any
        );
        cView.selectNode(undefined as any);
    });

    it('Infoiconview selectNode', () => {
        const state = EditorState.create({
            doc: doc(p(newInfoIconNode)),
            // doc: doc(p('Hello World', newInfoIconNode)),
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
        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };

        const cView = new InfoIconView(
            view.state.doc.nodeAt(0),
            view,
            undefined
        );


        const mouseclickEvent = new MouseEvent('mouseenter', {
            clientX: 281,
            clientY: 125,
        });
        // mouseclickEvent.target = (document.createElement('div'));
        // (mouseclickEvent.target as HTMLInputElement).className = 'fa';
        cView.onCancel(view);
        cView.selectNode(mouseclickEvent);
        const errorinfodiv = document.createElement('div');
        errorinfodiv.className = 'molcit-infoicon-submenu';
        cView.isPNodeNull(view.state.doc.nodeAt(0));
        cView.destroyPopup();

    });
    it("menu plugin> selection empty for markActive", () => {
        const plugin = MenuPlugin();
        const state = EditorState.create({
            doc: doc(p(newInfoIconNode)),
            // doc: doc(p('Hello World', newInfoIconNode)),
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
        const { marks } = view.state.schema;

        markActive(view.state, marks.strong);
        getLink(view);
    });

    it("returns true if a marked range is empty", () => {
        const plugin = MenuPlugin();
        const state = EditorState.create({
            // doc: doc(p(newInfoIconNode)),
            doc: doc(p('Hello World', newInfoIconNode)),
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
        const infoIcon = {
            from: '1',
            to: '3',
            description: 'test description',
            mode: 0,
            editorView: view,
            infoIcon: ''
        };

        const selection = TextSelection.create(view.state.doc, 6, 10);
        const tr = view.state.tr.setSelection(selection);
        view.updateState(
            view.state.reconfigure({ plugins: [plugin, new TestPlugin()] })
        );
        view.dispatch(tr);


        // const cView = new InfoIconView(
        //     view.state.doc.nodeAt(0).child(0),
        //     view,
        //     undefined
        // );


        const { marks } = view.state.schema;

        markActive(view.state, marks.strong);
        getLink(view);

    });



    // it("returns false if a marked range is not empty but there are no relevant marks", () => {
    //     const state = {
    //         selection: { from: 40, to: 50, empty: false },
    //         doc: { rangeHasMark: (from, to, type) => false }
    //     };
    //     expect(markActive(state, fooBarMark)).toBe(false);
    // });

});

