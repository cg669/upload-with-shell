
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { join } from '../utils'

import { OptionsB } from '../interface/options'

function writeFile (p: string, text: string) {
  fs.writeFile(p, text, (err: any) => {
    if (!err) {
      console.log('写入成功！')
    }
  })
}

// 递归创建目录 同步方法
function mkdirsSync (dirname: string) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

function _copy (src: string, dist: string) {
  let paths = fs.readdirSync(src)
  paths.forEach(function (p: string) {
    let _src = src + '/' + p
    let _dist = dist + '/' + p
    let stat = fs.statSync(_src)
    if (stat.isFile()) {// 判断是文件还是目录
      fs.writeFileSync(_dist, fs.readFileSync(_src))
    } else if (stat.isDirectory()) {
      copyDir(_src, _dist)// 当是目录是，递归复制
    }
  })
}

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir (src: string, dist: string) {
  let b = fs.existsSync(dist)
  if (!b) {
    mkdirsSync(dist)// 创建目录
  }
  _copy(src, dist)
}

function createDocs (src: string, dist: string, callback?: any) {
  copyDir(src, dist)
  console.log(chalk.green('\n复制完毕'))
  if (callback) {
    callback()
  }
}

export default (fromPath: string, options: OptionsB,cb?: any) => {
  try {
    createDocs(join(fromPath), join(options.output),cb)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}
