const files = require('./utils/files')
    // const config = require('../config')

module.exports = {
    // 检测未使用过的 image
    checkUselessImage: async function(sort) {
        // 获取当前执行路径
        const path = process.cwd() + '/'
        const imageList = await files.getImageFiles(path),
            fileList = await files.getSpecificFiles(path, ['.wxml', '.json', 'js']),
            filterList = await files.filterImage(fileList, imageList)

        let resultList = imageList.filter(item => !filterList.includes(item.filename))
        sort && (resultList = resultList.sort(function(a, b) { return b.size - a.size }))

        return files.formatSize(resultList)
    },
    deleteFiles: (filesList) => {
        files.destroyFiles(filesList)
    },
    AllFiles: async function(size, sort) {
        const path = process.cwd() + '/'
        let fileList = await files.getSpecificFiles(path, ['.wxml', '.json', '.js', '.wxss'])

        fileList.forEach(item => item.path = item.path.replace(process.cwd(), ''))
        sort && (fileList = fileList.sort(function(a, b) { return b.size - a.size }))
        let resultList = size ? fileList.filter(file => file.size >= size * 1024) : fileList
        return files.formatSize(resultList)
    }
}