import {mkdir,cp} from 'node:fs/promises';
for(const dir of ['data','reports']){await mkdir(new URL(`../public/${dir}/`,import.meta.url),{recursive:true});await cp(new URL(`../${dir}/`,import.meta.url),new URL(`../public/${dir}/`,import.meta.url),{recursive:true});}
