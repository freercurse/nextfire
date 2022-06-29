import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, User } from 'firebase/auth'
import { AccountContext, UserContext } from '../lib/context';
import { useCallback, useContext, useEffect, useState } from 'react';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import _ from 'lodash'

export default function Enter({ }) {

  const user = useContext<User>(UserContext)
  const Account = useContext(AccountContext)
  
  return (
    <main>
      {user ?
        !Account?.username ? <UsernameForm /> : <SignOutButton />
        : <SignInButton />
      }      
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} /> Sign in with Google
      </button>      
    </>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const Account = useContext(AccountContext)
  const User = useContext(UserContext)

  const onChange = (e) => {
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  const checkUsername = useCallback(
    _.debounce(async (username) => {
    if (username.length >= 3) {
      const ref = doc(firestore, 'usernames/' + username)
      const document  = await getDoc(ref)      
      
      setIsValid(!document.exists())
      setLoading(false)
    }
    }, 500),
    [])

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(firestore, `users/${User.uid}`);
    const usernameDoc = doc(firestore, `usernames/${formValue}`);

    const batch = writeBatch(firestore);
    batch.set(userDoc, { username: formValue, photoURL: User.photoURL, displayName: User.displayName })
    batch.set(usernameDoc, { uid: User.uid })
    
    await batch.commit()
  }

  return (
    <>
      {!Account?.username &&
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="Choose your user name" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>Submit</button>          
        </form>
      </section>
      }
      </>
    )

}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}