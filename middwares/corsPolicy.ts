import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type {StandardtMessageReply} from '../types/StandardtMessageReply'
import NextCors from 'nextjs-cors';

export const corsPolicy = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<StandardtMessageReply>) => {
    try{
        await NextCors(req, res, {
            origin : '*',
            methods : ['GET', 'POST', 'PUT'],
            optionsSuccessStatus : 200, // navegadores antigos dao problema quando se retorna 204
        });

        return handler(req, res);
    }catch(e){
        return res.status(500).json({error : 'Ocorreu erro ao tratar a politica de CORS'});
    }
}