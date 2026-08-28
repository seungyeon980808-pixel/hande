import { notFound,redirect } from "next/navigation";
import { findManaged } from "@/lib/repository";
import { getManageAccessToken } from "@/lib/manage-access";
import { tokenHash } from "@/lib/security";

export const dynamic="force-dynamic";

export default async function ManageRecoveryPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const token=await getManageAccessToken(id);
  if(!token||!(await findManaged(id,tokenHash(token))))notFound();
  redirect(`/manage/${id}/${token}`);
}
