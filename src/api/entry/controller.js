import Entry from './model'
import { BadRequestError, UnauthorizedError } from 'restify-errors'
import userModel from '~/api/user/model'
import { validateMail, decode } from '~/services/guard'
import { extractToken } from '~/utils'
import { Types } from 'mongoose'

export const deleteAll = async(req, res) => {
    await Entry.deleteMany()
    res.json('success')
}


export const create = async(req, res, next) => {

    const { postcode, entryType, list, deliveryDate, email, name } = req.body
    
    try {
        const response = await userModel.findOne({ email }) // find user
        
        // validate token+mail
        if (!await validateMail(req, response._id.toString())) return next(new UnauthorizedError())
        
        // TODO: validate entry input!!

        // create entry
        const entry = await Entry.create({ postcode, entryType, list, deliveryDate, user: response._id, name  })
        res.send(201, entry.modelProjection())
 
    } catch (error) {
        /* istanbul ignore next */ 
        console.log(error)
        return next(new BadRequestError(error))
    }
}
export const getMe = async(req, res, next) => {
    
    try {

        // get count if given
        const count = req.query?.count === undefined ? 20 : parseInt(req.query.count)

        // extract userid
        const id = (await decode(extractToken(req)))._id

        // find entries, sort ascending and limit by count
        const entries = await Entry.find({user: Types.ObjectId(id)}).sort({createdAt: 'ascending'}).limit(count)
        
        // project the models
        const data = []
        entries.forEach((entry) => { data.push(entry.modelProjection()) })

        res.send(201, data)

    } catch (error) {
        return next(new BadRequestError(error))
    }
}

export const get = async(req, res, next) => {

    try {
        
        // check for postcode and type
        if (!req.query?.postcode || !req.query?.type) return next(new BadRequestError('Missing query parameter'))
        
        // get count if given
        const count = req.query?.count === undefined ? 20 : parseInt(req.query.count)
        const entries = await Entry.find({postcode: req.query?.postcode, entryType: req.query?.type}).sort({createdAt: 'ascending'}).limit(count)

        // project the models
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
