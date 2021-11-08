const path = require('path')
const {mkdir, readdir, copyFile, rm} = require('fs/promises')

const readCopy = async (pathFrom, pathTo) => {
    mkdir(pathTo, {recursive: true});
    const readFromDir = await readdir(pathFrom, {withFileTypes: 'true'})
    readFromDir.forEach((el) => {
        if (el.isFile()){
                try {
                    copyFile(path.resolve(pathFrom, el.name), path.resolve(pathTo, el.name));
                } catch {
                    console.log(`Error when copying file ${el.name}`);
                }
        }
        else if (el.isDirectory){
            readCopy(path.resolve(pathFrom, el.name), path.resolve(pathTo, el.name))
        }
    })
}

(async function () {
    const filesCopyPath = path.resolve(__dirname, 'files-copy')
    const filesPath = path.resolve(__dirname, 'files')
    await rm(filesCopyPath, { force: true, recursive: true });
    readCopy(filesPath, filesCopyPath)
})()

