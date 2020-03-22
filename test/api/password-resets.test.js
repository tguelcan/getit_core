import request from 'supertest'
import { isJWT } from 'validator'
import server from '~/server'
import { serverConfig } from '~/config'
import { sign } from '~/services/guard'
import Model from '~/api/user/model'        
import PasswordReset from '~/api/password-reset/model'
import userModel from '~/api/user/model'


let adminUser, 
    defaultUser,
    adminToken,
    defaultToken,
    passwordReset,
    apiEndpoint = 'password-resets'

beforeEach(async (done) => {
    // Create user
    adminUser = await Model.create({ name: 'Maximilian', email: 'max1@moritz.com', password: 'Max123!!!', role: 'user' })
    defaultUser = await Model.create({ name: 'Maximilian', email: 'max2@moritz.com', password: 'Max123!!!', role: 'user' })
    
    passwordReset = await PasswordReset.create({ user: defaultUser })
    
    defaultToken = await sign(defaultUser)
    expect(isJWT(defaultToken)).toBe(true)
    
    defaultToken = await sign(defaultUser)
    expect(isJWT(defaultToken)).toBe(true)

    done()
})


describe(`Test /${apiEndpoint} endpoint`, () => {

    test(`POST /${apiEndpoint} 201 - Send email with password reset link`, async () => {
        const { status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max2@moritz.com', token: serverConfig.masterKey, link: 'http://0.0.0.0:9000/password-resets/' })

        expect(status).toBe(201)


        const user = await userModel.findOne({ email: 'max2@moritz.com' })
    
        // find reset token in db
        const data = await PasswordReset.findOne({ user: user._id })
        expect(typeof data).toEqual('object')
        expect(typeof data.token).toBe('string')

    })

    test(`POST /${apiEndpoint} 400 - Send email with wrong mail`, async () => {
        const { status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'das ist keine mail', token: serverConfig.masterKey, link: 'http://0.0.0.0:9000/password-resets/' })

        expect(status).toBe(400)
    })

    test(`POST /${apiEndpoint} 401 - Send email with wrong token`, async () => {
        const { status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max2@moritz.com', token: 'simsalabim', link: 'http://0.0.0.0:9000/password-resets/' })

        expect(status).toBe(401)
    })

    test(`POST /${apiEndpoint} 401 - Send email with missing link`, async () => {
        const { status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max2@moritz.com', token: serverConfig.masterKey, link: undefined })

        expect(status).toBe(400)
    })

    test(`GET /${apiEndpoint}/:token 200 - Verify token`, async () => {
        const { status, body } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/${passwordReset.token}`)

        
        expect(status).toBe(200)

        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')

        expect(body.email).toEqual('max2@moritz.com')
        expect(body.role).toEqual('user')
        expect(body.name).toEqual('Maximilian')
    })


    test(`GET /${apiEndpoint}/:token 400 - Verify token with wrong token`, async () => {
        const { status } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/123`)
        
        expect(status).toBe(400)
    })
    
    
    test(`PATCH /${apiEndpoint}/:token 200 - Update password`, async () => {
        const { status } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/${passwordReset.token}`)
            .send({ password: 'SuperSicheresPasswort123!' })
        expect(status).toBe(200)

        // Make sure we can login with new credentials
        defaultUser.password = 'SuperSicheresPasswort123!'
        defaultToken = await sign(defaultUser)
        expect(isJWT(defaultToken)).toBe(true)

    })


    test(`PATCH /${apiEndpoint}/:token 200 - Update password with invalid password`, async () => {
        const { status } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${passwordReset.token}`)
            .send({ password: 'meh' })
        expect(status).toBe(400)
    }) 

    
    test(`PATCH /${apiEndpoint}/:token 200 - Update password with invalid token`, async () => {
        const { status } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/123`)
            .send({ password: 'SuperSicheresPasswort123!' })
        expect(status).toBe(400)
    })
    

})


describe('view', () => {
    it('returns view', () => {
        const view = passwordReset.modelProjection()
        expect(view.token).toBe(passwordReset.token)
        expect(view.user.email).toBe(passwordReset.user.email)
    })
})