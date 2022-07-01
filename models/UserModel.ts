import mongoose, { Schema } from "mongoose";

// Modelando nossa tabela para o DB.
const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: false },
    following: { type: Number, default: 0 }, // seguindo
    followers: { type: Number, default: 0 }, // seguidores
    publications: { type: Number, default: 0 }, // pubicações
});

// Ele vai pegar nossa tabela no DB, e veririficar se a tabela users existe, 
// se não existir ele vai criar ela, com base nas informações que passamos no UserSchema.
export const UserModel = (mongoose.models.users ||
    mongoose.model('users', UserSchema));