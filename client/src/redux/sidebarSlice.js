import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCreateOpen: false,
  isProfileOpen: false,
  profileData: {
    selectedProfile: null,
  },
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openCreate: (state) => {
      state.isCreateOpen = true;
      state.isProfileOpen = false;
    },
    closeCreate: (state) => {
      state.isCreateOpen = false;
    },
    openProfile: (state, action) => {
      state.isProfileOpen = true;
      state.isLocationBarOpen = false;
      state.profileData.selectedProfile = action.payload;
    },
    closeProfile: (state) => {
      state.isProfileOpen = false;
      state.profileData.selectedProfile = null;
    },
    resetSidebar: () => initialState,
  },
});

export const {
  resetSidebar,
  openLocationBar,
  closeLocationBar,
  setLocationData,
  openProfile,
  closeProfile,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
