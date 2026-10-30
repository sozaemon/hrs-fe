import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, throwError } from "rxjs";

export interface HttpResponseBody<T> {
  data: T;
  message: string;
  responseTime: Date;
}

export type ValidRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

@Injectable({ providedIn: "root" })
export class ServerClient {

  private readonly clientUrl = `${environment.apiUrl}/api` //`${import.meta.env.NG_APP_API_URL}/api`;
  private readonly http = inject(HttpClient);

  private createBasicHeader(): HttpHeaders {

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );
    return headers;
  }

  private createUploadHeader(): HttpHeaders {
    // No Content-Type here: the browser must append the multipart boundary.
    return new HttpHeaders({ 'Accept': 'application/json' });
  }

  private createDownloadHeader(): HttpHeaders {
    return new HttpHeaders({ 'Accept': 'application/octet-stream' });
  }

  request<T, R>(url: string, method?: ValidRequestMethod, headers?: HttpHeaders, body?: T, params?: HttpParams): Observable<HttpResponseBody<R | void>> {
    switch (method) {
      case "GET":
        return this.get(url, params, headers);
      case "POST":
        return this.post(url, body, headers);
      case "PUT":
        return this.put(url, body, headers);
      case "PATCH":
        return this.patch(url, body, headers);
      case "DELETE":
        return this.delete(url, headers, params);
    }

    return throwError(() => new Error("Invalid request method"));
  }

  post<T, R>(url: string, request?: T | FormData, headers?: HttpHeaders): Observable<HttpResponseBody<R>> {

    let header = headers ?? this.createBasicHeader();

    if (request instanceof FormData) {
      header.set("Content-Type", "multipart/form-data");
    }
    return this.http.post<HttpResponseBody<R>>(`${this.clientUrl}/${url}`, request ?? {},
      { headers: header, withCredentials: true }
    );
  }

  uploadFile<R>(url: string, formData: FormData, headers?: HttpHeaders): Observable<HttpResponseBody<R>> {
    return this.http.post<HttpResponseBody<R>>(`${this.clientUrl}/${url}`, formData,
      { headers: headers ?? this.createUploadHeader(), withCredentials: true }
    );
  }

  downloadFile(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.clientUrl}/${url}`,
      {
        params: params,
        headers: headers ?? this.createDownloadHeader(),
        observe: "response",
        responseType: "blob",
        withCredentials: true,
      }
    );
  }

  get<R>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<HttpResponseBody<R>> {
    return this.http.get<HttpResponseBody<R>>(`${this.clientUrl}/${url}`,
      { params: params, headers: headers ?? this.createBasicHeader(), withCredentials: true }
    );
  }

  put<T, R>(url: string, request?: T, headers?: HttpHeaders): Observable<HttpResponseBody<R>> {
    return this.http.put<HttpResponseBody<R>>(`${this.clientUrl}/${url}`, request ?? {},
      { headers: headers ?? this.createBasicHeader(), withCredentials: true }
    );
  }

  patch<T, R>(url: string, request?: T, headers?: HttpHeaders): Observable<HttpResponseBody<R>> {
    return this.http.patch<HttpResponseBody<R>>(`${this.clientUrl}/${url}`, request ?? {},
      { headers: headers ?? this.createBasicHeader(), withCredentials: true }
    );
  }

  delete<T>(url: string, headers?: HttpHeaders, params?: HttpParams): Observable<HttpResponseBody<void>> {
    return this.http.delete<HttpResponseBody<void>>(`${this.clientUrl}/${url}`,
      { params: params, headers: headers ?? this.createBasicHeader(), withCredentials: true }
    );
  }

}