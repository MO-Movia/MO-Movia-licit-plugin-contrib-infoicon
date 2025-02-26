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
    if (!dispatch || !infoIcon) {
      return false;
    }

    let {from, to} = state.selection;
    if (from === to) {
      ({from, to} = this.adjustCursorPosition(state.doc, from, to));
    }

    const node = getNode(from, to, state.tr);
    if (!node) return false;

    const infoiconNode = this.createInfoIconNode(state, from, to, infoIcon);
    let tr = state.tr.insert(to, Fragment.from(infoiconNode));

    const listNodeData = this.getListNodeData(state);
    if (listNodeData) {
      tr = tr.setNodeMarkup(
        listNodeData.listPos,
        undefined,
        listNodeData.listNodeAttr
      );
    }

    dispatch(tr);
    return true;
  };

  adjustCursorPosition(doc, from, to) {
    const textAfter = doc.textBetween(
      to,
      Math.min(to + 50, doc.content.size),
      '',
      '\0'
    );
    const wordMatch = /^\w+/.exec(textAfter);

    if (wordMatch) {
      to += wordMatch[0].length;
      from = to;

      const afterWordText = doc.textBetween(
        to,
        Math.min(to + 5, doc.content.size),
        '',
        '\0'
      );
      const punctMatch = /^[.,;:!?]/.exec(afterWordText);

      if (punctMatch) {
        to += punctMatch[0].length;
        from = to;
      }
    }

    return {from, to};
  }

  createInfoIconNode(state, from, to, infoIcon) {
    const div = document.createElement('div');
    div.appendChild(this.getFragm(infoIcon));

    const infoicon = state.schema.nodes['infoicon'];
    const newAttrs = this.createInfoIconAttrs(
      from,
      to,
      div.innerHTML,
      infoIcon
    );
    return infoicon.create(newAttrs);
  }

  getListNodeData(state) {
    const $head = state.selection.$head;
    for (let d = $head.depth; d > 0; d--) {
      if (this.isList($head, d)) {
        return {
          listNodeAttr: {...$head.node(d).attrs},
          listPos: $head['path'][d + 4],
        };
      }
    }
    return null;
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
    return true;
  }
  executeCustom(_state: EditorState, tr: Transform): Transform {
    return tr;
  }
}
