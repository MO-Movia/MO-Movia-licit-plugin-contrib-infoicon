import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { MarkSpec } from 'prosemirror-model';

export default () =>
  keymap({
    ...baseKeymap,
    'Mod-z': undo,
    'Shift-Mod-z': redo,
    'Mod-b': toggleMark(marks.strong as any),
    'Mod-i': toggleMark(marks.em as any),
  });

export type Marks = 'em' | 'strong'

export const marks: { [key in Marks]: MarkSpec } = {
  em: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }, { style: 'font-style=italic' }],
    toDOM: () => ['em', 0],
  },

  strong: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }, { style: 'font-weight=bold' }],
    toDOM: () => ['strong', 0],
  },
};