import { BadRequestError } from 'restify-errors'
import { sendDynamicMail } from '~/services/sendgrid'
import { serverConfig } from '~/config'
import PasswordResetModel from './model'
import userModel from '~/api/user/model'

let { emailTemplates } = serverConfig

export const create = async ({ body }, res, next) => {
    // Pass values
    let { email, link } = body

    try {
        // Find user
        const response = await userModel.findOne({ email })

        // Create reset token
        let data = await PasswordResetModel.create({ user: response._id })

        console.log(data)
        link = `${link.replace(/\/$/, '')}/${data.token}`

        await sendDynamicMail({ 
            toEmail: email,
            templateId: emailTemplates.forgot,
            dynamic_template_data: {
                username: data.user.name, link
            }
        })

        res.send(201)

    } catch(error) {
        next(new BadRequestError('No user found with this email.'))
    }
}

export const show = async ({ params }, res, next) => {
    // Pass values
    let { token } = params

    try {
        // Find token
        const { user } = await PasswordResetModel.findOne({ token }).populate('user')
        console.log(user.modelProjection())
        res.send(user.modelProjection())

    } catch(error) {
        next(new BadRequestError('No user found with this email.'))
    }
}

export const update = async ({ params, body }, res, next) => {
    // Pass values
    let { token } = params
    let { password } = body
    
    try {
        // Find token
        const { user } = await PasswordResetModel.findOne({ token }).populate('user')
        
        // Set new password
        // // Save user
        const data = await user.set({ password }).save()
        
        // Remove reset token
        await PasswordResetModel.remove({ user })
        
        // Send response 
        res.send(201, data.modelProjection())
        
    } catch(error) {
        next(new BadRequestError('Not valid token!'))
    } 
}
