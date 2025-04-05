import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchHistoryState {
  value: string[];
}

const initialState: SearchHistoryState = {
  value: [],
};

export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addSearchHistory: (state, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    removeSearchHistory: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((item) => item !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addSearchHistory } = searchHistorySlice.actions;

export default searchHistorySlice.reducer;
