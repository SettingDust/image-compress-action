declare module '@squoosh/lib' {
  class ImagePool {
    constructor(threads?: number)

    /**
     * Ingest an image into the image pool.
     * @param {string | Buffer | URL | object} image - The image or path to the image that should be ingested and decoded.
     * @returns {Image} - A custom class reference to the decoded image.
     */
    ingestImage(image: string | Buffer | URL | object): Image

    /**
     * Closes the underlying image processing pipeline. The already processed images will still be there, but no new processing can start.
     * @returns {Promise<undefined>} - A promise that resolves when the underlying pipeline has closed.
     */
    close(): Promise<undefined>
  }

  interface Image {
    encodedWith: any
    /**
     * Define one or several preprocessors to use on the image.
     * @param {object} preprocessOptions - An object with preprocessors to use, and their settings.
     * @returns {Promise<undefined>} - A promise that resolves when all preprocessors have completed their work.
     */
    preprocess(preprocessOptions: object): Promise<undefined>

    /**
     * Define one or several encoders to use on the image.
     * @param {object} encodeOptions - An object with encoders to use, and their settings.
     * @returns {Promise<undefined>} - A promise that resolves when the image has been encoded with all the specified encoders.
     */
    encode(encodeOptions: object): Promise<undefined>
  }
}
