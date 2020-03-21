import { BadRequestError } from 'restify-errors'
import model from '~/api/user/model'
import { sign, decode } from '~/services/guard'
import { comparePassword, providerAuth } from '~/utils'

/**
 * @throws {BadRequestError} 400 Error - invalid email or password
 */
const errorHandler = (next) => 
    next(new BadRequestError('invalid email or password'))

const signHandler = async (user, res) => {
    let token = await sign(user), 
        { _id, role } = await decode(token)

    // Send response
    res.send({ _id, role, token })
}

export const authenticate = async({ body }, res, next) => {
    // Pass values
    let { email, password } = body
    
    try {
        // Validate request body
        await model.validate({ email, password })
        
        // Find user
        let user = await model.findOne({ email })
        if(!user) 
            return errorHandler(next)
        
        // Compare password
        let comparedPassword = await comparePassword(password, user.password)
        if(!comparedPassword) 
            return errorHandler(next)

        // Sign in user
        await signHandler(user, res)

    } catch(error) {
        return next(new BadRequestError(error))
    }
}

export const providerAuthenticate = async({ body, params }, res, next) => {
    // Pass values
    let { provider } = params, 
        { token } = body

    try {
        // Get user from external provider
        const providerUser = await providerAuth[provider](token)
        const user = await model.createFromService(providerUser)
        
        // Sign in user
        await signHandler(user, res)
        
    } catch(error) {
        return next(new BadRequestError(error))
    }

}
