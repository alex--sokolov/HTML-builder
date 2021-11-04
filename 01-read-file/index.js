const path = require('path');
// const stream = require('stream');
const fs = require('fs');
const process = require('process');


// console.log('Название файла: ', path.basename(__dirname), '/',  path.basename(__filename));
// path.delimiter = '__';
// console.log('Резделитель: ', path.delimiter);
// path.delimiter = ';';
// console.log('Абсолютный путь до места запуска: ', path.dirname(__dirname));
// console.log('absolute path of the directory containing the currently executing file: ',__dirname);
// console.log('absolute path of the currently executing file: ',__filename);
// console.log('absolute path of the text.txt: ',__dirname + '\\text.txt');
// console.log('absolute path of the text.txt: ',
//     path.join(__dirname,'text.txt'));
const newPath = path.join(__dirname,'text.txt');
const newStream = new fs.ReadStream(newPath, {encoding: 'utf-8'}); // {encoding: 'utf-8'} === 'utf-8'
newStream.on('readable', function(){                 // on === addListener
    let data = newStream.read();
    if(data != null) process.stdout.write(data);//console.log(data);
});

// newStream.on('end', function(){
//     console.log("THE END");
// });

newStream.on('error', function(err){
    if(err.code == 'ENOENT'){
        console.log("Файл не найден");
    }else{
        console.error(err);
    }
});


// //  Another way:
// const anotherStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));
// anotherStream.on('data', (data) => { console.log(data.toString()); });