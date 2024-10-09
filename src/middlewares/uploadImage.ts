import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
upload.fields([{ name: 'image' }, { name: 'background' }])

export default upload;