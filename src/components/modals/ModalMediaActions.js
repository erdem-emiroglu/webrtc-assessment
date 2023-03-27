import {Button, Modal} from "@/components/common";
import {useModal} from "@/store/slices/modalSlice";
import {useMediaActions} from "@/store/slices/mediaActionsSlice";

export const ModalMediaActions = ({onJoinRoom}) => {
    const { micActive, cameraActive, toggleMic, toggleCamera } = useMediaActions();
    const { modals, closeModal } = useModal();

    const closeModalMediaActions = () => {
        closeModal('ModalMediaActions');
    }

    return (
        <Modal isOpen={modals.ModalMediaActions} onClose={closeModalMediaActions} title="Check your settings">
            <div className="p-6 flex flex-col gap-2 items-center">
                <Button
                    title={micActive ? "Mute" : "Unmute"}
                    onClick={toggleMic}
                    className="bg-blue text-white py-2 px-4 rounded w-64"
                />
                <Button
                    title={cameraActive ? "Turn off camera" : "Turn on camera"}
                    onClick={toggleCamera}
                    className="bg-blue text-white py-2 px-4 rounded max-w-sm w-64"
                />
                <Button
                    title="Proceed"
                    onClick={onJoinRoom}
                    className="bg-green text-white py-2 px-4 rounded max-w-sm w-64"
                />
            </div>
        </Modal>
    );
}
