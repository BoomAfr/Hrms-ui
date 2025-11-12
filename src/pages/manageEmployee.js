import React, { useState } from 'react';
import { Avatar, Tag, Space, Button } from 'antd';
import CommonTable from '../components/common/SharedTable/CommonTable';
import { useManageEmployee } from '../hooks/useManageEmployee';
import {  useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Select } from 'antd';
const { Option } = Select;

const ManageEmployee = () => {
     const navigate = useNavigate();
     const [isOpenModal,setIsOpenModal] = useState(false)

    const { employee,
        loading,
        error,supervisors } = useManageEmployee();
    // Employee data
    const employeeData = [
        {
            key: '1',
            name: 'sujit wagh',
            department: 'Engineering',
            designation: 'Software Engineer',
            role: 'Employee',
            branchName: 'Main Branch',
            fingerprintEmpNo: '4S',
            payGradeName: 'CC (Monthly)',
            dateOfJoining: '06/11/2025',
            joiningDuration: '2 days ago',
            jobStatus: 'Probation Period',
            phone: 'N/A',
            supervisor: 'N/A'
        },
        {
            key: '2',
            name: 'John Doe',
            department: 'Human Resource',
            designation: 'Director',
            role: 'Employee',
            branchName: 'Main Branch',
            fingerprintEmpNo: '9000',
            payGradeName: 'Intern (Monthly)',
            dateOfJoining: '06/10/2025',
            joiningDuration: '1 month ago',
            jobStatus: 'Probation Period',
            phone: '9699009989',
            supervisor: 'jhon hally'
        }
    ];

    // Job status color mapping
    const getStatusColor = (status) => {
        const statusColors = {
            'Permanent': 'green',
            'Probation Period': 'orange',
            'Intern': 'blue'
        };
        return statusColors[status] || 'default';
    };
    const handleEdit = (prop) => {
        const {key} = prop;
    navigate(`edit/${key}`)
  };
  const handleDelete = (record) => {
    setIsOpenModal(true);
  };
  const handleView = (prop) =>{
    const {key} = prop;
    navigate(`profile/${key}`)
  }
const handleEmptyData = (data) => (data || "--")
    // Employee columns
    const employeeColumns = [
         {
            title: 'Serial',
            dataIndex: 'serial',
            key: 'serial',
            render : (text,record) =>(
                <span>{handleEmptyData(record.key)}</span>
            )
        },
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'employeeInfo',
            render: (text, record) => (
                <Space>
                    <Avatar
                        size="large"
                        style={{ backgroundColor: '#1890ff' }}
                    >
                        {text.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                            Role: {handleEmptyData(record.role)}
                        </div>
                        {record.supervisor && record.supervisor !== 'N/A' && (
                            <div style={{ color: '#666', fontSize: '12px' }}>
                                Supervisor: {handleEmptyData(record.supervisor)}
                            </div>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
             render: (text, record) => (
                <Space direction="vertical">
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                            Designation: { handleEmptyData(record.designation)}
                        </div>
                        {record.supervisor && record.supervisor !== 'N/A' && (
                            <div style={{ color: '#666', fontSize: '12px' }}>
                                Branch Name: {handleEmptyData(record?.branchName)}
                            </div>
                        )}
                </Space>
            ),
        },
       
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Fingerprint/Emp No.',
            dataIndex: 'fingerprintEmpNo',
            key: 'fingerprintEmpNo',
        },
        {
            title: 'Pay Grade',
            dataIndex: 'payGradeName',
            key: 'payGradeName',
        },
        {
            title: 'Date of Joining',
            dataIndex: 'dateOfJoining',
            key: 'dateOfJoining',
            render: (text, record) => (
                <Space direction="vertical">
                    <div>{text}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                        {record.joiningDuration}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                        Job Status: {handleEmptyData(record.jobStatus)}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            ),
        },
          {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
            <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleView(record)}
          />
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
    ];

    // Filter options
    const employeeFilters = [
        {
            key: 'department',
            placeholder: '--- Select Department ---',
            options: [
                { value: 'engineering', label: 'Engineering' },
                { value: 'hr', label: 'Human Resource' },
                { value: 'networking', label: 'Networking' }
            ]
        },
        {
            key: 'designation',
            placeholder: '--- Select Designation ---',
            options: [
                { value: 'software_engineer', label: 'Software Engineer' },
                { value: 'director', label: 'Director' },
                { value: 'executive', label: 'S/ Executive' }
            ]
        },
        {
            key: 'role',
            placeholder: '--- Please Select ---',
            options: [
                { value: 'employee', label: 'Employee' },
                { value: 'manager', label: 'Manager' },
                { value: 'admin', label: 'Admin' }
            ]
        }
    ];

    const handleSearch = (value) => {
        console.log('Search employees:', value);
    };

    const handleFilterChange = (filterKey, value) => {
        console.log('Filter changed:', filterKey, value);
    };

    const handleRefresh = () => {
        console.log('Refresh employee data');
    };
const AddEmployeeButton = (
   <Button type="primary" onClick={() =>( navigate('create'))}>{"Add Employee"}</Button>
)
const handleDeleteConfirm = () => {

}
const handleDeleteCancel = () =>{
    setIsOpenModal(false)
    
}
const deleteModal = {
    isOpen:isOpenModal,
    // title:{deleteModal.title},
    message:"This Profile will be Deleted",
    onOk:handleDeleteConfirm,
    onCancel:handleDeleteCancel,
}
    return (
        <CommonTable
            title="Employee List"
            data={employeeData}
            columns={employeeColumns}
            showSearch={true}
            showFilters={true}
            filters={employeeFilters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            searchPlaceholder="Search By Employee Name"
            extraButtons={AddEmployeeButton}
            deleteModal={deleteModal}
        />
        
    );
};

export default ManageEmployee;