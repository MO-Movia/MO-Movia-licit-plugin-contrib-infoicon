import * as React from 'react';
import {EditorView} from 'prosemirror-view';
import InfoToolButton from './ui/InfoToolButton';
import InfoSubMenuIcon from './ui/InfoSubMenuIcon';
import './ui/infoicon-note.css';

export class InfoIconSubMenu extends React.PureComponent{
  props: {
    editorView: EditorView;
    onCancel: (view: EditorView) => void;
    onEdit: (view: EditorView) => void;
    onRemove: (view: EditorView) => void;
    onMouseOut: () => void;
  };

  _unmounted = false;

  state = {
    hidden: false,
  };

  render() {
    const { onEdit, onRemove, editorView, onMouseOut} = this.props;
    const disabled = editorView['readOnly'];

    return (
      <div className="molcit-infoicon-submenu" onMouseLeave={onMouseOut}>
        <div className="molcit-infoicon-submenu-body">
          <div className="molcit-infoicon-submenu-row">
            <InfoToolButton
              disabled={disabled}
              icon={InfoSubMenuIcon.get('edit')}
              onClick={onEdit}
              value={editorView}
            />
            <InfoToolButton
              disabled={disabled}
              icon={InfoSubMenuIcon.get('delete')}
              onClick={onRemove}
              value={editorView}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default InfoIconSubMenu;
