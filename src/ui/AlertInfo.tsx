import * as React from 'react';
import './infoicon-note.css';

type AlertProps = {
  initialValue: Record<string, never>;
  title: string;
  content: string;
  close: () => void;
};

export class AlertInfo extends React.PureComponent<AlertProps, AlertProps> {
  _unmounted = false;

  constructor(props: AlertProps) {
    super(props);
  }

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  render(): React.ReactNode {
    const title = this.props.title || 'Info Plugin Error!';
    const content =
      this.props.content ||
      'Unable to load the info plugin.';
    return (
      <div className="molcit-infoicon-alert">
        <strong>{title}</strong>
        <span>{content}</span>
      </div>
    );
  }

  _cancel = (): void => {
    this.props.close();
  };
}


