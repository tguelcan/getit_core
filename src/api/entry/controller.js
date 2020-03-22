import Entry from './model'
import { BadRequestError, UnauthorizedError } from 'restify-errors'
import userModel from '~/api/user/model'
import { validateMail } from '~/services/guard'

export const deleteAll = async(req, res) => {
    await Entry.deleteMany()
    res.json('success')
}


export const create = async(req, res, next) => {

    const { postcode, entryType, list, deliveryDate, email } = req.body
    
    try {
        const response = await userModel.findOne({ email }) // find user
        // validate token+mail
        if (!await validateMail(req, response._id.toString())) return next(new UnauthorizedError())
        // TODO: validate entry input
        // create entry
        const entry = await Entry.create({ postcode, entryType, list, deliveryDate, user: response._id  })
        res.send(201, entry.modelProjection())
 
    } catch (error) {
        /* istanbul ignore next */ 
        console.log(error)
        return next(new BadRequestError(error))
    }
}


export const get = async(req, res, next) => {

    try {

        if (!req.query?.postcode || !req.query?.type) return next(new BadRequestError('Missing query parameter'))

        const count = req.query?.count === undefined ? 20 : parseInt(req.query.count)
        const entries = await Entry.find({postcode: req.query?.postcode, entryType: req.query?.type}).sort({createdAt: 'ascending'}).limit(count)
        
        const data = []
        entries.forEach((entry) => {
            data.push(entry.modelProjection())
        })

        res.send(201, data)
 
    } catch (error) {
        /* istanbul ignore next */ 
        return next(new BadRequestError(error))
    }
}
