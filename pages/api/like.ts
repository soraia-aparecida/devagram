import type { NextApiRequest, NextApiResponse } from 'next';
import { validateTokenJWT } from '../../middwares/validateTokenJWT';
import { conectarMongoDB } from '../../middwares/conectarMongoDB';
import { UserModel } from '../../models/UserModel';
import { PublicationModel } from '../../models/PublicationModel';
import { StandardtMessageReply } from '../../types/StandardtMessageReply';
import { corsPolicy } from '../../middwares/corsPolicy';

const endpointLike = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply | any>
) => {
    try {

        if (req.method === "PUT") {

            const { id } = req?.query;
            const publication = await PublicationModel.findById(id);

            if (!publication) {
                return res.status(400).json({ error: "Publicação não encontrada." })
            };

            const { userId } = req?.query;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(400).json({ error: "Usuario não encontrado." })
            };

            // Ele procura se aquela publicação já foi curtida, se sim retorna ela, se não retorna -1.
            const userLiked = publication.likes.findIndex((e: any) => e.toString() === user._id.toString());

            console.log(userLiked, "userLikes")

            // Já foi curtida, vamos dar deslike
            if (userLiked !== -1) {
                //pegamos essa curtida e tiramos da nossa lista de likes.
                publication.likes.splice(userLiked, 1)

                // vamos atualizar nossa lista de curtidas
                await PublicationModel.findByIdAndUpdate({ _id: publication._id }, publication)
                return res.status(200).json({ message: "Publicação descurtida com sucesso!" })

            } else {
                // Entra nesse else se a pessoa ainda não curtiu essa publicação.

                // add esse like no array de likes.
                publication.likes.push(user._id)
                await PublicationModel.findByIdAndUpdate({ _id: publication._id }, publication)
                return res.status(200).json({ message: "Publicação curtida com sucesso!" })
            };
        }

        return res.status(405).json({ message: "Esse método não é valido." })

    } catch (error) {
        return res.status(400).json({ message: "Não foi possível dar like/deslikes" })
    }
}

export default corsPolicy(validateTokenJWT(conectarMongoDB(endpointLike)));