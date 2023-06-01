import mongoose from "mongoose"

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

const mongoosePromise = process.env.MONGODB_URI
  ? mongoose.connect(process.env.MONGODB_URI)
  : null

export default mongoosePromise
