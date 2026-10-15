import { inject, Injectable } from "@angular/core";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { Observable } from "rxjs";
import { UpdatePassword, UserData } from "./types";



@Injectable({ providedIn: "root" })
export class UserService {
  private readonly client = inject(ServerClient);

  fetchUserData(): Observable<HttpResponseBody<UserData> | undefined> {
    return this.client.get<UserData>("user");
  }

  updatePassword(updatePasswordRequest: UpdatePassword): Observable<HttpResponseBody<{}>> {
    return this.client.post<UpdatePassword, {}>("user/update-password", updatePasswordRequest);
  }

  fetchRole(): Observable<HttpResponseBody<string>> {
    return this.client.get<string>("user/user-roles");
  }
}