import mongoose, { Schema } from 'mongoose'
import { postcodeValidator } from '~/utils'

const types = ['product', 'service']

const entrieschema = new Schema({
    postcode: {
        type: Number,
        required: true,
        validate: postcodeValidator
    },
    entryType: {
        type: String,
        required: true,
        enum: types
    },
    list: [
        { 
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            unit: { type: String, required: true },
            shop: { type: String, required: true },
            price: { type: Number }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deliveryDate: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
})

export const modelProjection = function (req, item = this, cb) {
    let view = {}
    let fields = ['id', 'postcode', 'type', 'createdAt', 'deliveryDate', 'user', 'list']

    fields.forEach((field) => {
        view[field] = item[field]})


    if(!cb)
        return view
    

    cb(null, view)
}

export default mongoose.model('Entry', entrieschema)
