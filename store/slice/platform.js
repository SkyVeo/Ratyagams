import { createSlice } from '@reduxjs/toolkit';

export const platformSlice = createSlice({
    name: 'platformList',
    initialState: {
        platforms: [],
        nextIdPlatform: 0
    },
    reducers: {
        addPlatform: (state, action) => {
            state.platforms.push({
                ...action.payload,
                id: state.nextIdPlatform
            });
            state.nextIdPlatform += 1;
        },
        setPlatforms: (state, action) => {
            state.platforms = action.payload;
        }
    },
})

export const { addPlatform, setPlatforms } = platformSlice.actions;

export default platformSlice.reducer;