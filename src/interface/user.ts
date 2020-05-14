export interface IUser {
  host: string,
  username: string,
  password: string,
  serviceUrl: string
}

export type IKey = 'host' | 'username' | 'password' | 'serviceUrl'
