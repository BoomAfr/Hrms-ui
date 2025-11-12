import React, { useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Table, 
  Divider, 
  Tag, 
  Avatar, 
  Row, 
  Col, 
  Skeleton 
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import { useManageEmployee } from '../hooks/useManageEmployee';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { 
    employee, 
    loading, 
    error, 
    fetchEmployeeById 
  } = useManageEmployee();
  
  const { id } = useParams();

  console.log(id, 'id');
  
  useEffect(() => {
    if (id) {
      fetchEmployeeById(id); // Directly call fetch function
    }
  }, [id]);

  console.log(employee,error, 'employee');

  // Skeleton Components
  const ProfileSkeleton = () => (
    <div style={{ padding: '24px' }}>
      {/* Profile Header Skeleton */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Skeleton.Avatar active size={80} />
          </Col>
          <Col flex={1}>
            <Skeleton active paragraph={{ rows: 3 }} title={false} />
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Educational Qualification Skeleton */}
      <Card title="EDUCATIONAL QUALIFICATION" style={{ marginBottom: '24px' }}>
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      </Card>

      <Divider />

      {/* Professional Experience Skeleton */}
      <Card title="PROFESSIONAL EXPERIENCE" style={{ marginBottom: '24px' }}>
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      </Card>

      <Divider />

      {/* Personal Information Skeleton */}
      <Card title="PERSONAL INFORMATION">
        <Skeleton active paragraph={{ rows: 8 }} title={false} />
      </Card>
    </div>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card>
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  if (!employee || Object.keys(employee).length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card>
          <h2>No Employee Data Found</h2>
          <p>Please check if the employee ID is correct.</p>
        </Card>
      </div>
    );
  }

  // Actual employee data - aapke API response ke according adjust karein
  const profileData = {
    name: employee[0].name || '--',
    email: employee[0].email || '--',
    address: employee[0].address || '--',
    phone: employee[0].phone || '--',
    dateOfJoining: employee[0].date_of_joining || '--',
    dateOfBirth: employee[0].dateOfBirth || employee[0].dob || '--',
    gender: employee[0].gender || '--',
    religion: employee[0].religion || '--',
    position: employee[0].position || '--',
    department: employee[0].department || '--'
  };

  // Educational Qualification Data
  const educationColumns = [
    {
      title: 'Institute',
      dataIndex: 'institute',
      key: 'institute',
      render: (text) => text || '--',
    },
    {
      title: 'Degree',
      dataIndex: 'degree',
      key: 'degree',
      render: (text) => text || '--',
    },
    {
      title: 'Board / University',
      dataIndex: 'boardUniversity',
      key: 'boardUniversity',
      render: (text) => text || '--',
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: (text) => text || '--',
    },
    {
      title: 'GPA / CGPA',
      dataIndex: 'gpa',
      key: 'gpa',
      render: (text) => text || '--',
    },
    {
      title: 'Passing Year',
      dataIndex: 'passingYear',
      key: 'passingYear',
      render: (text) => text || '--',
    },
  ];

  const educationData = employee.education || [
    {
      key: '1',
      institute: '--',
      degree: '--',
      boardUniversity: '--',
      result: '--',
      gpa: '--',
      passingYear: '--'
    }
  ];

  // Professional Experience Data
  const experienceColumns = [
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (text) => text || '--',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      render: (text) => text || '--',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => text || '--',
    },
    {
      title: 'Skill',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        skills && skills.length > 0 ? (
          <div>
            {skills.map((skill, index) => (
              <Tag key={index} color="blue" style={{ margin: '2px' }}>
                {skill}
              </Tag>
            ))}
          </div>
        ) : '--'
      ),
    },
    {
      title: 'Responsibility',
      dataIndex: 'responsibility',
      key: 'responsibility',
      render: (text) => text || '--',
    },
  ];

  const experienceData = employee.experience || [
    {
      key: '1',
      organization: '--',
      designation: '--',
      duration: '--',
      skills: [],
      responsibility: '--'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Profile Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Avatar 
              size={80} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
              src={employee.avatar || employee.profile_picture}
            />
          </Col>
          <Col flex={1}>
            <h2 style={{ margin: 0, marginBottom: '8px' }}>{profileData.name}</h2>
            <p style={{ margin: 0, marginBottom: '8px', color: '#666' }}>
              {profileData.position} - {profileData.department}
            </p>
            <div style={{ color: '#666' }}>
              <div>
                <MailOutlined style={{ marginRight: '8px' }} />
                Email: {profileData.email}
              </div>
              <div>
                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                Address: {profileData.address}
              </div>
              <div>
                <PhoneOutlined style={{ marginRight: '8px' }} />
                Phone: {profileData.phone}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Educational Qualification Section */}
      <Card 
        title="EDUCATIONAL QUALIFICATION" 
        style={{ marginBottom: '24px' }}
      >
        <Table 
          columns={educationColumns} 
          dataSource={educationData}
          pagination={false}
          bordered
          size="middle"
          loading={loading}
        />
      </Card>

      <Divider />

      <Card 
        title="PROFESSIONAL EXPERIENCE" 
        style={{ marginBottom: '24px' }}
      >
        <Table 
          columns={experienceColumns} 
          dataSource={experienceData}
          pagination={false}
          bordered
          size="middle"
          loading={loading}
        />
      </Card>

      <Divider />

      {/* Personal Information Section */}
      <Card title="PERSONAL INFORMATION">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">
            {profileData.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {profileData.email}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {profileData.address}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {profileData.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Joining">
            <CalendarOutlined style={{ marginRight: '8px' }} />
            {profileData.dateOfJoining}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            <CalendarOutlined style={{ marginRight: '8px' }} />
            {profileData.dateOfBirth}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {profileData.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Religion">
            {profileData.religion}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;