import { useEffect, useRef, useState } from "react"
import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000"

interface VideoCallProps {
  chatId: string
  userId: string
  otherUserName: string
  onClose: () => void
}

 
const VideoCall = ({ chatId, userId, otherUserName, onClose }: VideoCallProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    socketRef.current = io(ENDPOINT)

    // Join video chat room
    socketRef.current.emit("join video chat", { chatId, userId })

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Initialize WebRTC peer connection
        const configuration = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        }
        peerConnectionRef.current = new RTCPeerConnection(configuration)

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream)
        })

        // Handle incoming remote stream
        peerConnectionRef.current.ontrack = (event) => {
          setRemoteStream(event.streams[0])
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // Handle and send ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit("ice-candidate", {
              chatId,
              candidate: event.candidate,
            })
          }
        }

        setIsConnected(true)
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initializeMedia()

    // Socket event handlers
    socketRef.current.on("offer", async (offer: RTCSessionDescriptionInit) => {
      if (!peerConnectionRef.current) return
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      socketRef.current.emit("answer", { chatId, answer })
    })

    socketRef.current.on("answer", async (answer: RTCSessionDescriptionInit) => {
      if (!peerConnectionRef.current) return
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
    })

    socketRef.current.on("ice-candidate", async (candidate: RTCIceCandidateInit) => {
      if (!peerConnectionRef.current) return
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
    })

    socketRef.current.on("call ended", () => {
      handleCallEnd(); 
    });

    return () => {
      handleCallEnd()
      socketRef.current?.disconnect()
    }
  }, [chatId, userId])

  useEffect(() => {
    socketRef.current.on("call ended", () => {
      handleCallEnd(); 
    });

    return () => {
      socketRef.current?.off("call ended", handleCallEnd); 
    };
  }, []);

const handleCallEnd = () => {
  if (peerConnectionRef.current) {
    peerConnectionRef.current.close();
    peerConnectionRef.current = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    setLocalStream(null);
  }

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
    setRemoteStream(null);
  }

  setIsConnected(false);
  socketRef.current.emit("end call", { chatId, userId, receiverId: otherUserName });
  onClose();
};

  const startCall = async () => {
    if (!peerConnectionRef.current) return

    try {
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)
      socketRef.current.emit("offer", { chatId, offer })
    } catch (error) {
      console.error("Error creating offer:", error)
    }
  }

  useEffect(() => {
    if (isConnected) {
      startCall()
    }
  }, [isConnected])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Video Call</h2>
          <button onClick={handleCallEnd} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            End Call
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded-lg bg-gray-900" />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">You</span>
          </div>
          <div className="relative">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-lg bg-gray-900" />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">{ otherUserName }</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCall

