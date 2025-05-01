import { useParams } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import {Link} from 'react-router-dom'
import { selectPostById } from './postSlices'
import { selectCurrentUsername } from '@/features/auth/authSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from '@/components/TimeAgo'

export const SinglePostPage = () => {
  const { postId } = useParams()

  const post = useAppSelector(state => selectPostById(state, postId!))
  const currentUsername = useAppSelector(selectCurrentUsername)!

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const canEdit = currentUsername === post.user

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user || 'Unknown'} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        {canEdit && (
        <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
          </Link>
        )}
        <ReactionButtons post={post} />
      </article>
    </section>
  )
}