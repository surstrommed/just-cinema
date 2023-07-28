import { action, flow, makeAutoObservable, observable } from "mobx";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { STORE_STATUSES } from "models/store";
import {
  createActor,
  deleteActor,
  dislikeActor,
  getActors,
  getSearchedActors,
  likeActor,
} from "api/manageActors";
import {
  ActorResponse,
  ActorsResponse,
  IActor,
  IManageActorsValues,
  StoredActorsData,
} from "models/actor";
import { SortType, SortOrder } from "models/sorting";

class ManageActorsStore {
  createdActor = null as IActor | null;
  actor = null as IActor | null;
  actors = null as StoredActorsData | null;
  searchedActors = null as StoredActorsData | null;
  statuses = {
    createActor: IDLE_STORE_STATUS,
    getActors: IDLE_STORE_STATUS,
    getSearchedActors: IDLE_STORE_STATUS,
    deleteActor: IDLE_STORE_STATUS,
  } as STORE_STATUSES;
  responseMessage = null as string | null;

  constructor() {
    makeAutoObservable(this, {
      actors: observable,
      searchedActors: observable,
      createdActor: observable,
      responseMessage: observable,
      createActor: flow,
      getActors: flow,
      getSearchedActors: flow,
      deleteActor: flow,
      likeActor: flow,
      dislikeActor: flow,
      handleResponseMessage: action,
    });
  }

  handleResponseMessage(msg: string | null) {
    this.responseMessage = msg;
  }

  *createActor(actorValues: IManageActorsValues) {
    this.createdActor = null;
    this.statuses.createActor = PENDING_STORE_STATUS;
    try {
      const { data }: { data: ActorResponse } = yield createActor(actorValues);
      this.createdActor = data.actor;
      this.responseMessage = data.message;
      this.statuses.createActor = DONE_STORE_STATUS;
    } catch {
      this.statuses.createActor = ERROR_STORE_STATUS;
    }
  }

  *getActors(
    limit: number,
    page: number,
    sortType: SortType,
    sortOrder: SortOrder
  ) {
    this.actors = null;
    this.statuses.getActors = PENDING_STORE_STATUS;
    try {
      const { data }: { data: ActorsResponse } = yield getActors(
        limit,
        page,
        sortType,
        sortOrder
      );
      const actors = {
        data: data.actors,
        totalActors: data.totalActors,
        limit: data.limit,
        page: data.page,
      };
      this.actors = actors;
      this.statuses.getActors = DONE_STORE_STATUS;
    } catch {
      this.statuses.getActors = ERROR_STORE_STATUS;
    }
  }

  *getSearchedActors(
    limit: number,
    page: number,
    searchedValue: string,
    sortType: SortType,
    sortOrder: SortOrder
  ) {
    this.actors = null;
    this.searchedActors = null;
    this.statuses.getSearchedActors = PENDING_STORE_STATUS;
    try {
      const { data }: { data: ActorsResponse } = yield getSearchedActors(
        limit,
        page,
        searchedValue,
        sortType,
        sortOrder
      );
      const actors = {
        data: data.actors,
        totalActors: data.totalActors,
        limit: data.limit,
        page: data.page,
      };
      this.searchedActors = actors;
      this.statuses.getSearchedActors = DONE_STORE_STATUS;
    } catch {
      this.statuses.getSearchedActors = ERROR_STORE_STATUS;
    }
  }

  *deleteActor(actorId: string) {
    this.actors = null;
    this.statuses.deleteActor = PENDING_STORE_STATUS;
    try {
      const { data }: { data: ActorsResponse } = yield deleteActor(actorId);
      const actors = {
        data: data.actors,
        totalActors: data.totalActors,
        limit: data.limit,
        page: data.page,
      };
      this.actors = actors;
      this.responseMessage = data.message;
      this.statuses.deleteActor = DONE_STORE_STATUS;
    } catch {
      this.statuses.deleteActor = ERROR_STORE_STATUS;
    }
  }

  *likeActor(actorId: string) {
    this.statuses.likeActor = PENDING_STORE_STATUS;
    try {
      const { data }: { data: ActorResponse } = yield likeActor(actorId);
      this.actor = data.actor;
      this.statuses.likeActor = DONE_STORE_STATUS;
    } catch {
      this.statuses.likeActor = ERROR_STORE_STATUS;
    }
  }

  *dislikeActor(actorId: string) {
    this.statuses.dislikeActor = PENDING_STORE_STATUS;
    try {
      const { data }: { data: ActorResponse } = yield dislikeActor(actorId);
      this.actor = data.actor;
      this.statuses.dislikeActor = DONE_STORE_STATUS;
    } catch {
      this.statuses.dislikeActor = ERROR_STORE_STATUS;
    }
  }
}

const manageActorsStore = new ManageActorsStore();

export default manageActorsStore;
