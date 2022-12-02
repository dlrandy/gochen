import { GetServerSidePropsContext } from "next";
import { verifyToken } from "../lib/utils/index";
export const isEmpty = (obj: object) => {
    return obj && Object.keys(obj).length === 0;
};
export const fetcher = (url:string) => fetch(url).then((res) => res.json());




export const redirectUser = async (context:GetServerSidePropsContext) => {
  const token = context.req?.cookies?.token || null;
  const userId = await verifyToken(token);

  return {
    userId,
    token,
  };
};
