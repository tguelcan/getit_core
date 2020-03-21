import mongoose, { Schema } from 'mongoose'
import { uid } from 'rand-token'

const passwordResetSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    token: {
        type: String,
        unique: true,
        index: true,
        default: () => uid(32)
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

export const modelProjection = function(req, item, cb) {
    let view = {}
    let fields = ['user', 'token']

    /*
    if (req.user) {
        fields = [...fields, 'createdAt']
    }
    */

    fields.forEach((field) => { view[field] = item[field] })

    cb(null, view)
}

passwordResetSchema.methods = {
    modelProjection
}

export default mongoose.model('PasswordReset', passwordResetSchema)

