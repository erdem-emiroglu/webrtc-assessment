import {createSlice} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';

const initialState = {
    micActive: false,
    cameraActive: false,
};

const mediaActionsSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        toggleMic(state) {
            state.micActive = !state.micActive;
        },
        toggleCamera(state) {
            state.cameraActive = !state.cameraActive;
        },
    },
});

const {toggleMic, toggleCamera} = mediaActionsSlice.actions;
export const useMediaActions = () => {
    const dispatch = useDispatch();
    const {micActive, cameraActive} = useSelector((state) => state.mediaActions);
    return {
        toggleMic: () => dispatch(toggleMic()),
        toggleCamera: () => dispatch(toggleCamera()),
        micActive,
        cameraActive,
    };
}
export default mediaActionsSlice.reducer;
