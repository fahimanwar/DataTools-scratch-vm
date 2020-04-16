require('tap').mochaGlobals();
const tap = require('tap');
const test = tap.test;
const data = require('../../src/extensions/data_tools/index.js');
const Runtime = require('../../src/engine/runtime');

const dataset = [ {name:'mikey', age:25 }, {name:'joe', age:36}, {name:'steve', age:85}];
const dataset2 = [];
const fileName = "fileName";
const name = 'name';

let runtime;
let blocks;

tap.beforeEach(done => {
    runtime = new Runtime();
    blocks = new data(runtime);
    done();
});


// ******* Statement Coverage Tests *******

// ******* Statement Coverage Test - Removing Data File *******
test('removeDataFile - Statement Coverage Test', t =>{
    blocks.addDataFile(fileName, dataset);
    let emptyBool = blocks.removeDataFile('file');
    let fileBool = blocks.removeDataFile('fileName');
    t.equal(fileBool, true);
    t.equal(emptyBool, false);
    t.end();
});

// ******* Statement Coverage Test - Adding Data File *******
test('addDataFile - Statement Coverage Test', test => {
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    let output = blocks.getDataFileContents(fileName);
    blocks.addDataFile(name, dataset2);
    
    //Checks for first if condition in addDataFile (length < 1)
    test.equal(0, dataset2.length);
    
    //Checks for second if condition
    test.equal('name', blocks.generateFileDisplayName(name));
    
    //Checks the rest of the the statements in addDataFile
    test.equal(output[0].name, dataset[0].name);
    test.end();
});

// ******* Statement Coverage Test - Getting Row Count *******
test('getRowCount - Statement Coverage Test', t=> {
    let runtime = new Runtime();
    let blocks = new data(runtime);
    
    //Checks if getRowCount is able to retrieve files from fileName
    //with an empty dataset
    t.equal(blocks.getRowCount({FILENAME: 'fileName'}), 0);
    
    //Checks if getRowCount is able to retrieve files from fileName
    //with a dataset and get the proper count
    blocks.addDataFile('fileName', dataset);
    t.equal(blocks.getRowCount({FILENAME: 'fileName'}), 3);
    t.end();
});

// ******* Statement Coverage Test - Getting File Names *******
test('getFileNames - Statement Coverage Test', t => {
    let runtime = new Runtime();
    let blocks = new data(runtime);
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    
    //Making sure that the new array fileNames
    //has gotten the file with 'fileName'
    t.strictEqual(fileNames[0], 'fileName');
    t.end();
});

// getColumnAtRow
test('getColumnAtRow - Statement Coverage Test', t=> {
    let runtime = new Runtime();
    let blocks = new data(runtime);   
    blocks.addDataFile(fileName, dataset2);
    t.equal(blocks.getColumnAtRow(dataset2), "");
    t.end();
});
    
//
test('addDataFileRow', t => {
    runtime = new Runtime();
    blocks = new data(runtime);
    blocks.addDataFile('fileName', dataset2);
    let arg = { FILENAME: 'fileName'};
    
    //Adds fileName with empty data
    blocks.addDataFileRow(arg);
    
    let arg2 = { FILENAME: ''}; 
    blocks.addDataFileRow(arg2);
    
    let args = {COLUMN: '[fileName] age', ROW: 4};
    let result = blocks.getColumnAtRow(args);
    t.strictEqual(0, result);
    args = {COLUMN: '[fileName] name', ROW: 4};
    result = blocks.getColumnAtRow(args);
    t.strictEqual('', result);
    t.end();
});





















































