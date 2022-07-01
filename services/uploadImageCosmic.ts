import multer from "multer";
import cosmicjs from "cosmicjs";

//pegamos as variaveis de ambiente do .env
const {
    AVATARS_RECORDING_KEYS,
    BUCKET_AVATARS,
    PUBLICATIONS_RECORDING_KEYS,
    BUCKET_PUBLICATIONS
} = process.env;

//criamos uma instancia do cosmicjs
const Cosmic = cosmicjs();

// e com essa instacia criamos os dois buckts necessários, de avats e publications.
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARS,
    write_key: AVATARS_RECORDING_KEYS
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICATIONS,
    write_key: PUBLICATIONS_RECORDING_KEYS
});

//criamos o nosso storage através do multer e dizemos qual iremos usar, nesse caso o armazenamento em memoria storage.
const storage = multer.memoryStorage();

// // criamos o nosso multer em cima do nosso storage
const upload = multer({ storage: storage });

// Aqui criamos nossa regra de negocio. Para subir nossos objetos para o servidor do cosmic.
const uploadImageCosmic = async (req: any) => {

    // se na nossa requisição vier um arquivo e esse arquivo tiver um nome
    if (req?.file?.originalname) {

        if (!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') &&
            !req.file.originalname.includes('.jpeg')) {
            throw new Error('Extensao da imagem invalida');
        }

        // vou criar um objeto que o cosmic espera
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        // checo a minha url da requisição, se for de puclications, salvamos no bucket respectivo
        if (req.url && req.url.includes('publications')) {
            return await bucketPublicacoes.addMedia({ media: media_object });

            //se não, salvamos no outro
        } else {
            return await bucketAvatares.addMedia({ media: media_object });
        }
    }
}

export { upload, uploadImageCosmic };
