import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Checkbox, Divider, Radio, Upload, Space, Collapse } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined, PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useManageEmployee, useShift } from '../hooks/useManageEmployee';
import { useDepartments } from '../hooks/useDepartments';
import { useDesignations } from '../hooks/useDesignations';
import { useBranches } from '../hooks/useBranches';
import { useToast } from '../hooks/useToast';
import { useMonthlyPayGrades } from '../hooks/useMonthlyPayGrade';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useHourlyPaygrades from '../hooks/useHourlyPayGrade';

const { Option } = Select;
const { TextArea } = Input;


const AddEmployeeForm = () => {
    const [form] = Form.useForm();
    const { addEmployee,loading,employees,profile,fetchEmployeeById,updateEmployee } = useManageEmployee();
    const { shifts } = useShift();
    const { paygrades } = useMonthlyPayGrades();
    const { Toast, contextHolder } = useToast();
    const { departments } = useDepartments();
    const { designations } = useDesignations();
    const { branches } = useBranches();
    const {hourlyPaygrades} = useHourlyPaygrades();
    const [isEditMode,setIsEditMode] = useState(false)
        const [activePanels, setActivePanels] = useState([1, 2, 3, 4])
const [fileList, setFileList] = useState([]);

    const { id } = useParams();
      const navigate = useNavigate();

        const setFormField = () => {
        const formattedData = {
                    ...profile,
                    date_of_birth: dayjs(employees.date_of_birth) ,
                    date_of_joining: dayjs(employees.date_of_joining) ,
                    date_of_leaving: dayjs(employees.date_of_leaving) ,
                };
console.log(formattedData,'formattedData');

                // Set form fields with the fetched data
                form.setFieldsValue(formattedData);
    };
    console.log(profile,'employees');
    

  useEffect(() => {
    if(id){
             Object.keys(profile).length === 0 &&   fetchEmployeeById(id)

        setIsEditMode(true);

    setFormField()


    }
        
  }, [id,profile])

    const onFinish = (values) => {
        console.log(values, 'values')
        const { date_of_birth, date_of_joining} = values;
        const formatedValues = {
            ...values,
            date_of_birth: date_of_birth.format('YYYY-MM-DD'),
            date_of_joining: date_of_joining.format('YYYY-MM-DD'),
            date_of_leaving: values.date_of_leaving ? values.date_of_leaving.format('YYYY-MM-DD') : undefined,        }
        console.log(formatedValues, 'formatedValues')
        if(isEditMode){
            updateEmployee(id,formatedValues, Toast)
        }else{        addEmployee(formatedValues, Toast)
}
    };

//  const [fileList, setFileList] = useState([]);

const uploadProps = {
    beforeUpload: (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            Toast('error', 'You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        
        // Custom file object create karein
        const customFileObject = {
            uid: file.uid,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            percent: 0,
            originFileObj: {
                uid: file.uid
            }
        };
        
        // Sirf ek file rakhein array mein
        setFileList([customFileObject]);
        
        // Form field mein bhi set karein
        form.setFieldValue('photo', [customFileObject]);
        
        // Auto upload rok dein
        return false;
    },
    maxCount: 1,
    fileList: fileList,
    onRemove: () => {
        setFileList([]);
        form.setFieldValue('photo', null);
    },
};

    const uploadButton = (
        <Button 
            icon={<UploadOutlined />} 
            style={{ 
                color: fileList.length > 0 ? '#52c41a' : 'inherit',
                borderColor: fileList.length > 0 ? '#52c41a' : '#d9d9d9'
            }}
        >
            {fileList.length > 0 ? fileList[0].name : 'Choose file'}
        </Button>
    );

    return (
        <div style={{ padding: '24px' }}>
            {contextHolder}
            <Card title={isEditMode ? "Edit Employee":"Add Employee"} style={{ marginBottom: '24px' }}>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Collapse activeKey={activePanels} onChange={(key) => setActivePanels(key)} style={{ marginBottom: '24px' }}
                        expandIconPosition="end">
                        <Collapse.Panel key={1} header={"EMPLOYEE ACCOUNT"}>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Role"
                                        name="role"
                                        rules={[{ required: true, message: 'Please select role' }]}
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            <Option value="ADMIN">Admin</Option>
                                            <Option value="MANAGER">Manager</Option>

                                            <Option value="EMPLOYEE">Employee</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                    
                                        label="User Name"
                                        // name="username"
                                        // rules={[{ required: true, message: 'Please enter username' }]}
                                    >
                                        <Input disabled={true} placeholder="User Name" prefix={<UserOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please enter password' }]}
                                    >
                                        <Input.Password placeholder="Password" prefix={<LockOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Please confirm password' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Passwords do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder="Confirm Password" prefix={<LockOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Collapse.Panel>
                        <Collapse.Panel key={2} header="PERSONAL INFORMATION">
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="First Name"
                                        name="first_name"
                                        rules={[{ required: true, message: 'Please enter first name' }]}
                                    >
                                        <Input placeholder="First Name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Last Name"
                                        name="last_name"
                                         rules={[{ required: true, message: 'Please enter last name' }]}

                                    >
                                        <Input placeholder="Last Name" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Fingerprint/Emp No."
                                        name="employee_id"
                                        rules={[{ required: true, message: 'Please enter employee ID' }]}
                                    >
                                        <Input placeholder="Fingerprint/Emp No." />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        
                                        label="Supervisor"
                                        name="supervisor"
                                        // rules={[{ required: true, message: 'Please select supervisor' }]}

                                    >
                                        <Select  placeholder="--- Please Select ---">
                                            {Array.isArray(employees) && employees.length > 0 ? (
                                                employees.map((employee) => (
                                                    <Option key={employee?.user_id} value={employee?.user_id}>
                                                        {employee?.name}
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option disabled>No Supervisors Found</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Department Name"
                                        name="department"
                                        rules={[{ required: true, message: 'Please select department' }]}
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {Array.isArray(departments) && departments?.map((department) => (
                                                <Option value={department?.id} key={department?.id}>{department?.name}</Option>))}

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Designation Name"
                                        name="designation"
                                        rules={[{ required: true, message: 'Please select designation' }]}
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {Array.isArray(designations) && designations.map((designation) => (
                                                <Option value={designation?.id} key={designation?.id}>{designation?.name}</Option>
                                            ))}

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Branch Name"
                                        name="branch"
                                        rules={[{ required: true, message: 'Please select Branch Name' }]}
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {
                                                Array.isArray(branches)
                                                && branches?.map((branch) => (
                                                    <Option value={branch?.id} key={branch?.id}>{branch?.name}</Option>
                                                ))
                                            }

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Work Shift Name"
                                        name="work_shift"
                                        rules={[{ required: true, message: 'Please select work shift' }]}
                                    >
                                        <Select placeholder="--- Please Select ---" allowClear>
                                            {Array.isArray(shifts) && shifts.length > 0 ? (
                                                shifts.map((shift) => (
                                                    <Option key={shift.id} value={shift.id}>
                                                        {shift.name || shift.shift_name}
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option disabled>No Shifts Found</Option>
                                            )}
                                        </Select>
                                    </Form.Item>


                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Month/Pay Grade"
                                        name="monthly_pay_grade"
                                        rules={[{ required: true, message: 'Please select Month/Pay Grade' }]}

                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {Array.isArray(paygrades) &&
                                                paygrades.map((paygrade) => (
                                                    <Option value={paygrade?.id}>{paygrade?.grade_name}</Option>

                                                ))
                                            }

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Hourly Pay Grade"
                                        name="hourly_pay_grade"
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {Array.isArray(hourlyPaygrades) && 
                                            
                                            hourlyPaygrades.map((grades)=>(
                                            <Option value={grades?.id}>{grades?.pay_grade_name}</Option>

                                            ))
                                            }
                                        
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, type: 'email', message: 'Please enter valid email' }
                                        ]}
                                    >
                                        <Input placeholder="email" prefix={<MailOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Phone"
                                        name="phone"
                                        rules={[{ required: true, message: 'Please enter phone number' }]}
                                    >
                                        <Input placeholder="Phone" prefix={<PhoneOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Gender"
                                        name="gender"
                                        rules={[{ required: true, message: 'Please select gender' }]}
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            <Option value="male">Male</Option>
                                            <Option value="female">Female</Option>
                                            <Option value="other">Other</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Religion"
                                        name="religion"
                                    >
                                        <Select placeholder="Religion">
                                            <Option value="hinduism">Hinduism</Option>
                                            <Option value="islam">Islam</Option>
                                            <Option value="christianity">Christianity</Option>
                                            <Option value="sikhism">Sikhism</Option>
                                            <Option value="buddhism">Buddhism</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Date of Birth"
                                        name="date_of_birth"
                                        rules={[{ required: true, message: 'Please select date of birth' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} placeholder="Date of Birth" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Date of Joining"
                                        name="date_of_joining"
                                        rules={[{ required: true, message: 'Please select date of joining' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} placeholder="Date of Joining" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Date of Leaving"
                                        name="date_of_leaving"
                                    >
                                        <DatePicker style={{ width: '100%' }} placeholder="Date of Leaving" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Marital Status"
                                        name="marital_status"
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            <Option value="single">Single</Option>
                                            <Option value="married">Married</Option>
                                            <Option value="divorced">Divorced</Option>
                                            <Option value="widowed">Widowed</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Status"
                                        name="status"
                                        rules={[{ required: true, message: 'Please select status' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value="Active">Active</Radio>
                                            <Radio value="Inactive">Inactive</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Photo"
                                        name="photo"
                                    >
                                        <Upload {...uploadProps}>
                                           {uploadButton}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                    >
                                        <TextArea placeholder="Address" rows={3} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Emergency Contact"
                                        name="emergency_contact"
                                    >
                                        <TextArea placeholder="emergency Contact" rows={3} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Collapse.Panel>

                    </Collapse>


                    <Form.Item style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button loading={loading} type="primary" htmlType="submit" size="large" style={{ marginRight: '16px' }}>
                                  {isEditMode ? "Update" : "Save"}
                            </Button>
                            <Button size="large" onClick={() => form.resetFields()}>
                                Reset Form
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddEmployeeForm;