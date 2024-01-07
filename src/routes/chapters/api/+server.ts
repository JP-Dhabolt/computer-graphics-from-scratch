import { readdirSync } from 'fs';
import * as path from 'path';
import { json, type RequestHandler } from '@sveltejs/kit';

const ignoreList = ['.', '..', '+layout.svelte', 'api'];

export const GET: RequestHandler = async () => {
  const dirName = path.resolve(path.join('.', 'src', 'routes', 'chapters'));
  const files = readdirSync(dirName);
  const filtered = files.filter((file) => !ignoreList.includes(file));
  return json(filtered.map((file) => file.replace('.svelte', '')));
};
