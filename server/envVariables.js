import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config()

export const { MONGO_URL } = process.env
export const { PASSPORT_KEY } = process.env
export const { AllowedUrls } = process.env
export const { NODE_ENV } = process.env

