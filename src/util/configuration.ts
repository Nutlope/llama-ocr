import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

export const getOsType = (): 'unix' | 'windows' => {
  return process.platform === 'win32' ? 'windows' : 'unix'
}

export const getHomeDirectory = (): string => {
  const osType = getOsType()
  return osType === 'windows' ? 'USERPROFILE' : 'HOME'
}

export const getConfigurationFilePath = () => {
  const home = getHomeDirectory()
  return `${process.env[home]}/.llamaocr.json`
}

export const fetchConfig = async (): Promise<any> => {
  const path = getConfigurationFilePath()
  if (!existsSync(path)) {
    await writeFile(path, '{}', 'utf8')
  }

  return JSON.parse(await readFile(path, 'utf8'))
}

export const writeConfig = async (
  config: string
): Promise<void> => {
    const path = getConfigurationFilePath()
    await writeFile(path, JSON.stringify(config, null, 2), 'utf8')
}
