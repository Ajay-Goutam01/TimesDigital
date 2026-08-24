import { baseApi } from '../../../services/api/baseApi';

export const admissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAdmission: builder.mutation({
      query: (formData) => ({
        url: '/admissions',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Admissions', 'DashboardStats'],
    }),
    getAdminAdmissions: builder.query({
      query: (params) => ({
        url: '/admissions',
        params,
      }),
      providesTags: ['Admissions'],
    }),
    getAdmissionById: builder.query({
      query: (id) => `/admissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Admissions', id }],
    }),
    updateAdmissionStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/admissions/${id}/status`,
        method: 'PATCH',
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Admissions', id }, 'Admissions', 'DashboardStats'],
    }),
    deleteAdmission: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/admissions/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Admissions', 'DashboardStats'],
    }),
  }),
});

export const {
  useSubmitAdmissionMutation,
  useGetAdminAdmissionsQuery,
  useGetAdminAdmissionsQuery: useGetAdmissionsQuery,
  useGetAdmissionByIdQuery,
  useUpdateAdmissionStatusMutation,
  useDeleteAdmissionMutation,
} = admissionApi;

