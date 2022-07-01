import mongoose, { Schema } from "mongoose";

// Modelando nossa tabela para o DB.
const PublicationSchema = new Schema({
    idUser: { type: String, required: true },
    descripition: { type: String, required: true },
    photo: { type: String, required: true },
    date: { type: Date, required: true },
    likes: { type: Array, required: true, default: [] },
    comments: { type: Array, required: true, default: [] },
});

// Ele vai pegar nossa tabela no DB, e veririficar se a tabela users existe, 
// se não existir ele vai criar ela, com base nas informações que passamos no UserSchema.
export const PublicationModel = (mongoose.models.publications ||
    mongoose.model('publications', PublicationSchema));
