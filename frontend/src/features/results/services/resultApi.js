import { baseApi } from '../../../services/api/baseApi';

export const resultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicResults: builder.query({
      query: (params) => ({
        url: '/results',
        params,
      }),
      providesTags: ['Results'],
    }),
    getAdminResults: builder.query({
      query: (params) => ({
        url: '/results/admin/list',
        params,
      }),
      providesTags: ['Results'],
    }),
    getAdminResultById: builder.query({
      query: (id) => `/results/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Results', id }],
    }),
    createResult: builder.mutation({
      query: (formData) => ({
        url: '/results',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Results'],
    }),
    updateResult: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/results/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Results', id }, 'Results'],
    }),
    togglePublishResult: builder.mutation({
      query: (id) => ({
        url: `/results/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Results'],
    }),
    toggleFeatureResult: builder.mutation({
      query: (id) => ({
        url: `/results/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Results'],
    }),
    deleteResult: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/results/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Results'],
    }),
  }),
});

export const {
  useGetPublicResultsQuery,
  useGetAdminResultsQuery,
  useGetAdminResultByIdQuery,
  useCreateResultMutation,
  useUpdateResultMutation,
  useTogglePublishResultMutation,
  useToggleFeatureResultMutation,
  useDeleteResultMutation,
} = resultApi;
