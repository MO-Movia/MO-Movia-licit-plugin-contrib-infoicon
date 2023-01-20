// [FS] IRAD-1251 2021-03-10
// UI for Citation dialog
import * as React from 'react';
import { SELECTEDINFOICON } from './constants';
import { FaIcons, FONTAWESOMEICONS } from './ui/FaIcon';
import './ui/infoicon-note.css';

type SearchInfoProps = {
  icons,
  selectedIcon: FaIcons,
  close: (val?) => void;
};

class SearchInfoIcon extends React.PureComponent<SearchInfoProps, SearchInfoProps> {
  _unmounted = false;
  _popUp = null;
  constructor(props: SearchInfoProps) {
    super(props);
    this.state = {
      ...props,
      icons: FONTAWESOMEICONS,
      selectedIcon: { name: '', selected: false, unicode: '' }
    };
  }

  componentWillUnmount(): void {
    this._unmounted = true;
  }

  componentDidMount(): void {

  }

  render(): React.ReactNode {
    return (

      <div
        style={{
          width: '300px',
          border: '1px solid lightgray',
          boxShadow: '1px 1px',
        }}
      >
        <form className="czi-form" style={{ height: '300px' }}>
          <div className="search-col" style={{ display: 'flex' }}>
            <input type="text" placeholder="Search..." onChange={this.searchIcon} style={{ width: '50%', height: '27px' }} />
            <div style={{ float: 'right', paddingLeft: '.5rem' }}>
              <button style={{ height: '27px' }} onClick={this._save.bind(this)}>Save</button>
              <button className="btnsave" style={{ height: 27, marginLeft: '.2rem' }} onClick={this._cancel}>Cancel</button>
            </div>
          </div>
          <div className='icons' style={{ height: '16rem', overflowY: 'scroll', width: '255px' }}>
            {this.state.icons.map((icon, index) => {
              return <div className='molinfo-icon-list-div' style={{ display: 'contents', float: 'left' }}>
                <i className={icon.name + (this.state.selectedIcon?.name === icon.name ? ' molinfo-icon-active' : '')} onClick={() => this.selectInfoIcon(icon)}></i>
              </div>;
            })}
          </div>
        </form >
      </div >
    );
  }


  onSearchCitations(): void {
  }

  _cancel = (): void => {
    this.enableInfoWIndow();
    this.props.close();
  };

  _save = (): void => {
    let cache = this.getCacheIcons();

    if (cache.filter(c => c.name === this.state.selectedIcon.name).length > 0) {
      alert("Selected Icon Already Exist.");
    } else {
      cache.push(this.state.selectedIcon);
      localStorage.setItem(SELECTEDINFOICON, JSON.stringify(cache));
    }
    this.enableInfoWIndow();
    this.props.close(this.state);
  };

  enableInfoWIndow(): void {
    const citationForm: HTMLElement = document.getElementById('infoPopup');
    if (citationForm && citationForm.style) {
      citationForm.style.pointerEvents = 'unset';
    }
  }

  searchIcon = (e) => {
    // this.icons = {};
    let searchRes = FONTAWESOMEICONS.filter(d => d?.name?.toLowerCase().includes(e.target.value.toLowerCase()));
    this.setState({ icons: searchRes });
  }

  selectInfoIcon = (icon: FaIcons): void => {
    if (icon.name === this.state.selectedIcon.name) {
      this.setState({ selectedIcon: { name: '', selected: false, unicode: '' } });
    } else {
      this.setState({ selectedIcon: icon });
    }
  }

  getCacheIcons(): FaIcons[] {
    const ccList = localStorage.getItem(SELECTEDINFOICON);
    return ccList ? JSON.parse(ccList) : [];
  }
}

export default SearchInfoIcon;
