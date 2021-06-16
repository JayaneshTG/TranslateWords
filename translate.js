var fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const start = new Date();

var inputData = fs.readFileSync('./t8.shakespeare.txt', 'utf8');
var arrFind = fs.readFileSync('./find_words.txt', 'utf8').toString().split('\n');
var arr1 = fs.readFileSync('./french_dictionary.csv', 'utf8').toString().split('\n');
var arr2 = [], frequency = [];

arr1.forEach((row) => {
    var rowObj = {};
    var rowData = row.split(',');
    rowObj.englishWord = rowData[0];
    rowObj.frenchWord = rowData[1];
    arr2.push(rowObj);
});

arrFind.forEach((find) => {
    var wordCount = inputData.split(find).length - 1;
    arr2.filter((word) => {
        if (word.englishWord == find) {
            var data={};
            var frenchWord = word.frenchWord;
            inputData = inputData.replace(new RegExp(find, "ig"), frenchWord);
            data.englishWord = find;
            data.frenchWord = frenchWord;
            data.frequency = wordCount;
            frequency.push(data);
            return word;
        }
    })
});
fs.writeFileSync('./output/t8.shakespeare.translated.txt', inputData);

const csvWriter = createCsvWriter({path: './output/frequency.csv',
    header: [
        { id: 'englishWord', title: 'English word' },
        { id: 'frenchWord', title: 'French word' },
        { id: 'frequency', title: 'Frequency' }
    ]
});
csvWriter.writeRecords(frequency);

const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
const time = (new Date()-start)/1000;
console.log("Time taken to complete",time,"seconds\nThe script uses approximately",memoryUsed,"MB");

fs.writeFileSync('./output/performance.txt',"Time to process: "+Math.floor(time/60)+" minutes "+Math.round(time%60)+" seconds\nMemory used: "+memoryUsed+" MB");
