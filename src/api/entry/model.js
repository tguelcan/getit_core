import mongoose, { Schema } from 'mongoose'
import { postcodeValidator } from '~/utils'
const types = ['product', 'service']

const entrieschema = new Schema({
    name: {
        type: String, 
        required: true,
    },
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
    let fields = ['id', 'postcode', 'entryType', 'createdAt', 'deliveryDate', 'user', 'list']

    fields.forEach((field) => {
        view[field] = item[field]
    })

    // stupid fix to remove _id
    const newList = []    
    view.list.forEach((obj) => newList.push({name: obj.name, amount: obj.amount, unit: obj.unit, shop: obj.shop }))
    view.list = newList

    if(!cb)
        return view
    
    cb(null, view)
}
entrieschema.methods = {
    modelProjection
}

export default mongoose.model('Entry', entrieschema)
