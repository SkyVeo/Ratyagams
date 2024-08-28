import { createSlice } from '@reduxjs/toolkit';

export const genreSlice = createSlice({
    name: 'genreList',
    initialState: {
        genres: [],
        nextIdGenre: 0
    },
    reducers: {
        addGenre: (state, action) => {
            state.genres.push({
                ...action.payload,
                id: state.nextIdGenre
            });
            state.nextIdGenre += 1
        },
        setGenres: (state, action) => {
            state.genres = action.payload
        }
    },
})

export const { addGenre, setGenres } = genreSlice.actions;

export default genreSlice.reducer;