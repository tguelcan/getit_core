import request from 'supertest'
import { isJWT } from 'validator'
import server from '~/server'
import { serverConfig } from '~/config'
import Model from '~/api/entry/model'
import { sign } from '~/services/guard'
import User from '~/api/user/model'


let defaultToken,
    defaultBuyer,
    otherBuyer0,
    defaultEntry,
    apiEndpoint = 'entries'

beforeEach(async (done) => {

    defaultBuyer = await User.create({ name: 'Maximilian', email: 'max2@moritz.com', password: 'Max123!!!', role: 'buyer' })
    otherBuyer0 = await User.create({ name: 'Maximilian', email: 'max3@moritz.com', password: 'Max123!!!', role: 'buyer' })

    defaultToken = await sign(defaultBuyer)
    expect(isJWT(defaultToken)).toBe(true)

    const postcode = 12345
    const entryType = 'product'
    const list = [ { name: 'eggs', amount: 42, unit: 'piece', shop: 'edeka' }, { name: 'milk', amount: 42, unit: 'liter', shop: 'bauerladen' }]
    const name = 'einkaufsliste'

    defaultEntry = await Model.create({email: 'max2@moritz.com', postcode, entryType, list, user: defaultBuyer._id, name})
    await Model.create({email: 'max2@moritz.com', postcode, entryType, list: [{ name: 'thing', amount: 3, unit: 'kg', shop: 'bauer'}], user: defaultBuyer._id, name})

    await Model.create({email: 'max3@moritz.com', postcode, entryType, list, user: otherBuyer0._id, createdAt: new Date().setMonth(1), name})

    await Model.create({email: 'max3@moritz.com', postcode: 99999, entryType, list, user: otherBuyer0._id, createdAt: new Date().setMonth(1), name})


    done()
})

describe(`Test /${apiEndpoint} endpoint:`, () => {

    test(`GET /${apiEndpoint} 200`, async () => {
        const postcode = 12345
        const entryType = 'product'
        const {status, body} = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}?postcode=${postcode}&type=${entryType}`)
            .set('Authorization', 'Bearer ' + defaultToken)
        expect(status).toBe(201)
        expect(Array.isArray(body)).toBe(true)
        // TODO: Test the right order
        body.forEach((entry) => {
            expect(entry.postcode).toBe(postcode)
            expect(entry.entryType).toBe(entryType)
        })
        expect(body.length).toBe(3)

    })

    test(`GET /${apiEndpoint} 200`, async () => {
        const postcode = 12345
        const entryType = 'product'
        const {status, body} = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}?postcode=${postcode}&type=${entryType}&count=1`)
            .set('Authorization', 'Bearer ' + defaultToken)
        
        expect(status).toBe(201)
        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBe(1)

    })



    test(`GET /${apiEndpoint} 401 - missing token`, async () => {
        const postcode = 12345
        const entryType = 'product'
        const { status } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}?postcode=${postcode}&type=${entryType}`)
        
        expect(status).toBe(401)
    })

    test(`GET /${apiEndpoint} 400 - missing all query parameter`, async () => {
        const { status } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}`)
            .set('Authorization', 'Bearer ' + defaultToken)

        expect(status).toBe(400)
    })

    test(`GET /${apiEndpoint} 400 - missing postcode query parameter`, async () => {
        const entryType = 'product'
        const { status, body } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}?type=${entryType}`)
            .set('Authorization', 'Bearer ' + defaultToken)

        expect(status).toBe(201)
        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBe(4)
    })



    test(`POST /${apiEndpoint} 201`, async () => {
        const email = 'max2@moritz.com'
        const postcode = 12345
        const entryType = 'product'
        const name = 'einkaufsliste'
        const list = [ { name: 'eggs', amount: 42, unit: 'piece', shop: 'edeka' }, { name: 'milk', amount: 42, unit: 'liter', shop: 'bauerladen' }]
        const { body, status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email, token: defaultToken,  user: defaultBuyer._id, postcode, entryType, list, name} )

        expect(body.user.toString()).toEqual(defaultBuyer._id.toString())
        expect(body.postcode).toBe(postcode)
        expect(body.entryType).toBe(entryType)
        expect(typeof body.createdAt).toBe('string')
        expect(body.list).toEqual(list)
        expect(status).toBe(201)
        
    })

    test(`POST /${apiEndpoint} 401 - wrong mail`, async () => {
        const email = 'max3@moritz.com'
        const postcode = 12345
        const entryType = 'product'
        const name = 'einkaufsliste'
        const list = [ { name: 'eggs', amount: 42, unit: 'piece', shop: 'edeka' }, { name: 'milk', amount: 42, unit: 'liter', shop: 'bauerladen' }]
        const { status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email, token: defaultToken,  user: defaultBuyer._id, postcode, entryType, list, name} )

        expect(status).toBe(401)
        
    })


    test(`POST /${apiEndpoint} 401 - wrong token`, async () => {
        const email = 'max2@moritz.com'
        const postcode = 12345
        const entryType = 'product'
        const name = 'einkaufsliste'
        const list = [ { name: 'eggs', amount: 42, unit: 'piece', shop: 'edeka' }, { name: 'milk', amount: 42, unit: 'liter', shop: 'bauerladen' }]
        const { status } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email, token: '123',  user: defaultBuyer._id, postcode, entryType, list, name} )


        expect(status).toBe(401)
        
    })
    
    test(`GET /${apiEndpoint}/me 200`, async () => {
        const {status, body} = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/me`)
            .set('Authorization', 'Bearer ' + defaultToken)
        
        expect(status).toBe(201)
        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBe(2)
    })

    test(`GET /${apiEndpoint}/me 401 - missing token`, async () => {
        const { status } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/me`)
        
        expect(status).toBe(401)
    })

    test(`GET /${apiEndpoint}/me 200`, async () => {
        const { status, body } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/me?count=1`)
            .set('Authorization', 'Bearer ' + defaultToken)
        
        expect(status).toBe(201)
        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBe(1)
    })
   

    test(`GET /${apiEndpoint}/:id 200`, async () => {
        const { status, body } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/${defaultEntry._id}`)
        
        expect(status).toBe(200)
        expect(body.postcode).toBe(defaultEntry.postcode)
        expect(body.entryType).toBe(defaultEntry.entryType)
        expect(new Date(body.createdAt)).toStrictEqual(defaultEntry.createdAt)
        expect(body.id).toBe(defaultEntry._id.toString())

    })


})