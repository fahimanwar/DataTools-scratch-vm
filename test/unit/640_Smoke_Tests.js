// ******** Smoke Tests *********	// ******** Smoke Tests *********


// ***** Import Smoke Test ******	// ***** Import Smoke Test - Filename ******
test('Importing a Data File Smoke Test - File Name', test => {	test('Importing a Data File - Filename', test => {
    blocks.addDataFile(fileName, dataset);	    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();	    let fileNames = blocks.getFileNames();
    test.strictEqual(fileNames[0], 'fileName');	    test.strictEqual(fileNames[0], 'fileName');
@@ -28,42 +28,80 @@ test('Importing a Data File Smoke Test - File Name', test => {
    test.end();	    test.end();
});	});


test('Importing a Data File Smoke Test - Name', test => {	// ***** Import Smoke Tests - Name ******
test('Importing a Data File - Name', test => {
    blocks.addDataFile(fileName, dataset);	    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();	    let fileNames = blocks.getFileNames();
    test.strictEqual(fileNames[0], 'fileName');	
    let output = blocks.getDataFileContents(fileName);	    let output = blocks.getDataFileContents(fileName);
    test.equal(output[0].name, dataset[0].name);	    test.equal(output[0].name, dataset[0].name);
    test.end();	    test.end();
});	});


test('Importing a Data File Smoke Test - Age', test => {	// ***** Import Smoke Test - Age ******
test('Importing a Data File - Age', test => {
    blocks.addDataFile(fileName, dataset);	    blocks.addDataFile(fileName, dataset);
    let fileNames = blocks.getFileNames();	    let fileNames = blocks.getFileNames();
    test.strictEqual(fileNames[0], 'fileName');	
    let output = blocks.getDataFileContents(fileName);	    let output = blocks.getDataFileContents(fileName);
    test.equal(output[0].age, dataset[0].age);	    test.equal(output[0].age, dataset[0].age);
    test.equal(blocks._fileBlocks[0].text, 'fileName');	
    test.equal(blocks._fileBlocks[0].opcode, 'file_fileName');	
    test.end();	    test.end();
});	});


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


// Tests adding a data file	// ***** Modify Smoke Test - Row Edge Cases ******
test('Adding Data File to extension', t => {	test('Modifying a Row Edge Case - Row Less Than 1', t=>{
    blocks.addDataFile(fileName, dataset);	    let args = {COLUMN: '[file] age', ROW: 3, VALUE: '10'};
    let fileNames = blocks.getFileNames();	    let out = blocks.setColumnAtRow(args);
    t.strictEqual(fileNames[0], 'fileName');	    args = {COLUMN: '[file] age', ROW: 0, VALUE: '100' };
    let output = blocks.getDataFileContents(fileName);	    out = blocks.setColumnAtRow(args);
    t.equal(output[0].name, dataset[0].name);	    t.equal(out, '');
    t.equal(output[0].age, dataset[0].age);	    t.end();
    t.equal(blocks._fileBlocks[0].text, 'fileName');	});
    t.equal(blocks._fileBlocks[0].opcode, 'file_fileName');	
// ***** Create Smoke Test ******
test('Create Blank Row', t => {
    blocks.addDataFile('fileName', dataset);
    let arg = { FILENAME: 'fileName'};
    blocks.addDataFileRow(arg);
    let args = {COLUMN: '[fileName] age', ROW: 4};
    let result = blocks.getColumnAtRow(args);
    t.strictEqual(0, result);
    args = {COLUMN: '[fileName] name', ROW: 4};
    result = blocks.getColumnAtRow(args);
    t.strictEqual('', result);
    t.end();	    t.end();
});	});







// Tests adding a data file and then removing that data file	// Tests adding a data file and then removing that data file
test('Removing a Data file from the extension', t =>{	test('Removing a Data file from the extension', t =>{
    let bool = blocks.removeDataFile('file');	    let bool = blocks.removeDataFile('file');
@@ -106,40 +144,5 @@ test('Changing a file in the file view', t =>{
    t.end();	    t.end();
})	})


// Modifying an existing row	
test('Modifying an existing row of a dataset', t => {	
    blocks.addDataFile('fileName', dataset);	
    blocks.setColumnAtRow({COLUMN: '[fileName] name', ROW: 2, VALUE: "Roger"});	
    t.equal(blocks.getColumnAtRow({COLUMN: '[fileName] name', ROW: 2}), 'Roger');	
    t.end();	
});	


// Modifying a row, edge cases	
test('Modifying a row edge cases', t=>{	
    let args = {COLUMN: '[file] age', ROW: 3, VALUE: '10'};	
    let out = blocks.setColumnAtRow(args);	
    t.equal(out, ''); // testing if the file does not exist	
    blocks.addDataFile('file', dataset);	
    args = {COLUMN: '[file] age', ROW: 4, VALUE: '100'}	
    out = blocks.setColumnAtRow(args);	
    t.equal(out, '');// testing if the row does not exist	
    args = {COLUMN: '[file] age', ROW: 0, VALUE: '100' };	
    out = blocks.setColumnAtRow(args);	
    t.equal(out, '');// testing if the row is less than 1	
    t.end();	
});	

//Adding a row to the data file, checking that the row was added properly	
test('Adding a blank row to a dataset', t => {	
    blocks.addDataFile('fileName', dataset);	
    let arg = { FILENAME: 'fileName'};	
    blocks.addDataFileRow(arg);	
    let args = {COLUMN: '[fileName] age', ROW: 4};	
    let result = blocks.getColumnAtRow(args);	
    t.strictEqual(0, result);	
    args = {COLUMN: '[fileName] name', ROW: 4};	
    result = blocks.getColumnAtRow(args);	
    t.strictEqual('', result);	
    t.end();	
});
