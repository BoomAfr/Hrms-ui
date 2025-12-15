import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Typography } from 'antd';
import { LockOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { changePasswordAPI } from '../../services/changePasswordServices';
import { logout } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/useToast';
import './ChangePassword.css';

const { Title, Text } = Typography;

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const { Toast, contextHolder } = useToast();
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState('');

    useEffect(() => {
        if (profile?.profile) {
            setUsername(`${profile.profile.first_name || ''} ${profile.profile.last_name || ''}`.trim());
        }
    }, [profile]);

    const handleChangePassword = async (values) => {
        const { old_password, new_password, confirm_password } = values;

        setLoading(true);
        try {
            await changePasswordAPI.changePassword({ old_password, new_password, confirm_password });
            Toast.success('Success', 'Password changed successfully. Please log in again.');

            // Logout user after password change
            dispatch(logout());
        } catch (error) {
            const msg = error.response?.data?.old_password ||
                error.response?.data?.new_password ||
                error.response?.data?.confirm_password ||
                error.response?.data?.message ||
                'Something went wrong';
            Toast.error('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            {contextHolder}
            <Card className="change-password-card">
                <div className="change-password-header">
                    <Title level={2} className="change-password-title">
                        Change Password
                    </Title>
                    <Text className="change-password-subtitle">
                        Ensure your account is secure with a strong password
                    </Text>
                </div>

                <Form
                    layout="vertical"
                    onFinish={handleChangePassword}
                    autoComplete="off"
                    className="change-password-form"
                    size="large"
                >
                    <Form.Item label="User Name">
                        <Input
                            prefix={<UserOutlined className="input-icon" />}
                            value={username || 'Loading...'}
                            disabled
                            className="change-password-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Current Password"
                        name="old_password"
                        rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Enter current password"
                            className="change-password-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="new_password"
                        rules={[
                            { required: true, message: 'Please enter new password' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined className="input-icon" />}
                            placeholder="Enter new password"
                            className="change-password-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirm_password"
                        dependencies={['new_password']}
                        rules={[
                            { required: true, message: 'Please confirm new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined className="input-icon" />}
                            placeholder="Confirm new password"
                            className="change-password-input"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="change-password-btn"
                        >
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;
