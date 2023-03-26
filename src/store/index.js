import {configureStore} from '@reduxjs/toolkit';
import mediaActionsSlice from '@/store/slices/mediaActionsSlice';
import modalSlice from "@/store/slices/modalSlice";

const store = configureStore({
    reducer: {
        mediaActions: mediaActionsSlice,
        modal: modalSlice
    },
});

export default store;
