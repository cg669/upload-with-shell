
import fs from 'fs'
import chalk from 'chalk'
import { Client } from 'ssh2'
import readline from 'readline'
import { join } from '../utils'

import { IUser } from '../interface/user'
import { IUploadParams,OptionsB } from '../interface/options'

// console.log(user);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let user: IUser = {
  host: '10.128.**.**',
  username: '',
  password: ''
}

let params: IUploadParams = {
  file: ``,
  target: ``
}
/**
 * 上传完成后服务器需要执行的内容
 * 删除本地压缩文件
 * @param conn
 * @constructor
 */
function Shell (conn: any) {
  conn.shell(function (err: any, stream: any) {
    if (err) throw err
    stream.on('close', function () {
      console.log(chalk.green('上传服务器成功'))
      conn.end()
      if (params.file) {
        fs.unlinkSync(params.file)
      }
      process.exit(0)
    }).on('data', function (data: string) {
      console.log(chalk.yellow(`正在上传：${data}`))
    }).stderr.on('data', function (data: string) {
      console.log(chalk.red(`上传失败：${data}`))
    })
    const uploadShellList = [
      `cd ~\n`,
      `rm -rf ${params.file.substring(0,params.file.lastIndexOf('.'))}\n`,
      `unzip ${params.file}\n`,
      `rm -rf ${params.file}\n`,
      `exit\n`
    ]
    stream.end(uploadShellList.join(''))
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
function Ready () {
  let conn = new Client()
  if (user.password && user.host && user.username) {
    Publish(conn, user)
  } else {
    rl.question(chalk.green(`输入服务器地址:`), host => {
      if (host) {
        user.host = host
        rl.question(chalk.green(`发布至服务器 ${user.host} 请输入服务账户:`), userName => {
          if (userName) {
            user.username = userName.replace(/\r\n$/, '')
            rl.question(chalk.green(`发布至服务器 ${user.host} 请输入服务器密码:`), password => {
              if (password) {
                user.password = password.replace(/\r\n$/, '')
                Publish(conn, user)
              }
            })
          }
        })
      }
    })

  }
}

export default function upload (zipName: string, options: OptionsB,cb?: any) {
  try {

    let configSrc = join('./uws-config.js')
    console.log(configSrc)
      // tslint:disable-next-line: deprecation
    fs.exists(configSrc, function (exists) {
      params = {
        file: zipName,
        target: `${ options.output}/${zipName}`
      }
      if (exists) {
        const myUser = require(configSrc)()
        user.host = myUser.host
        user.username = myUser.username
        user.password = myUser.password

      }
      params.target = `/home/${ user.username }/${zipName}`
      Ready()
    })
  } catch (err) {
    console.log(err)
  }
}
