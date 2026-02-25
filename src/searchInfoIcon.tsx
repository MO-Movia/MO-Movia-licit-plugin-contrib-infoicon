// [FS] IRAD-1251 2021-03-10
// UI for Citation dialog
import { createPopUp, atViewportCenter } from '@modusoperandi/licit-ui-commands';
import * as React from 'react';
import { SELECTEDINFOICON } from './constants';
import { FaIcons } from './ui/FaIcon';
import { AlertInfo } from './ui/AlertInfo';
import {getConfiguredInfoIcons} from './iconConfig';
import {getCanonicalIconIdentity, getIconRenderData} from './iconRender';

type SearchInfoProps = {
  icons?;
  selectedIcon?: FaIcons,
  close: (val?) => void;
};

type SearchInfoState = {
  icons: FaIcons[];
  allIcons: FaIcons[];
  selectedIcon: FaIcons;
};

export class SearchInfoIcon extends React.PureComponent<SearchInfoProps, SearchInfoState> {
  _popUp = null;
  constructor(props: SearchInfoProps) {
    super(props);
    const configuredIcons = Array.isArray(props.icons) && props.icons.length > 0 ? props.icons : getConfiguredInfoIcons();
    this.state = {
      icons: configuredIcons,
      allIcons: configuredIcons,
      selectedIcon: props.selectedIcon || { name: '', selected: false, unicode: '' }
    };
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
            <input onChange={this.searchIcon} placeholder="Search..." style={{ width: '50%', height: '30px' }} type="text" />
            <div style={{ float: 'right', paddingLeft: '.5rem' }}>
              <button disabled={this.state.selectedIcon.name === ''} onClick={this._save.bind(this)} style={{ height: '27px' }}>Save</button>
              <button className="btnsave" onClick={this._cancel} style={{ height: 27, marginLeft: '.2rem' }}>Cancel</button>
            </div>
          </div>
          <div className='icons' style={{height: '16rem', overflowY: 'scroll', width: '255px'}}>
            {this.state.icons.map((icon, index) => {
                const iconData = getIconRenderData(icon);
                const className = [
                  iconData.className,
                  this.state.selectedIcon?.name === icon.name ? 'molinfo-icon-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
              return <div className='molinfo-icon-list-div' key={icon.id || `${icon.name}-${index}`}
              style={{display: 'contents', float: 'left'}}>
                <i
                className={className}
                onClick={() => this.selectInfoIcon(icon)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    this.selectInfoIcon(icon);
                  }
                }} role='menu' style={iconData.fontFamily ? {fontFamily: iconData.fontFamily} : undefined}
                tabIndex={0}>
                  {iconData.glyph}
                </i>
              </div>;
            })}
          </div>
        </form >
      </div >
    );
  }


  _cancel = (): void => {
    this.enableInfoWIndow();
    this.props.close();
  };

  _save = (): void => {
    const cache = this.getCacheIcons();
    const selectedIconIdentity = this.getIconIdentity(this.state.selectedIcon);

    if (cache.filter((c) => this.getIconIdentity(c) === selectedIconIdentity).length > 0) {
      this.showAlert();
    } else {
      if (cache.length >= 10) {
        cache.splice(0, 1);
      }
      cache.push(this.state.selectedIcon);
      localStorage.setItem(SELECTEDINFOICON, JSON.stringify(cache));
    }
    this.enableInfoWIndow();
    this.props.close(this.state);
  };

  enableInfoWIndow(): void {
    const infoIconForm: HTMLElement = document.getElementById('infoPopup');
    if (infoIconForm?.style) {
      infoIconForm.style.pointerEvents = 'unset';
    }
  }

  showAlert() {
    const anchor = null;
    this._popUp = createPopUp(
      AlertInfo,
      {
        content: 'Selected icon is already exist.',
        title: 'Duplicate Error!!! ',
      },
      {
        anchor,
        position: atViewportCenter,
        onClose: (_val) => {
          if (this._popUp) {
            this._popUp = null;
          }
        },
      }
    );
  }

  searchIcon = (e) => {
    const searchText = e.target.value.toLowerCase();
    const searchRes = this.state.allIcons.filter((d) => {
      const nameMatch = d?.name?.toLowerCase().includes(searchText);
      const glyphMatch = d?.glyph?.toLowerCase().includes(searchText);
      return nameMatch || glyphMatch;
    });
    this.setState({ icons: searchRes });
  };

  getIconIdentity(icon: FaIcons): string {
    return getCanonicalIconIdentity(icon);
  }

  selectInfoIcon = (icon: FaIcons): void => {
    if (this.getIconIdentity(icon) === this.getIconIdentity(this.state.selectedIcon)) {
      this.setState({ selectedIcon: { name: '', selected: false, unicode: '' } });
    } else {
      this.setState({ selectedIcon: icon });
    }
  };

  getCacheIcons(): FaIcons[] {
    const ccList = localStorage.getItem(SELECTEDINFOICON);
    return ccList ? JSON.parse(ccList) : [];
  }
}
