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

// ******** Smoke Tests *********

// ***** Import Smoke Test - Filename ******
test('Importing a Data File - Filename', test => {
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    test.strictEqual(fileNames[0], 'fileName');
    let output = blocks.getDataFileContents(fileName);
    test.equal(blocks._fileBlocks[0].text, 'fileName');
    test.equal(blocks._fileBlocks[0].opcode, 'file_fileName');
    test.end();
});

// ***** Import Smoke Tests - Name ******
test('Importing a Data File - Name', test => {
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    let output = blocks.getDataFileContents(fileName);
    test.equal(output[0].name, dataset[0].name);
    test.end();
});

// ***** Import Smoke Test - Age ******
test('Importing a Data File - Age', test => {
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    let output = blocks.getDataFileContents(fileName);
    test.equal(output[0].age, dataset[0].age);
    test.end();
});

// ***** Modify Smoke Test - Existing Row ******
test('Modify Row of a Dataset', t => {
    blocks.addDataFile('fileName', dataset);
    blocks.setColumnAtRow({COLUMN: '[fileName] name', ROW: 2, VALUE: "Roger"});
    t.equal(blocks.getColumnAtRow({COLUMN: '[fileName] name', ROW: 2}), 'Roger');
    t.end();
});

// ***** Modify Smoke Test - Row Edge Cases ******
test('Modifying a Row Edge Case - File Exists', t=>{
    let args = {COLUMN: '[file] age', ROW: 3, VALUE: '10'};
    let out = blocks.setColumnAtRow(args);
    t.equal(out, ''); 
    t.end();
});

// ***** Modify Smoke Test - Row Edge Cases ******
test('Modifying a Row Edge Case - Row Exists', t=>{
    let args = {COLUMN: '[file] age', ROW: 3, VALUE: '10'};
    let out = blocks.setColumnAtRow(args);
    blocks.addDataFile('file', dataset);
    args = {COLUMN: '[file] age', ROW: 4, VALUE: '100'}
    out = blocks.setColumnAtRow(args);
    t.equal(out, '');
    t.end();
});

// ***** Modify Smoke Test - Row Edge Cases ******
test('Modifying a Row Edge Case - Row Less Than 1', t=>{
    let args = {COLUMN: '[file] age', ROW: 3, VALUE: '10'};
    let out = blocks.setColumnAtRow(args);
    args = {COLUMN: '[file] age', ROW: 0, VALUE: '100' };
    out = blocks.setColumnAtRow(args);
    t.equal(out, '');
    t.end();
});

// ***** Create Smoke Test ******
test('Create Blank Row - 0', t => {
    blocks.addDataFile('fileName', dataset);
    let arg = { FILENAME: 'fileName'};
    blocks.addDataFileRow(arg);
    let args = {COLUMN: '[fileName] age', ROW: 4};
    let result = blocks.getColumnAtRow(args);
    t.strictEqual(0, result);
    t.end();
});

test('Create Blank Row', t => {
    blocks.addDataFile('fileName', dataset);
    let arg = { FILENAME: 'fileName'};
    blocks.addDataFileRow(arg);
    let args = {COLUMN: '[fileName] name', ROW: 4};
    result = blocks.getColumnAtRow(args);
    t.strictEqual('', result);
    t.end();
});
