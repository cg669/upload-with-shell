import path from 'path'

type IType = 'cwd' | 'dirname' | 'resolve'

export function join (joinPath: string, type: IType = 'cwd') {
//   console.log(type,'type')
  switch (type) {
    case 'cwd':
      return path.join(process.cwd(), joinPath)
    case 'dirname':
      return path.join(__dirname, '../../',joinPath)
    case 'resolve':
      return path.join(path.resolve(), joinPath)
    default:
      return path.join(process.cwd(), joinPath)

  }
}
