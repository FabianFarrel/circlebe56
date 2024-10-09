import { v2 as cloudinary } from "cloudinary";

class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: 'ddpxi6wyh', 
            api_key: '589469279618447', 
            api_secret: 'g6yTUeO77Vc2sYOHv0NxomRKU4g'
        });
    }
    async upload(file: Express.Multer.File) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        return await cloudinary.uploader.upload(dataURI, {
            folder: "stage2_circle"
        });
    }
}

export default new CloudinaryService();