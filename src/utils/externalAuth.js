import request from 'request-promise'


export const providerAuth = {

    facebook: async (access_token) => {
        const { id, name, email, picture } = await request({
            uri: 'https://graph.facebook.com/me',
            json: true,
            qs: {
                access_token,
                fields: 'id, name, email, picture'
            }
        })

        return { 
            service: 'facebook',
            picture: picture?.data?.url,
            id,
            name,
            email
        }
    },

    google: async (access_token) => {
        const { id, name, email, picture } = await request({
            uri: 'https://www.googleapis.com/userinfo/v2/me',
            json: true,
            qs: {
                access_token
            }
        })

        return { 
            service: 'google',
            picture,
            id,
            name,
            email
        }

    }

}


