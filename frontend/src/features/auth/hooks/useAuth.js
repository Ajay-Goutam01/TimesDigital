import { useSelector } from 'react-redux';
import { useGetMeQuery } from '../services/authApi';

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: auth.isInitialized && !!auth.admin,
  });

  const admin = auth.admin || data?.data?.admin || data?.data;
  const isSuperAdmin = admin?.role === 'superadmin';

  return {
    admin,
    isAuthenticated: !!admin,
    mustChangePassword: !!admin?.mustChangePassword,
    isSuperAdmin,
    isLoading: !auth.isInitialized && (isLoading || isFetching),
  };
};
