import fs from 'fs/promises';
const path = require('path');

export async function GetNameListFilesDir(urlDir: string): Promise<string[]> {
	return await fs.readdir(urlDir);
}

export async function GetPathListFilesDir(urlDir: string): Promise<string[]> {
	const nameFiles: string[] = await GetNameListFilesDir(urlDir);
	return nameFiles.map((nameFile) => path.join(urlDir, nameFile));
}

export async function GetNameFolderPathListFolderDir(
	urlDir: string
): Promise<string[]> {
	const files: string[] = await fs.readdir(urlDir);
	return files.filter((file) => file !== '.DS_Store');
}

export async function CopyFile() {
	const filePath = './uploads/my-image.png';

	const filePathCopy = './images/my-image-copy.png';

	await fs.copyFile(filePath, filePathCopy);
}

export async function ObjectToJsonFile(
	pathJson: string,
	object: any
): Promise<void> {
	const arrayPathPointSplit = pathJson.split('.');

	let extension: string | undefined;
	if (arrayPathPointSplit.length > 1) extension = arrayPathPointSplit.pop();

	if (!extension) pathJson = `${pathJson}.json`;
	else if (extension !== 'json') throw 'extension is not json';

	return await fs.writeFile(pathJson, JSON.stringify(object));
}

export async function GetObjectFromJsonFile<T>(pathJson: string): Promise<T> {
	let buffer: Buffer = await fs.readFile(pathJson);
	return JSON.parse(buffer.toString());
}
