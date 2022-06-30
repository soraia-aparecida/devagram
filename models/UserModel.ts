import mongoose, { Schema } from "mongoose";

// Modelando nossa tabela para o DB.
const UserSchema = new Schema({
    name: { type: String, require: true },
    password: { type: String, requeri: true },
    email: { type: String, requeri: true },
    avatar: { type: String, requeri: false },
    following: { type: Number, default: 0 }, // seguindo
    followers: { type: Number, default: 0 }, // seguidores
    publications: { type: Number, default: 0 }, // pubicações
});

// Ele vai pegar nossa tabela no DB, e veririficar se a tabela users existe, 
// se não existir ele vai criar ela, com base nas informações que passamos no UserSchema.
export const UserModel = (mongoose.models.users ||
    mongoose.model('users', UserSchema));