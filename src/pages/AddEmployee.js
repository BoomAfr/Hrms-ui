import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Checkbox, Divider, Radio, Upload, Space, Collapse } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useManageEmployee } from '../hooks/useManageEmployee';
import { useDepartments } from '../hooks/useDepartments';
import { useDesignations } from '../hooks/useDesignations';
import { useBranches } from '../hooks/useBranches';
import { useWorkShifts } from '../hooks/useManageWorkShift';
import { useMonthlyPayGrades } from '../hooks/useMonthlyPayGrade';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const AddEmployeeForm = ({ employeeData, isEdit = false }) => {
    const [form] = Form.useForm();
    const {addEmployee,updateEmployee} = useManageEmployee();
    const {shifts} = useWorkShifts();
    const {paygrades} =useMonthlyPayGrades();
    const {departments} = useDepartments();
    const {designations} = useDesignations();
    const {branches} = useBranches();
console.log(designations,'departments')



useEffect(() => {
        if (isEdit && employeeData) {
            formatAndSetFormData(employeeData);
        }
    }, [isEdit, employeeData]);
 const formatAndSetFormData = (data) => {
        const formattedData = {
            ...data,
            
            // Date fields ko moment object me convert karein
            date_of_birth: data.date_of_birth ? moment(data.date_of_birth) : null,
            date_of_joining: data.date_of_joining ? moment(data.date_of_joining) : null,
            date_of_leaving: data.date_of_leaving ? moment(data.date_of_leaving) : null,
            
            // Experiences dates
            experiences: data.experiences ? data.experiences.map(exp => ({
                ...exp,
                fromDate: exp.fromDate ? moment(exp.fromDate) : null,
                toDate: exp.toDate ? moment(exp.toDate) : null
            })) : [],
            
            // Qualifications
            qualifications: data.qualifications || []
        };
        
        form.setFieldsValue(formattedData);
    };

    const onFinish = (values) => {
        const formattedValues = {
            ...values,
            date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
            date_of_joining: values.date_of_joining ? values.date_of_joining.format('YYYY-MM-DD') : null,
            date_of_leaving: values.date_of_leaving ? values.date_of_leaving.format('YYYY-MM-DD') : null,
            
            // Professional Experience dates
            experiences: values.experiences ? values.experiences.map(exp => ({
                ...exp,
                fromDate: exp.fromDate ? exp.fromDate.format('YYYY-MM-DD') : null,
                toDate: exp.toDate ? exp.toDate.format('YYYY-MM-DD') : null
            })) : []
        };
        if (isEdit && employeeData) {
                // Edit mode - update employee
                updateEmployee(employeeData.id, formattedValues);
            } else {
                // Add mode - new employee
                addEmployee(formattedValues);
            }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                // message.error('You can only upload JPG/PNG file!');
            }
            return isJpgOrPng || Upload.LIST_IGNORE;
        },
        maxCount: 1,
    };
    const [activePanels, setActivePanels] = useState([1, 2, 3, 4])
    return (
        <div style={{ padding: '24px' }}>
            <Card title="Add Employee" style={{ marginBottom: '24px' }}>

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
                                        // rules={[{ required: true, message: 'Please select role' }]}
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            <Option value="admin">Admin</Option>
                                            <Option value="Employee">Employee</Option>
                                            <Option value="manager">Manager</Option>
                                            <Option value="supervisor">Supervisor</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="User Name"
                                        // name="username"
                                        rules={[{ required: true, message: 'Please enter username' }]}
                                    >
                                        <Input placeholder="User Name" prefix={<UserOutlined />} />
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
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            <Option value="supervisor1">Supervisor 1</Option>
                                            <Option value="supervisor2">Supervisor 2</Option>
                                            <Option value="supervisor3">Supervisor 3</Option>
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
                                            {Array.isArray(departments) && departments?.map((department) =>(
                                                <Option value={department?.id} key={department?.id}>{department?.name}</Option>                                            ))}
                    
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
                                            {Array.isArray(designations) && designations.map((designation) =>(
                                                <Option value={designation?.id} key={designation?.id}>{designation?.name}</Option>
                                            ))}
            
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Branch Name"
                                        name="branch"
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {
                                                Array.isArray(branches)
                                                && branches?.map((branch) =>(
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
                                        <Select placeholder="--- Please Select ---">
                                            {Array.isArray(shifts) &&

                                            shifts.map((shift)=>(
                                                <Option key={shift.id} value={shift.id}>{shift.shift_name}</Option>
                                            ))
                                            
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Month/Pay Grade"
                                        name="monthly_pay_grade"
                                    >
                                        <Select placeholder="--- Please Select ---">
                                            {Array.isArray(paygrades) && 
                                            paygrades.map((paygrade)=>(
                                                <Option key={paygrade.id} value={paygrade.id}>{paygrade.grade_name}</Option>
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
                                            <Option value="1">Hourly Grade 1</Option>
                                            <Option value="hourly_2">Hourly Grade 2</Option>
                                            <Option value="hourly_3">Hourly Grade 3</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { type: 'email', message: 'Please enter valid email' }
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
                                        <DatePicker format="YYYY-MM-DD"  style={{ width: '100%' }} placeholder="Date of Birth" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Date of Joining"
                                        name="date_of_joining"
                                        rules={[{ required: true, message: 'Please select date of joining' }]}
                                    >
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Date of Joining" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={6}>
                                    <Form.Item
                                        label="Date of Leaving"
                                        name="date_of_leaving"
                                    >
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Date of Leaving" />
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
                                            <Radio value="Active" >Active</Radio>
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
                                            <Button icon={<UploadOutlined />}>Choose file</Button>
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
                        <Collapse.Panel key={3} header={"PROFESSIONAL EXPERIENCE"}>
                            <Form.List name="experiences">
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field, index) => (
                                            <Card
                                                key={field.key}
                                                type="inner"
                                                style={{
                                                    marginBottom: '16px',
                                                    border: '1px solid #d9d9d9'
                                                }}
                                                title={`Professional Experience ${index + 1}`}
                                                extra={
                                                    fields.length > 1 && (
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => remove(field.name)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )
                                                }
                                            >
                                                {/* Organization */}
                                                <Form.Item
                                                    {...field}
                                                    label="Organization"
                                                    name={[field.name, 'organization']}
                                                    rules={[{ required: true, message: 'Please enter organization name' }]}
                                                >
                                                    <Input placeholder="Organization" />
                                                </Form.Item>

                                                {/* Designation and Date Range */}
                                                <Row gutter={16}>
                                                    <Col xs={24} sm={8}>
                                                        <Form.Item
                                                            {...field}
                                                            label="Designation"
                                                            name={[field.name, 'designation']}
                                                            rules={[{ required: true, message: 'Please enter designation' }]}
                                                        >
                                                            <Input placeholder="Designation" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} sm={8}>
                                                        <Form.Item
                                                            {...field}
                                                            label="From Date"
                                                            name={[field.name, 'fromDate']}
                                                            rules={[{ required: true, message: 'Please select from date' }]}
                                                        >
                                                            <DatePicker style={{ width: '100%' }} placeholder="From Date" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} sm={8}>
                                                        <Form.Item
                                                            {...field}
                                                            label="To Date"
                                                            name={[field.name, 'toDate']}
                                                            rules={[{ required: true, message: 'Please select to date' }]}
                                                        >
                                                            <DatePicker style={{ width: '100%' }} placeholder="To Date" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                {/* Skills Section - Dynamic Skills List */}
                                                <Form.Item
                                                    label="Skills"
                                                >
                                                    <Form.List name={[field.name, 'skills']}>
                                                        {(skillFields, skillOperations) => (
                                                            <div>
                                                                {skillFields.map((skillField, skillIndex) => (
                                                                    <Space
                                                                        key={skillField.key}
                                                                        style={{ display: 'flex', marginBottom: 8 }}
                                                                        align="baseline"
                                                                    >
                                                                        <Form.Item
                                                                            {...skillField}
                                                                            name={[skillField.name, 'skill']}
                                                                            rules={[{ required: true, message: 'Please enter skill' }]}
                                                                            style={{ marginBottom: 0 }}
                                                                        >
                                                                            <Input placeholder="Skill" />
                                                                        </Form.Item>

                                                                        {skillFields.length > 1 && (
                                                                            <Button
                                                                                type="text"
                                                                                danger
                                                                                icon={<DeleteOutlined />}
                                                                                onClick={() => skillOperations.remove(skillField.name)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        )}
                                                                    </Space>
                                                                ))}

                                                                <Button
                                                                    type="dashed"
                                                                    onClick={() => skillOperations.add()}
                                                                    icon={<PlusOutlined />}
                                                                    style={{ width: '100%', marginBottom: 16 }}
                                                                >
                                                                    Add Skill
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>

                                                {/* Responsibility */}
                                                <Form.Item
                                                    {...field}
                                                    label="Responsibility"
                                                    name={[field.name, 'responsibility']}
                                                    rules={[{ required: true, message: 'Please enter responsibilities' }]}
                                                >
                                                    <TextArea
                                                        placeholder="Describe your responsibilities..."
                                                        rows={4}
                                                    />
                                                </Form.Item>

                                                <Divider />
                                            </Card>
                                        ))}

                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                                style={{ width: '100%' }}
                                            >
                                                Add Professional Experience
                                            </Button>
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.List>
                        </Collapse.Panel>
                        <Collapse.Panel key={4} header={"EDUCATIONAL QUALIFICATION"}>
                            <Form.List name="qualifications">
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field, index) => (
                                            <Card
                                                key={field.key}
                                                type="inner"
                                                style={{
                                                    marginBottom: '16px',
                                                    border: '1px solid #d9d9d9'
                                                }}
                                                title={`Educational Qualification ${index + 1}`}
                                                extra={
                                                    fields.length > 1 && (
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => remove(field.name)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )
                                                }
                                            >
                                                <Row gutter={16}>
                                                    <Col xs={24} sm={12}>
                                                        <Form.Item
                                                            {...field}
                                                            label="Institute"
                                                            name={[field.name, 'institute']}
                                                            rules={[{ required: true, message: 'Please select institute' }]}
                                                        >
                                                            <Select placeholder="--- Please Select ---">
                                                                <Option value="university_1">University of Example</Option>
                                                                <Option value="university_2">Example Institute of Technology</Option>
                                                                <Option value="university_3">Sample University</Option>
                                                                <Option value="university_4">Test College</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} sm={12}>
                                                        <Form.Item
                                                            {...field}
                                                            label="Result"
                                                            name={[field.name, 'result']}
                                                        >
                                                            <Select placeholder="--- Please Select ---">
                                                                <Option value="first_class">First Class</Option>
                                                                <Option value="second_class">Second Class</Option>
                                                                <Option value="third_class">Third Class</Option>
                                                                <Option value="distinction">Distinction</Option>
                                                                <Option value="passed">Passed</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Row gutter={16}>
                                                    <Col xs={24} sm={12}>
                                                        <Form.Item
                                                            {...field}
                                                            label="Board / University"
                                                            name={[field.name, 'boardUniversity']}
                                                            rules={[{ required: true, message: 'Please enter board/university' }]}
                                                        >
                                                            <Input placeholder="Board / University" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} sm={12}>
                                                        <Form.Item
                                                            {...field}
                                                            label="GPA / CGPA"
                                                            name={[field.name, 'gpa']}
                                                        >
                                                            <Input placeholder="Example: 5.00, 4.63" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Row gutter={16}>
                                                    <Col xs={24} sm={12}>
                                                        <Form.Item
                                                            {...field}
                                                            label="Degree"
                                                            name={[field.name, 'degree']}
                                                            rules={[{ required: true, message: 'Please enter degree' }]}
                                                        >
                                                            <Input placeholder="Example: B.Sc. Engr.(Bachelor of Science in Engineering)" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} sm={12}>
                                                        <Form.Item
                                                            {...field}
                                                            label="Passing Year"
                                                            name={[field.name, 'passingYear']}
                                                            rules={[{ required: true, message: 'Please enter passing year' }]}
                                                        >
                                                            <Input placeholder="Passing Year" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>

                                                <Divider />
                                            </Card>
                                        ))}

                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                                style={{ width: '100%' }}
                                            >
                                                Add Educational Qualification
                                            </Button>
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.List>
                        </Collapse.Panel>
                    </Collapse>


                    <Form.Item style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ marginRight: '16px' }}>
                                {"Save"}
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