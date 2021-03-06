# miniprogram-analyzer

a command-line tools for WeChat miniprogram to analyze your project

# install

```js
npm install miniprogram-analyzer -g
```

# usage

安装完成后可在相应的小程序目录使用`wma`命令开始分析你的项目

目前仅有两个功能：分析文件和查找项目中未使用的图片(仅做参考)

### 分析文件

```js
wma check [option]

option:
    -S, --size  按文件大小进行筛选,单位为KB
    --sort      按文件大小排序(降序)
    -P, --path  指定检查路径，默认为当前目录
```

![check](./images/check.jpg)

![check](./images/check_filter.jpg)

### 查找图片

```js
wma image_check|image [option]

option:
    -S, --sort      按文件大小进行排序(降序)
    -D, --delete    查找图片并删除(谨慎使用)
    -P, --path  指定检查路径，默认为当前目录
```

![image](./images/image.jpg)

![image_filter](./images/image_filter.jpg)

# LICENSE

MIT
