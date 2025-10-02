export interface IDetailedPhoto {
  /**
   * idPhoto
   * Unique id per file.
   */
  idPhoto: string;
  /**
   * userId
   * User id that saved the file.
   */
  userId?: number;
  /**
   * objectKey
   * string used as a path for retrieving/saving files.
   */
  objectKey: string;
  /**
   * contentType
   * type of the file
   */
  contentType?: string;
  /**
   * size
   * Size of the file
   */
  size?: number;
  /**
   * createdAt
   * Initial file saving date.
   */
  createdAt?: Date;
}

export interface IPhoto {
  idPhoto: string | null;
  previewUrl?: string;
  objectKey?: string;
  file?: File | null;
}
