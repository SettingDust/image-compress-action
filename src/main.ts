import * as core from '@actions/core'
import {statSync} from 'fs'
import * as path from 'path'
import globby from 'globby'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'

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
        quality: quality
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

    const result = await compress(file, realQuality, minSize)

    console.log(`压缩后大小：${statSync(path.resolve(result)).size / 1024} KB`)
    outputs.push(result)
  }
  core.setOutput('images', outputs.join('⭐'))
}

run()
