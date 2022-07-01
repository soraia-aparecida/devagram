import type { NextApiRequest, NextApiResponse } from 'next';
import { validateTokenJWT } from '../../middwares/validateTokenJWT';
import { conectarMongoDB } from '../../middwares/conectarMongoDB';
import { UserModel } from '../../models/UserModel';
import { StandardtMessageReply } from '../../types/StandardtMessageReply';
import { corsPolicy } from '../../middwares/corsPolicy';

const endpointSearch = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply | any>
) => {
    try {
        if (req.method === "GET") {

            if (req?.query?.id) {

                const userFound = await UserModel.findById(req?.query?.id)

                if (!userFound) {
                    return res.status(400).json({ error: "Usuário não encontrado." })
                }

                return res.status(200).json(userFound)

            } else {

                const { filter } = req.query

                if (!filter || filter.length < 1) {
                    return res.status(400).json({ message: "Por gentileza, informar dados para pesquisa" })
                }

                // regex do mongoose, para ele procurar nos nome que contenha os caracteres informados, o $option: 'i', siginifca que ele deve ignorar maiusculas.
                const userFound = await UserModel.find({
                    $or: [
                        { name: { $regex: filter, $options: 'i' } },
                        { email: { $regex: filter, $options: 'i' } }
                    ]
                })

                return res.status(200).json(userFound)
            }
        }

        return res.status(405).json({ message: "Esse método não é valido." })

    } catch (error) {
        return res.status(400).json({ message: "Não foi possível obeter o feed" })
    }
}

export default corsPolicy(validateTokenJWT(conectarMongoDB(endpointSearch)));