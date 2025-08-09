import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "../services/axiosConfig";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setDoctorToken } from "../Redux/slices/doctorSlice";
import { setUserToken } from "../Redux/slices/userSlice";

const OAuth = () => {

  const dispatch = useDispatch();
  const location = useLocation();

    const handleGoogleClick = async() => {
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
          
          const result = await signInWithPopup(auth, provider)          

          const role = location.pathname.startsWith("/doctor") ? "doctor" : "user";
          

          const res = await axios.post("/api/auth/google", {
            fullname: result.user.displayName,
            email: result.user.email,
            profilePicture: result.user.photoURL,
            role: role,
          },
          { withCredentials: true })
          
          const { token, userData } = res.data;

          if (role === "doctor") {
            dispatch(setDoctorToken({token, currentUser: userData}));
          } else {
            dispatch(setUserToken({token, currentUser: userData}));
          }
                
        } catch (error) {
            console.log('Could not login with Google', error);           
        }
    }

    return (
      <button className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded transition"
        type="button"
        onClick={handleGoogleClick}> Continue with Google 
      </button>
    )
}

export default OAuth
