import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints( {
    endpoints: builder => ({
        getUsers: builder.query( {
            query: () => ({
              url: '/users',
              validateStatus: ( response, result) => {
                return response.status === 200 && !result.isError
              },
            }),

            // for testing 5 seconds later kick out unused data . 60 seconds when deployed
            // keepUnusedDataFor: 5, // seconds 60 when deployed

            transformResponse: ( responseData ) => {
                const loadedUsers = responseData.map( user => {
                  user.id = user._id;
                  return user
                })
                return usersAdapter.setAll( initialState, loadedUsers )
            },
            providesTags: ( result, error, arg ) => {
              if ( result?.ids ){
                return [ ...result.ids.map( id => ({ type: 'User', id }) ), 
                    { type: 'User', id: 'LIST' } ]
              } else return [ { type: 'User', id: 'LIST' } ]
            }
        }),

      addNewUser: builder.mutation( {
        query: initialUserData => ( {
          url: '/users',
          method: 'POST',
          body: {
            ...initialUserData,
          }
        }),
        invalidatesTags: [ { type: 'User', id: 'LIST' } ]
      }),

      updateUser: builder.mutation( {
        query: initialUserData => ({
          url: '/users',
          method: 'PATCH',
          body: {
            ...initialUserData,
          }
        }),
        invalidatesTags: ( result, error, arg ) => {
          return [ { type: 'User', id: arg.id } ]
        }

      }),

      deleteUser: builder.mutation( {
        query: ({id}) => {
          
          const obj = {
            url: `/users`,
            method: 'DELETE',
            body: { id }
          }
          
          return (
            obj
          )
            
        },
        invalidatesTags: ( result, error, arg ) => {
          return [ { type: 'User', id: arg.id } ]
        }
      }),



    })
})

// Redux RTK automatically creates hooks
export const { 
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized seletor
const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers, 
    selectById: selectUserById,
    selectIds: selectUserIds 
} = usersAdapter.getSelectors( 
  state => selectUsersData( state) ?? initialState 
)


