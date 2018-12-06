const files = require("./utils/files");
const path = require("path");

module.exports = {
  // 检测未使用过的 image
  checkUselessImage: async function(sort, dir) {
    // 获取当前执行路径
    const dirPath = path.join(process.cwd(), dir ? dir : "/");
    const imageList = await files.getImageFiles(dirPath),
      fileList = await files.getSpecificFiles(dirPath, [
        ".wxml",
        ".json",
        "js"
      ]),
      filterList = await files.filterImage(fileList, imageList);

    let resultList = imageList.filter(
      item => !filterList.includes(item.filename)
    );
    sort &&
      (resultList = resultList.sort(function(a, b) {
        return b.size - a.size;
      }));

    return files.formatSize(resultList);
  },
  deleteFiles: filesList => {
    files.destroyFiles(filesList);
  },
  AllFiles: async function(size, sort, dir) {
    const dirPath = path.join(process.cwd(), dir ? dir : "/");
    let fileList = await files.getSpecificFiles(dirPath, [
      ".wxml",
      ".json",
      ".js",
      ".wxss"
    ]);

    fileList.forEach(
      item => (item.path = item.path.replace(process.cwd(), ""))
    );
    sort &&
      (fileList = fileList.sort(function(a, b) {
        return b.size - a.size;
      }));
    let resultList = size
      ? fileList.filter(file => file.size >= size * 1024)
      : fileList;
    return files.formatSize(resultList);
  }
};
