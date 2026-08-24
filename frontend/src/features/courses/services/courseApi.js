import { baseApi } from '../../../services/api/baseApi';

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicCourses: builder.query({
      query: (params) => ({
        url: '/courses',
        params,
      }),
      providesTags: ['Courses'],
    }),
    getCourseBySlug: builder.query({
      query: (slug) => `/courses/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Courses', id: slug }],
    }),
    getAdminCourses: builder.query({
      query: (params) => ({
        url: '/courses/admin/list',
        params,
      }),
      providesTags: ['Courses'],
    }),
    getAdminCourseById: builder.query({
      query: (id) => `/courses/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),
    createCourse: builder.mutation({
      query: (formData) => ({
        url: '/courses',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Courses'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Courses', id }, 'Courses'],
    }),
    togglePublishCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Courses'],
    }),
    toggleFeatureCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Courses'],
    }),
    deleteCourse: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/courses/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetPublicCoursesQuery,
  useGetCourseBySlugQuery,
  useGetAdminCoursesQuery,
  useGetAdminCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useTogglePublishCourseMutation,
  useToggleFeatureCourseMutation,
  useDeleteCourseMutation,
} = courseApi;

export const useGetCoursesQuery = useGetPublicCoursesQuery;

