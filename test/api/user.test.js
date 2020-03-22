import crypto from 'crypto'
import request from 'supertest'
import { isJWT } from 'validator'
import server from '~/server'
import { serverConfig } from '~/config'
import { sign } from '~/services/guard'
import Model from '~/api/user/model'

let adminUser, 
    defaultUser,
    adminToken,
    defaultToken,
    apiEndpoint = 'users'

beforeEach(async (done) => {
    // Create user
    adminUser = await Model.create({ name: 'Maximilian', email: 'max1@moritz.com', password: 'Max123!!!', role: 'user' })
    defaultUser = await Model.create({ name: 'Maximilian', email: 'max2@moritz.com', password: 'Max123!!!', role: 'user' })
    
    adminUser.role = 'admin'
    adminUser = await adminUser.save()

    // Sign in user
    adminToken = await sign(adminUser)
    expect(isJWT(adminToken)).toBe(true)
    
    defaultToken = await sign(defaultUser)
    expect(isJWT(defaultToken)).toBe(true)

    done()
})


describe(`Test /${apiEndpoint} endpoint:`, () => {
    test(`GET /${apiEndpoint} 200`, async () => {
        const {statusCode, body} = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}`)
            .set('Authorization', 'Bearer ' + adminToken)
        const firstItem = body[0]
        
        expect(statusCode).toBe(200)
        expect(Array.isArray(body)).toBe(true)
        expect(typeof firstItem.name).toEqual('string')
        expect(typeof firstItem.picture).toEqual('string')
        expect(firstItem.name).toEqual(adminUser.name)
        expect(firstItem.email).toEqual(adminUser.email)
        expect(firstItem.role).toEqual('admin')
        expect(firstItem._id).toBeTruthy()
        expect(firstItem.updatedAt).toBeUndefined()
    })

    test(`GET ${serverConfig.endpoint}/users/me 200`, async () => {
        const { body, statusCode, header } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/me`)
            .set('Authorization', 'Bearer ' + adminToken)
        
        expect(statusCode).toBe(201)
        expect(header['content-type']).toBe('application/json')
        expect(typeof body).toBe('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.role).toBe('string')
        expect(body.role).toBe('admin')
    })  

    test(`POST /${apiEndpoint} 401 - Create user with another roles`, async () => {
        const { status, body } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max2@moritz.com', password: 'Max123!!!', role: 'admin', token: serverConfig.masterKey })

        expect(status).toBe(401)
        expect(typeof body).toEqual('object')
    })

    test(`POST /${apiEndpoint} 401 - Create user without master key`, async () => {
        const { status, body } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max2@moritz.com', password: 'Max123!!!'})

        expect(status).toBe(401)
        expect(typeof body).toEqual('object')
    })

    test(`POST /${apiEndpoint} 201 - Create user`, async () => {
        const { status, body } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max3@moritz.com', password: 'Max123!!!', token: serverConfig.masterKey })

        expect(status).toBe(201)
        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')
        expect('password' in body).toBe(false)
        expect('keywords' in body).toBe(false)
        expect('services' in body).toBe(false)
        expect(body.email).toEqual('max3@moritz.com')
        expect(body.role).toEqual('user')
        expect(body.name).toEqual('max3')
    })

    test(`POST /${apiEndpoint} 400 - Create user with same email`, async () => {
        const { status, body } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max1@moritz.com', password: 'Max123!!!', token: serverConfig.masterKey })

        expect(status).toBe(400)
        expect(typeof body).toEqual('object')
    })

    test(`PATCH /${apiEndpoint}/:id 201 - Update user`, async () => {
        const { status, body } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${adminUser.id}`)
            .send({ name: 'Maxi', token: adminToken })

        expect(status).toBe(201)
        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')
        expect('password' in body).toBe(false)
        expect('keywords' in body).toBe(false)
        expect('services' in body).toBe(false)
        expect(body.role).toEqual('admin')
        expect(body.name).toEqual('Maxi')
    })

    test(`PATCH /${apiEndpoint}/me 201 - Update user`, async () => {
        const { status, body } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/me`)
            .send({ name: 'Max', token: defaultToken })

        expect(status).toBe(201)
        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')
        expect('password' in body).toBe(false)
        expect('keywords' in body).toBe(false)
        expect('services' in body).toBe(false)
        expect(body.role).toEqual('user')
        expect(body.role).toEqual('user')
        expect(body.name).toEqual('Max')
    })

    test(`PATCH /${apiEndpoint}/:id 201 - Update user`, async () => {
        const { status, body } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${defaultUser._id}`)
            .send({ name: 'Maximilian', token: defaultToken })

        expect(status).toBe(201)
        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')
        expect('password' in body).toBe(false)
        expect('keywords' in body).toBe(false)
        expect('services' in body).toBe(false)
        expect(body.role).toEqual('user')
        expect(body.name).toEqual('Maximilian')
    })

    test(`PATCH /${apiEndpoint}/:id 201 - Update user as admin`, async () => {
        const { status, body } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${defaultUser._id}`)
            .send({ name: 'Max', token: adminToken })

        expect(status).toBe(201)
        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')
        expect('password' in body).toBe(false)
        expect('keywords' in body).toBe(false)
        expect('services' in body).toBe(false)
        expect(body.role).toEqual('user')
        expect(body.name).toEqual('Max')
    })

    test(`PATCH /${apiEndpoint}/:id 401 - Update user`, async () => {
        const { status, body, header } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${adminUser.id}`)
            .send({ name: 'Maximilian', adminUser })

        expect(status).toBe(401)
        expect(header['content-type']).toBe('application/json')
        expect(body.code).toBe('Unauthorized')
    })

    test(`PATCH /${apiEndpoint}/:id/password 201 - Update user`, async () => {
        const { status, body } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${defaultUser._id}/password`)
            .send({ password: 'NewPasswort123!', token: defaultToken })

        expect(status).toBe(201)
        expect(typeof body).toEqual('object')
        expect(typeof body._id).toBe('string')
        expect(typeof body.picture).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.email).toBe('string')
        expect('password' in body).toBe(false)
        expect('keywords' in body).toBe(false)
        expect('services' in body).toBe(false)
        expect(body.role).toEqual('user')
        expect(body.name).toEqual('Maximilian')
    })
})

