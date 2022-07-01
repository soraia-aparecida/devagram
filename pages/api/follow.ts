import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middwares/conectarMongoDB";
import { validateTokenJWT } from "../../middwares/validateTokenJWT";
import { UserModel } from "../../models/UserModel";
import { StandardtMessageReply } from "../../types/StandardtMessageReply";
import { FollowModel } from '../../models/FollowModel';
import { corsPolicy } from "../../middwares/corsPolicy";

const endpointFollow = async (req: NextApiRequest, res: NextApiResponse<StandardtMessageReply>) => {
    try {

        if (req.method === "PUT") {

            //usuario logado
            const { userId, followedUserId } = req?.query;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(400).json({ error: "Usuário logado não encontrado." })
            };

            const followedUser = await UserModel.findById(followedUserId);
            if (!followedUser) {
                return res.status(400).json({ error: "Usuário a ser seguido/deseguido não encontrado." })
            };

            // Se o usuario logado já segue esse outro uauário
            const userFollows = await FollowModel.find({ userId: user._id, followedUserId: followedUser._id })

            // Já segue essa pessoa
            if (userFollows && followedUser.length > 0) {

                // para cada seguidor que eu achei, vou deletar. Fazemos uma função async. 
                // pq por algum erro de sincronismo, podemos ter seguido essa pessoa mais de uma vez. 
                // o forEach é parecido com o for, mas ele abre uma nova  trend, "função", não na nossa função princiapal 
                // e executa um lambida: (e) =>...
                // com isso, enquanto ele vai deletando na tabela de seguidores, já passa para a proxima execução,
                // da linha  39.
                userFollows.forEach(async (e) => await FollowModel.findByIdAndDelete({ _id: e._id }))

                user.following--;
                await UserModel.findByIdAndUpdate({ _id: user._id }, user);

                // removendo mais uma pessoa no numero de seguindores do usuario informado.
                followedUser.followers--;
                await UserModel.findByIdAndUpdate({ _id: followedUser._id }, followedUser);

                return res.status(200).json({ message: "Usuario seguido com sucesso!" });

                // Ainda não segue essa pessoa
            } else {

                // modelando os dados para enviar para o nosso bando de dados.
                const followed = {
                    userId: user._id,
                    followedUserId: followedUser._id
                };

                await FollowModel.create(followed);

                // adicionando mais uma pessoa no numero de seguindo do usuario logado.
                user.following++;
                await UserModel.findByIdAndUpdate({ _id: user._id }, user);

                // adicionando mais uma pessoa no numero de seguindores do usuario informado.
                followedUser.followers++;
                await UserModel.findByIdAndUpdate({ _id: followedUser._id }, followedUser);

                return res.status(200).json({ message: "Usuário seguido com sucesso." });
            }
        }

        return res.status(405).json({ message: "Esse método não é valido." })

    } catch (error) {
        return res.status(500).json({ error: "Não possível seguir/deseguir o usuário informado." })
    }
}

export default corsPolicy(validateTokenJWT(conectarMongoDB(endpointFollow)));