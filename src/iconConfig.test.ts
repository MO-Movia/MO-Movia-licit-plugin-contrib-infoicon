import {
  getConfiguredInfoIcons,
  resolveConfiguredInfoIcons,
  setConfiguredInfoIcons,
} from './iconConfig';
import {FONTAWESOMEICONS, FaIcons} from './ui/FaIcon';

describe('iconConfig', () => {
  afterEach(() => {
    setConfiguredInfoIcons();
  });

  it('returns default icons when options are not provided', () => {
    expect(resolveConfiguredInfoIcons()).toBe(FONTAWESOMEICONS);
  });

  it('returns options.icons when explicitly provided', () => {
    const icons: FaIcons[] = [{name: 'material-icons', glyph: 'info'}];
    expect(resolveConfiguredInfoIcons({icons})).toEqual(icons);
  });

  it('merges material and font-awesome arrays when icons is not provided', () => {
    const materialIcons: FaIcons[] = [{name: 'material-icons', glyph: 'warning'}];
    const faIcons: FaIcons[] = [{name: 'fa fa-info-circle', unicode: '&#xf05a;'}];

    expect(resolveConfiguredInfoIcons({materialIcons, faIcons})).toEqual([
      ...materialIcons,
      ...faIcons,
    ]);
  });

  it('falls back to default icons for empty option arrays', () => {
    expect(resolveConfiguredInfoIcons({icons: [], materialIcons: [], faIcons: []})).toBe(
      FONTAWESOMEICONS
    );
  });

  it('stores configured icons via setConfiguredInfoIcons', () => {
    const icons: FaIcons[] = [{name: 'material-icons', glyph: 'help'}];
    setConfiguredInfoIcons({icons});
    expect(getConfiguredInfoIcons()).toEqual(icons);
  });
});
