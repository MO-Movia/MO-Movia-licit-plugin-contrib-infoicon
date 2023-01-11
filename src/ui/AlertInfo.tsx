import * as React from 'react';
import PropTypes from 'prop-types';
import './infoicon-note.css';

type AlertProps = {
  initialValue: Record<string, never>;
  title: string;
  content: string;
  close: () => void;
};

class AlertInfo extends React.PureComponent<AlertProps, AlertProps> {
  _unmounted = false;

  constructor(props: AlertProps) {
    super(props);
  }

  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  static propsTypes = {
    initialValue: PropTypes.object,
    close: function (props: AlertProps, propName: string): Error {
      const fn = props[propName];
      if (
        !fn.prototype ||
        (typeof fn.prototype.constructor !== 'function' &&
          fn.prototype.constructor.length !== 1)
      ) {
        return new Error(
          propName + ' must be a function with 1 arg of type ImageLike'
        );
      }
      return null;
    },
  };

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.ReactNode {
    const title = this.props.title || 'Document Error!';
    const content =
      this.props.content ||
      'Unable to load the document. Have issues in Json format, please verify...';
    return (
      <div className="molcit-alert">
        <strong>{title}</strong>
        <span>{content}</span>
      </div>
    );
  }

  _cancel = (): void => {
    this.props.close();
  };
}

export default AlertInfo;
