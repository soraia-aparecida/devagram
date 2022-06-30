import * as bycript from 'bcryptjs'
import { sendRenderResult } from 'next/dist/server/send-payload'

export class HasManager {

    public generateHash = async (
        text: string
    ): Promise<string> => {
        const rounds = 12
        const salt = await bycript.genSalt(rounds)
        const result = await bycript.hash(text, salt)
        return result
    }

    public compareHash = async (
        text: string,
        hash: string
    ): Promise<boolean> => {
        const result = await bycript.compare(text, hash)
        return result
    }
}