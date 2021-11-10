const path = require('path');
const fs = require('fs');
const {readdir} = require('fs/promises');

const srcDir = path.resolve(__dirname, 'styles');
const distDir = path.resolve(__dirname, 'project-dist', 'bundle.css');
const ext = 'css';

const getFiles = async (src) => {
    let result = [];
    const readFiles = await readdir(src, {withFileTypes: "true"})
    readFiles.filter(el => el.isFile()).forEach((el) => {
        if (ext === path.extname(el.name).slice(1)) result.push(el.name)
    })
    return result;
}

async function getDataFromCurrentFile(file, src)
{
    let dataString = '';
    return new Promise((res) => {
            const filesPath = path.resolve(src, file);
            const newStream = fs.createReadStream(filesPath);
            newStream.on('data', data => dataString += data);
            newStream.on('end', () => res(dataString))
    })
}


const getStreamData = async (files, src) => {
    let finalData = [];
    for (const file of files) {
        finalData.push(await getDataFromCurrentFile(file, src))
    }
    return finalData;
}


const writeStreamData = async (data, dist) => {
    let bundle = await fs.createWriteStream(dist);
    for (const dataPart of data) {
        bundle.write(dataPart, err => {
            if (err) throw err;
        })
    }
}


(async () => {
    const cssFiles = await getFiles(srcDir);
    const data = await getStreamData(cssFiles, srcDir);
    await writeStreamData(data, distDir);
})();