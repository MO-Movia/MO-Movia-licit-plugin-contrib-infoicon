import * as React from 'react';
import {UICommand} from '@modusoperandi/licit-doc-attrs-step';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import {InfoIconDialog} from './infoIconDialog';
import {createPopUp} from '@modusoperandi/licit-ui-commands';
import type {PopUpHandle} from '@modusoperandi/licit-ui-commands';
import {getNode} from './constants';
import {DOMSerializer, Fragment} from 'prosemirror-model';

export class InfoIconCommand extends UICommand {
  _popUp: PopUpHandle | null = null;
  _alertPopup: PopUpHandle | null = null;
  _color = '';

  constructor(color?: string) {
    super();
    this._color = color;
  }
  isEnabled = (state: EditorState): boolean => {
    return this._isEnabled(state);
  };
  createInfoObject(editorView: EditorView, mode: number) {
    return {
      infoIcon: '',
      description: '',
      mode: mode, //0 = new , 1- modify, 2- delete
      editorView: editorView,
      selectedIconName: '',
    };
  }
  waitForUserInput = (
    _state: EditorState,
    _dispatch?: (tr: Transform) => void,
    view?: EditorView,
    _event?: React.SyntheticEvent
  ): Promise<unknown> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }
    return new Promise((resolve) => {
      this._popUp = createPopUp(
        InfoIconDialog,
        this.createInfoObject(view, 1),
        {
          modal: true,
          IsChildDialog: false,
          autoDismiss: false,
          onClose: (val) => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          },
        }
      );
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: (tr: Transform) => void | undefined,
    _view: EditorView | undefined,
    infoIcon
  ): boolean => {
    if (dispatch) {
      const {selection} = state;
      let {tr} = state;
      tr = tr.setSelection(selection);
      const from = state.selection.from;
      const to = this.getWordSafeInsertPos(state);
      const node = getNode(from, to, tr);
      if (node && infoIcon) {
        const div = document.createElement('div');
        const fragm = this.getFragm(infoIcon);
        div.appendChild(fragm);
        const desc = div.innerHTML;
        const infoicon = state.schema.nodes['infoicon'];
        let newAttrs = {};
        Object.assign(newAttrs, infoicon['attrs']);
        newAttrs = this.createInfoIconAttrs(to, to, desc, infoIcon);
        const infoiconNode = infoicon.create(null);
        const $head = state.selection.$head;
        let listNodeAttr = null;
        let listPos = 0;
        for (let d = $head.depth; d > 0; d--) {
          if (this.isList($head, d)) {
            listNodeAttr = {...$head.node(d).attrs};
            listPos = $head['path'][d + 4];
            break;
          }
        }
        tr = tr.insert(to, Fragment.from(infoiconNode));
        tr = tr.setNodeMarkup(to, undefined, newAttrs);
        if (listNodeAttr) {
          tr = tr.setNodeMarkup(listPos, undefined, listNodeAttr);
        }
      }
      dispatch(tr);
    }

    return false;
  };

  getWordSafeInsertPos(state: EditorState): number {
    const {selection} = state;
    if (!selection.empty) {
      return selection.to;
    }

    const parent = selection.$from?.parent;
    const offset = selection.$from?.parentOffset ?? 0;
    if (!parent || offset < 0) {
      return selection.to;
    }

    // Preserve inline node offsets by representing leaf nodes as a single character.
    const parentText = parent.textBetween(0, parent.content.size, '', ' ');
    if (!parentText || offset >= parentText.length) {
      return selection.to;
    }

    // Move only when cursor is at word start/middle.
    const currentChar = parentText.charAt(offset);
    if (!this.isWordCharacter(currentChar)) {
      // If cursor is right before sentence-ending punctuation after a word,
      // move past the punctuation marks as well.
      const prevChar = offset > 0 ? parentText.charAt(offset - 1) : '';
      if (
        this.isSentenceEndingCharacter(currentChar) &&
        this.isWordCharacter(prevChar)
      ) {
        let punctuationEnd = offset;
        while (
          punctuationEnd < parentText.length &&
          this.isSentenceEndingCharacter(parentText.charAt(punctuationEnd))
        ) {
          punctuationEnd++;
        }
        return selection.to + (punctuationEnd - offset);
      }
      return selection.to;
    }

    let wordEnd = offset;
    while (
      wordEnd < parentText.length &&
      this.isWordCharacter(parentText.charAt(wordEnd))
    ) {
      wordEnd++;
    }

    // If word is immediately followed by sentence-ending punctuation,
    // keep the icon after the punctuation rather than between word and punctuation.
    let punctuationEnd = wordEnd;
    while (
      punctuationEnd < parentText.length &&
      this.isSentenceEndingCharacter(parentText.charAt(punctuationEnd))
    ) {
      punctuationEnd++;
    }

    return selection.to + (punctuationEnd - offset);
  }

  isWordCharacter(char: string): boolean {
    if (!char) {
      return false;
    }
    if (char === '_') {
      return true;
    }
    const code = char.charCodeAt(0);
    const isNumber = code >= 48 && code <= 57;
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    return isNumber || isUpper || isLower;
  }

  isSentenceEndingCharacter(char: string): boolean {
    return char === '.' || char === '!' || char === '?';
  }

  cancel(): void {
    return null;
  }

  createInfoIconAttrs(from, to, desc, infoIcon) {
    const newAttrs = {};
    Object.assign(newAttrs, infoIcon['attrs']);
    newAttrs['from'] = from;
    newAttrs['to'] = to;
    newAttrs['description'] = desc;
    newAttrs['infoIcon'] = infoIcon.infoIcon;
    return newAttrs;
  }

  getFragm(infoIcon) {
    return DOMSerializer.fromSchema(
      infoIcon.editorView.state.schema
    ).serializeFragment(this.getDocContent(infoIcon));
  }

  getDocContent(infoIcon) {
    return infoIcon.editorView.state.doc.content;
  }

  isList($head, d) {
    return !!(
      $head.node(d).type.name === 'ordered_list' ||
      $head.node(d).type.name === 'bullet_list'
    );
  }

  getParentNodeSize(state: EditorState): number {
    return state.selection.$head.parent.nodeSize - 2;
  }

  getParentStartPos(head): number {
    return head.pos - head.parentOffset;
  }

  _isEnabled = (state: EditorState): boolean => {
    const tr = state.tr;
    if (!tr.selection.empty) {
      return false;
    }
    return true;
  };

  renderLabel() {
    return;
  }
  isActive(): boolean {
    return false;
  }
  executeCustom(_state: EditorState, tr: Transform): Transform {
    return tr;
  }
  executeCustomStyleForTable(_state: EditorState, tr: Transform): Transform {
    return tr;
  }
}
