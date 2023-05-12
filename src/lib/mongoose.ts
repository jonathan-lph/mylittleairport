import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const mongoosePromise = mongoose.connect(process.env.MONGODB_URI)

export default mongoosePromise
