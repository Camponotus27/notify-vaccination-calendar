import nodemailer from 'nodemailer';

export interface MailToSend {
	to: string;
	subject: string;
	text: string;
	html: string;
	attachments: any[];
}

export default async function SendMail({
	to,
	subject,
	text,
	html,
	attachments,
}: MailToSend): Promise<void> {
	let jConfig = {
		host: process.env.EMAIL_HOST,
		port: Number(process.env.EMAIL_PORT),
		secure: true,
		requireTLS: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		logger: true,
	};

	let createTransport = nodemailer.createTransport(jConfig);

	let email = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		text,
		html,
		attachments,
		//headers: { 'x-myheader': 'test header' },
	};

	await createTransport.sendMail(email);
}
