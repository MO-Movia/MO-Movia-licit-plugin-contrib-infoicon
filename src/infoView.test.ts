/* eslint-disable */

import {InfoIconPlugin} from './index';

import {schema, builders} from 'prosemirror-test-builder';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, Node} from 'prosemirror-model';
import {InfoIconView, CBFn} from './infoIconView';
import {createPopUp} from '@modusoperandi/licit-ui-commands';
import {InfoIconDialog} from './infoIconDialog';
import * as sanitizeURLModule from './plugins/menu/sanitizeURL';

jest.mock('./plugins/menu/sanitizeURL', () => ({
  sanitizeURL: jest.fn(),
}));

describe('Info Plugin Extended', () => {
  const info = {
    from: 0,
    to: 9,
    description: 'Test description',
    infoIcon: 'faIcon',
  };

  const mySchema = new Schema({
    nodes: schema.spec.nodes,
    marks: schema.spec.marks,
  });
  const plugin = new InfoIconPlugin();
  const effSchema = plugin.getEffectiveSchema(mySchema);

  const newInfoIconNode = effSchema.node(effSchema.nodes.infoicon, info);
  plugin.initButtonCommands();
  const {doc, p} = builders(mySchema, {p: {nodeType: 'paragraph'}});

  it('Infoiconview call createInfoIconTooltip', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );
    const ttContent = document.createElement('div');
    ttContent.id = 'tooltip-content';
    ttContent.innerHTML =
      '"<p>test <a href="ingo" title="ingo">ingo</a> icon</p>"';
    const errorinfodiv = document.createElement('div');
    errorinfodiv.className = 'ProseMirror czi-prosemirror-editor';
    const extraerrorinfodiv = document.createElement('div');
    extraerrorinfodiv.className = 'prosemirror-editor-wrapper';
    const tooltip = document.createElement('div');
    tooltip.className = 'molcit-infoicon-tooltip';
    document.body.appendChild(tooltip);

    const clickEvent = new MouseEvent('mouseclick', {
      clientX: 281,
      clientY: 125,
    });
    const getNodePosEx = jest.spyOn(cView, 'getNodePosEx');
    getNodePosEx.mockReturnValue(12);
    const isPNodeNull = jest.spyOn(cView, 'isPNodeNull');
    isPNodeNull.mockReturnValue(true);
    cView.getNodePosition(clickEvent);
    // Call the close function
    cView.close();
    cView.setContentRight(clickEvent, errorinfodiv, tooltip, ttContent);
  });

  it('Infoiconview call selectNode', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );
    const getNodePosEx = jest.spyOn(cView, 'getNodePosEx');
    getNodePosEx.mockReturnValue(12);
    const targetElement = document.createElement('div');
    targetElement.className = 'fa';
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    targetElement.dispatchEvent(event);
    cView._popUp_subMenu = createPopUp(
      InfoIconDialog,
      cView.createInfoObject(view, 1),
      {
        modal: true,
        IsChildDialog: false,
        autoDismiss: false,
      }
    );
    cView.selectNode(event as MouseEvent);
  });
  it('should handle missing currentTarget', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );
    const destroyPopupSpy = jest.spyOn(cView, 'destroyPopup');
    const mockEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    cView.dom = null as unknown as globalThis.Node;
    const targetElement = document.createElement('div');
    targetElement.className = 'fa';
    const eventWithCustomData = {
      ...mockEvent,
      currentTarget: null, // Add custom data
      target: targetElement,
    };
    cView.selectNode(eventWithCustomData);

    // Verify that destroyPopup was called
    expect(destroyPopupSpy).toHaveBeenCalled();
  });

  it('should return false id sameMarkup returns false', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );
    const node = new Node();

    expect(cView.update(node)).toBe(false);
  });
  it('should return true if sameMarkup returns true', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView(
      {mount: dom},
      {
        state: state,
      }
    );
    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );

    // Simulate a node with the same markup
    const node = cView.node.copy(); // This creates a new node with the same markup
    expect(cView.update(node)).toBe(true);
  });

  describe('Info Plugin Extended', () => {
    let currentNode: Node | undefined;

    const updateNode = (node: Node): boolean => {
      if (!currentNode || !node.sameMarkup(currentNode)) return false;
      currentNode = node;
      return true;
    };

    const mockNode = {
      sameMarkup: jest.fn(),
    };

    beforeEach(() => {
      mockNode.sameMarkup.mockReset();
      currentNode = undefined;
    });

    it('should return false if currentNode is undefined', () => {
      mockNode.sameMarkup.mockReturnValue(false);
      currentNode = undefined; // Ensure currentNode is undefined
      const result = updateNode(mockNode as unknown as Node);
      expect(result).toBe(false);
      expect(mockNode.sameMarkup).not.toHaveBeenCalled();
    });

    it('should return false if node has different markup', () => {
      currentNode = mockNode as unknown as Node;
      mockNode.sameMarkup.mockReturnValue(false);
      const result = updateNode(mockNode as unknown as Node);
      expect(result).toBe(false);
      expect(mockNode.sameMarkup).toHaveBeenCalledWith(mockNode);
    });

    it('should return true and update node if node has the same markup', () => {
      currentNode = mockNode as unknown as Node;
      mockNode.sameMarkup.mockReturnValue(true);
      const result = updateNode(mockNode as unknown as Node);
      expect(result).toBe(true);
      expect(mockNode.sameMarkup).toHaveBeenCalledWith(mockNode);
      expect(currentNode).toBe(mockNode);
    });
  });

  it('should not close when relatedTarget offsetParent has the expected class', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView({mount: dom}, {state});

    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );

    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'ProseMirror molcit-infoicon-tooltip-content';

    const targetElement = document.createElement('div');
    targetElement.className = '';
    Object.defineProperty(targetElement, 'offsetParent', {
      value: tooltipContent,
    });

    const closeSpy = jest.spyOn(cView, 'close');

    const event = new MouseEvent('mouseout', {bubbles: true, cancelable: true});
    Object.defineProperty(event, 'relatedTarget', {
      value: targetElement,
    });

    cView.hideSourceText(event);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should return the correct position from posAtCoords', () => {
    const before = 'hello';
    const after = ' world';

    const state = EditorState.create({
      doc: doc(p(before, newInfoIconNode, after)),
      schema: effSchema,
      plugins: [plugin],
    });
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const view = new EditorView({mount: dom}, {state});

    const cView = new InfoIconView(
      view.state.doc.nodeAt(6),
      view,
      undefined as any
    );

    const mockPos = {pos: 12, inside: -1};
    jest.spyOn(view, 'posAtCoords').mockReturnValue(mockPos);
    const result = cView.getNodePosEx(100, 200);
    expect(result).toBe(12);
  });

  describe('InfoIconView - addClickListenerToLinks', () => {
    const info = {
      from: 0,
      to: 9,
      description: 'Test description',
      infoIcon: 'faIcon',
    };

    const mySchema = new Schema({
      nodes: schema.spec.nodes,
      marks: schema.spec.marks,
    });
    const plugin = new InfoIconPlugin();
    const effSchema = plugin.getEffectiveSchema(mySchema);
    const newInfoIconNode = effSchema.node(effSchema.nodes.infoicon, info);
    const {doc, p} = builders(mySchema, {p: {nodeType: 'paragraph'}});

    let view: EditorView;
    let cView: InfoIconView;
    let tooltipContent: HTMLDivElement;
    let windowSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();

      const dom = document.createElement('div');
      document.body.appendChild(dom);

      const state = EditorState.create({
        doc: doc(p('hello', newInfoIconNode, ' world')),
        schema: effSchema,
        plugins: [plugin],
      });

      view = new EditorView({mount: dom}, {state});

      const getPos = () => 6;
      cView = new InfoIconView(view.state.doc.nodeAt(6), view, getPos);

      tooltipContent = document.createElement('div');
      tooltipContent.innerHTML = `
        <a href="https://test.com" class="test-link">Test Link</a>
        <a>No Href Link</a>
        <a href="example.com">Non-HTTP Link</a>
        <a href="javascript:alert('xss')">JavaScript Link</a>
      `;

      windowSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      windowSpy.mockRestore();
      document.body.innerHTML = '';
      jest.clearAllMocks();
    });

    it('should handle links with https URLs correctly', () => {
      const preventDefault = jest.fn();
      const link = tooltipContent.querySelector(
        'a[href="https://test.com"]'
      ) as HTMLAnchorElement;

      (sanitizeURLModule.sanitizeURL as jest.Mock).mockReturnValue(
        'https://test.com'
      );

      cView.addClickListenerToLinks(tooltipContent);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: preventDefault,
      });
      link.dispatchEvent(clickEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(sanitizeURLModule.sanitizeURL).toHaveBeenCalledWith(
        'https://test.com'
      );
      expect(windowSpy).toHaveBeenCalledWith('https://test.com', '_blank');
    });

    it('should handle links without href', () => {
      const preventDefault = jest.fn();
      const link = tooltipContent.querySelector(
        'a:not([href])'
      ) as HTMLAnchorElement;

      cView.addClickListenerToLinks(tooltipContent);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: preventDefault,
      });
      link.dispatchEvent(clickEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(windowSpy).not.toHaveBeenCalled();
    });

    it('should prepend https:// to non-http URLs', () => {
      const preventDefault = jest.fn();
      const link = tooltipContent.querySelector(
        'a[href="example.com"]'
      ) as HTMLAnchorElement;

      (sanitizeURLModule.sanitizeURL as jest.Mock).mockReturnValue(
        'https://example.com'
      );

      cView.addClickListenerToLinks(tooltipContent);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: preventDefault,
      });
      link.dispatchEvent(clickEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(sanitizeURLModule.sanitizeURL).toHaveBeenCalledWith('example.com');
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    });

    it('should prepend https:// to javascript URLs', () => {
      const preventDefault = jest.fn();
      const link = tooltipContent.querySelector(
        'a[href^="javascript"]'
      ) as HTMLAnchorElement;

      (sanitizeURLModule.sanitizeURL as jest.Mock).mockReturnValue(
        "https://javascript:alert('xss')"
      );

      cView.addClickListenerToLinks(tooltipContent);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: preventDefault,
      });
      link.dispatchEvent(clickEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(sanitizeURLModule.sanitizeURL).toHaveBeenCalledWith(
        "javascript:alert('xss')"
      );
      expect(windowSpy).toHaveBeenCalledWith(
        "https://javascript:alert('xss')",
        '_blank'
      );
    });

    it('should use openLinkDialog when available in runtime', () => {
      const openLinkDialog = jest.fn();
      (view as any).runtime = {openLinkDialog};
      (view as any).editable = true;

      const preventDefault = jest.fn();
      const link = tooltipContent.querySelector(
        'a[href="https://test.com"]'
      ) as HTMLAnchorElement;

      (sanitizeURLModule.sanitizeURL as jest.Mock).mockReturnValue(
        'https://test.com'
      );

      cView.addClickListenerToLinks(tooltipContent);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: preventDefault,
      });
      link.dispatchEvent(clickEvent);

      expect(preventDefault).toHaveBeenCalled();
      expect(openLinkDialog).toHaveBeenCalledWith(
        'https://test.com',
        'Any unsaved changes will be lost'
      );
      expect(windowSpy).not.toHaveBeenCalled();
    });

    it('should handle editable vs non-editable views', () => {
      const openLinkDialog = jest.fn();
      (view as any).runtime = {openLinkDialog};

      (sanitizeURLModule.sanitizeURL as jest.Mock).mockReturnValue(
        'https://test.com'
      );

      const testCases = [
        {editable: true, expectedMessage: 'Any unsaved changes will be lost'},
        {editable: false, expectedMessage: ''},
      ];

      testCases.forEach(({editable, expectedMessage}) => {
        openLinkDialog.mockClear();

        (view as any).editable = editable;

        const preventDefault = jest.fn();
        const link = tooltipContent.querySelector(
          'a[href="https://test.com"]'
        ) as HTMLAnchorElement;

        cView.addClickListenerToLinks(tooltipContent);

        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(clickEvent, 'preventDefault', {
          value: preventDefault,
        });
        link.dispatchEvent(clickEvent);

        expect(openLinkDialog).toHaveBeenCalledWith(
          'https://test.com',
          expectedMessage
        );
      });
    });

    it('should handle empty tooltipContent with no links', () => {
      const emptyTooltip = document.createElement('div');

      expect(() => {
        cView.addClickListenerToLinks(emptyTooltip);
      }).not.toThrow();
    });
  });
});
