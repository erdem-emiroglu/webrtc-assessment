import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import {generateRandomString} from "@/utils/generateRandomString";

export default function Home() {
  const router = useRouter()
  const [roomName, setRoomName] = useState('')

  const joinRoom = () => {
    router.push(`/room/${roomName || generateRandomString()}`)
  }

  return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Lets join a room!</h1>
          <input onChange={(e) => setRoomName(e.target.value)} value={roomName} className={styles['room-name']} />
          <button onClick={joinRoom} type="button" className={styles['join-room']}>Join Room</button>
        </main>
      </div>
  )
}

