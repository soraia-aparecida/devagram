import mongoose, { Schema } from "mongoose";

// Modelando nossa tabela para o DB.
const FollowSchema = new Schema({
    // quem segue
    userId: { type: String, required: true },

    //quem é seguido
    followedUserId: { type: String, required: true },
});

export const FollowModel = (mongoose.models.follow ||
    mongoose.model('follow', FollowSchema));