import {getCanonicalIconIdentity, getIconRenderData} from './iconRender';
import {FaIcons} from './ui/FaIcon';

describe('iconRender', () => {
  it('returns empty render data for null and string inputs', () => {
    expect(getIconRenderData(null)).toEqual({className: '', glyph: ''});
    expect(getIconRenderData('info')).toEqual({className: '', glyph: ''});
  });

  it('keeps class-based icon names as-is', () => {
    const icon: FaIcons = {name: 'fa fa-info-circle', unicode: '&#xf05a;'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'fa fa-info-circle',
      glyph: '',
      fontFamily: undefined,
    });
  });

  it('treats plain icon names as material ligatures', () => {
    const icon: FaIcons = {name: 'warning'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons',
      glyph: 'warning',
      fontFamily: 'Material Icons',
    });
  });

  it('uses material class inferred from fontFamily for plain names', () => {
    const icon: FaIcons = {name: 'warning', fontFamily: 'Material Symbols Rounded'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-symbols-rounded',
      glyph: 'warning',
      fontFamily: 'Material Symbols Rounded',
    });
  });

  it('applies default material family for material-icons class', () => {
    const icon: FaIcons = {name: 'material-icons', glyph: 'info'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons',
      glyph: 'info',
      fontFamily: 'Material Icons',
    });
  });

  it('applies default symbols family for material-symbols class', () => {
    const icon: FaIcons = {name: 'material-symbols-outlined', glyph: 'info'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-symbols-outlined',
      glyph: 'info',
      fontFamily: 'Material Symbols Outlined',
    });
  });

  it('supports glyph-only material icon setup with inferred class', () => {
    const icon = {
      name: '',
      glyph: 'help',
      fontFamily: 'Material Icons Outlined',
    } as unknown as FaIcons;

    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons-outlined',
      glyph: 'help',
      fontFamily: 'Material Icons Outlined',
    });
  });

  it('maps Material Icons Round family correctly', () => {
    const icon: FaIcons = {name: 'info', fontFamily: 'Material Icons Round'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons-round',
      glyph: 'info',
      fontFamily: 'Material Icons Round',
    });
  });

  it('maps Material Icons Sharp family correctly', () => {
    const icon: FaIcons = {name: 'info', fontFamily: 'Material Icons Sharp'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons-sharp',
      glyph: 'info',
      fontFamily: 'Material Icons Sharp',
    });
  });

  it('maps Material Icons Two Tone family correctly', () => {
    const icon: FaIcons = {name: 'info', fontFamily: 'Material Icons Two Tone'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons-two-tone',
      glyph: 'info',
      fontFamily: 'Material Icons Two Tone',
    });
  });

  it('falls back to material-icons for unknown font family with plain name', () => {
    const icon: FaIcons = {name: 'info', fontFamily: 'Custom Family'};
    expect(getIconRenderData(icon)).toEqual({
      className: 'material-icons',
      glyph: 'info',
      fontFamily: 'Custom Family',
    });
  });

  it('produces the same canonical identity for equivalent material icon shapes', () => {
    const plainName: FaIcons = {name: 'warning'};
    const classAndGlyph: FaIcons = {name: 'material-icons', glyph: 'warning'};
    const asString = 'warning';

    expect(getCanonicalIconIdentity(plainName)).toBe(getCanonicalIconIdentity(classAndGlyph));
    expect(getCanonicalIconIdentity(asString)).toBe(getCanonicalIconIdentity(classAndGlyph));
  });
});
