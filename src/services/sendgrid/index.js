/* eslint camelcase: 0 */

import sendgridMail from '@sendgrid/mail'
import { serverConfig } from '~/config'

let { sendgridKey, defaultEmail } = serverConfig

sendgridMail.setApiKey(sendgridKey)

export const sendMail = ({
    fromEmail = defaultEmail,
    toEmail,
    subject,
    content
}) => {
    const msg = {
        to: toEmail,
        from: fromEmail,
        subject,
        html: content
    }
    return sendgridMail.send(msg)
}

export const sendDynamicMail = ({
    fromEmail = defaultEmail,
    toEmail,
    templateId,
    dynamic_template_data
}) => {
    const msg = {
        to: toEmail,
        from: fromEmail,
        templateId,
        dynamic_template_data
    }
    return sendgridMail.send(msg)
}
