import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config()

export const { MONGO_URL } = process.env
export const { PASSPORT_KEY } = process.env
export const { AllowedUrls } = process.env
export const { NODE_ENV } = process.env
export const { ACCESS_TOKEN } = process.env
export const { GRAPH_URI } = 'https://graph.microsoft.com/v1.0'
