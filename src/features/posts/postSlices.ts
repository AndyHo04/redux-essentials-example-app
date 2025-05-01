import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { sub } from 'date-fns'
import { userLoggedOut } from '@/features/auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withType'

export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions

export interface Post {
  id: string
  title: string
  content: string
  user?: string
  date: string
  reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
type NewPost = Pick<Post, 'title' | 'content' | 'user'>
export const addNewPost = createAppAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async (initialPost: NewPost) => {
      // We send the initial data to the fake API server
      const response = await client.post<Post>('/fakeApi/posts', initialPost)
      // The response includes the complete post object, including unique ID
      return response.data
    }
  )

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

export const fetchPosts = createAppAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
  })
  

interface PostsState {
  posts: Post[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PostsState = {
  posts: [
    {
      id: '1',
      title: 'First Post',
      content: 'Hello!',
      date: sub(new Date(), { minutes: 10 }).toISOString(),
      reactions: { ...initialReactions },
      user: '1',
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'More text',
      date: sub(new Date(), { minutes: 5 }).toISOString(),
      reactions: { ...initialReactions },
      user: '2',
    },
  ],
  status: 'idle',
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post: Post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find((post: Post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLoggedOut, (state) => {
      return {
        posts: [],
        status: 'idle',
        error: null,
      }
    })
    .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending'
      })
    .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts.push(...action.payload)
      })
    .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown Error'
      })
    .addCase(addNewPost.fulfilled, (state, action) => {
        // We can directly add the new post object to our posts array
        state.posts.push(action.payload)
    })
  },
})

export default postsSlice.reducer
export const {postUpdated, reactionAdded } = postsSlice.actions
export const selectAllPosts = (state: RootState) => state.posts.posts
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post: Post) => post.id === postId)

export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error