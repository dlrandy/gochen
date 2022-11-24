import { NextApiRequest, NextApiResponse } from "next";
import { fetchCoffeeStores } from "../../lib/coffee-store/service";

type Data = Array<{
    id: string,
    address: string,
    name: string,
    neighbourhood: string,
    imgUrl: string,
}>|{message:string, error:Error};

export type MyCustomRequest<T, R> = Omit<NextApiRequest, keyof T> & R;

const getCoffeeStoresByLocation = async (req: MyCustomRequest<NextApiRequest, {
    query: {
        latLong: string,
        limit: number
    }
}>, res: NextApiResponse<Data>) => {
    try {
        const { latLong, limit } = req.query;
        const response = await fetchCoffeeStores(latLong as string, limit);
        res.status(200).json(response);
    } catch (err:unknown) {
        console.error("There is an error", err);
        res.status(500).json({ message: "Oh no! Something went wrong", error:err as Error });
    }

    //return
};

export default getCoffeeStoresByLocation;