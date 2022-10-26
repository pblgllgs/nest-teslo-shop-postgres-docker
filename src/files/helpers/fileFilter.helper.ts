export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  if (!file) return callback(new Error('file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = process.env.EXTENSIONS_FILE_ACCEPTED;
  if (validExtension.includes(fileExtension)) {
    return callback(null, true);
  }
  console.log({ file });

  callback(null, false);
};
