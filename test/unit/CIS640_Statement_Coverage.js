require('tap').mochaGlobals();
const tap = require('tap');
const test = tap.test;
const data = require('../../src/extensions/data_tools/index.js');
const Runtime = require('../../src/engine/runtime');

const dataset = [ {name:'mikey', age:25 }, {name:'joe', age:36}, {name:'steve', age:85}];
const fileName = "fileName";

let runtime;
let blocks;

tap.beforeEach(done => {
    runtime = new Runtime();
    blocks = new data(runtime);
    done();
});


// ******* Statement Coverage Tests *******

// ******* Statement Coverage Test - Removing Data File *******
test('Removing a Data file from the extension', t =>{
    blocks.addDataFile(fileName, dataset);
    let emptyBool = blocks.removeDataFile('file');
    let fileBool = blocks.removeDataFile('fileName');
    t.equal(fileBool, true);
    t.equal(emptyBool, false);
    t.end();
});
