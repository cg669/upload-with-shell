#!/usr/bin/env node

import chalk from 'chalk'
import program, { Command } from 'commander'
import minimist from 'minimist'
// import ora from 'ora'

import Copy from './lib/copy'
import Zip from './lib/zip'
import Upload from './lib/upload'
import cleanArgs from './utils/cleanArgs'

const { version } = require('../package.json')
// const spinner = ora('loading')

//  命令版本号
program.version(chalk.green(version))

//  help命令

program
    .command('help')
    .description(chalk.green('显示使用帮助'))
    .action(function () {
      program.outputHelp()
    })

//  复制命令

program
    .command('copy [dir]')
    .alias('c')
    .description(chalk.green('将打包后的文件夹复制到一个新的文件夹里'))
    .option('-o,--output <dir>','文件存放目录')
    .action((dir: string, cmd: Command) => {
      const options = cleanArgs(cmd)

      if (!dir) {
        console.log('\n')
        console.log(chalk.yellow('提示: 请输入要复制的文件或者文件夹名称，比如 c yourDir'))
        process.exit(0)
      }

      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.yellow('\n 提示: 是不是少加了-o哦'))
        process.exit(0)
      }
      if (!options.output) {
        console.log(chalk.yellow('\n 提示: 请配置输出文件夹地址'))
        process.exit(0)
      }
      Copy(name,options)
    })

//  压缩命令
program
    .command('zip [dir]')
    .description(chalk.green('压缩文件'))
    .alias('z')
    .option('-o,--output <dir>','压缩后的文件名')
    .action((dir: string, cmd: Command) => {
      const options = cleanArgs(cmd)

      if (!dir) {
        console.log('\n')
        console.log(chalk.yellow('提示: 请输入要压缩的文件或者文件夹名称，比如 z yourDir'))
        process.exit(0)
      }

      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log('\n')
        console.log(chalk.yellow('提示: 是不是少加了-o哦'))
        process.exit(0)
      }

      if (!options.output) {
        console.log('\n')
        console.log(chalk.yellow('提示: 如果不填写输出文件名，默认为输入dist.zip,请使用-o name来设置输出文件名'))
      }

      Zip(dir,options)
    })

//  上传命令
program
  .command('upload [path]')
  .alias('u')
  .description(chalk.green('上传的文件'))
  .option('-o,--output <dir>', '上传的地址')
  .action((path: string, cmd: Command) => {
    const options = cleanArgs(cmd)

    if (!path) {
      console.log('\n')
      console.log(chalk.yellow('提示: 请输入要上传的文件或者文件夹名称，比如 u yourDir'))
      process.exit(0)
    }

    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log('\n')
      console.log(chalk.yellow('提示: 是不是少加了-o哦'))
      process.exit(0)
    }

    if (!options.output) {
      console.log('\n')
      console.log(chalk.yellow('提示: 如果不填写上传到的路径，默认为~'))
    }

    Upload(path,options)
  })

//  压缩并且上传
program
  .command('zu [dir]')
  .description(chalk.green('压缩然后上传'))
  .option('-o,--output <dir>','压缩后的文件名')
  .option('-u,--upload <dir>','上传的地址')
  .action((path: string = 'dist', cmd: Command) => {
    const options = cleanArgs(cmd)

    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log('\n')
      console.log(chalk.yellow('提示: 是不是少加了-o哦'))
      process.exit(0)
    }

    if (!options.output) {
      console.log('\n')
      console.log(chalk.yellow('提示: 如果不填写上传到的路径，默认为~'))
    }
    if (!options.output) {
      console.log('\n')
      console.log(chalk.yellow('提示: 如果不填写压缩后的文件名，默认为输入dist.zip'))
    }

    Zip(path,options,() => Upload(options.output || 'dist.zip',options))
  })

// //  生成静态页面命令
// program
//     .command('build [dir]')
//     .description('生成整站静态html')
//     .option('-o,--output <dir>','生成静态html存放目录')
//     .action(require('../lib/cmd_build'))

//  开始解析命令dir
program.parse(process.argv)
