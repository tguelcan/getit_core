import { Router } from 'restify-router'
import { masterman } from '~/services/guard'
import { create, show, update } from './controller'

const router = new Router()

/**
 * @api {post} /password-resets Send email
 * @apiName SendPasswordReset
 * @apiGroup PasswordReset
 * @apiPermission master
 * @apiParam {String} email Email address to receive the password reset token.
 * @apiParam {String} link Link to redirect user.
 * @apiSuccess (Success 202) 202 Accepted.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.post('',
    masterman(),
    create)

/**
 * @api {get} /password-resets/:token Verify token
 * @apiName VerifyPasswordReset
 * @apiGroup PasswordReset
 * @apiSuccess {String} token Password reset token.
 * @apiSuccess {Object} user User's data.
 * @apiError 404 Token has expired or doesn't exist.
 */
router.get('/:token',
    show)

/**
 * @api {patch} /password-resets/:token Submit password
 * @apiName SubmitPasswordReset
 * @apiGroup PasswordReset
 * @apiParam {String{6..}} password User's new password.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Token has expired or doesn't exist.
 */
router.patch('/:token',
    update)

export default router
