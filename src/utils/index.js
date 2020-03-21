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
