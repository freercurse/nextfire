import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, orderBy, query, onSnapshot, Firestore, DocumentData, Query, doc } from 'firebase/firestore';
import { AccountContext } from './context';


// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user, setUser] = useState<User>()
  const [account, setAccount] = useState(undefined);
  
  onAuthStateChanged(auth, (user) => {    
    if (user != null) {
      setUser(user)
    }
  })  

  useEffect(() => {
    // turn off realtime subscription      
    if (user) {
      
      const ref = doc(firestore, 'users/' + user.uid)
     
      const unsubscribe = onSnapshot(ref, (doc) => {
        
        if (!doc.exists) {
          setAccount(null)
        } else {          
          setAccount(doc.data());          
        }        
      });

      return () => unsubscribe();
    }

    
  }, [user]);  

  return { user, account };
}