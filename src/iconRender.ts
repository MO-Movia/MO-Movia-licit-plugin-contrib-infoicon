import {FaIcons} from './ui/FaIcon';

export type IconRenderData = {
  className: string;
  glyph: string;
  fontFamily?: string;
};

function normalize(value?: string): string {
  return (value || '').trim();
}

function isCssClassIconName(name: string): boolean {
  if (!name) {
    return false;
  }
  return (
    name.includes(' ') ||
    name.startsWith('fa') ||
    name.includes('material-icons') ||
    name.includes('material-symbols') ||
    name.startsWith('mat-')
  );
}

function getMaterialClassFromFontFamily(fontFamily: string): string {
  const value = normalize(fontFamily).toLowerCase();
  if (!value) {
    return '';
  }
  if (value.includes('material symbols rounded')) {
    return 'material-symbols-rounded';
  }
  if (value.includes('material symbols sharp')) {
    return 'material-symbols-sharp';
  }
  if (value.includes('material symbols')) {
    return 'material-symbols-outlined';
  }
  if (value.includes('material icons outlined')) {
    return 'material-icons-outlined';
  }
  if (value.includes('material icons round')) {
    return 'material-icons-round';
  }
  if (value.includes('material icons sharp')) {
    return 'material-icons-sharp';
  }
  if (value.includes('material icons two tone')) {
    return 'material-icons-two-tone';
  }
  if (value.includes('material icons')) {
    return 'material-icons';
  }
  return '';
}

export function getIconRenderData(icon: FaIcons | null | string): IconRenderData {
  if (!icon || typeof icon === 'string') {
    return {
      className: '',
      glyph: '',
    };
  }

  const name = normalize(icon.name);
  let glyph = normalize(icon.glyph);
  let className = name;
  let fontFamily = normalize(icon.fontFamily);
  const materialClassFromFont = getMaterialClassFromFontFamily(fontFamily);

  if (!glyph && name && !isCssClassIconName(name)) {
    glyph = name;
  }

  if (name && !isCssClassIconName(name)) {
    className = materialClassFromFont || 'material-icons';
  }

  if (!className && glyph) {
    className = materialClassFromFont || 'material-icons';
  }

  if (className.includes('material-icons') && !fontFamily) {
    fontFamily = 'Material Icons';
  }
  if (className.includes('material-symbols') && !fontFamily) {
    fontFamily = 'Material Symbols Outlined';
  }

  return {
    className,
    glyph,
    fontFamily: fontFamily || undefined,
  };
}

export function getCanonicalIconIdentity(icon: FaIcons | null | string): string {
  if (!icon) {
    return '';
  }

  if (typeof icon === 'string') {
    const value = normalize(icon);
    if (!value) {
      return '';
    }
    return `material-icons|${value}|`;
  }

  const iconData = getIconRenderData(icon);
  const name = normalize(icon.name);
  const glyph = normalize(icon.glyph);
  const unicode = normalize(icon.unicode);

  const keyClass = iconData.className || name;
  const keyGlyph = iconData.glyph || glyph;

  if (!keyClass && !keyGlyph && !unicode) {
    return '';
  }

  return `${keyClass}|${keyGlyph}|${unicode}`;
}
