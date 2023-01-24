
import * as React from 'react';
import './ui/infoIconDialog.css';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import 'font-awesome/css/font-awesome.min.css';
import 'prosemirror-menu/style/menu.css';
import SearchInfoIcon from './SearchInfoIcon';
import {
  createPopUp
} from '@modusoperandi/licit-ui-commands';
import { plugins } from './plugins';
import { FaIcons, FONTAWESOMEICONS } from './ui/FaIcon';
import { SELECTEDINFOICON } from './constants';


type InfoDialogProps = {
  infoIcon: string;
  description: string;
  editorView: EditorView,
  mode: number,
  from: number,
  to: number,
  faIcons,
  isOpen: boolean,
  isEditorEmpty: boolean,
  close: (val?) => void;
};

class InfoIconDialog extends React.PureComponent<InfoDialogProps, InfoDialogProps> {
  _popUp = null;
  _anchorEl = null;
  count: number;
  view: EditorView;
  constructor(props: InfoDialogProps) {
    super(props);
    this.state = {
      infoIcon: null,
      faIcons: this.getCacheIcons(),
      isOpen: false,
      isEditorEmpty: false,
      ...props,
    };
  }

  togglePopover = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  componentDidMount() {
    // Mix the nodes from prosemirror-schema-list into the basic schema to
    // create a schema with list support.
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, '', ''),
      marks: schema.spec.marks
    });

    const content = document.getElementById('content');
    content.innerHTML = this.props.description;
    this.view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(
          document.querySelector('#content')
        ),
        plugins: plugins,
        schema: mySchema
      })
    });
    this.setState(
      {
        editorView: this.view,
        isEditorEmpty: this.view.state.doc.textContent === '' ? false : true
      },
    );
  }

  render(): React.ReactNode {
    // const [visible, setVisible] = React.useState(false);
    return (
      <div className="molinfo-infoContainer" id="infoPopup">
        <div className="molinfo-info-head">
          <span>Info Icon</span>
          <button className='molinfo-info-close' onClick={this._cancel} type="button">
            <span>X</span>
          </button>
        </div>
        <div className='molinfo-divider'></div>
        <div className="molinfo-info-body">
          <div>
            <span>Select Icons</span>
          </div>
          <div className='molinfo-icon-container'>
            <div className='molinfo-icon-list'>
              {this.state.faIcons.map((icon, index) => {
                if (index < 10)
                  return <div className='molinfo-icon-list-div'>
                    <i className={icon.name + (this.state.infoIcon === icon.unicode ? ' molinfo-icon-active' : '')} id={`infoIcon ${index}`} onClick={() => this.selectInfoIcon(icon.unicode)}></i>
                  </div>;
                else
                  return null;
              })}
            </div>
            <div className='molinfo-dot-container'>
              <i className="fa fa-ellipsis-v" onClick={() => this.setVisible(!this.state.isOpen)}></i>
              {this.state.isOpen &&
                <div className='icon-control-cont'>
                  <button onClick={this._onAdd.bind(this)} >Add</button>
                  <button disabled={!this.state.infoIcon} onClick={this._onRemove.bind(this)}>Remove</button>
                </div>}

            </div>
          </div>
          <div className='molinfo-display-t'>
            <span>Display Text</span>
          </div>
          <div className='molinfo-editor-container' id="editor" onInput={(event) => this.editorOnChange(event)}></div>
          <div hidden id="content">
          </div>
          <div className='molinfo-insert-container'>
            <button className='molinfo-insert-btn' disabled={!this.validateInsert()} onClick={this._insert.bind(this)}>{this.props.mode === 1 ? 'Insert' : 'Update'}</button>
          </div>
        </div>
      </div >
    );
  }
  _cancel = (): void => {
    this.props.close();
  };

  selectInfoIcon = (iName: string): void => {
    if (iName === this.state.infoIcon) {
      this.setState({ infoIcon: '' });
    } else {
      this.setState({ infoIcon: iName });
    }

  }

  _insert = (): void => {
    this.props.close(this.state);
  };

  editorOnChange = (event): void => {
    event.currentTarget.textContent == '' ? this.setState({ isEditorEmpty: false }) : this.setState({ isEditorEmpty: true });
  };

  validateInsert = (): boolean => {
    return this.state.infoIcon !== '' && this.state.isEditorEmpty === true;
  }

  _onAdd(_event: React.SyntheticEvent): void {
    this.disableInfoWIndow(false);
    this._popUp = createPopUp(
      SearchInfoIcon, null, {
      autoDismiss: false,
      onClose: (val) => {
        if (this._popUp) {
          this._popUp.close();
          this._popUp = null;
          if (undefined !== val) {
            this.setState({ faIcons: this.getCacheIcons() });
          }
        }
      },
    }
    );
  }

  setVisible(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  getFaIconCount(): number {
    return this.state.faIcons.filter((obj) => obj.selected === true).length;
  }
  _onRemove() {
    const iconName = this.state.infoIcon;
    const lcList = localStorage.getItem(SELECTEDINFOICON);
    const lcListItem = JSON.parse(lcList);
    lcListItem.forEach((element, i) => {
      if (element.unicode === iconName) {
        lcListItem.splice(i, 1);
        localStorage.setItem(SELECTEDINFOICON, JSON.stringify(lcListItem));
        this.setState({ faIcons: this.getCacheIcons(), infoIcon: null });
      }
    });
  }

  disableInfoWIndow(isEditable: boolean): void {
    const citationForm: HTMLElement = document.getElementById('infoPopup');
    if (citationForm && citationForm.style) {
      if (isEditable) {
        citationForm.style.pointerEvents = 'unset';
      } else {
        citationForm.style.pointerEvents = 'none';
      }
    }
  }

  getCacheIcons(): FaIcons[] {
    const ccList = localStorage.getItem(SELECTEDINFOICON);
    if (ccList) {
      return JSON.parse(ccList);
    } else {
      const fq = FONTAWESOMEICONS.slice(0, 10);
      localStorage.setItem(SELECTEDINFOICON, JSON.stringify(fq));
      return fq;
    }
  }
}

export default InfoIconDialog;
