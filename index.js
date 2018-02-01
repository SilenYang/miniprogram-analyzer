#! /usr/bin/env node

const path = require('path')
const program = require('commander')
const ora = require('ora')
const fs = require('fs')
const chalk = require('chalk')
const table = require('painting-table')
const { checkUselessImage, deleteFiles, AllFiles } = require('./lib/wx_tools')

program
    .version('0.0.1')
    .usage('<cmd> [options]')

program
    .command('image_check')
    .alias('image')
    .option('-d, --delete', '删除查找出来的图片(谨慎使用)')
    .option('-s, --sort', '按文件大小进行排序')
    .description('查找没有使用过的图片')
    .action(function(options) {
        const spinner = ora('checking...')
        spinner.start()
        checkUselessImage(options.sort).then(res => {
            /* 
                [{
                    path: '',  文件路径
                    filename: '', 文件名称
                    size: 0, 文件大小
                    modify_time: '' 上次修改日期
                }]
            */
            spinner.stop()
            options.delete && deleteFiles(res)
            table(res, { filename: true, size: true, modify_time: false })
        })
    }).on('--help', function() {
        console.log()
        console.log('  Examples:')
        console.log()
        console.log('    $ deploy image_check|image')
        console.log('    $ deploy image_check|image -s -d')
        console.log()
    });

program
    .command('check')
    .option('-s, --size <num>', '按文件大小进行筛选(kb)')
    .option('--sort', '按文件大小排序')
    .description('显示所有文件信息，除了图片')
    .action(function(options) {
        const spinner = ora('checking...')
        spinner.start()
        AllFiles(options.size, options.sort).then(res => {
            spinner.stop()
            table(res, { filename: true, size: true, path: true })
        })
    }).on('--help', function() {
        console.log()
        console.log('  Examples:')
        console.log()
        console.log('    $ deploy check')
        console.log('    $ deploy check -s 2 --sort')
        console.log()
    });

program
    .command('*')
    .action((env) => {
        console.error(chalk.red(`不存在命令: "${env}"`));
    });

program.parse(process.argv);