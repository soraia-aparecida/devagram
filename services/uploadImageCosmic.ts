// import multer from "multer";
// import cosmicjs from 'cosmicjs';
// import dotenv from 'dotenv';

// dotenv.config()

// //pegamos as variaveis de ambiente do .env
// const { AVATARS_RECORDING_KEYS,
//     BUCKET_AVATARS,
//     PUBLICATIONS_RECORDING_KEYS,
//     BUCKET_PUBLICATIONS } = process.env;

// //criamos uma instancia do cosmicjs
// const Cosmic = cosmicjs();

// //console.log("aqui")
// // e com essa instacia criamos os dois buckts necessários, de avats e publications.
// const bucketAvatars = Cosmic.bucket({
//     slug: BUCKET_AVATARS,
//     write_key: AVATARS_RECORDING_KEYS
// });
// const bucketPublications = Cosmic.bucket({
//     slug: BUCKET_PUBLICATIONS,
//     write_key: PUBLICATIONS_RECORDING_KEYS
// });

// //console.log("aqui2")

// //criamos o nosso storage através do multer e dizemos qual iremos usar, nesse caso o armazenamento em memoria storage.
// const storage = multer.memoryStorage();

// //console.log("aqui2")
// // criamos o nosso multer em cima do nosso storage
// const updload = multer({ storage: storage })

// //console.log('upload', upload)

// //console.log("aqui4")

// // Aqui criamos nossa regra de negocio. Para subir nossos objetos para o servidor do cosmic.
// const uploadImageCosmic = async (req: any) => {
//     //console.log("req?.file?.originalname", req)
//     // se na nossa requisição vier um arquivo e esse arquivo tiver um nome
//     console.log('req?.file?.originalname', req?.file?.originalname)
//     if (req?.file?.originalname) {


//         // vou criar um objeto que o cosmic espera
//         const media_object = {
//             originalname: req.file.originalname,
//             buffer: req.file.buffer
//         }

//         //console.log(req.url, "url")
//         // checo a minha url da requisição, se for de puclications, salvamos no bucket respectivo
//         if (req.url && req.url.includes('publications')) {
//             return await bucketPublications.addMedia({ media: media_object })

//             //se não, salvamos no outro
//         } else {
//             return await bucketAvatars.addMedia({ media: media_object })
//         }
//     }else{
//         console.log("Não existe req")
//     }
// }

// export { updload, uploadImageCosmic };

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
const updload = multer({ storage: storage });

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

export { updload, uploadImageCosmic };
