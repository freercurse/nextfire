import { User } from 'firebase/auth'
import Link from 'next/link'
import { useContext } from 'react'
import { AccountContext, UserContext } from '../lib/context'

export default function NavBar() {

  const account = useContext(AccountContext)
  const user = useContext(UserContext)
 
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button>FEED</button>
          </Link>
        </li>

        {user && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={'/' + account?.username}>
                <img src={account?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {!user && (
          <>
            <li>
              <Link href="/enter">
                <button className="btn-blue">Login</button>
              </Link>
            </li>            
          </>
        )}


      </ul>
    </nav>
    )
}