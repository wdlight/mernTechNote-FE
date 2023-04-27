import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})
const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints( {
    endpoints: builder => ({
        getNotes: builder.query( {
            query: () => ({
              url: '/notes',
              validateStatus: ( response, result) => {
                console.log ( " 🚩:", )
                console.log ( response )
                return response.status === 200 && !result.isError
              },
            }),
            // keepUnusedDataFor: 5, // seconds 60 when deployed
            transformResponse: ( responseData ) => {
              
                const loadedNotes = responseData.map( note => {
                  note.id = note._id;
                  return note
                })
                return notesAdapter.setAll( initialState, loadedNotes )
            },
            providesTags: ( result, error, arg ) => {              
              if ( result?.ids ){
                return [ 
                  ...result.ids.map( id => ({ type: 'Note', id }) ), 
                  { type: 'Note', id: 'LIST' } 
                ]
              } else return [ { type: 'Note', id: 'LIST' } ]
            }
        }),

        addNewNote: builder.mutation( {
          query: initialNoteData => ( {
            url: '/notes',
            method: 'POST',
            body: {
              ...initialNoteData,
            }
          }),
          invalidatesTags: [ { type: 'Note', id: 'LIST' } ]
        }),
  
        updateNote: builder.mutation( {
          query: initialNoteData => ({
            url: '/notes',
            method: 'PATCH',
            body: {
              ...initialNoteData,
            }
          }),
          invalidatesTags: ( result, error, arg ) => {
            return [ { type: 'Note', id: arg.id } ]
          }
  
        }),
  
        deleteNote: builder.mutation( {
          query: ({id}) => ({
            url: `/notes`,
            method: 'DELETE',
            body: {id}
          }),
          invalidatesTags: ( result, error, arg ) => {
            return [ { type: 'Note', id: arg.id } ]
          }
        }),

    })
})

export const { 
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApiSlice

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized seletor
const selectNotesData = createSelector(
  selectNotesResult,
  notesResult => notesResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes, 
    selectById: selectNoteById,
    selectIds: selectNoteIds 
} = notesAdapter.getSelectors( 
  state => selectNotesData( state) ?? initialState 
)


