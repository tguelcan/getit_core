import Entry from './model'
import { BadRequestError } from 'restify-errors'
import model from './model'
import userModel from '~/api/user/model'


export const deleteAll = async(req, res) => {
    await Entry.deleteMany()
    res.json('success')
}


export const create = async({ body }, res, next) => {
    // Pass values
    const { postcode, entryType, list, deliveryDate, email } = body
    
    try {

        // const response = await userModel.findOne({ email })

        // const entry = await model.create({postcode, entryType, list, deliveryDate, user: response._id})
        res.send(201, body)

    } catch (error) {
        /* istanbul ignore next */ 
        return next(new BadRequestError(error))
    }
}
