import * as core from '@actions/core'
import {statSync} from 'fs'
import * as path from 'path'
import globby from 'globby'
import imagemin from 'imagemin'
import imageminJpegoptim from 'imagemin-jpegoptim'
import imageminPngquant from 'imagemin-pngquant'

async function run(): Promise<void> {
  const files: string = core.getInput('files')
  const quality: number | undefined =
    parseInt(core.getInput('quality')) || undefined
  const minSize: number = parseInt(core.getInput('min-size'))

  let fileArray = files.split('⭐')
  console.log(`输入文件：${fileArray}`)
  if (minSize) {
    fileArray = fileArray
      .map(it => path.resolve(it))
      .filter(it => statSync(it).size > minSize)
  }

  const filePaths = await globby(fileArray, {onlyFiles: true})
  const outputs: string[] = []

  for (const file of filePaths) {
    const size = statSync(file).size
    const realQuality: number = quality ? quality : (minSize / size) * 100
    console.log(`正在处理：${file}`)
    console.log(`压缩前大小：${size / 1024} KB`)
    console.log(`质量：${realQuality}`)

    const result = await imagemin([file], {
      destination: 'build/images',
      plugins: [
        imageminJpegoptim({
          size: minSize,
          progressive: false
        }),
        imageminPngquant({
          quality: [0.0, realQuality / 100]
        })
      ]
    })
    const destination = result[0].destinationPath
    console.log(
      `压缩后大小：${statSync(path.resolve(destination)).size / 1024} KB`
    )
    outputs.push(destination)
  }
  core.setOutput('images', outputs.join('⭐'))
}

run()
