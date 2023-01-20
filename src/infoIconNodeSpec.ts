import { DOMOutputSpec, Node, NodeSpec } from 'prosemirror-model';

const InfoIconNodeSpec: NodeSpec = {
  group: 'inline',
  content: 'text*',
  inline: true,
  selectable: false,
  // added new attributes to this spec.
  attrs: {
    from: { default: null },
    to: { default: null },
    description: { default: null },
    // imageSrc: { default: null },
    infoIcon: { default: null },
  },
  toDOM,
  parseDOM: [
    {
      tag: 'infoicon',
      getAttrs,
    },
  ],
};

function getAttrs(dom: HTMLElement): Record<string, unknown> {
  const from = dom.getAttribute('from') || null;
  const to = dom.getAttribute('to') || null;

  const description = dom.getAttribute('description') || null;
  // const imageSrc = dom.getAttribute('imageSrc') || null;
  const infoIcon = dom.getAttribute('infoIcon') || null;

  return {
    from,
    to,
    description,
    infoIcon,
  };
}

function toDOM(node: Node): DOMOutputSpec {
  const { from, to, description,
    infoIcon,
  } = node.attrs;
  const attrs = {
    from,
    to,
    description,
    infoIcon
  };
  attrs.from = from;
  attrs.to = to;
  attrs.description = description;
  attrs.infoIcon = infoIcon;

  return ['infoicon', attrs, 0];
}
export default InfoIconNodeSpec;
