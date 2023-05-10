// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import sanitizeURL from './sanitizeURL';
import { CustomButton } from '@modusoperandi/licit-ui-commands';
import { toggleMark } from 'prosemirror-commands';
import { preventEventDefault } from '@modusoperandi/licit-ui-commands';

import './czi-form.css';
import './czi-image-url-editor.css';

export const ENTER = 13;
const BAD_CHARACTER_PATTER = /\s/;

type LinkProps = {
  href: string,
  view: EditorView,
  close: ((url?) => string),
}
class LinkURLEditor extends React.PureComponent<LinkProps> {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  static propsTypes = {
    href: PropTypes.string,
    close: function (props, propName) {
      const fn = props[propName];
      if (
        !fn.prototype ||
        (typeof fn.prototype.constructor !== 'function' &&
          fn.prototype.constructor.length !== 1)
      ) {
        return new Error(
          propName + 'must be a function with 1 arg of type string'
        );
      }
      return null;
    },
  };

  state = {
    url: this.props.href,
  };

  render() {
    const { href } = this.props;
    const { url } = this.state;

    const error = url ? BAD_CHARACTER_PATTER.test(url) : false;

    let label = 'Apply';
    let disabled = !!error;
    if (href) {
      label = url ? 'Apply' : 'Remove';
      disabled = error;
    } else {
      disabled = error || !url;
    }

    return (
      <div className="czi-image-url-editor">
        <form className="czi-form" onSubmit={preventEventDefault}>
          <fieldset>
            <legend>Add a Link</legend>
            <input
              autoFocus={true}
              onChange={this._onURLChange}
              onKeyDown={this._onKeyDown}
              placeholder="Paste a URL"
              spellCheck={false}
              type="text"
              value={url || ''}
            />
          </fieldset>
          <div className="czi-form-buttons">
            <CustomButton label="Cancel" onClick={this._cancel} />
            <CustomButton
              active={true}
              disabled={disabled}
              label={label}
              onClick={this._apply}
            />
          </div>
        </form>
      </div>
    );
  }

  _onKeyDown = (e) => {
    if (e.keyCode === ENTER) {
      e.preventDefault();
      this._apply();
    }
  };

  _onURLChange = (e) => {
    const url = e.target.value;
    this.setState({
      url,
    });
  };

  _cancel = () => {
    this.props.close();
  };

  _apply = () => {
    const { url } = this.state;
    toggleMark(this.props.view.state.schema.marks.link, {
      href: url,
    })(this.props.view.state, this.props.view.dispatch);
    this.props.view.focus();
    this.props.close(sanitizeURL(url));
    return false;
  };
}

export default LinkURLEditor;