describe('set email', () => {
    it('sets name automatically', () => {
        adminUser.name = ''
        adminUser.email = 'test@example.com'
        
        expect(adminUser.name).toBe('test')
    })

    it('sets picture automatically', () => {
        const hash = crypto.createHash('md5').update(adminUser.email).digest('hex')
        
        expect(adminUser.picture).toBe(`https://gravatar.com/avatar/${hash}?d=identicon`)
    })

    it('changes picture when it is gravatar', () => {
        adminUser.email = 'b@b.com'
        const hash = crypto.createHash('md5').update(adminUser.email).digest('hex')
        
        expect(adminUser.picture).toBe(`https://gravatar.com/avatar/${hash}?d=identicon`)
    })

    it('does not change picture when it is already set and is not gravatar', () => {
        adminUser.picture = 'not_gravatar.jpg'
        adminUser.email = 'c@c.com'
        
        expect(adminUser.picture).toBe('not_gravatar.jpg')
    })

    it('sets welcomescreen to false', () => {
        adminUser.userSettings.hideWelcomePopup = false
        expect(adminUser.userSettings.hideWelcomePopup).toEqual(false)
    })
})

describe('createFromService', () => {
    let serviceUser

    beforeEach(() => {
        serviceUser = {
            id: '123',
            name: 'Test Name',
            email: 'test@test.com',
            picture: 'test.jpg'
        }
    })

    ;['facebook', 'github', 'google'].forEach((service) => {
        describe(service, () => {
            beforeEach(() => {
                serviceUser.service = service
            })

            it('updates user when email is already registered', async () => {
                const updatedUser = await Model.createFromService({ ...serviceUser, email: 'max1@moritz.com' })
                
                // keep
                expect(updatedUser.id).toBe(adminUser.id)
                expect(updatedUser.email).toBe(adminUser.email)
                // update
                expect(updatedUser.name).toBe(serviceUser.name)
                expect(updatedUser.services[service]).toBe(serviceUser.id)
                expect(updatedUser.picture).toBe(serviceUser.picture)
            })

            it('updates user when service id is already registered', async () => {
                await adminUser.set({ services: { [service]: serviceUser.id } }).save()
                const updatedUser = await Model.createFromService(serviceUser)
                
                // keep
                expect(updatedUser.id).toBe(adminUser.id)
                expect(updatedUser.email).toBe(adminUser.email)
                // update
                expect(updatedUser.name).toBe(serviceUser.name)
                expect(updatedUser.services[service]).toBe(serviceUser.id)
                expect(updatedUser.picture).toBe(serviceUser.picture)
            })

            it('creates a new user when neither service id and email was found', async () => {
                const createdUser = await Model.createFromService(serviceUser)
                
                expect(createdUser.id).not.toBe(adminUser.id)
                expect(createdUser.services[service]).toBe(serviceUser.id)
                expect(createdUser.name).toBe(serviceUser.name)
                expect(createdUser.email).toBe(serviceUser.email)
                expect(createdUser.picture).toBe(serviceUser.picture)
            })
        })
    })
})