import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: credential => ({
        url: "auth/login",
        method: "POST",
        body: { ...credential }
      }),
      // invalidatesTags: ["User"],
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "auth/logout",
          method: "POST",
      }),
      async onQueryStarted( arg, { dispatch, queryFulfilled } ) {
        try {
          const { data } = await queryFulfilled;
          // await queryFulfilled;
          console.log(data);
          dispatch(logOut());

          // RTK Toolkit logout takes a second to clear out the cache.
          setTimeout ( ()=> {
            dispatch( apiSlice.util.resetApiState()) // clear out cache.
          }, 1000)
          
        } catch (error) {
          console.log(error);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "auth/refresh/",
        method: "GET",
      }),
      async onQueryStarted( arg, { dispatch, queryFulfilled } ) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          const { accessToken } = data
          dispatch(setCredentials({accessToken}));
        } catch (error) {
          console.log(error);
        }
      }
    })



  }),

});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice;
    