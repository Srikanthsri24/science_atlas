import{mkdir,cp,rm}from'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('public/data/',root),{recursive:true});await cp(new URL('data/',root),new URL('public/data/',root),{recursive:true});
await rm(new URL('public/reports/',root),{recursive:true,force:true});await mkdir(new URL('public/reports/',root),{recursive:true});
for(const name of ['concept-ledger.json','COMPANY_CONTENT.md'])await cp(new URL('reports/'+name,root),new URL('public/reports/'+name,root));
