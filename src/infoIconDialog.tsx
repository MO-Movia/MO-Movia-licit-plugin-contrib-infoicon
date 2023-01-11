
import * as React from 'react';
import './ui/infoIconDialog.css';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import 'font-awesome/css/font-awesome.min.css';
import 'prosemirror-menu/style/menu.css';
import { plugins } from './plugins';
import { FONTAWESOMEICONS } from './ui/FaIcon';
type InfoDialogProps = {
  infoIcon: string;
  description: string;
  editorView: EditorView,
  mode: number,
  close: (val?) => void;
};

class InfoIconDialog extends React.PureComponent<InfoDialogProps, InfoDialogProps> {
  _popUp = null;
  _anchorEl = null;
  constructor(props: InfoDialogProps) {
    super(props);
    this.state = {
      infoIcon: null,
      ...props,
    };
  }

  componentDidMount() {
    // Mix the nodes from prosemirror-schema-list into the basic schema to
    // create a schema with list support.
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks
    });

    const view = new EditorView(document.querySelector('#editor'), {
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
        editorView: view,
      },
    );
  }

  render(): React.ReactNode {
    return (
      <div className="molinfo-infoContainer">
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
              {FONTAWESOMEICONS.map((icon, index) => {
                if (index < 10)
                  return <div className='molinfo-icon-list-div'>
                    <i className={icon.name + (this.state.infoIcon === icon.unicode ? ' molinfo-icon-active' : '')} id={`infoIcon ${index}`} onClick={() => this.selectInfoIcon(icon.unicode)}></i>
                  </div>;
                else
                  return null;
              })}
            </div>
            <div className='molinfo-dot-container'>
              <i className="fa fa-ellipsis-v"></i>
            </div>
          </div>
          <div className='molinfo-display-t'>
            <span>Display Text</span>
          </div>
          <div className='molinfo-editor-container' id="editor"></div>
          <div hidden id="content">
            <p>Para one</p>
          </div>
          <div className='molinfo-insert-container'>
            <button className='molinfo-insert-btn' disabled={!this.state.infoIcon} onClick={this._insert.bind(this)}>Insert</button>
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
      this.setState({ infoIcon: null });
    } else {
      this.setState({ infoIcon: iName });
    }

  }
  _insert = (): void => {
    this.props.close(this.state);
  };

}

export default InfoIconDialog;
