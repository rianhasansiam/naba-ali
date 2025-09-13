import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  })
}