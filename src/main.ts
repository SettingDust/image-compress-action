import * as core from '@actions/core'
import {statSync} from 'fs'
import globby from 'globby'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'

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

  for (const file of filePaths) {
    const realQuality: number = quality
      ? quality
      : (minSize / statSync(file).size) * 100
    imagemin([file], {
      destination: 'build/images',
      plugins: [
        imageminMozjpeg({
          quality: Math.floor(realQuality)
        }),
        imageminPngquant({
          quality: [0.0, realQuality / 100]
        })
      ]
    })
      .then(res => outputs.push(res.map(it => it.destinationPath)[0]))
      .catch(reson => console.log(reson))
  }
  core.setOutput('images', outputs.join('\n'))
}

run()
