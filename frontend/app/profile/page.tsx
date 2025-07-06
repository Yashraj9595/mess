import ProfilePage from '@/components/auth/ProfilePage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProfileRoute() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
} 