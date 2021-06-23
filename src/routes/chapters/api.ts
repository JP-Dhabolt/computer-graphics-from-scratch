import { readdirSync } from 'fs';
import * as path from 'path';
import type { EndpointOutput } from '@sveltejs/kit';

const ignoreList = ['.', '..', '__layout.svelte', 'api.ts'];

export async function get(): Promise<EndpointOutput> {
  const dirName = path.resolve(path.join('.', 'src', 'routes', 'chapters'));
  const files = readdirSync(dirName);
  const filtered = files.filter((file) => !ignoreList.includes(file));
  return {
    body: filtered.map((file) => file.replace('.svelte', '')),
  };
}
