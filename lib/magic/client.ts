import { Magic } from "magic-sdk";

const createMagic = () => {
    return (
      typeof window !== "undefined" ?
      new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY as string) :null
    ); // ✨
  };
  
  export const magic = createMagic();