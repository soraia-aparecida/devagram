import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import { StandardtMessageReply } from '../types/StandardtMessageReply';

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<StandardtMessageReply> //Isso é para garantir que a nossa resposta deve vim como esse tipo. 
    ) => {

        //verifica se está concetado com db
        if (mongoose.connections[0].readyState) {
            return handler(req, res)
        }

        //Como não está conectado, vamos conecatar
        const { DB_CONEXAO_STRING } = process.env;

        //Se o .env estiver vazio, avisamos o programador.
        if (!DB_CONEXAO_STRING) {
            return res.status(500).json({ error: "ENV de configuração do db, não informado." })
        }

        // Para verificar a resposta da nossa conexão com o DB.
        // Esse on significa que queremos escutar a conexão, e ser certo "connected" ou errado "error", 
        // damos um conselo pra saber essa resposta. 
        mongoose.connection.on('connected', () => console.log("Banco de dados conectado."))
        mongoose.connection.on('error', (error) => console.log(`Ocorreu um erro ao conecat com o DB, ${error}`))

        // Se estiver tudo certo, ele conecta no banco de dados.
        await mongoose.connect(DB_CONEXAO_STRING);

        return handler(req, res)
    }