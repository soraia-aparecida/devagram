import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    AVATARS_RECORDING_KEYS, 
    BUCKET_AVATARS,
    PUBLICATIONS_RECORDING_KEYS,
    BUCKET_PUBLICATIONS } = process.env;

const Cosmic = cosmicjs();
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARS,
    write_key: AVATARS_RECORDING_KEYS
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICATIONS,
    write_key: PUBLICATIONS_RECORDING_KEYS
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImageCosmic = async (req: any) => {
    if (req?.file?.originalname) {

        if (!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') &&
            !req.file.originalname.includes('.jpeg')) {
            throw new Error('Extensao da imagem invalida');
        }

        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        if (req.url && req.url.includes('publications')) {
            return await bucketPublicacoes.addMedia({ media: media_object });
        } else {
            return await bucketAvatares.addMedia({ media: media_object });
        }
    }
}

export { upload, uploadImageCosmic };
