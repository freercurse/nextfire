import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { GetServerSideProps } from 'next'
import { firestore, getAccountWithUsername, postToJSON } from '../../lib/firebase'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const { username } = context.query ;
  
  const userdoc = await getAccountWithUsername(username);

  let account = null
  let posts = null

  if (userdoc) {    
    account = userdoc.data();    
    const postsQuery = query(collection(firestore, userdoc.ref.path + '/posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(5))
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
  }
  
  return {
    props: {account, posts}
  }
}

export default function UserProfilePage({ account, posts }) {  
  return (
    <main>
      <UserProfile account={account} />
      <PostFeed posts={posts} admin />
    </main>
  )
}

