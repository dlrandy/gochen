export const isEmpty = (obj: object) => {
    return obj && Object.keys(obj).length === 0;
};