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
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <Title title="Join a Room" className="text-2xl font-semibold text-center text-indigo-600" />
                <div className="w-full bg-gradient-to-r from-blue-400 to-purple-600 p-0.5 rounded-lg">
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
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                />
                <ModalMediaActions onJoinRoom={joinRoom} />
            </div>
        </div>
    );
}
