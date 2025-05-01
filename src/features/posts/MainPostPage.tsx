import React from 'react'
import { AddPostForm } from './AddPostForm'
import { PostsList } from './postList'

export const MainPostPage = () => {
  return (
    <>
      <AddPostForm />
      <PostsList />
    </>
  )
}