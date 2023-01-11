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
