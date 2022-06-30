import type { NextApiRequest, NextApiResponse } from 'next'
import { validateTokenJWT } from '../../middwares/validateTokenJWT'

const endpointUser = (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    return res.status(200).json({ message: "Usuario autenticado com sucesso!" })
}

export default validateTokenJWT(endpointUser)