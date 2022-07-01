import type { NextApiRequest, NextApiResponse } from 'next';
import { validateTokenJWT } from '../../middwares/validateTokenJWT';
import { conectarMongoDB } from '../../middwares/conectarMongoDB';
import { UserModel } from '../../models/UserModel';
import { PublicationModel } from '../../models/PublicationModel';
import { StandardtMessageReply } from '../../types/StandardtMessageReply';
import { corsPolicy } from '../../middwares/corsPolicy';

const endpointComment = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply | any>
) => {
    try {

        if (req.method === "PUT") {

            const { userId, id } = req?.query;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(400).json({ error: "Usuário não encontrado." })
            };

            const publication = await PublicationModel.findById(id);
            if (!publication) {
                return res.status(400).json({ error: "Publicação não encontrada." })
            };

            const comment = req.body.comment;

            if (!comment || comment.length < 2) {
                return res.status(400).json({ error: "Comentário não é válido" })
            };

            const insertComment = {
                userId: user._id,
                name: user.name,
                comment
            };

            publication.comments.push(insertComment);

            await PublicationModel.findByIdAndUpdate({ _id: publication._id }, publication);

            return res.status(200).json({ message: "Comentário adicionado com sucesso!" });
        }

        return res.status(405).json({ message: "Esse método não é valido." })

    } catch (error) {
        return res.status(400).json({ message: "Não foi possível comentar nessa publicação" })
    }
}

export default corsPolicy (validateTokenJWT(conectarMongoDB(endpointComment)));