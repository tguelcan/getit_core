import mongoose, { Schema } from 'mongoose'

const institutionSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    shortname: {
        type: String
    },
    lowestGrade: {
        type: Number
    },
    highestGrade: {
        type: Number
    },
    picture: {
        type: String
    },
    logo: {
        type: String
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    institutionType: {
        type: String
    },
    address: {
        street: {
            type: String
        },
        postalCode: {
            type: Number
        },
        state: {
            type: String
        },
        country: {
            type: String
        }
    },
    contact: {
        contactPerson: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        phone: {
            type: String
        },
        email: {
            type: String
        }
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (obj, ret) => { delete ret._id }
    }
})

export const modelProjection = function(req, item, cb) {
    let view = {}
    let fields = ['id', 'name', 'shortname', 'lowestGrade', 'highestGrade', 'picture', 'logo', 'createdBy', 'institutionType', 'address', 'contact']

    fields.forEach((field) => { view[field] = item[field] })

    cb(null, view)
}

export default mongoose.model('Institution', institutionSchema)