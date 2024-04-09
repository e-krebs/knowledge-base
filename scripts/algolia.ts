import algoliasearch from "algoliasearch";
import { list } from "./list";

const urls = await list();

const client = algoliasearch(Bun.env.APPID, Bun.env.APIKEY);

const index = client.initIndex(Bun.env.INDEXNAME);

const { objectIDs } = await index.replaceAllObjects(urls, {
  safe: true,
  autoGenerateObjectIDIfNotExist: true,
});

console.log(`got ${objectIDs.length} objectIDs for ${urls.length} items`);
