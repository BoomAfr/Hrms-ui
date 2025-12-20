
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography, Image } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { login, clearError, logout } from '../store/slices/authSlice';
import { authAPI } from '../services/authServices';
import logo from '../assets/images/logo.svg';
import { useToast } from '../hooks/useToast';
const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { Toast, contextHolder } = useToast();


  const location = useLocation();
  const logoutTriggered = new URLSearchParams(location.search).get('logout') === 'true';

  useEffect(() => {
    if (logoutTriggered) {
      dispatch(logout());
      // Optional: Clean up URL after logout
      navigate('/login', { replace: true });
    }
  }, [logoutTriggered, dispatch, navigate]);

  useEffect(() => {
    // Navigation is now handled in onFinish after role check
  }, [isAuthenticated, navigate]);

  // useEffect(() => {
  //   if (error) {
  //     message.error(error);
  //     dispatch(clearError());
  //   }
  // }, [error, dispatch]);

  const onFinish = async (values) => {
    try {
      const result = await dispatch(login(values)).unwrap();

      // Fetch user profile to check role
      try {
        const { data: profile } = await authAPI.getProfile();

        // Check if role is Super Admin
        //console.log("Fetched Profile:", profile);
        //console.log("Role Name RAW:", profile?.role?.name);

        const roleName = profile?.role?.name?.trim();
        //console.log("Role Name TRIMMED:", roleName);

        if (roleName === "Super Admin") {
          //console.log("MATCH! Redirecting to Super Admin Portal...");
          message.success("Login Successful. Redirecting to Super Admin Portal...");
          // Redirect to Super Admin UI on port 3001 with tokens
          // Fix: Tokens are likely at the root of result based on authSlice
          const access = result.access || result.tokens?.access;
          const refresh = result.refresh || result.tokens?.refresh;

          //console.log("Tokens found:", { access, refresh });

          if (access && refresh) {
            window.location.href = `http://localhost:3001?access=${access}&refresh=${refresh}`;
            return;
          } else {
            //console.error("Tokens missing in login response:", result);
            message.error("Failed to retrieve authentication tokens.");
            // Fallback or halt? If super admin, we probably shouldn't go to /app if it fails.
            // But to avoid dead end, maybe just let it fail naturally or stay on page.
            return;
          }
        } else {
          console.log("NO MATCH. Redirecting to /app...");
          Toast.success("Login Successfully");
          setTimeout(() => {
            navigate('/app');
          }, 300);
        }
      } catch (profileError) {
        console.error("Failed to fetch profile:", profileError);
        // Fallback to default app if profile fetch fails
        navigate('/app');
      }

    } catch (error) {
      console.log("Login Dispatch Error:", error);
      Toast.error(error)
    }

  };
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e9ff',
      }}
    >
      <Button
        type="text"
        icon={<HomeOutlined />}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontWeight: 600,
          color: '#333'
        }}
      >
        Back to Home
      </Button>
      {contextHolder}
      <Card
        style={{
          width: '90%',
          maxWidth: 380,
          padding: '40px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          borderRadius: '6px',
          backgroundColor: '#f7f7f7',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 20,
          left: 30,
        }}>
          <Title level={4} style={{ color: '#333', marginBottom: 0 }}>
            LOG IN
          </Title>

        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Image
            width={120}
            preview={false}
            src={logo}
            style={{ marginTop: 25, height: 100 }}
          />
        </div>

        <Form form={form} name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            label={<span style={{ fontWeight: 600, color: '#333' }}>Registered Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="User Name / Email"
              style={{
                borderRadius: 3,
                padding: '8px 10px',
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, color: '#333' }}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              style={{
                borderRadius: 3,
                padding: '8px 10px',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 30 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                backgroundColor: '#6f53e1',
                borderColor: '#6f53e1',
                height: 40,
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 15 }}>
          <Text>If you don't have an account? </Text>
          <Button
            type="link"
            onClick={() => navigate('/signup')}
            style={{ padding: 0, fontWeight: 600, color: '#6f53e1' }}
          >
            Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
