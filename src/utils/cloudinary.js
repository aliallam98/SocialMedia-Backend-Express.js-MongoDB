import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../config/.env') })
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    api_key: process.env.api_key ?? '172181411358383',
    api_secret: process.env.api_secret ?? 'SSc-DTufyIwZY-6Y8GRpjcmDhmo',
    cloud_name: process.env.cloud_name ?? 'dgwaqs0i8',
    secure: true
})

export default cloudinary.v2;