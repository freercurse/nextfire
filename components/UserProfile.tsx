export default function UserProfile({ account }) {
  return (
    <div className="box-center">
      <img src={account?.photoURL} className="card-img-center" />
      <p>
        <i>@{account?.username}</i>
      </p>
      <h1>{account?.displayName}</h1>
    </div>
  )
}