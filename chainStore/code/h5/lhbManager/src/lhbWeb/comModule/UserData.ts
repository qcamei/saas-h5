export class UserData{
  private _opuserId:number;
  private _opuserName:string;
  private _accessToken:string;

  public static newInstance():UserData{
    return new UserData();
  }

  public setOPUserId(value: number) {
    this._opuserId = value;
  }

  public setOPUserName(value: string) {
    this._opuserName = value;
  }

  public setAccessToken(value: string) {
    this._accessToken = value;
  }

  public getOPUserId(): number {
    return this._opuserId;
  }

  public getOPUserName(): string {
    return this._opuserName;
  }

  public getAccessToken(): string {
    return this._accessToken;
  }

}
