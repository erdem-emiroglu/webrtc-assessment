import { createSlice } from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';

const initialState = {
    modals: {}
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            const key = action.payload;
            state.modals[key] = true;
        },
        closeModal: (state, action) => {
            const key = action.payload;
            if (state.modals[key]) {
                state.modals[key] = false;
            }
        },
    },
});

const { openModal, closeModal } = modalSlice.actions;
export const useModal = () => {
    const dispatch = useDispatch();
    const { modals } = useSelector((state) => state.modal);
    return {
        openModal: (key) => dispatch(openModal(key)),
        closeModal: (key) => dispatch(closeModal(key)),
        modals,
    };
}

export default modalSlice.reducer;
