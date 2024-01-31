import { marks } from './keys';

describe('ProseMirror marks', () => {
    const emMark = marks.em as any;
    test('serializes to em tag', () => {
        const emNode = emMark.toDOM();
        expect(emNode).toEqual(['em', 0]);
    });
});