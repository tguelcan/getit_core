import restifyMongoose from 'restify-mongoose'
import { Router } from 'restify-router'
import { restConfig } from '~/config'
import { doorman } from '~/services/guard'
import { deleteAll } from './controller'
import model, { modelProjection } from './model'

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
     * http://localhost:3000/institutions?select=content,createdAt
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
 * @api {get} /institutions Retrieve institutions
 * @apiName RetrieveInstitutions
 * @apiGroup Institution
 * @apiUse listParams
 * @apiHeader {Number} x-total-count Institutions count.
 * @apiSuccess {Object[]} institutions List of institutions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('', endpoint.query())

/**
 * @api {get} /institutions/:id Retrieve institution
 * @apiName RetrieveInstitution
 * @apiGroup Institution
 * @apiSuccess {Object} institution Institution's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Institution not found.
 */
router.get('/:id', endpoint.detail())

/**
 * @api {post} /institutions Create institution
 * @apiName CreateInstitution
 * @apiGroup Institution
 * @apiPermission user
 * @apiParam content Institution's content.
 * @apiSuccess {Object} institution Institution's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Institution not found.
 */
router.post('', endpoint.insert())

/**
 * @api {patch} /institutions/:id Update institution
 * @apiName UpdateInstitution
 * @apiGroup Institution
 * @apiParam content Institution's content.
 * @apiSuccess {Object} institution Institution's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Institution not found.
 */  
router.patch('/:id', endpoint.update())

/**
 * @api {delete} /institutions/:id Delete institution
 * @apiName Institution
 * @apiGroup Institution
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Institution not found.
 */
router.del('/:id', endpoint.remove())

/**
 * @api {delete} /institutions/all Delete all institutions
 * @apiName DeleteAllInstitutions
 * @apiGroup Institution
 * @apiPermission admin
 * @apiParam {String} admintoken admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 admin access only.
 */
router.del('/all', doorman(['admin']), deleteAll)


/**
 * Export this function
 * @returns {Function} the Router of institution
 */
export default router

