import * as core from '@actions/core'
import {statSync, writeFileSync} from 'fs'
import globby from 'globby'
import {ImagePool} from '@squoosh/lib'
import * as path from 'path'

async function run(): Promise<void> {
  const files: string = core.getInput('files')
  const quality: number | undefined =
    parseInt(core.getInput('quality')) || undefined
  const minSize: number = parseInt(core.getInput('min-size'))

  let fileArray = files.split('\n')
  if (minSize) {
    fileArray = fileArray.filter(it => statSync(it).size > minSize)
  }

  const filePaths = await globby(fileArray, {onlyFiles: true})
  const outputs: string[] = []
  const imagePool: ImagePool = new ImagePool()

  for (const fileName of filePaths) {
    const file = path.resolve(__dirname, fileName)
    const realQuality: number = quality
      ? quality
      : (minSize / statSync(file).size) * 100
    const image = imagePool.ingestImage(file)
    image
      .encode({
        mozjpeg: {
          quality: realQuality
        }
      })
      .then(async () => {
        const encodedImage = await image.encodedWith['mozjpeg']
        const filename =
          file.slice(0, file.lastIndexOf('.') + 1) +
          (await encodedImage).extension
        writeFileSync(filename, (await encodedImage).binary)
        outputs.push(filename)
        core.setOutput('images', outputs.join('\n'))
      })
      .catch(reson => console.log(reson))
  }
}
