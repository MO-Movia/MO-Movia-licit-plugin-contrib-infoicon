import { icons, MenuItem, renderGrouped } from 'prosemirror-menu';
import {
    EditorState,
    Plugin,
} from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';


const markActive = (markType: MarkType) => (state: EditorState) => {
    const { from, $from, to, empty } = state.selection;

    if (empty) {
        return Boolean(markType.isInSet(state.storedMarks || $from.marks()));
    }

    return state.doc.rangeHasMark(from, to, markType);
};

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

            return {
                update: (view, _prevState) => update(view.state),
            };
        },
    });
