import { baseApi } from '../../../services/api/baseApi';

export const facultyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicFaculty: builder.query({
      query: (params) => ({
        url: '/faculty',
        params,
      }),
      providesTags: ['Faculty'],
    }),
    getFacultyBySlug: builder.query({
      query: (slug) => `/faculty/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Faculty', id: slug }],
    }),
    getAdminFaculty: builder.query({
      query: (params) => ({
        url: '/faculty/admin/list',
        params,
      }),
      providesTags: ['Faculty'],
    }),
    getAdminFacultyById: builder.query({
      query: (id) => `/faculty/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Faculty', id }],
    }),
    createFaculty: builder.mutation({
      query: (formData) => ({
        url: '/faculty',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Faculty'],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/faculty/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faculty', id }, 'Faculty'],
    }),
    togglePublishFaculty: builder.mutation({
      query: (id) => ({
        url: `/faculty/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Faculty'],
    }),
    toggleFeatureFaculty: builder.mutation({
      query: (id) => ({
        url: `/faculty/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Faculty'],
    }),
    deleteFaculty: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/faculty/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Faculty'],
    }),
  }),
});

export const {
  useGetPublicFacultyQuery,
  useGetFacultyBySlugQuery,
  useGetAdminFacultyQuery,
  useGetAdminFacultyByIdQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useTogglePublishFacultyMutation,
  useToggleFeatureFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;
