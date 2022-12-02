import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../../lib/airtable/service";
import { NextApiRequest,NextApiResponse } from 'next';
 
type Data =  Array<{
  id: string,
  address: string,
  name: string,
  neighbourhood: string,
  imgUrl: string,
}> |{message:string,error?:Error,id?:string};
const favouriteCoffeeStoreById = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records?.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + 1;
          // update a record

          const updateRecord:any = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "Coffee store id doesn't exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (error:any) {
      res.status(500);
      res.json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
