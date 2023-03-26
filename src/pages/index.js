import {useRouter} from 'next/router'
import {useState} from 'react'
import {generateRandomString} from "@/utils/generateRandomString";
import {Input} from "@/components/common/Input";

export default function Home() {
    const router = useRouter()
    const [roomName, setRoomName] = useState('')

    const joinRoom = () => {
        router.push(`/room/${roomName || generateRandomString()}`)
    }

    return (
        <div>
            <h1>Lets join a room!</h1>
            <Input onChange={(e) => setRoomName(e.target.value)} value={roomName} name="roomName" label="Room Name"/>
            <button onClick={joinRoom} type="button">Join Room</button>
        </div>
    )
}

