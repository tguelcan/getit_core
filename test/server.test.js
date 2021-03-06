import 'dotenv/config'
import request from 'supertest'
import server from '~/server'
import { serverConfig, dbConfig } from '~/config'
import { requireProcessEnv } from '~/utils'
import { Router } from 'restify-router'


let config = serverConfig, 
    apiEndpoint = 'test'

beforeAll((done) => {
    describe('Add Testrouter', () => {
        const router = new Router()

        router.get('/test', ((req, res, next) => {
            res.json({ content: 'Hello World!' })
            next()
        }))

        router.applyRoutes(server)
    })
    done()
})

describe('Server Test:', () => {
    test('Load Server', (done) => {
        expect(typeof config.server).toEqual('object')
        done()
    })

    test('Load JWT', (done) => {
        expect(typeof config.jwt).toEqual('object')
        expect(typeof config.jwt?.secret).toEqual('string')
        done()
    })

    test('Load DB Config', (done) => {
        expect(typeof dbConfig.url).toBeTruthy()
        expect(typeof dbConfig.url).toEqual('string')
        expect(dbConfig.url.startsWith('mongodb://')).toBeTruthy()
        done()
    })

    test(`GET /${apiEndpoint} 200`, async (done) => {
        const { body, statusCode, header } = await request(server)
            .get(`/${apiEndpoint}`)
        expect(statusCode).toBe(200)
        expect(header['content-type']).toBe('application/json')
        expect(typeof body).toBe('object')
        expect(typeof body.content).toBe('string')
        expect(body.content).toBe('Hello World!')
        done()
    })

    test(`GET /${apiEndpoint}/test 404`, async (done) => {
        const { body, statusCode, header } = await request(server)
            .get(`/${apiEndpoint}/test`)
        expect(statusCode).toBe(404)
        expect(header['content-type']).toBe('application/json')
        expect(body.code).toBe('ResourceNotFound')
        expect(typeof body).toBe('object')
        done()
    })

})
