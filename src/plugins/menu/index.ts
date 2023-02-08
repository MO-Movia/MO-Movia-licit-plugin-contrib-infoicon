import { icons, MenuItem, renderGrouped } from 'prosemirror-menu';
import {
    EditorState,
    Plugin,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';



function markActive(state: EditorState, type: MarkType) {
    const { from, $from, to, empty } = state.selection;
    if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
    else return state.doc.rangeHasMark(from, to, type);
}

function getLink(view: EditorView) {
    return view.state.doc.cut(view.state.selection.from, view.state.selection.to).textContent.trim();
}

export default () =>
    new Plugin({
        view: (view) => {
            if (!view.dom.parentNode) {
                return null;
            }

            const { marks } = view.state.schema;

            const content = [
                [
                    new MenuItem({
                        title: 'Toggle Strong',
                        icon: icons.strong,
                        enable: () => true,
                        active(state) { return markActive(state, marks.strong); },
                        run: toggleMark(marks.strong),
                    }),
                    new MenuItem({
                        title: 'Toggle Italics',
                        icon: icons.em,
                        enable: () => true,
                        active(state) { return markActive(state, marks.em); },
                        run: toggleMark(marks.em),
                    }),
                    new MenuItem({
                        title: 'Link',
                        icon: icons.link,
                        enable: () => true,
                        active(state) { return markActive(state, marks.link); },
                        run(state, dispatch) {
                            if (markActive(state, marks.link)) {
                                toggleMark(marks.link)(state, dispatch);
                                return true;
                            }
                            toggleMark(marks.link, {
                                href: getLink(view), title: getLink(view),
                            })(view.state, view.dispatch);
                            view.focus();
                            return false;
                        }
                    }),
                ]
            ];

            const { dom, update } = renderGrouped(view, content);

            const menubar = document.createElement('div');
            menubar.className = 'ProseMirror-menubar';
            menubar.appendChild(dom);

            view.dom.parentNode.insertBefore(menubar, view.dom);

            return {
                update: (_prevState) => update(view.state),
            };
        },
    });
