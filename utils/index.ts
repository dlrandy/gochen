export const isEmpty = (obj: object) => {
    return obj && Object.keys(obj).length === 0;
};
export const fetcher = (url:string) => fetch(url).then((res) => res.json());