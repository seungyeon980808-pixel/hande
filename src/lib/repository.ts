import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { AppState,Collection } from "./domain";
import { createSerialQueue } from "./serial-queue";
const dataDir=path.join(process.cwd(),".data"); const stateFile=path.join(dataDir,"state.json"); const runSerial=createSerialQueue();
async function readState():Promise<AppState>{ await fs.mkdir(dataDir,{recursive:true}); try{const state=JSON.parse(await fs.readFile(stateFile,"utf8")) as AppState;state.collections??=[];for(const collection of state.collections){collection.type??="document";collection.mode??="individual";collection.sharedFields??=[];collection.sharedFieldStates??=[];for(const recipient of collection.recipients){recipient.drafts??=[];recipient.versions??=[]}}return state}catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return {collections:[]};throw error} }
async function writeState(state:AppState){const temp=`${stateFile}.${process.pid}.tmp`;await fs.writeFile(temp,JSON.stringify(state,null,2),{mode:0o600});await fs.rename(temp,stateFile)}
export async function listCollections(){return (await readState()).collections}
export async function findByShareHash(hash:string){return (await readState()).collections.find(i=>i.shareTokenHash===hash)}
export async function findManaged(id:string,hash:string){return (await readState()).collections.find(i=>i.id===id&&i.manageTokenHash===hash)}
export async function saveCollection(collection:Collection){await runSerial(async()=>{const state=await readState();state.collections.unshift(collection);await writeState(state)})}
export async function mutateCollection(id:string,update:(item:Collection)=>void){await runSerial(async()=>{const state=await readState();const item=state.collections.find(v=>v.id===id);if(!item)throw new Error("요청을 찾을 수 없습니다.");update(item);await writeState(state)})}
export async function deleteCollection(id:string){await runSerial(async()=>{const state=await readState();const index=state.collections.findIndex(v=>v.id===id);if(index<0)throw new Error("요청을 찾을 수 없습니다.");state.collections.splice(index,1);await writeState(state)})}
