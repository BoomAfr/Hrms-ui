import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Typography } from 'antd';
import { changePasswordAPI } from '../../services/changePasswordServices';
import { logout } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/useToast';

const { Title } = Typography;

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
        <>
            {contextHolder}
            <Card
                style={{
                    maxWidth: 500,
                    margin: '50px auto',
                    borderRadius: 10,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    padding: '30px 20px',
                    backgroundColor: '#fff',
                }}
            >
                <Title level={3} style={{ textAlign: 'center', marginBottom: 30, color: '#1890ff' }}>
                    Change Password
                </Title>

                <Form
                    layout="vertical"
                    onFinish={handleChangePassword}
                    autoComplete="off"
                >
                    <Form.Item label="User Name">
                        <Input value={username || 'Loading...'} disabled />
                    </Form.Item>

                    <Form.Item
                        label="Old Password"
                        name="old_password"
                        rules={[{ required: true, message: 'Please enter your old password' }]}
                    >
                        <Input.Password placeholder="Old Password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="new_password"
                        rules={[
                            { required: true, message: 'Please enter new password' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password placeholder="New Password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
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
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{ borderRadius: 5, backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                        >
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default ChangePassword;
