import { notification } from 'antd';

export const useToast = () => {
  const [api, contextHolder] = notification.useNotification();

  const Toast = {
    success: (message, description = '') => {
      api.success({
        message,
        description,
        placement: 'topRight',
        duration: 4.5,
      });
    },
    
    error: (message, description = '') => {
      api.error({
        message,
        description,
        placement: 'topRight',
        duration: 6,
      });
    },
    
    warning: (message, description = '') => {
      api.warning({
        message,
        description,
        placement: 'topRight',
        duration: 5,
      });
    },
    
    info: (message, description = '') => {
      api.info({
        message,
        description,
        placement: 'topRight',
        duration: 4.5,
      });
    }
  };

  return { Toast, contextHolder };
};