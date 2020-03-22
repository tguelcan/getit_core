import request from 'supertest'
import { isJWT } from 'validator'
import server from '~/server'
import { serverConfig } from '~/config'
import Model from '~/api/entry/model'
import { sign } from '~/services/guard'
import User from '~/api/user/model'


let dataObject, 
    adminToken,
    defaultToken,
    defaultBuyer, 
    apiEndpoint = 'entries'

beforeEach(async (done) => {
    
    defaultBuyer = await User.create({ name: 'Maximilian', email: 'max2@moritz.com', password: 'Max123!!!', role: 'buyer' })

    defaultToken = await sign(defaultBuyer)
    expect(isJWT(defaultToken)).toBe(true)
    done()
})

describe(`Test /${apiEndpoint} endpoint:`, () => {
/* 
    test(`GET /${apiEndpoint} 200`, async () => {
        const {statusCode, body} = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}`)
        const firstItem = body[0]
        
        expect(statusCode).toBe(200)
        expect(Array.isArray(body)).toBe(true)
        expect(typeof firstItem.content).toEqual('string')
        expect(firstItem.content).toEqual(dataObject.content)
        expect(firstItem.id).toBeTruthy()
        expect(firstItem.updatedAt).toBeUndefined()
    })

    test(`GET /${apiEndpoint}:id 200`, async () => {
        const { status, body } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/${dataObject.id}`)
        
        expect(status).toBe(200)
        expect(typeof body).toEqual('object')
        expect(body.content).toEqual(dataObject.content)
    })

    test(`GET /${apiEndpoint}/:id 404`, async () => {
        const { status } = await request(server)
            .get(`${serverConfig.endpoint}/${apiEndpoint}/123456789098765432123456`)
        
        expect(status).toBe(404)
    })
    
 */    test(`POST /${apiEndpoint} 201`, async () => {
        const { body } = await request(server)
            .post(`${serverConfig.endpoint}/${apiEndpoint}`)
            .send({ email: 'max2@moritz.com', token: defaultToken,  user: defaultBuyer._id, postcode: '12345', type: 'product', list: [ { name: 'eggs', amount: 42, unit: 'piece', shop: 'farmer dude', }]} )
        
        console.log(body)
        //const entry = await Model.findOne({user: defaultBuyer._id})
        //console.log(entry.modelProjection())

    })
    /* 
    test(`PATCH /${apiEndpoint}/:id 200`, async () => {
        const { status, body } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/${dataObject.id}`)
            .send({ content: 'newContent' })
        
        expect(status).toBe(200)
        expect(typeof body).toEqual('object')
        expect(body.content).toEqual('newContent')
    })

    test(`PATCH /${apiEndpoint}/:id 404`, async () => {
        const { status } = await request(server)
            .patch(`${serverConfig.endpoint}/${apiEndpoint}/123456789098765432123456`)
            .send({ content: 'test' })
        
        expect(status).toBe(404)
    })
    
    test(`DELETE /${apiEndpoint}/:id 200`, async () => {
        const { status } = await request(server)
            .delete(`${serverConfig.endpoint}/${apiEndpoint}/${dataObject.id}`)
        
        expect(status).toBe(200)
    })

    test(`DELETE /${apiEndpoint}/:id 404`, async () => {
        const { status } = await request(server)
            .delete(`${serverConfig.endpoint}/${apiEndpoint}/123456789098765432123456`)
        
        expect(status).toBe(404)
    })

    test(`DELETE /${apiEndpoint}/all 401`, async () => {
        const { status, body, header } = await request(server)
            .delete(`${serverConfig.endpoint}/${apiEndpoint}/all`)
        
        expect(status).toBe(401)
        expect(header['content-type']).toBe('application/json')
        expect(body.code).toBe('Unauthorized')
    })

    test(`DELETE /${apiEndpoint}/all 200`, async () => {
        const { status } = await request(server)
            .delete(`${serverConfig.endpoint}/${apiEndpoint}/all`)
            .set('Authorization', 'Bearer ' + adminToken)

        expect(status).toBe(200)
    })

    test(`DELETE /${apiEndpoint}/all 401`, async () => {
        const { status } = await request(server)
            .delete(`${serverConfig.endpoint}/${apiEndpoint}/all`)
            .set('Authorization', 'Bearer ' + defaultToken)

        expect(status).toBe(401)
    })
     */

})