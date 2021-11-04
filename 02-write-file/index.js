const path = require('path')
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const writeableStream = fs.createWriteStream(path.resolve(__dirname,"writeable.txt"));

const writeDataToFile = data => {
    writeableStream.write(data, err =>{
        if (err) throw err;
    })
}

const exitFunc = () => {
    process.stdout.write('\n\nGood bye!');
    process.exit(0);
}

rl.setPrompt('Enter your text: ');
rl.prompt();

rl.on('line', data => {
    if (data.trim() === 'exit') {
        exitFunc();
    }
    writeDataToFile(data);
    rl.setPrompt('> ')
    rl.prompt();
})

//catch Ctrl+C
rl.on('SIGINT', () => exitFunc());
// another way is to listen process for event 'beforeExit'
// process.on('beforeExit', () => {
//     console.log('\n\n GoodBye!');
// });