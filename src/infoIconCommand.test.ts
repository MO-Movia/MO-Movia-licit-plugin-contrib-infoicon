import {InfoIconCommand} from './infoIconCommand';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {Schema} from 'prosemirror-model';
import {EditorView} from 'prosemirror-view';
import {createPopUp} from '@modusoperandi/licit-ui-commands';

jest.mock('@modusoperandi/licit-ui-commands', () => ({
  createPopUp: jest.fn(),
}));

describe('InfoIconCommand', () => {
  const infoCommand = new InfoIconCommand('');

  const mockSchema = new Schema({
    nodes: {
      doc: {
        content: 'block+',
      },
      paragraph: {
        content: 'inline*',
        group: 'block',
        parseDOM: [{tag: 'p'}],
        toDOM: () => ['p', 0],
      },
      heading: {
        attrs: {level: {default: 1}},
        content: 'inline*',
        group: 'block',
        defining: true,
        parseDOM: [
          {tag: 'h1', attrs: {level: 1}},
          {tag: 'h2', attrs: {level: 2}},
          {tag: 'h3', attrs: {level: 3}},
        ],
        toDOM: (node) => ['h' + node.attrs.level, 0],
      },
      text: {
        group: 'inline',
      },
      image: {
        inline: true,
        attrs: {
          src: {},
          alt: {default: null},
          title: {default: null},
        },
        group: 'inline',
        draggable: true,
        parseDOM: [
          {
            tag: 'img[src]',
            getAttrs: (dom) => ({
              src: dom.getAttribute('src'),
              alt: dom.getAttribute('alt'),
              title: dom.getAttribute('title'),
            }),
          },
        ],
        toDOM: (node) => [
          'img',
          {
            src: node.attrs.src,
            alt: node.attrs.alt,
            title: node.attrs.title,
          },
        ],
      },
      illustration: {
        inline: false,
        attrs: {
          url: {},
          caption: {default: null},
        },
        group: 'block',
        draggable: true,
        parseDOM: [
          {
            tag: "div[data-type='illustration']",
            getAttrs: (dom) => ({
              url: dom.getAttribute('data-url'),
              caption: dom.getAttribute('data-caption'),
            }),
          },
        ],
        toDOM: (node) => [
          'div',
          {'data-type': 'illustration', 'data-url': node.attrs.url},
          ['img', {src: node.attrs.url, alt: 'Illustration'}],
          ['p', {class: 'caption'}, node.attrs.caption || ''],
        ],
      },
      hard_break: {
        inline: true,
        group: 'inline',
        selectable: false,
        parseDOM: [{tag: 'br'}],
        toDOM: () => ['br'],
      },
    },
    marks: {
      bold: {
        parseDOM: [
          {tag: 'strong'},
          {
            tag: 'b',
            getAttrs: (node) => node.style.fontWeight != 'normal' && null,
          },
        ],
        toDOM: () => ['strong', 0],
      },
      italic: {
        parseDOM: [
          {tag: 'em'},
          {
            tag: 'i',
            getAttrs: (node) => node.style.fontStyle != 'normal' && null,
          },
        ],
        toDOM: () => ['em', 0],
      },
      link: {
        attrs: {
          href: {},
          title: {default: null},
        },
        inclusive: false,
        parseDOM: [
          {
            tag: 'a[href]',
            getAttrs: (dom) => ({
              href: dom.getAttribute('href'),
              title: dom.getAttribute('title'),
            }),
          },
        ],
        toDOM: (node) => [
          'a',
          {href: node.attrs.href, title: node.attrs.title},
          0,
        ],
      },
    },
  });

  it('should handle cancel', () => {
    expect(infoCommand.cancel()).toBeNull();
  });
  it('should handle getFragm', () => {
    jest.spyOn(infoCommand, 'getDocContent').mockReturnValue([]);
    expect(
      infoCommand.getFragm({
        editorView: {state: {doc: {content: {}}, schema: mockSchema}},
      })
    ).toBeDefined();
  });
  it('should handle renderLabel', () => {
    expect(infoCommand.renderLabel()).toBeUndefined();
  });
  it('should handle isActive and return true', () => {
    expect(infoCommand.isActive()).toBeTruthy();
  });
  it('should handle isActive and return tr', () => {
    expect(
      infoCommand.executeCustom(
        {state: {schema: null}} as unknown as EditorState,
        {} as unknown as Transform
      )
    ).toStrictEqual({});
  });

  describe('createInfoIconAttrs', () => {
    const infoCommand = new InfoIconCommand('');
    it('should create new attributes with correct values', () => {
      const from = 1;
      const to = 5;
      const desc = 'Test description';
      const infoIcon = {
        attrs: {existingAttr: 'value'},
        infoIcon: {name: 'fa-test', unicode: '#1234'},
      };

      const result = infoCommand.createInfoIconAttrs(from, to, desc, infoIcon);

      expect(result).toEqual({
        existingAttr: 'value',
        from: 1,
        to: 5,
        description: 'Test description',
        infoIcon: {name: 'fa-test', unicode: '#1234'},
      });
    });

    it('should not modify the original infoIcon object', () => {
      const from = 2;
      const to = 8;
      const desc = 'Another description';
      const infoIcon = {
        attrs: {existingAttr: 'value'},
        infoIcon: {name: 'fa-icon', unicode: '#5678'},
      };

      const originalInfoIcon = JSON.parse(JSON.stringify(infoIcon));
      infoCommand.createInfoIconAttrs(from, to, desc, infoIcon);
      expect(infoIcon).toEqual(originalInfoIcon);
    });

    it('should work correctly when attrs is empty', () => {
      const from = 3;
      const to = 10;
      const desc = 'Empty attrs test';
      const infoIcon = {
        attrs: {},
        infoIcon: {name: 'fa-empty', unicode: '#0000'},
      };

      const result = infoCommand.createInfoIconAttrs(from, to, desc, infoIcon);

      expect(result).toEqual({
        from: 3,
        to: 10,
        description: 'Empty attrs test',
        infoIcon: {name: 'fa-empty', unicode: '#0000'},
      });
    });

    it('should handle missing infoIcon property gracefully', () => {
      const from = 4;
      const to = 12;
      const desc = 'No infoIcon property';
      const infoIcon = {attrs: {}};

      const result = infoCommand.createInfoIconAttrs(from, to, desc, infoIcon);

      expect(result).toEqual({
        from: 4,
        to: 12,
        description: 'No infoIcon property',
        infoIcon: undefined,
      });
    });
  });

  it('should return false when selection is not empty', () => {
    const mockState = {
      tr: {
        selection: {
          empty: false,
        },
      },
    } as unknown as EditorState;

    expect(infoCommand.isEnabled(mockState)).toBe(false);
  });

  describe('InfoIconCommand', () => {
    let command: InfoIconCommand;
    let mockState: EditorState;
    let mockView: EditorView;

    beforeEach(() => {
      command = new InfoIconCommand();
      mockState = {} as EditorState;
      mockView = {} as EditorView;
    });

    it('should resolve promise and set _popUp to null when onClose is called', async () => {
      (createPopUp as jest.Mock).mockImplementation(
        (_component, _props, options) => {
          setTimeout(() => {
            options.onClose('test_value');
          }, 0);
          return {close: jest.fn()};
        }
      );

      const resultPromise = command.waitForUserInput(
        mockState,
        undefined,
        mockView
      );

      const result = await resultPromise;

      expect(command._popUp).toBeNull();

      expect(result).toBe('test_value');
    });
  });

  describe('adjustCursorPosition', () => {
    let command: InfoIconCommand;
    let mockDoc;

    beforeEach(() => {
      command = new InfoIconCommand();
      mockDoc = {
        textBetween: jest.fn(),
        content: {size: 100},
      };
    });

    it('should adjust position when a word is found after cursor', () => {
      mockDoc.textBetween.mockReturnValueOnce('exampleWord remaining text');

      const result = command.adjustCursorPosition(mockDoc, 5, 5);

      expect(result).toEqual({from: 16, to: 16});
    });

    it('should adjust position when punctuation follows the word', () => {
      mockDoc.textBetween
        .mockReturnValueOnce('exampleWord')
        .mockReturnValueOnce(', nextWord');

      const result = command.adjustCursorPosition(mockDoc, 5, 5);

      expect(result).toEqual({from: 17, to: 17});
    });

    it('should not adjust if no word is found', () => {
      mockDoc.textBetween.mockReturnValueOnce('   ');

      const result = command.adjustCursorPosition(mockDoc, 5, 5);

      expect(result).toEqual({from: 5, to: 5});
    });

    it('should not adjust if no punctuation follows the word', () => {
      mockDoc.textBetween
        .mockReturnValueOnce('exampleWord')
        .mockReturnValueOnce('nextWord');

      const result = command.adjustCursorPosition(mockDoc, 5, 5);

      expect(result).toEqual({from: 16, to: 16});
    });
  });

  describe('getListNodeData', () => {
    let command: InfoIconCommand;
    let mockState;

    beforeEach(() => {
      command = new InfoIconCommand();
      mockState = {
        selection: {
          $head: {
            depth: 3, // Cursor inside a nested structure
            node: jest.fn(),
            path: [0, 1, 2, 3, 4, 5, 6], // Simulating document structure
          },
        },
      };
    });

    it('should return null if no list node is found', () => {
      jest.spyOn(command, 'isList').mockReturnValue(false); // No list nodes found

      const result = command.getListNodeData(mockState);

      expect(result).toBeNull();
    });
  });
});
