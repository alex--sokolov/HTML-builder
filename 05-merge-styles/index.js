const path = require('path');
const fs = require('fs');
const {readdir} = require('fs/promises');

const srcDir = path.resolve(__dirname, 'styles');
const distDir = path.resolve(__dirname, 'project-dist', 'bundle.css');
const ext = 'css';

const getFiles = async (src) => {
    const readFiles = await readdir(src, {withFileTypes: "true"})
    let result = [];
    readFiles.filter(el => el.isFile()).forEach((el) => {
        if (ext === path.extname(el.name).slice(1)) result.push(el.name)
    })
    return result;
}


const getStreamData = (files, src) => {
    let finalData = [];
    return new Promise((res) => {
        for (const file of files) {
            const filesPath = path.resolve(src, file);
            const newStream = fs.createReadStream(filesPath);
            newStream.on('data', data => finalData.push(data));
            newStream.on('end', () => res(finalData))
        }
    })
}


const writeStreamData = async (data, dist) => {
    let bundle = fs.createWriteStream(dist);
    for (const dataPart of data) {
        bundle.write(dataPart, err => {
            if (err) throw err;
        })
    }
}


(async () => {
    const cssFiles = await getFiles(srcDir);
    const data = await getStreamData(cssFiles, srcDir);
    writeStreamData(data, distDir);
})();