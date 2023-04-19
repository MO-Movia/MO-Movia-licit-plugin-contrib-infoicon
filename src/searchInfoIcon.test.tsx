import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { SearchInfoIcon } from './searchInfoIcon';
import React from 'react';
import { SELECTEDINFOICON } from './constants';

Enzyme.configure({ adapter: new Adapter() });
describe('should render the SearchInfoIcon component', () => {
    const subMenuProps = {
        icons: '',
        selectedIcon: {
            name: '',
            unicode: '',
            selected: true
        },
        close: () => {
            return null;
        },
    };


    it('should return an empty array when no icons are cached', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        localStorage.clear();
        const result = instance.getCacheIcons();
        expect(result).toEqual([]);
    });

    it('should return an array of cached icons when icons are present', () => {
        const icons = [{ id: '1', name: 'Icon 1' }, { id: '2', name: 'Icon 2' }];
        localStorage.setItem(SELECTEDINFOICON, JSON.stringify(icons));
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        const result = instance.getCacheIcons();
        expect(result).toEqual(icons);
    });

    it('should render', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        const infoPopupDiv = document.createElement('div');
        infoPopupDiv.id = 'infoPopup';
        document.body.appendChild(infoPopupDiv);
        expect(instance).toBeDefined();
    });

    it('should call componentWillUnmount', () => {
        const subMenuProps = {
            icons: '',
            selectedIcon: {
                name: '',
                unicode: '',
                selected: true
            },
            close: () => {
                return null;
            },
        };
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        instance.componentWillUnmount();
        expect(instance._unmounted).toEqual(true);
    });

    it('should call _cancel', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        const enableInfoWindowMock = jest.spyOn(SearchInfoIcon.prototype, 'enableInfoWIndow');

        instance._cancel();
        expect(enableInfoWindowMock).toHaveBeenCalled();

    });

    it('should call _save', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        const enableInfoWindowMock = jest.spyOn(SearchInfoIcon.prototype, 'enableInfoWIndow');
        const searchInfo = jest.spyOn(instance, 'getCacheIcons');
        searchInfo.mockReturnValue([{ name: '', unicode: '', selected: false }]);
        instance._save();
        expect(enableInfoWindowMock).toHaveBeenCalled();

    });

    it('should call _save with mock data', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;

        const searchInfo = jest.spyOn(instance, 'getCacheIcons');
        searchInfo.mockReturnValue([
            { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false },
            { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false }, { name: 'fa1', unicode: '123', selected: false },]);
        const enableInfoWindowMock = jest.spyOn(SearchInfoIcon.prototype, 'enableInfoWIndow');
        instance._save();
        expect(enableInfoWindowMock).toHaveBeenCalled();

    });
    it('should call showAlert', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        instance.showAlert();
        expect(instance).toBeDefined();
    });

    it('should call searchIcon', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        const clickEvent = {
            target: {
                value: 'test'
            }
        };
        instance.searchIcon(clickEvent);
        expect(instance.state.icons).toEqual([]);
    });

    it('should call selectInfoIcon', () => {
        const subMenuProps = {
            icons: '',
            selectedIcon: {
                name: 'fa fa-500px',
                unicode: 'x0457',
                selected: true
            },
            close: () => {
                return null;
            },
        };
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        instance.render();
        const inputSearch = {
            name: 'fa fa-500px',
            unicode: 'x0457',
            selected: true
        };
        instance.selectInfoIcon(inputSearch);
        expect(instance.props.selectedIcon).toEqual(inputSearch);
    });

    it('should call selectInfoIcon with null value', () => {
        const wrapper = shallow(<SearchInfoIcon {...subMenuProps} />);
        const instance = wrapper.instance() as SearchInfoIcon;
        const inputSearch = {
            name: '',
            unicode: '',
            selected: true
        };
        instance.selectInfoIcon(inputSearch);
        expect(instance.props.selectedIcon).toEqual(inputSearch);
    });
});