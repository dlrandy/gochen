import {findRecordByFilter,} from "../../../lib/airtable/service";
import { NextApiRequest,NextApiResponse } from 'next';
 
type Data =  Array<{
  id: string,
  address: string,
  name: string,
  neighbourhood: string,
  imgUrl: string,
}> |{message:string,error?:Error};
const getCoffeeStoreById = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id as string);

      if (records?.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: `id could not be found` });
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (error:any) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
