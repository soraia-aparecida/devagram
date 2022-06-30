import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middwares/conectarMongoDB";
import type { RequestRegistration } from '../../types/RequestRegistration';
import type { StandardtMessageReply } from '../../types/StandardtMessageReply';
import { UserModel } from '../../models/UserModel';
import { HasManager } from "../../services/HashManager";

const hasManager = new HasManager()

const endpointRegistration = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply>
) => {

    if (req.method === "POST") {
        const user: RequestRegistration = req.body

        if (!user.name || !user.password || !user.email) {
            return res.status(422).json({ error: "Para realizar o cadastro de um novo usuário é necessário informar os seguintes campos: name, email, password." })
        }

        if (!user.email.includes('@') || !user.email.includes('.com')) {
            return res.status(422).json({ error: "Email invalido" })
        }

        if (user.password.length < 6) {
            return res.status(422).json({ error: "A senha deve conter no mímino 6 caracteres." })
        }

        const checkExistenceOfEmail = await UserModel.find({ email: user.email })

        if (checkExistenceOfEmail && checkExistenceOfEmail.length > 0) {
            return res.status(409).json({ error: "E-mail já cadastrado no nosso banco de dados." })
        }

        const encryptedPassword = await hasManager.generateHash(user.password)

        const userToBeSaved = {
            name: user.name,
            email: user.email,
            password: encryptedPassword
        }

        await UserModel.create(userToBeSaved)

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" })
    }

    return res.status(405).json({ error: "Metodo informado não é válido" })
}

export default conectarMongoDB(endpointRegistration)