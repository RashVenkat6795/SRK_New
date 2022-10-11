import AsyncStorage from '@react-native-async-storage/async-storage'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { watcherSaga } from './Sagas/RootSaga'
import { api } from '@/Services/api'
import theme from './Theme'
import User from './User'

const sagaMiddleware = createSagaMiddleware()

const reducers = combineReducers({
  theme,
  user: User,
  // api: api.reducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null
  // whitelist: ['theme'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    /* const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware) */
    const middlewares = [
      ...getDefaultMiddleware({ thunk: false, serializableCheck: false, immutableCheck: false }),
      sagaMiddleware,
    ]

    /* if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    } */

    return middlewares
  },
})

sagaMiddleware.run(watcherSaga)

const persistor = persistStore(store)

// setupListeners(store.dispatch)

export { store, persistor }
