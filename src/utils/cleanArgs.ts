
import { Command, Option } from 'commander'
import { OptionsB } from '../interface/options'
import camelize from './camelize'
function cleanArgs (cmd: Command): OptionsB {
  const args: any = {}
  cmd.options.forEach((o: Option) => {
    const key = camelize(o.long.replace(/^--/, ''))
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
export default cleanArgs
