declare module 'imagemin-jpegoptim' {
  import {Plugin} from 'imagemin'

  export default function imageminJpegoptim(options?: Options): Plugin

  export interface Options {
    stripAll?: boolean
    stripCom?: boolean
    stripExif?: boolean
    stripIptc?: boolean
    stripIcc?: boolean
    stripXmp?: boolean
    size?: number | string
    /**
    @example [0.3, 0.5]
   */
    max?: number
    progressive?: boolean
  }
}
