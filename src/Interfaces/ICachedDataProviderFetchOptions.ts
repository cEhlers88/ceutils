export interface ICachedDataProviderFetchOptions {
  data?: { [name: string]: any };
  enableCache?: boolean;
  evalJson?: boolean;
  method?: string;
  url: string;
}
