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
    .description(chalk.green('将打包后的文件夹复制到一个新的文件夹里'))
    .option('-o,--output <dir>','文件存放目录')
    .action((name: string, cmd: Command) => {
      const options = cleanArgs(cmd)

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
    .option('-n,--name <dir>','压缩后的文件名')
    .action((name: string, cmd: Command) => {
      const options = cleanArgs(cmd)

      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.yellow('\n 提示: 是不是少加了-o哦'))
        process.exit(0)
      }

      if (!options.name) {
        console.log(chalk.yellow('\n 提示: 如果不填写输出文件名，默认为输入dist.zip'))
      }

      Zip(name,options)
    })

//  上传命令
program
.command('upload [name]')
.description(chalk.green('上传的文件名'))
.option('-o,--output <dir>','上传的地址')
.action((name: string, cmd: Command) => {
  const options = cleanArgs(cmd)

  if (minimist(process.argv.slice(3))._.length > 1) {
    console.log(chalk.yellow('\n 提示: 是不是少加了-o哦'))
    process.exit(0)
  }

  if (!options.output) {
    console.log(chalk.yellow('\n 提示: 如果不填写上传到的路径，默认为~'))
  }

  Upload(name,options)
})

//  压缩并且上传
program
.command('zu [dir]')
.description(chalk.green('压缩然后上传'))
.option('-n,--name <name>','压缩后的文件名')
.option('-o,--output <dir>','上传的地址')
.action((path: string, cmd: Command) => {
  const options = cleanArgs(cmd)

  if (minimist(process.argv.slice(3))._.length > 1) {
    console.log(chalk.yellow('\n 提示: 是不是少加了-o哦'))
    process.exit(0)
  }

  if (!options.output) {
    console.log(chalk.yellow('\n 提示: 如果不填写上传到的路径，默认为~'))
  }
  if (!options.name) {
    console.log(chalk.yellow('\n 提示: 如果不填写输出文件名，默认为输入dist.zip'))
  }
  Zip(path,options,() => Upload(options.name || 'dist.zip',options))
})

// //  生成静态页面命令
// program
//     .command('build [dir]')
//     .description('生成整站静态html')
//     .option('-o,--output <dir>','生成静态html存放目录')
//     .action(require('../lib/cmd_build'))

//  开始解析命令dir
program.parse(process.argv)
