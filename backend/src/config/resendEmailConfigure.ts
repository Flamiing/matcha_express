import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend: Resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
