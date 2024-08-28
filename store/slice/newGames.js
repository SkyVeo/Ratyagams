import { createSlice } from '@reduxjs/toolkit';

export const newGamesSlice = createSlice({
    name: 'newGames',
    initialState: {
        newGames: {}
    },
    reducers: {
        addNewGames: (state, action) => {
            state.newGames[action.payload.key] ??= [];
            state.newGames[action.payload.key].push(...action.payload.values);
        },
        clearNewGames: (state, action) => {
            state.newGames = {};
        }
    },
})

export const { addNewGames, clearNewGames } = newGamesSlice.actions;

export default newGamesSlice.reducer;