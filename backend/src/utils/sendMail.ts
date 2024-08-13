import resend from '../config/resend';
import dotenv from 'dotenv';

dotenv.config();

type Email = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

const getFromEmail = () =>
	process.env.NODE_ENV === 'development'
		? 'onboarding@resend.dev'
		: process.env.EMAIL_SENDER || '';

const getToEmail = (to: string) =>
	process.env.NODE_ENV === 'development' ? 'delivered@resend.dec' : to;

export const sendMail = async ({ to, subject, text, html }: Email) => {
	try {
		await resend.emails.send({
			from: getFromEmail(),
			to: getToEmail(to),
			subject,
			text,
			html,
		});
	} catch (err) {
		console.error('Error sending email', err);
	}
};
