// import {prosemirrorMatchers} from 'jest-prosemirror';

// // Add jest-prosemirror assertions
// expect.extend(prosemirrorMatchers);
 // 
// needed to mock this due to execute during loading
document.execCommand = document.execCommand || function execCommandMock() {};
