import mongoose from 'mongoose'
mongoose.Promise = global.Promise

/* istanbul ignore next */ 
export const connect = async ({ url, options }) => {
    await mongoose.connect(url, options)
}

export default mongoose
