import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
const fs = require('fs');
const path = require('path');

export default async function GetData() {
	console.log('Obteniendo informacion de calendario de vacunas');

	const URL_VACUNATION_CALENDAR: string = 'http://www.corporacionbuin.cl';
	try {
		await mkdirpSync('src/images');

		let res: AxiosResponse = await axios.get(URL_VACUNATION_CALENDAR);
		const html = await res.data;
		const $ = cheerio.load(html);
		const images: cheerio.Cheerio = $(
			'#bdt-modal-0c84090 .bdt-modal-body > p > img'
		);

		images.each((i, elem) => {
			const urlImange = $(elem).attr('src');
			if (urlImange) urlToObject(urlImange, 'images');
		});
	} catch (err) {
		console.log('Error al obtener informacion de calendario de vacunas: ', err);
	}
}

const urlToObject = async (fileUrl: string, downloadFolder: string) => {
	const fileName = path.basename(fileUrl);
	try {
		const localFilePath = path.resolve(__dirname, downloadFolder, fileName);

		const response = await axios({
			method: 'GET',
			url: fileUrl,
			responseType: 'stream',
		});

		const w = response.data.pipe(fs.createWriteStream(localFilePath));
		w.on('finish', () => {
			console.log('Successfully downloaded file!');
		});
		w.on('error', () => {
			console.log('fail!');
		});
	} catch (err) {
		console.log('Error to get image from url: ', err);
	}
};

var mkdirpSync = function (dirpath: string) {
	var parts = dirpath.split(path.sep);
	for (var i = 1; i <= parts.length; i++) {
		try {
			fs.mkdirSync(path.join.apply(null, parts.slice(0, i)));
		} catch (e: any) {
			if (e.code != 'EEXIST') throw e;
			else console.log('Folder already exists');
		}
	}
};
