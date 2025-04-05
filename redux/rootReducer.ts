import { combineReducers } from "redux";
import searchHistoryReducer from "./slices/searchHistorySlice";

const rootReducer = combineReducers({
  searchHistory: searchHistoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
