import { extname } from 'path';

export const editFileName = (req, file, cb) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = (today.getMonth() + 1).toString(); // Months start at 0!
  let dd = today.getDate().toString();

  if (parseInt(dd) < 10) dd = '0' + dd;
  if (parseInt(mm) < 10) mm = '0' + mm;

  const dateStamp = dd + '-' + mm + '-' + yyyy;
  cb(null, `${dateStamp}.${name}${fileExtName}`);
};

export const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
   
    req.nitesh = true;
    return cb(null, false);
  }


  return cb(null, true);
};
