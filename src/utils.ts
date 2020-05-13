import uuid from 'uuid/v4'
import path from 'path'

export function newId (): string {
  return uuid()
}

export function homeDir (): string {
  const platform = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME'
  return path.resolve(process.env[platform] as string)
}