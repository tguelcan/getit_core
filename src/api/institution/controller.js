// import { BadRequestError } from 'restify-errors'
import Institution from './model'

export const deleteAll = async(req, res) => {
    await Institution.deleteMany()
    res.json('success')
}
