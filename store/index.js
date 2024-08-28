import { configureStore } from '@reduxjs/toolkit';
import platforms from './slice/platform';
import newGames from './slice/newGames';
import genre from './slice/genre';
import token from './slice/token';

export default configureStore({
  reducer: {
    platformList: platforms,
    genreList: genre,
    newGames: newGames,
    token : token,
  },
})