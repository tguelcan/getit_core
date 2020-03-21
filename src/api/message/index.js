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
     * http://localhost:3000/messages?select=content,createdAt
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


/*
 * Serve resources with fine grained mapping control
 * */

/* GET */
/**
 * @api {get} /messages Retrieve messages
 * @apiName RetrieveMessages
 * @apiGroup Message
 * @apiUse listParams
 * @apiHeader {Number} x-total-count Messages count.
 * @apiSuccess {Object[]} messages List of messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('', endpoint.query())

/**
 * @api {get} /messages/:id Retrieve message
 * @apiName RetrieveMessage
 * @apiGroup Message
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.get('/:id', endpoint.detail())

/* POST */
/**
 * @api {post} /messages Create message
 * @apiName CreateMessage
 * @apiGroup Message
 * @apiPermission user
 * @apiParam content Message's content.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.post('', endpoint.insert())

/* PATCH */
/**
 * @api {put} /messages/:id Update message
 * @apiName UpdateMessage
 * @apiGroup Message
 * @apiParam content Message's content.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */  
router.patch('/:id', endpoint.update())

/* DELETE */
/**
 * @api {delete} /messages/:id Delete message
 * @apiName Message
 * @apiGroup Message
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Message not found.
 */
router.del('/:id', endpoint.remove())

/**
 * @api {delete} /messages/all Delete all messages
 * @apiName DeleteAllMessages
 * @apiGroup Message
 * @apiPermission admin
 * @apiParam {String} admintoken admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 admin access only.
 */
router.del('/all', doorman(['admin']), deleteAll)

/**
 * Export this function
 * @returns {Function} the Router of message
 */
export default router

