import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

// set baseQuery to have token in header
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log ( args ) // request url, method, body, etc
  console.log ( api) //s ignal, dispatch, getState, endpointDefinitions, reducerPath, middleware, etc
  console.log ( extraOptions ) // custom like {shout: true}// signal, dispatch, getState, extra, jwt, etc 

  let result = await baseQuery( args, api, extraOptions)
  console.log ( "===== : 🔴🔴🔴🔴")
  console.log ( result ) // response, data, error, etc

  // handle other status codes, too

  // 403 : Forbidden -- need to refresh token
  if (result?.error?.status === 403) {
    console.log ( 'sending refresh token')

    // send refresh token to get new access token
    const refreshResult = await baseQuery( '/auth/refresh', api, extraOptions)
    if ( refreshResult?.data ){
      
      const { accessToken } = refreshResult.data
      console.log ( 'got new access token', accessToken)
      // set new access token
      api.dispatch( setCredentials({ accessToken }) )
      
      // retry original request
      result = await baseQuery( args, api, extraOptions)
    }else
    {
      if ( refreshResult?.error?.status === 403 ){
        console.log ( 'refresh token expired, sending logout')
        refreshResult.error.data.message = "Your login has expired. Please log in again."
        return refreshResult
      }
    }
    return result
  }

}


export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  //: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['User','Note'],
  endpoints: builder => ({})
  })
