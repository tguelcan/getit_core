import restifyMongoose from 'restify-mongoose'
import { Router } from 'restify-router'
import { restConfig } from '~/config'
import { doorman, masterman } from '~/services/guard'
import { validateUserBeforeCreate } from '~/utils'
import model, { modelProjection } from './model'
import { getMe, create, update, updatePassword } from './controller'

const config = {

    /*
     * The returned results can use mongoose's "populate" query modifier to populated referenced documents within models.
     * Referenced documents can be populated in three ways:
     * Adding populate=[referenced_field] to the query string will populate the referenced_field, if it exists.
     *
     * Multiple referenced documents can be populated by using a comma-delimited list of the desired fields in any of the three methods above.
     * */

    // populate: 'author,contributors'
    
    /*
     * Results can be filtered with a function, which is set in the options object of the constructor or on the query and detail function.
     * */

    // filter: ((req) => new Object({author: req._id}))
    
    /*
     * Sort parameters are passed by query string parameter sort.
     * */
    
    // sort: '-createdAt'

    /*
     * Requests that return multiple items in query will be paginated to 100 items by default. You can set the pageSize (number min=1) by adding it to the options.
     * */
    
    // pageSize: 50,
    
    /*
     * The output format can be changed to a more compatible one with the json-api standard to use the API with frameworks like Ember.
     * */

    // outputFormat: 'json-api',
    // modelName: 'data',
    
    /*
     * these functions will now conduct searches with the field 'myField'. (defaults to '_id')
     * */

    // queryString: 'myField'
    
    /*
     * To restrict selected columns you can pass a query string parameter __select__.
     * Select fields can be separated by comma or space. They will be passed to http://mongoosejs.com/docs/api.html#query_Query-select
     * To select only title and date the fields of a notes resource append the __select__ query parameter to the URL:
     * http://localhost:3000/users?select=content,createdAt
     * */

    // select: '_id'
    
    /*
     * Projection functions are specified in the options for the resitfy-mongoose contructor, the query function, or the detail function.
     **/

    listProjection: modelProjection,
    detailProjection: modelProjection
}

const router = new Router()
const endpoint = restifyMongoose(model, Object.assign(restConfig, config))


/*
 * Serve resources with fine grained mapping control
 * */

/**
 * @api {get} /users Retrieve users
 * @apiName RetrieveUsers
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} token User token.
 * @apiUse listParams
 * @apiSuccess {Object[]} users List of users.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 */
router.get('', 
    doorman(['user', 'admin']), 
    endpoint.query())

/**
 * @api {get} /users/me Retrieve current user
 * @apiName RetrieveCurrentUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} token User token.
 * @apiParam {String} admintoken Admin token.
 * @apiSuccess {Object} user User's data.
 */
router.get('/me', doorman(['user', 'admin', 'buyer', 'distributor']), 
    getMe)

/**
 * @api {get} /users/:id Retrieve user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiPermission public
 * @apiSuccess {Object} user User's data.
 * @apiError 404 User not found.
 */
router.get('/:id', 
    endpoint.detail())

/**
 * @api {post} /users Create user
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission master
 * @apiParam {String} token Master token.
 * @apiParam {String} email User's email.
 * @apiParam {String{6..}} password User's password.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiParam {String=user,admin} [role=user] User's role.
 * @apiSuccess (Sucess 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 409 Email already registered.
 */
router.post('', 
    masterman(), 
    validateUserBeforeCreate(), 
    create)

/**
 * @api {patch} /users/:id Update user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} token User token.
 * @apiParam {String} admintoken User token.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiParam {Object} [userSettings] some usersettings values.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user or admin access only.
 * @apiError 404 User not found.
 */ 
router.patch('/:id', 
    doorman(['user', 'admin', 'buyer', 'distributor']), 
    update)


/**
 * @api {patch} /users/:id/password Update password
 * @apiName UpdatePassword
 * @apiGroup User
 * @apiParam {String} token User token.
 * @apiParam {String} admintoken Admin token.
 * @apiParam {String{6..}} password User's new password.
 * @apiSuccess (Success 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user access only.
 * @apiError 404 User not found.
 */
router.patch('/:id/password',
    doorman(['user', 'admin']),
    updatePassword)


/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteMessage
 * @apiGroup User
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 User not found.
 */
router.del('/:id', 
    endpoint.remove())


export default router

