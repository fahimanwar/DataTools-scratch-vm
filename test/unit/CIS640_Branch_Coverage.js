require('tap').mochaGlobals();
const should = require('should');
const tap = require('tap');
const test = tap.test;
const data = require('../../src/extensions/data_tools/index.js');
const Runtime = require('../../src/engine/runtime');

const dataset = [ {name:'mikey', age:25 }, {name:'joe', age:36}, {name:'steve', age:85}];
const fileName = "fileName";

let runtime;
let blocks;

beforeEach(function() {
    runtime = new Runtime();
    blocks = new data(runtime);
});

describe('#removeDataFile()', () => {
    let result, fileNames;

    describe('when the data file does not exist', () => {
        it('returns false', function() {
            result = blocks.removeDataFile(fileName);
            result.should.equal(false);
        });
    });

    describe('when the data file does exist', () => {
        before(function() {
            blocks.addDataFile(fileName, dataset);
            result = blocks.removeDataFile(fileName);
            fileNames = blocks.getFileNames();
        });

        it('returns true', function() {
            result.should.equal(true);
        });

        it('removes the filename', function() {
            fileNames[0].should.equal("");
        });
    });
});

describe('#addDataFile()', () => {
    let fileNames, output;

    beforeEach(function() {
        blocks.addDataFile(fileName, dataset);
        fileNames = blocks.getFileNames();
        output = blocks.getDataFileContents(fileName);
    });

    it('name is added', function() {
        output[0].name.should.equal(dataset[0].name);
    });

    it('age is added', function() {
        output[0].age.should.equal(dataset[0].age);
    });

    it('filename is added', function() {
        fileNames[0].should.equal(fileName);
    });

    it('text is added', function() {
        blocks._fileBlocks[0].text.should.equal(fileName);
    });

    it('opcode is added', function() {
        blocks._fileBlocks[0].opcode.should.equal('file_fileName');
    });
});

describe('#getRowCount()', () => {
    let result;

    describe('when dataset exists', () => {
        it('returns 3', function() {
            blocks.addDataFile(fileName, dataset);
            result = blocks.getRowCount({FILENAME: fileName});
            result.should.equal(3);
        });
    });

    describe('when dataset does not exist', () => {
        it('returns 0', function() {
            result = blocks.getRowCount({FILENAME: fileName});
            result.should.equal(0);
        });
    });
});

describe('#generateColumnData()', () => {
    const noFilesUploaded = 'NO FILES UPLOADED';
    const name = 'name';
    const age = 'age';

    describe('when no datafile exists', () => {
        it('returns error message', function() {
            blocks.generateColumnData()[''][0].should.equal(noFilesUploaded);
        });
    });

    describe('when no datafile exists', () => {
        beforeEach(function() {
            blocks.addDataFile(fileName, dataset);
        });

        it('adds "name" value to dataset', function() {
            blocks.generateColumnData()[fileName][0].should.equal(name)
        });

        it('adds "age" value to dataset', function() {
            blocks.generateColumnData()[fileName][1].should.equal(age)
        });
    });
});

describe('#updateDataFileFromTable()', () => {
    const newAge = 100
    const newName = 'NewName'

    beforeEach(function() {
        blocks.addDataFile(fileName, dataset);
    });

    describe('when name is updated', () => {
        it('the new value is saved', function() {
            blocks.updateDataFileFromTable(fileName, 0, 'name', newName);
            blocks._files[fileName][0].name.should.equal(newName);
        });
    });

    describe('when age is updated', () => {
        it('the new value is saved', function() {
            blocks.updateDataFileFromTable(fileName, 0, 'age', newAge);
            blocks._files[fileName][0].age.should.equal(newAge);
        });
    });
});

describe('#updateDataFileFromTable()', () => {
    const newAge = 100
    const newName = 'NewName'

    beforeEach(function() {
        blocks.addDataFile(fileName, dataset);
    });

    describe('when name attribute is updated', () => {
        it('the new value is saved', function() {
            blocks.updateDataFileFromTable(fileName, 0, 'name', newName);
            blocks._files[fileName][0].name.should.equal(newName);
        });
    });

    describe('when age attribute is updated', () => {
        it('the new value is saved', function() {
            blocks.updateDataFileFromTable(fileName, 0, 'age', newAge);
            blocks._files[fileName][0].age.should.equal(newAge);
        });
    });
});

describe('#setColumnAtRow()', () => {
    let args, out;

    const newAge = 100
    const newName = 'NewName'

    describe('when update is valid', () => {
        args = {COLUMN: '[fileName] name', ROW: 2, VALUE: newName};

        before(function() {
            blocks.addDataFile(fileName, dataset);
            blocks.setColumnAtRow(args);
            out = blocks.getColumnAtRow(args);
        });

        it('the new value is returned', function() {
            out.should.equal(newName);
        });
    });

    describe('when update is invalid (edge cases)', () => {
        beforeEach(function() {
            out = blocks.setColumnAtRow(args);
        });

        describe('when the file does not exist', () => {
            args = {COLUMN: '[fileName] age', ROW: 3, VALUE: newAge};

            it('returns an empty string', function() {
                out.should.equal('');
            });
        });

        describe('when the row does not exist', () => {
            args = {COLUMN: '[fileName] age', ROW: 4, VALUE: newAge}

            before(function() {
                blocks.addDataFile(fileName, dataset);
            });

            it('returns an empty string', function() {
                out.should.equal('');
            });
        });

        describe('when the row number is less than 1', () => {
            args = {COLUMN: '[file] age', ROW: 0, VALUE: newAge };

            before(function() {
                blocks.addDataFile(fileName, dataset);
            });

            it('returns an empty string', function() {
                out.should.equal('');
            });
        });
    });
});

describe('#addDataFileRow()', () => {
    const initialArg = { FILENAME: fileName };
    let args, result;

    beforeEach(function() {
        blocks.addDataFile(fileName, dataset);
        blocks.addDataFileRow(initialArg);
        result = blocks.getColumnAtRow(args);
    });

    describe('when age is added', () => {
        args = {COLUMN: '[fileName] age', ROW: 4};

        it('returns the default value (0)', function() {
            result.should.equal(0);
        });
    });

    describe('when name is added', () => {
        args = {COLUMN: '[fileName] name', ROW: 4};

        it("returns the default value ('')", function() {
            result.should.equal('');
        });
    });
});
