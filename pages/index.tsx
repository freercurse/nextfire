import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { GetServerSideProps } from 'next'
import { collectionGroup, getDocs, limit, orderBy, query, where} from 'firebase/firestore'
import { firestore, fromMillis, postToJSON } from '../lib/firebase'
import { useState } from 'react'
import PostFeed from '../components/PostFeed'

const LIMIT = 1

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postsQuery = collectionGroup(firestore, 'posts') 
  const q = query(postsQuery, where('published', '==', 'true'), orderBy('createdAt', 'desc'), limit(LIMIT))

  const posts = (await getDocs(q)).docs.map(postToJSON)

  return {
    props: { posts }
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const postsQuery = collectionGroup(firestore, 'posts')
    const q = query(postsQuery, where('published', '==', 'true'), orderBy('createdAt', 'desc'), limit(LIMIT))

    const newPosts = (await getDocs(q)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} admin />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}
