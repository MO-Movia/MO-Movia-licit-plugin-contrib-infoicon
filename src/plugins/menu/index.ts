import { icons, MenuItem, renderGrouped } from 'prosemirror-menu';
import {
    TextSelection,
    EditorState,
    Transaction,
    Plugin,
} from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { MarkType, NodeType, Node } from 'prosemirror-model';

// import 'prosemirror-menu/style/menu.css'
// import './menu.css'

type Dispatch = (transaction: Transaction) => void

const markActive = (markType: MarkType) => (state: EditorState) => {
    const { from, $from, to, empty } = state.selection;

    if (empty) {
        return Boolean(markType.isInSet(state.storedMarks || $from.marks()));
    }

    return state.doc.rangeHasMark(from, to, markType);
};

const canInsert = (nodeType: NodeType) => (state: EditorState) => {
    const { $from } = state.selection;

    for (let d = $from.depth; d >= 0; d--) {
        const index = $from.index(d);

        if ($from.node(d).canReplaceWith(index, index, nodeType)) {
            return true;
        }
    }

    return false;
};

const insertBlockAfter = (
    node: Node,
    state: EditorState,
    dispatch: Dispatch
) => {
    const tr = state.tr;
    const pos = tr.selection.$anchor.after();
    tr.insert(pos, node);

    const selection = TextSelection.near(tr.doc.resolve(pos));
    tr.setSelection(selection);

    if (dispatch) {
        dispatch(tr);
    }
};

const insertBlock = (nodeType: NodeType, attrs?: Record<string, unknown>) => (
    state: EditorState,
    dispatch: Dispatch
) => {
    insertBlockAfter(nodeType.createAndFill(attrs), state, dispatch);
};

export default () =>
    new Plugin({
        view: (view) => {
            if (!view.dom.parentNode) {
                return null;
            }

            const { marks, nodes } = view.state.schema;

            const content = [
                [
                    new MenuItem({
                        title: 'Toggle Strong',
                        icon: icons.strong,
                        enable: () => true,
                        active: markActive(marks.strong),
                        run: toggleMark(marks.strong),
                    }),
                    new MenuItem({
                        title: 'Toggle Italics',
                        icon: icons.em,
                        enable: () => true,
                        active: markActive(marks.em),
                        run: toggleMark(marks.em),
                    }),
                    new MenuItem({
                        title: 'Link',
                        icon: icons.link,
                        enable: () => true,
                        active: markActive(marks.link),
                        run: toggleMark(view.state.schema.marks.link, { href: marks.link })
                    }),
                ]
            ];

            const { dom, update } = renderGrouped(view, content);

            const menubar = document.createElement('div');
            menubar.className = 'ProseMirror-menubar';
            menubar.appendChild(dom);

            view.dom.parentNode.insertBefore(menubar, view.dom);

            // update(view.state)

            return {
                update: (view, _prevState) => update(view.state),
            };
        },
    });
