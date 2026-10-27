import { PrismaClient, StatusBlok } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const prisma = new PrismaClient();
function parse(line:string){ const a:string[]=[]; let s='',q=false; for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){q=!q}else if(c===','&&!q){a.push(s);s=''}else{s+=c}}a.push(s);return a}
async function main(){
 const lines=readFileSync(join(process.cwd(),'data/db_aresta.csv'),'utf8').trim().split(/\r?\n/).slice(1);
 const data=lines.map(line=>{const [estate,kebun,afdeling,kode,luas,jumlah]=parse(line); const luasHa=Number(luas); const jumlahPokok=Number(jumlah); return {estate,kebun,afdeling,kode,luasHa,jumlahPokok,status:luasHa===0&&jumlahPokok===0?StatusBlok.DATA_KOSONG:StatusBlok.AKTIF}});
 for(let i=0;i<data.length;i+=500){ await prisma.blok.createMany({data:data.slice(i,i+500),skipDuplicates:true}); console.log(`Impor ${Math.min(i+500,data.length)}/${data.length}`)}
}
main().finally(()=>prisma.$disconnect());
