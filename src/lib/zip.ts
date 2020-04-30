import fs from 'fs'
import archiver from 'archiver'
import chalk from 'chalk'
import ora from 'ora'

import { OptionsA } from '../interface/options'

export default function Zip (fromPath: string, options: OptionsA, cb?: any) {

  try {
    const _src = fromPath

    console.log(_src)

    let stat = fs.statSync(_src)

    let outputName = `${options.name || 'dist'}.zip`

    console.log(chalk.cyan('开始压缩\n'))

    const spinner = ora('正在压缩...\n')

    spinner.start()

    let output = fs.createWriteStream(outputName)

    let archive = archiver('zip')

    output.on('close', function () {
      console.log(chalk.cyan(''))
      console.log(chalk.cyan('压缩完毕\n'))
      spinner.stop()
      if (cb) {
        cb()
      }
    })

    archive.on('error', function (err: any) {
      throw err
    })

    archive.pipe(output)

    if (stat.isFile()) {// 判断是文件还是目录
      archive.glob(_src)
    } else {
      archive.glob(_src + '/**')
    }
    archive.finalize()
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}
