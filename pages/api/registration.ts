import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middwares/conectarMongoDB";
import type { RequestRegistration } from '../../types/RequestRegistration';
import type { StandardtMessageReply } from '../../types/StandardtMessageReply';
import { UserModel } from '../../models/UserModel';
import { HasManager } from "../../services/HashManager";
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';

const hasManager = new HasManager()

const handler = nc()
    // a forma como o next-connet usar para as requisições.
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<StandardtMessageReply | any>) => {

        try {
            const user = req.body as RequestRegistration

            if (!user.name || !user.password || !user.email) {
                return res.status(422).json({ error: "Para realizar o cadastro de um novo usuário é necessário informar os seguintes campos: name, email, password." })
            };

            if (!user.email.includes('@') || !user.email.includes('.com')) {
                return res.status(422).json({ error: "Email invalido" })
            };

            if (user.password.length < 6) {
                return res.status(422).json({ error: "A senha deve conter no mímino 6 caracteres." })
            };

            const checkExistenceOfEmail = await UserModel.find({ email: user.email })

            if (checkExistenceOfEmail && checkExistenceOfEmail.length > 0) {
                return res.status(409).json({ error: "E-mail já cadastrado no nosso banco de dados." })
            };

            const encryptedPassword = await hasManager.generateHash(user.password);

            // enviar a imagem do multer parao cosmic
            const image = await uploadImageCosmic(req);

            const userToBeSaved = {
                name: user.name,
                email: user.email,
                password: encryptedPassword,
                avatar: image?.media?.url
            };

            await UserModel.create(userToBeSaved)

            return res.status(201).json({ message: "Usuário cadastrado com sucesso!" })

        } catch (error) {
            return res.status(500).json({ error: "Error ao cadastrar usuário" })
        }
    });

//O next por padrão converte tudo para json, mas agora usando o cosmic, não queremos mais isso. 
//Vamos export uma config, quando exportamos esse config, significa que queremos mudar algo nela

export const config = {
    // vamos mudar a configuração de api, para que o bodyParse seja false.

    api: {
        // Quando o body parse está true, ele transforma tudo em json.
        bodyParser: false
    }
}

export default conectarMongoDB(handler);