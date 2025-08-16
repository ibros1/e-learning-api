declare module "multer-storage-cloudinary" {
  import { UploadApiOptions } from "cloudinary";
  import { StorageEngine } from "multer";

  interface Params extends UploadApiOptions {
    folder?: string;
    public_id?: string;
  }

  interface Options {
    cloudinary: any;
    params?: Params | ((req: any, file: any) => Params);
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: Options);
    _handleFile(req: any, file: any, callback: any): void;
    _removeFile(req: any, file: any, callback: any): void;
  }

  export = CloudinaryStorage;
}
