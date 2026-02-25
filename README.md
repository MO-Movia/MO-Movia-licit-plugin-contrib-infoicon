# MO-Movia-licit-plugin-contrib-infoicon

Insert icons that have hover text that can include links.

## Build

### Commands

- npm ci

- npm pack

#### To use this in Licit

Install the Infoicon plugin in Licit

- npm install _modusoperandi-licit-info-icon-0.0.1.tgz_

Include plugin in licit component

- import InfoIconPlugin

- add InfoIconPlugin instance in licit's plugin array

```

import  InfoIconPlugin  from  '@modusoperandi/licit-info-icon';

const  plugins = [new  InfoIconPlugin()]

ReactDOM.render(<Licit docID={0} plugins={plugins}/>


```

### Icon Set Configuration

Font Awesome is the default icon set. You can pass a custom icon list (or a mixed list such as Material + Font Awesome) through plugin config.

```ts
import {InfoIconPlugin} from '@modusoperandi/licit-info-icon';

const materialIcons = [
  {name: 'material-icons', glyph: 'info', selected: false},
  {name: 'material-icons', glyph: 'warning', selected: false},
];

const faIcons = [
  {name: 'fa fa-info-circle', unicode: '&#xf05a;', selected: false},
];

const plugins = [new InfoIconPlugin({icons: [...materialIcons, ...faIcons]})];
```

Make sure the corresponding icon font CSS (Material and/or Font Awesome) is loaded in your host app.

You can also pass them separately:

```ts
const plugins = [new InfoIconPlugin({materialIcons, faIcons})];
```
