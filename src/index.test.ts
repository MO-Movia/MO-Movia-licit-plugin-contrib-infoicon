/* eslint-disable */

import { InfoIconPlugin } from './index';
import { schema, builders } from 'prosemirror-test-builder';
import { Plugin, PluginKey } from 'prosemirror-state';
import { addListNodes } from 'prosemirror-schema-list';
import {
    Schema,
} from 'prosemirror-model';

class TestPlugin extends Plugin {
    constructor() {
        super({
            key: new PluginKey('TestPlugin'),
        });
    }
}

describe('Info Plugin', () => {

    const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, '', ''),
        marks: schema.spec.marks
    });
    const plugin = new InfoIconPlugin();
    plugin.initButtonCommands();
    plugin.initKeyCommands();
    plugin.getEffectiveSchema(mySchema);
    const { doc, p } = builders(mySchema, { p: { nodeType: 'paragraph' } });

    it('should create infoplugin', () => {

    });
});
