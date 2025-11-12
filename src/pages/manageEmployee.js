import React, { useState } from 'react';
import { Avatar, Tag, Space, Button } from 'antd';
import CommonTable from '../components/common/SharedTable/CommonTable';
import { useManageEmployee } from '../hooks/useManageEmployee';
import {  useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';

const ManageEmployee = () => {
     const navigate = useNavigate();
     const [isOpenModal,setIsOpenModal] = useState(false)

    const { employee,
        loading,
        error} = useManageEmployee();
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
    const {user_id} = prop;
    navigate(`edit/${user_id}`)
  };
  const handleDelete = (record) => {
    setIsOpenModal(true);
  };
  const handleView = (prop) =>{
    const {user_id} = prop;
    navigate(`profile/${user_id}`)
  }
const handleEmptyData = (data) => (data || "--")

    // Employee columns
    const employeeColumns = [
         {
            title: 'Serial',
            dataIndex: 'user_id',
            key: 'user_id',
            render : (text,record) =>(
                <span>{handleEmptyData(record.user_id)}</span>
            )
        },
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'name',
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
            dataIndex: 'employee_id',
            key: 'employee_id',
        },
        {
            title: 'Pay Grade',
            dataIndex: 'pay_grade',
            key: 'pay_grade',
        },
        {
            title: 'Date of Joining',
            dataIndex: 'date_of_joining',
            key: 'date_of_joining',
            render: (text, record) => (
                <Space direction="vertical">
                    <div>{text}</div>
                    {/* <div style={{ color: '#666', fontSize: '12px' }}>
                        {record.joiningDuration}
                    </div> */}
                    <div style={{ color: '#666', fontSize: '12px' }}>
                        Job Status: {handleEmptyData(record.job_status)}
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
console.log(employee,'employee');

    return (
        <CommonTable
            title="Employee List"
            data={employee}
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