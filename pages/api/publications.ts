import { NextApiResponse } from "next";
import { conectarMongoDB } from "../../middwares/conectarMongoDB";
import { validateTokenJWT } from '../../middwares/validateTokenJWT'
import type { StandardtMessageReply } from '../../types/StandardtMessageReply';
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';
import { PublicationModel } from '../../models/PublicationModel'
import { UserModel } from "../../models/UserModel";
import { corsPolicy } from "../../middwares/corsPolicy";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<StandardtMessageReply>) => {

        try {
            const { userId } = req.query
            const user = await UserModel.findById(userId)

            if (!user) {
                return res.status(400).json({ error: "Usuário não encontrado." })
            };

            if (!req || !req.body) {
                return res.status(400).json({ error: "Parametros de entrada não informados." })
            };

            const { descripition } = req?.body

            if (!descripition && descripition.length < 2) {
                return res.status(400).json({ error: "Essa descrição não é válida." })
            };

            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ error: "A imagem é obrigatória" })
            };

            const image = await uploadImageCosmic(req);

            const publicationToBeSaved = {
                idUser: userId,
                descripition,
                photo: image?.media.url,
                date: new Date()
            };

            user.publications++;
            await UserModel.findByIdAndUpdate({ _id: user._id }, user);

            await PublicationModel.create(publicationToBeSaved);

            return res.status(201).json({ message: "Publicação criado com sucesso!" });

        } catch (error) {
            return res.status(400).json({ error: "Error ao cadastra publicação" })
        }
    });

export const config = {
    api: {
        bodyParser: false
    }
};

export default corsPolicy(validateTokenJWT(conectarMongoDB(handler)));