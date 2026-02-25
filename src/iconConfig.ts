import {FaIcons, FONTAWESOMEICONS} from './ui/FaIcon';

let configuredIcons: FaIcons[] = FONTAWESOMEICONS;

export type InfoIconPluginOptions = {
  icons?: FaIcons[];
  materialIcons?: FaIcons[];
  faIcons?: FaIcons[];
};

export function resolveConfiguredInfoIcons(options?: InfoIconPluginOptions): FaIcons[] {
  if (!options) {
    return FONTAWESOMEICONS;
  }
  if (Array.isArray(options.icons) && options.icons.length > 0) {
    return options.icons;
  }
  const materialIcons = Array.isArray(options.materialIcons) ? options.materialIcons : [];
  const faIcons = Array.isArray(options.faIcons) ? options.faIcons : [];
  const mergedIcons = [...materialIcons, ...faIcons];
  if (mergedIcons.length > 0) {
    return mergedIcons;
  }
  return FONTAWESOMEICONS;
}

export function setConfiguredInfoIcons(options?: InfoIconPluginOptions): void {
  configuredIcons = resolveConfiguredInfoIcons(options);
}

export function getConfiguredInfoIcons(): FaIcons[] {
  return configuredIcons;
}
