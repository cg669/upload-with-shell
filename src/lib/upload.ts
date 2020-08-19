
import fs from 'fs'
import chalk from 'chalk'
import { Client } from 'ssh2'
import readlineSync from 'readline-sync'
import { join } from '../utils'

import { IUser,IKey } from '../interface/user'
import { IUploadParams, OptionsB } from '../interface/options'

// import executeSequentially from '../utils/executeSequentially'

let isHide = true

const questionMap = Object.freeze({
  host: '输入服务器地址:',
  username: '请输入服务账户:',
  password: '请输入账户密码:',
  serviceUrl: '请输入发送到的服务器路径:'

})
// // console.log(user);
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

let user: IUser = {
  host: '',
  username: '',
  password: '',
  serviceUrl: ''
}

let params: IUploadParams = {
  file: ``,
  target: ``
}

function Done (err: string, file: string) {
  if (err) {
    console.log(chalk.red(err))
    process.exit(0)
  }
  console.log(chalk.green('上传服务器成功'))
  if (file) {
    // fs.unlinkSync(file)
  }
  process.exit(0)
}
/**
 * 上传完成后服务器需要执行的内容
 * 删除本地压缩文件
 * @param conn
 * @constructor
 */
function Shell (conn: any) {
  conn.shell((err: any, stream: any) => {
    if (err) throw err
    stream
      .on('close', () => {
        console.log(chalk.green('上传服务器成功'))
        conn.end()
        if (params.file) {
          fs.unlinkSync(params.file)
        }
        process.exit(0)
      })
      .on('data', (data: string) => {
        console.log(chalk.yellow(`${data}`))
      })
      .stderr.on('data', (data: string) => console.log(chalk.red(`上传失败：${data}`)))

    let dirName = params.file.substring(0,params.file.lastIndexOf('.'))
    const uploadShellList = [
      `cd ~`,
      `rm -rf ${dirName}`,
      `unzip ${params.file}`,
      `rm -rf ${params.file}`,
      // `cd ${user.serviceUrl}`,
      // `sudo rm -rf ${dirName}`,
      // `sudo mv ~/${dirName} .`,
      `exit`
    ]

    stream.end(uploadShellList.join('\r\n'))
  })
}
/**
 * 上传文件
 * @param conn
 * @param params
 * @constructor
 */
function UploadFile (conn: any) {
//   console.log(params)
  const file = params.file
  const target = params.target
  if (!conn) {
    return
  }
  conn.sftp(function (err: any, sftp: any) {
    if (err) {
      console.log(chalk.red(err.message))
      process.exit(0)
    }
    sftp.fastPut(file, target, {}, function (err: any, result: any) {
      if (err) {
        console.log(chalk.red(err.message))
        process.exit(0)
      }
      Shell(conn)
    })
  })
}

function Publish (conn: any, user: IUser) {
  conn.on('ready', function () {
    console.log('Client :: ready')
    UploadFile(conn)
  }).connect(user)
}

function Question (key: IKey): any {
  const question = key === 'host' ? questionMap[key] : `发布至服务器 ${user.host} ${questionMap[key]}`
  return new Promise((resolve, reject) => {
    let word = readlineSync.question(chalk.green(question), {
      hideEchoBack: isHide,
      mask: chalk.magenta('\u2665')
    })
    if (word) {
      user[key] = word.replace(/\r\n$/, '')
      resolve()
    } else {
      console.log(chalk.yellow('请输入内容'))
      Question(key)
    }
  })
}

function executeSequentially (promiseFactories: IKey[]) {
  let result = Promise.resolve()
  promiseFactories.forEach(key => Question(key))
  return result
}

function changeIsHideWord (fn: Function) {
  let answer = readlineSync.question('是否隐藏输入内容? ', {
    trueValue: ['yes', 'yeah', 'yep'],
    falseValue: ['no', 'nah', 'nope']
  })
  if (answer === true) {
    console.log(chalk.green('当前输入为明文'))
    isHide = answer
    fn()
  } else if (answer === false) {
    console.log(chalk.green('当前输入为暗文'))
    isHide = answer
    fn()
  } else {
    console.log(chalk.yellow(`${answer}是啥意思？你可以选择yes or no`))
    changeIsHideWord(fn)
  }
}

function Ready () {
  let conn = new Client()

  //  过滤出来没有值的数据
  const emptyKeys: Array<IKey> = []
  //  filter的时候会有类型错误
  Object.keys(user).forEach((key: string) => {
    //  需要投射下类型
    let myKey: IKey = key as IKey
    if (!user[myKey]) {
      emptyKeys.push(myKey)
    }
  })

  console.log(emptyKeys)
  if (emptyKeys.length === 0) {
    //  都有值了
    Publish(conn, user)
  } else {
    changeIsHideWord(() => executeSequentially(emptyKeys).then(() => Publish(conn, user)))
  }
}

export default function upload (zipName: string, options: OptionsB,cb?: any) {
  try {

    let configSrc = join('./uws-config.js')
    fs.stat(zipName, (err, stat) => {
      if (err) {
        console.log('\n')
        console.log(chalk.red('目标路径不存在，请检查是否输入地址有误'))
        process.exit(0)
      }
      // tslint:disable-next-line: deprecation
      fs.exists(configSrc, function (exists) {
        params = {
          file: zipName,
          target: `${options.upload}/${zipName}`
        }
        if (exists) {
          const myUser = require(configSrc)()
          user.host = myUser.host
          user.username = myUser.username
          user.password = myUser.password
          user.serviceUrl = myUser.serviceUrl
        }
        params.target = `/home/${user.username}/${zipName}`
        Ready()
      })
    })
  } catch (err) {
    console.log(err)
  }
}
