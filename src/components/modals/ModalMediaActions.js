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
        <Modal isOpen={modals.ModalMediaActions} onClose={closeModalMediaActions} title="Media Actions">
            <div className="flex flex-col gap-2">
                <Button title={micActive ? 'Mute' : 'Unmute'} onClick={toggleMic}/>
                <Button title={cameraActive ? 'Turn off camera' : 'Turn on camera'} onClick={toggleCamera}/>
                <Button title="Proceed" onClick={onJoinRoom}/>
            </div>
        </Modal>
    );
}
