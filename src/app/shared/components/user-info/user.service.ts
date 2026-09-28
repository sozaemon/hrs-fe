import { inject, Injectable } from "@angular/core";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { Observable } from "rxjs";

export interface UserData {
  fullName: string | undefined
  email: string | undefined
}

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly client = inject(ServerClient);

  fetchUserData(): Observable<HttpResponseBody<UserData> | undefined> {
    return this.client.get<UserData>("user");
  }
}