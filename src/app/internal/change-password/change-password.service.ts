import { inject, Injectable } from "@angular/core";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { Observable } from "rxjs";

@Injectable()
export class ChangePasswordService {
  private readonly client = inject(ServerClient);

  changePassword(request: { oldPassword: string, newPassword: string }): Observable<HttpResponseBody<any>> {
    return this.client.post<{ oldPassword: string, newPassword: string }, string>("user/update-password", request);
  }
}