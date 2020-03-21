// import { BadRequestError } from 'restify-errors'
import Message from './model'

export const deleteAll = async(req, res) => {
    await Message.deleteMany()
    res.json('success')
}
