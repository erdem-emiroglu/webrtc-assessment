import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {useMediaActions} from "@/store/slices/mediaActionsSlice";
import useSocket from '@/hooks/useSocket';

const ICE_SERVERS = {
    iceServers: [
        {
            urls: 'stun:openrelay.metered.ca:80',
        }
    ],
};

const Room = () => {
    useSocket();
    const {toggleCamera, toggleMic, cameraActive, micActive} = useMediaActions();

    const router = useRouter();
    const userVideoRef = useRef();
    const peerVideoRef = useRef();
    const rtcConnectionRef = useRef(null);
    const socketRef = useRef();
    const userStreamRef = useRef();
    const hostRef = useRef(false);

    const [ready, setReady] = useState(false);

    const {id: roomName} = router.query;

    useEffect(() => {
        if (ready) {
            toggleMediaStream('audio', micActive);
        }
    }, [micActive, ready]);

    useEffect(() => {
        if (ready) {
            toggleMediaStream('video', cameraActive);
        }
    }, [cameraActive, ready]);

    useEffect(() => {
        socketRef.current = io();
        // First we join a room
        socketRef.current.emit('join', roomName);

        socketRef.current.on('joined', handleRoomJoined);
        // If the room didn't exist, the server would emit the room was 'created'
        socketRef.current.on('created', handleRoomCreated);
        // Whenever the next person joins, the server emits 'ready'
        socketRef.current.on('ready', initiateCall);

        // Emitted when a peer leaves the room
        socketRef.current.on('leave', onPeerLeave);

        // If the room is full, we show an alert
        socketRef.current.on('full', () => {
            window.location.href = '/';
        });

        // Event called when a remote user initiating the connection and
        socketRef.current.on('offer', handleReceivedOffer);
        socketRef.current.on('answer', handleAnswer);
        socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

        // clear up after
        return () => socketRef.current.disconnect();
    }, [roomName]);

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: {width: 500, height: 500},
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
                socketRef.current.emit('ready', roomName);
                setReady(true);
            })
            .catch((err) => {
                /* handle the error */
                console.log('error', err);
            });
    };

    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: {width: 500, height: 500},
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
                setReady(true);
            })
            .catch((err) => {
                /* handle the error */
                console.log(err);
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current
                .createOffer()
                .then((offer) => {
                    rtcConnectionRef.current.setLocalDescription(offer);
                    socketRef.current.emit('offer', offer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const onPeerLeave = () => {
        // This person is now the creator because they are the only person in the room.
        hostRef.current = true;
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving all track of Peer.
        }

        // Safely closes the existing connection established with the peer who left.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    }

    /**
     * Takes a userid which is also the socketid and returns a WebRTC Peer
     *
     * @param  {string} userId Represents who will receive the offer
     * @returns {RTCPeerConnection} peer
     */

    const createPeerConnection = () => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent;
        return connection;

    };

    const handleReceivedOffer = (offer) => {
        if (!hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current.setRemoteDescription(offer);

            rtcConnectionRef.current
                .createAnswer()
                .then((answer) => {
                    rtcConnectionRef.current.setLocalDescription(answer);
                    socketRef.current.emit('answer', answer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleAnswer = (answer) => {
        rtcConnectionRef.current
            .setRemoteDescription(answer)
            .catch((err) => console.log(err));
    };

    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            socketRef.current.emit('ice-candidate', event.candidate, roomName);
        }
    };

    const handlerNewIceCandidateMsg = (incoming) => {
        // We cast the incoming candidate to RTCIceCandidate
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current
            .addIceCandidate(candidate)
            .catch((e) => console.log(e));
    };

    const handleTrackEvent = (event) => {
        peerVideoRef.current.srcObject = event.streams[0];
    };

    const toggleMediaStream = (type, state) => {
        userStreamRef.current.getTracks().forEach((track) => {
            if (track.kind === type) {
                track.enabled = state;
            }
        });
    };

    const leaveRoom = () => {
        socketRef.current.emit('leave', roomName); // Let's the server know that user has left the room.

        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stops receiving all track of User.
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving audio track of Peer.
        }

        // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
        router.push('/')
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-light">
            <div className="flex flex-col items-center w-full max-w-screen-md space-y-4">
                <video autoPlay ref={userVideoRef}
                       className="w-64 h-64 md:w-96 md:h-96 border-4 border-blue rounded-lg shadow-lg"/>
                <video autoPlay ref={peerVideoRef}
                       className="w-64 h-64 md:w-96 md:h-96 border-4 border-purple rounded-lg shadow-lg"/>
                <div className="flex space-x-4">
                    <button onClick={toggleMic} type="button"
                            className="bg-blue text-white rounded-lg px-4 py-2 hover:bg-blue-700">
                        {micActive ? 'Mute Mic' : 'Unmute Mic'}
                    </button>
                    <button onClick={leaveRoom} type="button"
                            className="bg-orange text-white rounded-lg px-4 py-2 hover:bg-orange-700">
                        Leave
                    </button>
                    <button onClick={toggleCamera} type="button"
                            className="bg-green text-white rounded-lg px-4 py-2 hover:bg-green-700">
                        {cameraActive ? 'Stop Camera' : 'Start Camera'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Room;
