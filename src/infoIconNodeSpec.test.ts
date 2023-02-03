/* eslint-disable */

import InfoIconNodeSpec from './infoIconNodeSpec';


const node = {
  attrs: {
    from: 0,
    to: 9,
    description: 'Test description',
    infoIcon: 1
  },
};

describe('InfoIconNodeSpec', () => {
  it('dom should have matching node attributes', () => {
    const outputspec = InfoIconNodeSpec.toDOM(node as any);
    const infoDom = [];
    const { from, to, description, infoIcon } = node.attrs;

    const attrs: any = {
      from,
      to,
      description, infoIcon
    };
    attrs.from = from;
    attrs.to = to;
    attrs.description = description;
    attrs.infoIcon = infoIcon;

    infoDom.push('infoicon');
    infoDom.push(attrs);
    infoDom.push(0);
    expect(outputspec).toStrictEqual(infoDom);
  });
  it('parse dom attributes', () => {
    const dom = document.createElement('span');
    dom.setAttribute('from', '0' as any);
    dom.setAttribute('to', '9' as any);
    dom.setAttribute('description', node.attrs.description);
    dom.setAttribute('infoIcon', node.attrs.infoIcon);

    const { from, to, description, infoIcon } = node.attrs;

    const attrs: any = {
      from,
      to,
      description,
      infoIcon
    };
    attrs.from = dom.getAttribute('from');
    attrs.to = dom.getAttribute('to');
    attrs.description = dom.getAttribute('description');
    attrs.infoIcon = dom.getAttribute('infoIcon');

    const getAttrs = InfoIconNodeSpec.parseDOM[0].getAttrs(dom);
    expect(getAttrs).toStrictEqual(attrs);
  });

  it('parse dom attributes with null', () => {
    const dom = document.createElement('span');
    const { from, to, description, infoIcon } = node.attrs;

    const attrs: any = {
      from,
      to,
      description,
      infoIcon
    };
    attrs.from = dom.getAttribute('from');
    attrs.to = dom.getAttribute('to');
    attrs.description = dom.getAttribute('description');
    attrs.infoIcon = dom.getAttribute('infoIcon');

    const getAttrs = InfoIconNodeSpec.parseDOM[0].getAttrs(dom);
    expect(getAttrs).toStrictEqual(attrs);
  });


});
