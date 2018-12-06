#! /usr/bin/env node

const program = require("commander");
const ora = require("ora");
const fs = require("fs");
const chalk = require("chalk");
const table = require("painting-table");
const { checkUselessImage, deleteFiles, AllFiles } = require("./lib/wx_tools");

program.version("0.0.1").usage("<cmd> [options]");

program
  .command("image_check")
  .alias("image")
  .option("-D, --delete", "删除查找出来的图片(谨慎使用)")
  .option("-S, --sort", "按文件大小进行排序")
  .option("-P, --path <path>", "指定检查路径，默认为当前目录")
  .description("查找没有使用过的图片")
  .action(function(options) {
    const spinner = ora("checking...");
    spinner.start();
    checkUselessImage(options.sort, options.path).then(res => {
      /* 
        [{
          path: '',  文件路径
          filename: '', 文件名称
          size: 0, 文件大小
          modify_time: '' 上次修改日期
        }]
      */
      spinner.stop();
      options.delete && deleteFiles(res);
      res.forEach(item => (item.path = item.path.replace(process.cwd(), "")));
      const option = {
        excludes: [],
        includes: {
          filename: true,
          size: true,
          path: true,
          modify_time: false
        },
        rename: {}
      };
      const str = table(res, option);
      console.log(str);
    });
  })
  .on("--help", function() {
    console.log();
    console.log("  Examples:");
    console.log();
    console.log("    $ deploy image_check|image");
    console.log("    $ deploy image_check|image -S -D");
    console.log();
  });

program
  .command("check")
  .option("-S, --size <num>", "按文件大小进行筛选(kb)")
  .option("--sort", "按文件大小排序")
  .option("-P, --path <path>", "指定检查路径，默认为当前目录")
  .description("显示所有文件信息，除了图片")
  .action(function(options) {
    const spinner = ora("checking...");
    spinner.start();
    AllFiles(options.size, options.sort, options.path).then(res => {
      spinner.stop();
      const option = {
        excludes: [],
        includes: { filename: true, path: true, size: true },
        rename: {}
      };
      const str = table(res, option);
      console.log(str);
    });
  })
  .on("--help", function() {
    console.log();
    console.log("  Examples:");
    console.log();
    console.log("    $ deploy check");
    console.log("    $ deploy check -S 2 --sort");
    console.log();
  });

program.command("*").action(env => {
  console.error(chalk.red(`不存在命令: "${env}"`));
});

program.parse(process.argv);
