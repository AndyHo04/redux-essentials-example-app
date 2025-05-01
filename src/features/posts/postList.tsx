import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Link } from 'react-router-dom'
import { fetchPosts, selectAllPosts, selectPostsStatus, selectPostsError } from './postSlices'
import React, { useEffect } from 'react'
import { ReactionButtons } from "./ReactionButtons";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "../../components/TimeAgo";
import { Spinner } from '@/components/Spinner'


export const PostsList = () => {
  // Select the `state.posts` value from the store into the component
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  // Sort posts in reverse chronological order by datetime string
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))


  const renderedPosts = orderedPosts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <PostAuthor userId={post.user || 'Unknown'} />
      <TimeAgo timestamp={post.date} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  ))

  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map(post => (
      <article className="post-excerpt" key={post.id}>
        <h3>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h3>
        <PostAuthor userId={post.user || 'Unknown'} />
        <TimeAgo timestamp={post.date} />
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <ReactionButtons post={post} />
      </article>
    ))
  } else if (postStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}