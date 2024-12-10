

const OAuth = () => {


    const handleGoogleClick = async() => {
        try {
            
            
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
