import * as core from '@actions/core'
import {statSync} from 'fs'
import * as path from 'path'
import globby from 'globby'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import sharp from 'sharp'
import {imageSize} from 'image-size'

async function compress(
  source: string,
  quality: number,
  size: number
): Promise<string> {
  if (statSync(path.resolve(source)).size < size) return source

  const result = await imagemin([source], {
    destination: 'build/images',
    plugins: [
      imageminMozjpeg({
        progressive: false,
        quality
      }),
      imageminPngquant({
        quality: [0.0, quality / 100]
      })
    ]
  })

  return compress(result[0].destinationPath, quality - 1, size)
}

async function run(): Promise<void> {
  const files: string = core.getInput('files')
  const quality: number | undefined =
    parseInt(core.getInput('quality')) || undefined
  const minSize: number = parseInt(core.getInput('min-size'))
  const maxDimension: number = parseInt(core.getInput('max-dimension'))

  let fileArray = files.split('⭐')
  core.info(`输入文件：${fileArray}`)
  fileArray = fileArray.map(it => path.resolve(it))

  const filePaths = await globby(fileArray, {onlyFiles: true})
  const outputs: string[] = []

  for (let file of filePaths) {
    const size = statSync(file).size
    const realQuality: number = quality ? quality : (minSize / size) * 100
    const dimension = imageSize(file)
    core.info(`正在处理：${file}`)
    core.info(` 压缩前大小：${size / 1024} KB`)
    core.info(` 压缩前尺寸 ：${dimension.width} x ${dimension.height}`)

    if (
      maxDimension &&
      dimension.width &&
      dimension.height &&
      (dimension.height > maxDimension || dimension.width > maxDimension)
    ) {
      const result = await sharp(file)
        .resize(maxDimension, maxDimension, {
          fit: 'inside'
        })
        .toFile((file += '.resized.jpg'))
      core.info(` 压缩后尺寸 ：${result.width} x ${result.height}`)
    }

    if (size > minSize) {
      core.info(`质量：${realQuality}`)
      file = await compress(file, realQuality, minSize)
      core.info(` 压缩后大小：${statSync(path.resolve(file)).size / 1024} KB`)
    }
    outputs.push(file)
  }
  core.setOutput('images', outputs.join('⭐'))
}

run()
