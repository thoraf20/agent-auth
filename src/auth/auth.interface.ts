export interface IAuthedUser {
  id: string;
  email: string;
  accessToken?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
}
