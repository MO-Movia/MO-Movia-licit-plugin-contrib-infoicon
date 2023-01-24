import { DOMSerializer, Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { createPopUp, PopUpHandle, atAnchorTopCenter } from '@modusoperandi/licit-ui-commands';
import InfoIconSubMenu from './InfoIconSubMenu';
import {
  INFO_ICON,
} from './constants';
import './ui/infoicon-note.css';
import InfoIconDialog from './infoIconDialog';

type CBFn = () => void;

export type Style = {
  styles?: {
    underline?;
    textHighlight?: string;
  };
};

class InfoIconView {
  node: Node = null;
  outerView: EditorView = null;
  getPos = null;
  _popUp: PopUpHandle | null = null;
  _popUp_subMenu: PopUpHandle | null = null;
  dom: globalThis.Node = null;
  offsetLeft: Element;
  constructor(node: Node, view: EditorView, getPos: CBFn) {
    // We'll need these later
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;
    const spec = DOMSerializer.renderSpec(
      document,
      this.node.type.spec.toDOM(this.node)
    );
    this.dom = spec.dom;
    (this.dom as Element).className = INFO_ICON;

    this.addEventListenerToView();
    this.showInfoIcon();
  }

  showSourceText(e: MouseEvent): void {
    if ((this.dom as Element).classList) {
      this.open(e);
    }
  }

  getNodePosEx(left: number, top: number): number {
    const objPos = this.outerView.posAtCoords({ left, top, });
    return objPos ? objPos.pos : null;
  }

  addEventListenerToView(): void {
    this.dom.addEventListener('mouseover', this.showSourceText.bind(this));
    this.dom.addEventListener('mouseout', this.hideSourceText.bind(this));
    this.dom.addEventListener('keypress', this.hideSourceText.bind(this));
    this.dom.addEventListener('click', this.selectNode.bind(this));
  }
  removeEventListenerToView(): void {
    this.dom.removeEventListener('mouseover', this.showSourceText.bind(this));
    this.dom.removeEventListener('mouseout', this.hideSourceText.bind(this));
    this.dom.removeEventListener('click', this.selectNode.bind(this));
  }

  hideSourceText(_e: MouseEvent): void {
    this.close();
  }


  selectNode(e: MouseEvent): void {
    if (undefined === e) {
      return;
    }
    let anchorEl = this.dom;
    if (e && e.currentTarget) {
      anchorEl = e.currentTarget as globalThis.Node;
    }
    if (!anchorEl) {
      this.destroyPopup();
      return;
    }
    const popup = this._popUp_subMenu;
    popup && popup.close('');
    const viewPops = {
      editorState: this.outerView.state,
      editorView: this.outerView,

      onCancel: this.onCancel,
      onEdit: this.onEditInfo,
      onRemove: this.onInfoRemove,
      onMouseOut: this.onInfoSubMenuMouseOut,
    };
    this._popUp_subMenu = createPopUp(InfoIconSubMenu, viewPops, {
      anchor: anchorEl,
      autoDismiss: false,
      onClose: this._onClose,
      position: atAnchorTopCenter,
    });
  }

  _onClose = (): void => {
    this._popUp_subMenu = null;
  };

  onCancel = (view: EditorView): void => {
    this.destroyPopup();
    view.focus();
  };

  destroyPopup(): void {
    this._popUp && this._popUp.close('');
    this._popUp_subMenu && this._popUp_subMenu.close('');
  }

  onInfoSubMenuMouseOut = (): void => {
    this.destroyPopup();
  };

  onEditInfo = (view: EditorView): void => {
    this._popUp_subMenu && this._popUp_subMenu.close('');

    this._popUp = createPopUp(
      InfoIconDialog,
      this.createInfoObject(view, 2),
      {
        modal: true,
        IsChildDialog: false,
        autoDismiss: false,
        onClose: (val) => {
          if (this._popUp) {
            this._popUp = null;
            if (undefined !== val) {
              this.updateInfoIcon(view, val);
            }
          }
        },
      }
    );
  }

  createInfoObject(
    editorView: EditorView,
    mode: number
  ) {
    return {
      infoIcon: this.node.attrs.infoIcon,
      description: this.node.attrs.description,
      mode: mode, //0 = new , 1- modify, 2- delete
      editorView: editorView,
      from: this.node.attrs.from,
      to: this.node.attrs.to
    };
  }

  updateInfoIcon(view: EditorView, infoicon): void {
    if (view.dispatch) {
      const { selection } = view.state;
      let { tr } = view.state;
      tr = tr.setSelection(selection);
      tr = this.updateInfoObject(tr, infoicon) as Transaction;
      view.dispatch(tr);
    }
  }

  updateInfoObject(tr: Transform, infoIcon): Transform {
    const newattrs = {};
    Object.assign(newattrs, this.node.attrs);
    const div = document.createElement('div');
    const fragm = DOMSerializer.fromSchema(infoIcon.editorView.state.schema).serializeFragment(infoIcon.editorView.state.doc.content);
    div.appendChild(fragm);
    const desc = div.innerHTML;
    newattrs['description'] = desc;
    newattrs['infoIcon'] = infoIcon.infoIcon;
    tr = tr.setNodeMarkup(
      infoIcon.from,
      undefined,
      newattrs
    );
    return tr;
  }

  onInfoRemove = (view: EditorView): void => {
    const { selection } = view.state;
    let { tr } = view.state;
    tr = tr.setSelection(selection);
    if (INFO_ICON === this.getNameAfter(selection)) {
      tr = tr.delete(selection.$head.pos, selection.$head.pos + 2);
      view.dispatch(tr);
    }
  }

  getNameAfter(selection) {
    return selection.$head?.nodeAfter?.type?.name;
  }

  showInfoIcon() {
    if (this.node.attrs.infoIcon) {
      const iconSuperScript = this.dom.appendChild(document.createElement('sup'));
      const iconSpan = iconSuperScript.appendChild(document.createElement('span'));
      iconSpan.innerHTML = this.node.attrs.infoIcon;
      iconSpan.className = 'fa';
      iconSpan.style.fontFamily = 'FontAwesome';
    }
  }

  open(e: MouseEvent): void {
    // Append a tooltip to the outer node
    // get the editor div
    const parent = document.getElementsByClassName(
      'ProseMirror czi-prosemirror-editor'
    )[0];
    const tooltip = this.dom.appendChild(document.createElement('div'));
    tooltip.className = 'molcit-infoicon-tooltip';
    const ttContent = tooltip.appendChild(document.createElement('div'));
    ttContent.innerHTML = this.node.attrs.description;
    ttContent.className = 'ProseMirror molcit-infoicon-tooltip-content';
    this.setContentRight(e, parent, tooltip, ttContent);
    if (window.screen.availHeight - e.clientY < 170 && ttContent.style.right) {
      ttContent.style.bottom = '114px';
    }
  }

  setContentRight(
    e: MouseEvent,
    parent: Element,
    tooltip: HTMLDivElement,
    ttContent: HTMLDivElement
  ) {
    // Append a tooltip to the outer node
    const MAX_CLIENT_WIDTH = 975;
    const RIGHT_MARGIN_ADJ = 50;
    const POSITION_ADJ = -110;

    if (parent) {
      const width_diff = e.clientX - parent.clientWidth;
      const counter = e.clientX > MAX_CLIENT_WIDTH ? RIGHT_MARGIN_ADJ : 0;
      if (width_diff > POSITION_ADJ && width_diff < tooltip.clientWidth) {
        ttContent.style.right =
          (parent as HTMLElement).offsetLeft + counter + 'px';
      }
    }
  }

  close(): void {
    const tooltip = document.getElementsByClassName('molcit-infoicon-tooltip');
    if (tooltip.length > 0) {
      tooltip[0].remove();
    }
  }

  update(node: Node): boolean {
    if (!node.sameMarkup(this.node)) return false;
    this.node = node;
    return true;
  }

  destroy(): void {
    this.removeEventListenerToView();
    this.close();
  }

  stopEvent(_event: Event): boolean {
    return false;
  }

  ignoreMutation(): boolean {
    return true;
  }
}

export default InfoIconView;
