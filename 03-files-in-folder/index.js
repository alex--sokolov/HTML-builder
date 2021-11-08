const path = require('path');
const {readdir, stat} = require('fs/promises');

const filesPath = path.resolve(__dirname, 'secret-folder');
// console.log(filesPath);

readdir( filesPath, {withFileTypes: 'true'}).then(res => {
    let resultFiles = res.filter((el) => el.isFile());
    // console.log(resultFiles);
    resultFiles.forEach(el => {
        getResultFilesInfo(el.name);
    });
});

const getResultFilesInfo = async (fileName) => {
    const fileExt = path.extname(fileName);
    const fileNameWithoutExt = path.basename(fileName, fileExt);
    const fileInfo = await stat(path.resolve(filesPath, fileName))
    // console.log(fileInfo);
    const fileVol = fileInfo.size;
    // console.log(fileInfo.size);
    console.log(`${fileNameWithoutExt} - ${fileExt.slice(1)} - ${fileVol/1024}Kb`);
}