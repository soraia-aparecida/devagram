import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middwares/conectarMongoDB'
import type { StandardtMessageReply } from '../../types/StandardtMessageReply'
import { UserModel } from '../../models/UserModel'
import { HasManager } from "../../services/HashManager";
import * as jwt from 'jsonwebtoken';
import { AuthenticationData } from '../../models/AutheticationData';

const hasManager = new HasManager()

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply | string>
) => {

    const expiresIn = process.env.EXPIRES_IN
    if (!expiresIn) {
        return res.status(500).json({ error: "EXPIRES_IN não informado." })
    }

    const jwtKey = process.env.JWT_KEY
    if (!jwtKey) {
        return res.status(500).json({ error: "EXPIRES_IN não informado." })
    }

    if (req.method === "POST") {
        const { login, password } = req.body

        if (!login || !password) {
            return res.status(422).json({ error: "Para realizar login é necessário informar os seguintes campos:  email, password." })
        }

        const checkExistenceUser = await UserModel.find({ email: login })

        if (!checkExistenceUser[0]) {
            return res.status(404).json({ error: "Email não cadastrado em nosso banco de dados." })
        }

        const passwordIsCorrect: boolean = await hasManager.compareHash(password, checkExistenceUser[0].password)

        if (!passwordIsCorrect) {
            return res.status(404).json({ error: "Senha inválida." })
        }

        // Gerar token
        const payload: AuthenticationData = { id: checkExistenceUser[0]._id }

        const token = jwt.sign(payload, jwtKey, {expiresIn})

        return res.status(200).json(token)
    }

    return res.status(405).json({ error: "Metodo informado não é válido" })
}

export default conectarMongoDB(endpointLogin)