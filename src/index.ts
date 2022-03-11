import GetData from './getData';
import SendMail, { MailToSend } from './sendMail';
import {
	GetPathListFilesDir,
	GetObjectFromJsonFile,
	ObjectToJsonFile,
} from './utils/files';

require('dotenv').config();

const PATH_USERS = 'src/data/users.json';
const PATH_IMAGES = 'src/images';

interface UsersSendMail {
	email: string;
	sendedImages: string[];
}

async function main() {
	GetData()
		.then(() => sendMails())
		.then(() => console.log('Done'))
		.catch((err) => {
			console.log(err);
		});
}

main();

async function sendMails() {
	const pathImages: string[] = await getPathImages();
	const users: UsersSendMail[] = await GetObjectFromJsonFile<UsersSendMail[]>(
		PATH_USERS
	);

	for (let i = 0; i < users.length; i++) {
		for (let j = 0; j < pathImages.length; j++) {
			if (!users[i].sendedImages.includes(pathImages[j])) {
				console.log(
					`Sending mail to ${users[i].email} with image ${pathImages[j]}`
				);
				await sendMailAndSaveUser(users, users[i], pathImages[j]);
			} else {
				console.log(
					`Skipping mail to ${users[i].email} with image ${pathImages[j]}`
				);
			}
		}
	}
}

async function sendMailAndSaveUser(
	users: UsersSendMail[],
	user: UsersSendMail,
	pathImage: string
) {
	await buildMailAndSend(user.email, pathImage);
	user.sendedImages.push(pathImage);
	await ObjectToJsonFile(PATH_USERS, users);
}

async function getPathImages(): Promise<string[]> {
	return GetPathListFilesDir(PATH_IMAGES);
}

function buildMailAndSend(email: string, pathImage: string) {
	const subject: string = 'Notificacion de Vacunas';
	const text: string = 'Texto de prueba';
	const html: string = '<img src="cid:unique@kreata.ee"/>';
	const attachments: any[] = [
		{
			filename: 'image.png',
			path: pathImage,
			cid: 'unique@kreata.ee',
		},
	];

	const mailToSend: MailToSend = {
		to: email,
		subject,
		text,
		html,
		attachments,
	};

	SendMail(mailToSend);
}
