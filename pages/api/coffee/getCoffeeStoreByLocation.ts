import { NextApiRequest, NextApiResponse} from 'next';
import {
  fetchCoffeeStores
} from "../../../lib/coffee-store/service";
type Data =  {
  id: string,
  address: string,
  name: string,
  neighbourhood: string,
  imgUrl: string,
} |{message:string,error?:Error};
const getCoffeeStoresByLocation = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong as string, Number(limit));
    res.status(200);
    res.json(response);
  } catch (err:any) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Oh no! Something went wrong", error:err });
  }

  //return
};

export default getCoffeeStoresByLocation;
