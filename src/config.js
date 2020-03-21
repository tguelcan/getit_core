import 'dotenv/config'
import { requireProcessEnv, extractToken } from '~/utils'

export const serverConfig = {
    endpoint: '/api',
    port: process.env.PORT,
    server: {
        name: requireProcessEnv('APP_NAME'),
        version: process.env.APP_VERSION
    },
    throttle: {
        burst: 100,     // Max 10 concurrent requests (if tokens)
        rate: 2,        // Steady state: 2 request / 1 seconds
        ip: true,       // throttle per IP
    },
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwt: {
        secret: requireProcessEnv('JWT_SECRET'),
        credentialsRequired: false,
        getToken: (req) => extractToken(req)
    },
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    emailTemplates: {
        welcome: 'd-82227eb5eef242feb590e844a333b8c4',
        forgot: 'd-141a773f01d04265b3299be27b8d52f5'
    },
    defaultEmail: 'no-reply@tutels.com'
}

export const dbConfig = {
    url: process.env.MONGODB_URI,
    options: {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }
}
export const restConfig = {
    /**
     * You can customize global rest configurations here
     * sort: '-createdAt'
     * outputFormat: 'json-api'
     */
    pageSize: 50
}

