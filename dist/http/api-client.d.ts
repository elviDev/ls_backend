import { RequestInit } from "node-fetch";
declare class ApiClient {
    private baseUrl;
    constructor(baseUrl: string);
    request<T>(endpoint: string, options?: RequestInit): Promise<T>;
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, body?: any): Promise<T>;
}
export declare const apiClient: ApiClient;
export {};
//# sourceMappingURL=api-client.d.ts.map