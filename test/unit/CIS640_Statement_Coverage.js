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
test('Removing a Data file from the extension', t =>{
    blocks.addDataFile(fileName, dataset);
    let emptyBool = blocks.removeDataFile('file');
    let fileBool = blocks.removeDataFile('fileName');
    t.equal(fileBool, true);
    t.equal(emptyBool, false);
    t.end();
});

test('Importing a Data File - Name', test => {
    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();
    let output = blocks.getDataFileContents(fileName);
    blocks.addDataFile(name, dataset2);
    //Checks for first if condition in addDataFile (length < 1)
    test.equal(0, dataset2.length);
    
    //Checks for second if condition
    //test.equal('name', this.generateFileDisplayName(name));
    test.equal(this._files[name], 'name');
    
    //Checks the rest of the the statements in addDataFile
    test.equal(output[0].name, dataset[0].name);
    test.end();
});
