
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography, Image } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, clearError } from '../store/slices/authSlice';
import logo from '../assets/images/logo.svg';
import { useToast } from '../hooks/useToast';
const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const {Toast,contextHolder} = useToast();
  

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(()=>{
      navigate('/');

      },[300])
    }
  }, [isAuthenticated, navigate]);

  // useEffect(() => {
  //   if (error) {
  //     message.error(error);
  //     dispatch(clearError());
  //   }
  // }, [error, dispatch]);

  const onFinish = async(values) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      Toast.success("Login Successfully")

    } catch (error) {
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
      {contextHolder}
      <Card
        style={{
          width: 380,
          padding: '40px 30px',
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
            style={{ marginTop: 25, height:100 }}
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
      </Card>
    </div>
  );
};

export default Login;
