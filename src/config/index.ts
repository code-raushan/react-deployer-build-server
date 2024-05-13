import dotenv from 'dotenv';
dotenv.config();

export const PROJECT_ID = process.env.PROJECT_ID! as string;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY! as string;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY! as string;
export const AWS_REGION = process.env.AWS_REGION! as string;
export const UPLOAD_BUCKET = process.env.UPLOAD_BUCKET! as string;