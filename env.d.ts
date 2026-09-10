declare module "bun" {
  interface Env {
    APPID: string;
    APIKEY: string;
    INDEXNAME: string;
    SEARCHKEY?: string;
    TMPDIR?: string;
  }
}
