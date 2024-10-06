export interface IAuthState {
  token: string | null;
  decodedToken: IAuthTokenDecoded | null;
}
export interface IAuthTokenDecoded {
  id: string;
  name: string;
  email: string;
  canPostEvents: boolean;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginResponse {
  exists: boolean;
  token: string;
}


export interface IEvent {
  event_id: number;
  post_time: string;
  exp_time: string;
  description: string;
  qty: string;
  done: boolean;
  createdById: string;
  createdBy: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  location?: ILocation;
  photos?: IPhoto[];
  tags: ITag[] | number[];
}

export interface IPhoto {
  id: number;
  photo: string;
  event_id: number;
}

export interface ILocation {
  id: number;
  Address: string;
  floor: number;
  room: string;
  loc_note?: string;
  event_id: number;
}

export interface ITag {
  tag_id: number;
  name: string;
  color: string;
  type: ITagType;
}

export interface ITagType {
  id: number;
  name: string;
}
