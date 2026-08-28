import { notFound } from "next/navigation";
import { findByShareHash } from "@/lib/repository";
import { tokenHash } from "@/lib/security";
import { collectionType } from "@/lib/domain";
import { CollectionClient } from "@/components/collection-client";
import { DEFAULT_TARGET_YEAR } from "@/lib/school-year";
export const dynamic="force-dynamic";
export default async function CollectPage({params}:{params:Promise<{token:string}>}){const {token}=await params;const item=await findByShareHash(tokenHash(token));if(!item)notFound();return <CollectionClient token={token} item={{type:collectionType(item),title:item.title,description:item.description,deadline:item.deadline,templateName:item.templateName,hasReference:Boolean(item.reference),targetYear:item.targetYear??DEFAULT_TARGET_YEAR,table:item.table,recipients:item.recipients.map(recipient=>({id:recipient.id,name:recipient.name,department:recipient.department,versionCount:recipient.versions.length}))}}/>}
