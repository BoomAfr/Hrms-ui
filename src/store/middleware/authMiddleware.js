import { login } from '../slices/authSlice';
import { fetchUserProfile } from '../slices/userSlice';

export const authMiddleware = (store) => (next) => (action) => {
  if (login.fulfilled.match(action)) {
    setTimeout(() => {
      store.dispatch(fetchUserProfile());
    }, 0);
  }
  
  return next(action);
};