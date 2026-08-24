import { baseApi } from '../../../services/api/baseApi';

export const batchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicBatches: builder.query({
      query: (params) => ({
        url: '/batches',
        params,
      }),
      providesTags: ['Batches'],
    }),
    getBatchBySlug: builder.query({
      query: (slug) => `/batches/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Batches', id: slug }],
    }),
    getAdminBatches: builder.query({
      query: (params) => ({
        url: '/batches/admin/list',
        params,
      }),
      providesTags: ['Batches'],
    }),
    getAdminBatchById: builder.query({
      query: (id) => `/batches/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Batches', id }],
    }),
    createBatch: builder.mutation({
      query: (formData) => ({
        url: '/batches',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Batches'],
    }),
    updateBatch: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/batches/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Batches', id }, 'Batches'],
    }),
    togglePublishBatch: builder.mutation({
      query: (id) => ({
        url: `/batches/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Batches'],
    }),
    toggleFeatureBatch: builder.mutation({
      query: (id) => ({
        url: `/batches/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Batches'],
    }),
    deleteBatch: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/batches/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Batches'],
    }),
  }),
});

export const {
  useGetPublicBatchesQuery,
  useGetBatchBySlugQuery,
  useGetAdminBatchesQuery,
  useGetAdminBatchByIdQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useTogglePublishBatchMutation,
  useToggleFeatureBatchMutation,
  useDeleteBatchMutation,
} = batchApi;

export const useGetBatchesQuery = useGetPublicBatchesQuery;

