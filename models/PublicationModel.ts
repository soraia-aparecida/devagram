import mongoose, { Schema } from "mongoose";

// Modelando nossa tabela para o DB.
const PublicationSchema = new Schema({
    idUser: { type: String, require: true },
    descripition: { type: String, require: true },
    photo: { type: String, require: true },
    date: { type: Date, require: true },
    likes: { type: Array, require: true, default: [] },
    comments: { type: Array, require: true, default: [] },
});

// Ele vai pegar nossa tabela no DB, e veririficar se a tabela users existe, 
// se não existir ele vai criar ela, com base nas informações que passamos no UserSchema.
export const PublicationModel = (mongoose.models.publications ||
    mongoose.model('publications', PublicationSchema));
