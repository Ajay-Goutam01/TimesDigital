import { baseApi } from '../../../services/api/baseApi';

export const websiteSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWebsiteSettings: builder.query({
      query: () => '/website-settings',
      providesTags: ['WebsiteSettings'],
    }),
    updateWebsiteSettings: builder.mutation({
      query: (formData) => ({
        url: '/website-settings',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),
  }),
});

export const {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingsMutation,
} = websiteSettingsApi;
