import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { StandardtMessageReply } from '../types/StandardtMessageReply';
import NextCors from 'nextjs-cors';

// a diferença do middware, é que ele recebe o handle primeiro e depois devolve uma função " = (req, res) =>{}"
export const corsPolicy = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<StandardtMessageReply>) => {
        try {
            await NextCors(req, res, {
                origin: '*',
                methods: ['GET', 'POST', 'PUT'],
                optionsSuccessStatus: 200, // navegadores antigos dao problema quando se retorna 204
            });
            // handler significa, estar manipulando a api no next.
            return handler(req, res);
        } catch (e) {
            return res.status(500).json({ error: 'Ocorreu erro ao tratar a politica de CORS' });
        }
    }