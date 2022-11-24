import { NextApiRequest,NextApiResponse } from 'next';
import {
    table,
    getMinifiedRecords,
    findRecordByFilter,
  } from "../../../lib/airtable/service";
 type Data = Array<{
    id: string,
    address: string,
    name: string,
    neighbourhood: string,
    imgUrl: string,
}>|{message:string,error?:Error};
 const createCoffeeStore = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
        if (req.method === "POST") {
          //find a record
      
          const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
      
          try {
            if (id) {
              const records = await findRecordByFilter(id);
      
              if (records.length !== 0) {
                res.json(records);
              } else {
                //create a record
                if (name) {
                  const createRecords:any = await table.create([
                    {
                      fields: {
                        id,
                        name,
                        address,
                        neighbourhood,
                        voting,
                        imgUrl,
                      },
                    },
                  ]);
      
                  const records = getMinifiedRecords(createRecords);
                  res.json(records);
                } else {
                  res.status(400);
                  res.json({ message: "Id or name is missing" });
                }
              }
            } else {
              res.status(400);
              res.json({ message: "Id is missing" });
            }
          } catch (err:any) {
            console.error("Error creating or finding a store", err);
            res.status(500);
            res.json({ message: "Error creating or finding a store", error:err });
          }
        } else {
          res.status(405).json({message:'method not allowed'});
        }

      };
      
      export default createCoffeeStore;
      