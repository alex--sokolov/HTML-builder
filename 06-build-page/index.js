path = require('path');
fs = require('fs');
const {readdir, rm, mkdir, copyFile} = require('fs/promises');

const templateDir = path.resolve(__dirname, 'template.html');
const componentsDir = path.resolve(__dirname, 'components');
const indexDir = path.resolve(__dirname, 'project-dist');
const indexPath = path.resolve(indexDir, 'index.html');
const cssBundle = path.resolve(indexDir, 'style.css');
const stylesPath = path.resolve(__dirname, 'styles');
const assetsFiles = path.resolve(__dirname, 'assets')
const assetsFilesNew = path.resolve(indexDir, 'assets')


const fileToString = (templateDir) => {
    const stream = fs.createReadStream(templateDir, {encoding: 'utf-8'});
    const chunks = [];
    return new Promise((res, rej) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', (err) => rej(err));
        stream.on('end', () => res(chunks.join('')));
    })
}

const getFiles = async (src) => {
    result = []
    const readFiles = await readdir(src, {withFileTypes: "true"})
    readFiles.filter(el => el.isFile()).forEach((file) => result.push(file.name))
    return result;
}

const getComponents = async (arr, dir) => {
    const allCompFiles = await getFiles(dir);
    return allCompFiles.filter(el => path.extname(el) === '.html').map(el => (path.basename(el, path.extname(el))));
}

const changeTags = async (str, arr, dir) => {
    const componentsArr = await getComponents(arr, dir);
    for (const cName of componentsArr) {
        if (arr.includes(`{{${cName}}}`)) {
            const compPath = path.resolve(componentsDir, cName + '.html');
            const content = await fileToString(compPath);
            str = str.replace(`{{${cName}}}`, content)
        }
    }
    return str;
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

async function removeDirectory(dirPath){
    await rm(dirPath, { force: true, recursive: true });
}

async function makeDirectory(dirPath){
    await mkdir(dirPath, {recursive: true});
}

const readCopy = async (pathFrom, pathTo) => {
    await makeDirectory(pathTo);
    const readFromDir = await readdir(pathFrom, {withFileTypes: 'true'})
    readFromDir.forEach((el) => {
        if (el.isFile()){
            try {
                copyFile(path.resolve(pathFrom, el.name), path.resolve(pathTo, el.name));
            } catch (err) {
                console.log(`Error when copying file ${el.name}`, err);
            }
        }
        else if (el.isDirectory){
            readCopy(path.resolve(pathFrom, el.name), path.resolve(pathTo, el.name))
        }
    })
}

(ENTER____________start____________POINT = async () => {
    /* create index.html */
    const templateStr = await fileToString(templateDir);
    const templateMatchesArray = templateStr.match(/\{\{.*\}\}/g);
    const newTemplateStr = await changeTags(templateStr, templateMatchesArray, componentsDir);
    await removeDirectory(indexDir);
    await makeDirectory(indexDir);
    const writeStream = fs.createWriteStream(indexPath);
    writeStream.write(newTemplateStr);
    /* create styles.css */
    let cssFiles = await getFiles(stylesPath);
    cssFiles = cssFiles.filter(el => path.extname(el) === '.css');
    const data = await getStreamData(cssFiles, stylesPath);
    await writeStreamData(data, cssBundle);
    /* copy assets */
    await removeDirectory(assetsFilesNew);
    await readCopy(assetsFiles, assetsFilesNew)
})()