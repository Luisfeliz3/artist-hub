export const debugAuth = () => {
  console.log('=== AUTH DEBUG ===');
  console.log('Token in localStorage:', localStorage.getItem('token'));
  console.log('User in localStorage:', localStorage.getItem('user'));
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('Parsed user:', user);
  
  const token = localStorage.getItem('token');
  console.log('Token valid:', !!token);
  console.log('Token length:', token?.length);
  console.log('==================');
  
  return {
    token,
    user,
    isValid: !!token,
  };
};

// Call this in your app to debug
export const checkAuthStatus = () => {
  const auth = debugAuth();
  if (!auth.isValid) {
    console.warn('Authentication issues detected!');
  }
  return auth;
};