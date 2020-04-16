require('tap').mochaGlobals();
const tap = require('tap');
const test = tap.test;
const data = require('../../src/extensions/data_tools/index.js');
const Runtime = require('../../src/engine/runtime');

const dataset = [ 
    {name:'NameOne', age: 10 }, 
    {name:'NameTwo', age: 11 }, 
    {name:'NameThree', age: 12 }
];
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
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    
    //Making sure that the new array fileNames
    //has gotten the file with 'fileName'
    t.strictEqual(fileNames[0], 'fileName');
    t.end();
});

// ******* Statement Coverage Test - Getting Column At Row *******
test('getColumnAtRow - Statement Coverage Test', t=> {
    blocks.addDataFile(fileName, dataset2);
    t.equal(blocks.getColumnAtRow(dataset2), "");
    t.end();
});
    
// ******* Statement Coverage Test - Adding Data File To Row *******
test('addDataFileRow', t => {
    //Goes through to the bottom of the method
    blocks.addDataFile('fileName', dataset);
    let arg3 = { FILENAME: 'fileName'};
    blocks.addDataFileRow(arg3);
    let args = {COLUMN: '[fileName] age', ROW: 4};
    let result = blocks.getColumnAtRow(args);
    t.strictEqual(0, result);
    args = {COLUMN: '[fileName] name', ROW: 4};
    result = blocks.getColumnAtRow(args);
    t.strictEqual('', result);
    
    //Removes working fileName
    blocks.removeDataFile('fileName');
    
    //Checks for first if statement to see if returns
    let arg2 = { FILENAME: ''}; 
    blocks.addDataFileRow(arg2);
    
    //Adds fileName with empty data
    blocks.addDataFile('fileName', dataset2);
    let arg = { FILENAME: 'fileName'};
    blocks.addDataFileRow(arg);
    
    t.end();
});

