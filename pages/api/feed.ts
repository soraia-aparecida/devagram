import type { NextApiRequest, NextApiResponse } from 'next';
import { validateTokenJWT } from '../../middwares/validateTokenJWT';
import { conectarMongoDB } from '../../middwares/conectarMongoDB';
import { UserModel } from '../../models/UserModel';
import { StandardtMessageReply } from '../../types/StandardtMessageReply';
import { PublicationModel } from '../../models/PublicationModel';
import { FollowModel } from '../../models/FollowModel';
import { corsPolicy } from '../../middwares/corsPolicy';

const endpointFeed = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply | any>
) => {
    try {
        if (req.method === "GET") {

            if (req?.query?.id) {
                // feed, por um id
                const user = await UserModel.findById(req.query?.id)

                if (!user) {
                    return res.status(400).json({ error: "Usuário não encontrado." })
                };

                const publications = await PublicationModel.find({ idUser: user._id }).sort({ date: -1 })

                return res.status(200).json(publications)
            } else {
                // feed da home

                const { userId } = req?.query;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(400).json({ error: "Usuário não encontrado." })
                };

                // minhas publicações
                const followers = await FollowModel.find({ userId: user._id })

                //pegando apenas os ID dos usuários que eu sigo
                const followersId = followers.map((item) => item.followedUserId)

                // buscando as minhas publicações como das pessoas que sigo
                const publications = await PublicationModel.find({

                    // método ou do mongo
                    $or: [
                        { idUser: user._id },
                        { idUser: followersId }
                    ]
                }).sort({ date: -1 })


                const result = []
                // na nossa publicação não vinha o name e avatur dos susuarios, por isso, fizemos esse for... of...
                for (const publication of publications) {
                    const userPublication = await UserModel.findById(publication.idUser)
                    if (userPublication) {
                        const finish = {
                            ...publication._doc,
                            user: {
                                name: userPublication.name,
                                avatar: userPublication.avatar
                            }
                        }
                        result.push(finish)
                    }
                }
                return res.status(200).json(result)
            }
        }

        return res.status(400).json({ message: "Esse método não é valido." })

    } catch (error) {
        return res.status(400).json({ message: "Não foi possível obeter o feed" })
    }
}

export default corsPolicy(validateTokenJWT(conectarMongoDB(endpointFeed)));