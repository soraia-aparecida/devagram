import type { NextApiRequest, NextApiResponse } from 'next';
import { validateTokenJWT } from '../../middwares/validateTokenJWT';
import { conectarMongoDB } from '../../middwares/conectarMongoDB';
import { UserModel } from '../../models/UserModel';
import { StandardtMessageReply } from '../../types/StandardtMessageReply';
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';
import { corsPolicy } from '../../middwares/corsPolicy';

const handler = nc()
    //Enviar um unico arquivo, que contenha a propiedade 'file. o use é um middware do multer.
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<StandardtMessageReply>) => {
        try {
            const { userId } = req?.query;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(400).json({ error: "Usuário não encontrado." })
            };

            const { name } = req.body;
            if (name && name.length > 2) {
                user.name = name
            };

            const { file } = req;
            if (file && file.originalname) {
                const image = await uploadImageCosmic(req)
                if (image && image.media && image.media.url) {
                    user.avatar = image.media.url
                }
            };

            await UserModel.findByIdAndUpdate({ _id: user._id }, user)

            return res.status(200).json({ message: "Usuário editado com sucesso!" })

        } catch (error) {
            console.log(error)
        }
        return res.status(400).json({ error: "Não foi possivel atualizar usuário" })
    })
    .get(
        async (
            req: NextApiRequest,
            res: NextApiResponse<StandardtMessageReply>
        ) => {
            try {
                const { userId } = req?.query;
                const user = await UserModel.findById(userId);
                user.password = null;
                return res.status(200).json(user)

            } catch (error) {
                return res.status(400).json({ message: "Não foi possível obeter dados do usuário" })
            }
        }
    )

export const config = {
    api: { bodyParser: false }
}

export default corsPolicy(validateTokenJWT(conectarMongoDB(handler)));