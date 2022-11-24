
import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY||""
);

const table = base("coffee-stores");
 const getMinifiedRecord = (record:any) => {
    return {
      recordId: record.id,
      ...record.fields,
    };
  };
  
  const getMinifiedRecords = (records:any[]) => {
    return records.map((record) => getMinifiedRecord(record));
  };
  
  const findRecordByFilter = async (id:string) => {
    const findCoffeeStoreRecords:any = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();
  
    return getMinifiedRecords(findCoffeeStoreRecords);
  };
  
  export { table, getMinifiedRecords, findRecordByFilter };
  