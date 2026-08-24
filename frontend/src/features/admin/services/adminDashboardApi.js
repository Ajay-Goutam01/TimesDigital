import { baseApi } from '../../../services/api/baseApi';

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['DashboardStats'],
    }),
    getAdminUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['AdminUsers'],
    }),
    getAdminUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminUsers', id }],
    }),
    createAdminUser: builder.mutation({
      query: (formData) => ({
        url: '/admin/users',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    updateAdminUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AdminUsers', id }, 'AdminUsers'],
    }),
    deleteAdminUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = adminDashboardApi;
