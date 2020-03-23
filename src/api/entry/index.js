import restifyMongoose from 'restify-mongoose'
import { Router } from 'restify-router'
import { restConfig } from '~/config'
import { deleteAll, create, get, getMe } from './controller'
import model, { modelProjection } from './model'
import { doorman } from '~/services/guard'

const config = {

    /**
   * The returned results can use mongoose's "populate" query modifier to populated referenced documents within models.
   * Referenced documents can be populated in three ways:
   * Adding populate=[referenced_field] to the query string will populate the referenced_field, if it exists.
   *
   * Multiple referenced documents can be populated by using a comma-delimited list of the desired fields in any of the three methods above.
   */
    // populate: 'author,contributors'

    /**
   * Results can be filtered with a function, which is set in the options object of the constructor or on the query and detail function.
   */
    // filter: ((req) => new Object({author: req._id}))

    /**
   * Sort parameters are passed by query string parameter sort.
   */
    // sort: '-createdAt'

    /**
   * Requests that return multiple items in query will be paginated to 100 items by default. You can set the pageSize (number min=1) by adding it to the options.
   */
    // pageSize: 50,

    /**
   * The output format can be changed to a more compatible one with the json-api standard to use the API with frameworks like Ember.
   */
    // outputFormat: 'json-api',
    // modelName: 'data',

    /**
   * these functions will now conduct searches with the field 'myField'. (defaults to '_id')
   */
    // queryString: 'myField'

    /**
   * To restrict selected columns you can pass a query string parameter __select__.
   * Select fields can be separated by comma or space. They will be passed to http://mongoosejs.com/docs/api.html#query_Query-select
   * To select only title and date the fields of a notes resource append the __select__ query parameter to the URL:
   * http://localhost:3000/entries?select=content,createdAt
   */
    // select: '_id'

    /**
   * Projection functions are specified in the options for the resitfy-mongoose contructor, the query function, or the detail function.
   */
    listProjection: modelProjection,
    detailProjection: modelProjection
}

const router = new Router()
const endpoint = restifyMongoose(model, Object.assign(restConfig, config))

/**
 * Serve resources with fine grained mapping control
 */

/**
 * @api {get} /entries Retrieve entries
 * @apiName Retrieveentries
 * @apiGroup Entry
 * @apiParam {Number} count
 * @apiParam {Number} postcode
 * @apiSuccess {Object[]} entries List of entries.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('',
    doorman(['buyer', 'admin', 'retailer', 'distributor']),
    get)

/**
 * @api {get} /entries/me Retrieve user entries
 * @apiName RetrieveEntry
 * @apiGroup Entry
 * @apiSuccess {Array} entry Entry's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Missing permissions.
 */
router.get('/me', doorman(['user', 'admin', 'buyer', 'retailer']),
    getMe)

/**
 * @api {post} /entries Create entry
 * @apiName CreateEntry
 * @apiGroup Entry
 * @apiPermission buyer, admin, retailer
 * @apiParam {Number} postcode
 * @apiParam {String} entryType product or service
 * @apiParam {Array} list array with objects as modeled in entry schema
 * @apiParam {Date} deliveryDate
 * @apiParam {String} email user mail
 * @apiParam {String} name list name
 * 
 * @apiSuccess {Object} entry Entry's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Missing permissions.
 */
router.post('',
    doorman(['buyer', 'admin', 'retailer']),
    create)

/**
 * @api {get} /entries/:id Retrieve entry
 * @apiName RetrieveEntry
 * @apiGroup Entry
 * @apiPermission public
 * @apiSuccess {Object} entry data.
 * @apiError 400 Entry not found.
 */
router.get('/:id', 
    endpoint.detail())


// TODO:
// Patch + Del

/**
 * @api {delete} /entries/all Delete all entries
 * @apiName DeleteAllentries
 * @apiGroup Entry
 * @apiPermission admin
 * @apiParam {String} admintoken admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 admin access only.
 */
router.del('/all', doorman(['admin']), deleteAll)

/**
 * Export this function
 * @returns {Function} the Router of entry
 */
export default router
