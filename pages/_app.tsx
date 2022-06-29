import '../styles/globals.css'

import NavBar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { AccountContext, UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks';


function MyApp({ Component, pageProps }) {
  
  const userData = useUserData();
  
  return (
    <>
      <AccountContext.Provider value={userData.account}>
      <UserContext.Provider value={userData.user}>
        <NavBar/>
          <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
      </AccountContext.Provider>
    </>
    ) 
}

export default MyApp
