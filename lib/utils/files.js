const fs = require('fs')
const image = require("imageinfo");

module.exports = {
    // 获取文件
    readFileList: function(path, filesList) {
        let files = fs.readdirSync(path)
        files = files.filter((item, index) => !['.DS_Store', '.git', '.gitignore'].includes(item))
        files.forEach((itm, index) => {
            const stat = fs.statSync(path + itm)
            if (stat.isDirectory()) {
                //递归读取文件
                this.readFileList(path + itm + "/", filesList)
            } else {
                const obj = {}
                obj.path = path //路径
                obj.filename = itm //名字
                obj.size = stat.size
                obj.modify_time = stat.mtime.toLocaleString()
                filesList.push(obj)
            }
        })
    },
    //获取文件夹下的所有文件
    getFileList: function(path) {
        const filesList = [];
        this.readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function(path) {
        const imageList = [];
        this.getFileList(path).forEach((item) => {
            const ms = image(fs.readFileSync(item.path + item.filename));
            ms.mimeType && (imageList.push(item))
        });
        return imageList;
    },
    // 获取特定后缀文件
    getSpecificFiles: function(path, extension) {
        const fileList = []
        this.getFileList(path).forEach(item => {
            Array.isArray(extension) ?
                extension.some(ext => item.filename.endsWith(ext)) && fileList.push(item) :
                item.filename.endsWith(extension) && fileList.push(item)
        })
        return fileList
    },
    // 过滤使用过的 image
    filterImage: function(fileList, imageList) {
        const tmpImage = []
        fileList.forEach((item, index) => {
            const data = fs.readFileSync(item.path + item.filename, { flag: 'r', encoding: 'utf8' })
            imageList.forEach(image => {
                data.includes(image.filename) && !tmpImage.includes(image.filename) && tmpImage.push(image.filename)
            })
        })
        return tmpImage
    },
    // 删除文件
    destroyFiles: function(options) {
        switch (options.constructor) {
            case Array:
                // options.forEach(file => fs.unlinkSync(file.path + file.filename))
                console.log('array')
                const file = options[0]
                fs.unlinkSync(file.path + file.filename)
                break;
            case String:
                console.log('string')
                fs.unlinkSync(options)
                break;
            case Object:
                console.log('object')
                fs.unlinkSync(options.path + options.filename)
                break;
            default:
                console.log()
        }
    },
    formatSize: (fileList) => {
        fileList.forEach(file => {
            file.size = file.size > 1024 ? `${(Number(file.size) / 1024).toFixed(2)}KB` : `${file.size}B`
        })
        return fileList
    }
}