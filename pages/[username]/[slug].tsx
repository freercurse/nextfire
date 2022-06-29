import { firestore, getAccountWithUsername, postToJSON } from "../../lib/firebase"
import { collection, collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import PostContent from "../../components/PostContent";

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getAccountWithUsername(username)

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(firestore, collection(firestore, userDoc.ref.path + 'posts') + slug)

    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000
	}
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore, 'posts'))

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();

    return {
      params: {username, slug}
    }
  })

  return {
    fallback: 'blocking',
  }
}

export default function Post(props) {
  const postRef = doc(props.path)
  const [realtimepost] = useDocumentData(postRef)

  const post = realtimepost || props.post;

  return (
    <main className="container">

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

      </aside>
    </main>
    )
}