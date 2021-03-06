import { AppTabProps } from "../../components/app-tab/app-tab";

export enum LevelTabsActionTypes {
  FETCH_LEVEL_TABS_START = "FETCH_LEVEL_TABS_START",
  FETCH_LEVEL_TABS_SUCCESS = "FETCH_LEVEL_TABS_SUCCESS",
  FETCH_LEVEL_TABS_FAILURE = "FETCH_LEVEL_TABS_FAILURE",
}

export interface LevelTabsState {
  tabs: AppTabProps[] | null;
  isFetching: boolean;
  isAllFetched: boolean;
  errorMessage: string | null;
  sortedBy: LevelsSortingProperty | null;
  sortedDescending: boolean;
  pageSize: number;
  currentPage: number;
}

export interface FetchedLevelsData {
  levelCode: string;
  gameCode: string;
  gameName: string;
  difficulty: number;
  usersCount: number;
  steps: number;
}

export enum LevelsSortingProperty {
  BY_LEVEL_CODE = "BY_LEVEL_CODE",
  BY_GAME_NAME = "BY_GAME_NAME",
  BY_DIFFICULTY = "BY_DIFFICULTY",
  BY_USERS_COUNT = "BY_USERS_COUNT",
  BY_STEPS = "BY_STEPS",
  NONE = "NONE",
}

export interface FetchLevelsRequestData {
  userCode: string | null;
  gameCode: string | null;
  sortedBy: LevelsSortingProperty;
  descending: boolean;
  offset: number;
  limit: number;
}
