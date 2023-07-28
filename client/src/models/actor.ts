export interface IManageActorFormValues {
  actorFirstName: string;
  actorLastName: string;
  actorBiography: string;
  actorBirthDay: string;
  actorBirthPlace: string;
  actorHeight: number;
}

export interface IActor {
  id: string;
  name: string;
  biography: string;
  image: string | null;
  birthDay: number;
  birthPlace: string;
  height: number;
  genres: string[];
  likes: string[];
  dislikes: string[];
  rating: number;
}

export interface IManageActorsValues {
  name: string;
  biography: string;
  image: string | null;
  birthDay: number;
  birthPlace: string;
  height: number;
}

export interface StoredActorsData {
  data: IActor[];
  totalActors: number;
  page: number | null;
  limit: number | null;
}

export interface ActorsResponse {
  actors: IActor[];
  totalActors: number;
  limit: number | null;
  page: number | null;
  message: string;
}

export interface ActorResponse {
  actor: IActor;
  message: string;
}

export interface IActorCard {
  actor: IActor;
}
