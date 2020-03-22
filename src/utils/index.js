import 'dotenv/config'
export * from './auth'
export * from './externalAuth'

/**
 * Javascript helper for required env values
 * @param {string} name - The name of the env
 * @returns {string} that env.
 */

export const requireProcessEnv = (name) => {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable')
    }
    return process.env[name]
}

export const postcodeValidator = {
    /**
     * postcode validator - The postcode has to be exactly 5 digits.
     * @param {string} postcode - The postcode
     * @returns {boolean} if the postcode is correct enough lol
     */
    validator: function (postcode) {
        const strongRegex = new RegExp('^(\d{5})')
        return strongRegex.test(postcode)
    },
    /**
     * Send message if error
     * @returns {string} message - The postcode has to be exactly 5 digits.
     */
    message: () => 'The postcode has to be exactly 5 digits long'
}


