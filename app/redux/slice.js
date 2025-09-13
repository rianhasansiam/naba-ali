import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [
    {
      name: "Rian Hasan Siam",
      email: "rian@example.com"
    }
  ],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      console.log("Adding user:", action.payload);
      state.users.push(action.payload);
    },
  },
})

// Export the action
export const { addUser } = userSlice.actions

export default userSlice.reducer;