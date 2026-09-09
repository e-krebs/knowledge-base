declare module "bun" {
  interface Env {
    APPID: string;
    APIKEY: string;
    INDEXNAME: string;
    GITHUB_TOKEN?: string;
    TMPDIR?: string;
  }
}
