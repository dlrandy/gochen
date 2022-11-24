//initialize unsplash

import { createApi } from "unsplash-js";

// on your node server
// @ts-ignore
const unsplashApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
    apiUrl:"https://api.unsplash.com/"
});

const getUrlForCoffeeStores = (latLong:string, query:string, limit:number) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&radius=6666&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplashApi.search.getPhotos({
        query: "coffee shop",
        perPage: 30,
    });
    const unsplashResults = photos.response?.results || [];
    return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
    latLong = "43.653833032607096%2C-79.37896808855945",
    limit = 6
) => {
    const photos = await getListOfCoffeeStorePhotos();
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY as string,
        },
    };

    const response = await fetch(
        getUrlForCoffeeStores(latLong, "coffee", limit),
        options
    );
    const data = await response.json();
    return data.results.map((result:any, idx:number) => {
        return {
            id: result.fsq_id,
            address: result.location.formatted_address,
            name: result.name,
            neighbourhood: result.location.cross_street ||"",
            imgUrl: photos.length > 0 ? photos[idx] : null,
        };
    });
};