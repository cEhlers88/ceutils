import { ICachedDataProviderFetchOptions } from "../Interfaces/ICachedDataProviderFetchOptions";

interface IPendingRequest {
  callbacks: { resolve: CallableFunction[]; reject: CallableFunction[] };
  cacheKey: string;
  state: "initiated" | "loading" | "pending" | "resolved" | "rejected";
}
export default class CachedDataProvider {
  private _activeFetchCalls: number = 0;
  private _cache: { [key: string]: any } = {};
  private _pendingRequests: IPendingRequest[] = [];
  public clearCache(): CachedDataProvider {
    this._cache = {};
    return this;
  }
  public fetch(fetchOptions: ICachedDataProviderFetchOptions): Promise<any> {
    this._activeFetchCalls++;
    if (fetchOptions.enableCache === undefined) {
      fetchOptions.enableCache = true;
    }

    return new Promise((resolve, reject) => {
      const cacheKey = this._buildCacheKey(fetchOptions);
      if (fetchOptions.enableCache && this._cache[cacheKey]) {
        this._activeFetchCalls--;
        resolve(this._cache[cacheKey]);
        return;
      }

      const pendingRequestInfo = this._getPendingRequest(cacheKey);

      if (pendingRequestInfo.state === "initiated") {
        this._pendingRequests[pendingRequestInfo.index].state = "loading";
      }

      this._pendingRequests[pendingRequestInfo.index].callbacks.resolve.push(
        resolve
      );
      this._pendingRequests[pendingRequestInfo.index].callbacks.reject.push(
        reject
      );

      if (this._pendingRequests[pendingRequestInfo.index].state === "loading") {
        this._pendingRequests[pendingRequestInfo.index].state = "pending";
        fetch(fetchOptions.url)
          .then(response => {
            response[fetchOptions.evalJson ? "json" : "text"]()
              .then(r => {
                this._handleResponse(cacheKey, r);
              })
              .catch(r => {
                this._handleResponse(cacheKey, r, "reject");
              });
          })
          .catch((reason: any) => {
            this._handleResponse(cacheKey, reason, "reject");
          });
      }

      this._activeFetchCalls--;
    });
  }
  private _buildCacheKey(
    fetchOptions: ICachedDataProviderFetchOptions
  ): string {
    return (
      "C_" +
      btoa(
        encodeURI(
          JSON.stringify(
            fetchOptions.method +
              fetchOptions.url +
              JSON.stringify(fetchOptions.data)
          )
        )
      )
    );
  }
  private _getPendingRequest(
    cacheKey: string
  ): IPendingRequest & { index: number } {
    for (let i = 0; i < this._pendingRequests.length; i++) {
      if (this._pendingRequests[i].cacheKey === cacheKey) {
        return { ...this._pendingRequests[i], index: i };
      }
    }

    this._pendingRequests.push({
      cacheKey,
      callbacks: {
        reject: [],
        resolve: [
          (response: any) => {
            this._cache[cacheKey] = response;
          }
        ]
      },
      state: "initiated"
    });
    return {
      ...this._pendingRequests[this._pendingRequests.length - 1],
      index: this._pendingRequests.length - 1
    };
  }
  private _handleResponse(
    cacheKey: string,
    response: Response,
    callbackType: string = "resolve"
  ): void {
    if (this._activeFetchCalls > 0) {
      setTimeout(() => this._handleResponse(cacheKey, response), 10);
      return;
    }

    const pendingRequest = this._getPendingRequest(cacheKey);
    this._pendingRequests[pendingRequest.index].state =
      callbackType === "resolve" ? "resolved" : "rejected";

    (pendingRequest.callbacks as any)[callbackType].map(
      (callback: CallableFunction) => {
        callback(response);
      }
    );

    this._pendingRequests.splice(pendingRequest.index, 1);
  }
}
