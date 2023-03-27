import { useState } from "react";
import { useRouter } from "next/router";

import { Button, Input, Title } from "@/components/common";

import { useModal } from "@/store/slices/modalSlice";
import { generateRandomString } from "@/utils/generateRandomString";
import dynamic from "next/dynamic";

const ModalMediaActions = dynamic(() =>
    import("@/components/modals/ModalMediaActions").then((mod) => mod.ModalMediaActions)
);

export default function Home() {
    const router = useRouter();
    const { openModal } = useModal();
    const [roomName, setRoomName] = useState("");

    const joinRoom = () => {
        router.push(`/room/${roomName || generateRandomString()}`);
    };

    const handleOpenModal = () => {
        openModal("ModalMediaActions");
    };

    return (
        <div className="home__container">
            <div className="join__room">
                <Title title="Join a Room" className="join__room__title" />
                <div className="join__room__input__wrapper">
                    <Input
                        onChange={(e) => setRoomName(e.target.value)}
                        value={roomName}
                        name="roomName"
                        label="Room Name"
                        className="w-full bg-white"
                    />
                </div>
                <Button
                    onClick={handleOpenModal}
                    title="Join"
                    className="w-full text-white"
                />
                <ModalMediaActions onJoinRoom={joinRoom} />
            </div>
        </div>
    );
}
