import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { StandardtMessageReply } from '../types/StandardtMessageReply'
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const validateTokenJWT = (handler: NextApiHandler) => (
    req: NextApiRequest,
    res: NextApiResponse<StandardtMessageReply>
) => {

    try {
        const jwtKey = process.env.JWT_KEY
        if (!jwtKey) {
            return res.status(500).json({ error: "EXPIRES_IN não informado." })
        }

        if (!req || !req.headers) {
            return res.status(400).json({ error: "Não foi possível validar o token." })
        }


        if (req.method !== "OPTIONS") {
            const authorization = req.headers['authorization']
            if (!authorization) {
                return res.status(400).json({ error: "Não foi possível validar o token." })
            }

            // Fazemos isso, pois como o token vem com a palavra Bearer, devemos tira-lá e também o espaço após ela. 
            const token = authorization.substring(7)
            if (!token) {
                return res.status(400).json({ error: "Não foi possível validar o token." })
            }

            const decodedToken = jwt.verify(token, jwtKey) as jwt.JwtPayload

            if (!decodedToken) {
                return res.status(400).json({ error: "Não foi possível validar o token." })
            }

            if (!req.query) {
                req.query = {}
            }

            req.query.userId = decodedToken.id
        }

        return handler(req, res)
    } catch (error) {
        return res.status(400).json({ error: "Não foi possível validar o token." })
    }


}