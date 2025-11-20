import React, { useEffect } from 'react';
import { Card, Descriptions, Table, Divider, Tag, Avatar, Row, Col, Skeleton, Button } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useManageEmployee } from '../hooks/useManageEmployee';
import { useEducational } from '../hooks/useEducational';
import { useExperiences } from '../hooks/useExperiences';

const Profile = () => {
  const { id } = useParams();
  const { fetchEmployeeById, loading,profile } = useManageEmployee();
  const { educationals, refetch } = useEducational();
  const { experiences, fetchExperience } = useExperiences();

  useEffect(() => {
    if(id){
    fetchEmployeeById(id);
    fetchExperience(id)
    refetch(id)
    }
        
  }, [id])
  

  

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

  return (
    <div style={{ padding: '24px' }}>
      {/* Profile Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            {loading ? (
              <Skeleton.Avatar
                active
                size={80}
                shape="circle"
              />
            ) : (
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
            )}
          </Col>
          <Col flex={1}>
            {loading ? (
              <>
                <Skeleton
                  active
                  title={{ width: '200px' }}
                  paragraph={false}
                  style={{ marginBottom: '16px' }}
                />
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 3, width: ['100%', '100%', '80%'] }}
                />
              </>
            ) : (
              <>
                <h2 style={{ margin: 0, marginBottom: '8px' }}>
                  {profile?.first_name || '--'}{' '}{profile?.last_name || '--'}
                </h2>
                <div style={{ color: '#666' }}>
                  <div>
                    <MailOutlined style={{ marginRight: '8px' }} />
                    Email: {profile?.email || '--'}
                  </div>
                  <div>
                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                    Address: {profile?.address || '--'}
                  </div>
                  <div>
                    <PhoneOutlined style={{ marginRight: '8px' }} />
                    Phone: {profile?.phone || '--'}
                  </div>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Educational Qualification Section */}
      <Card
        title="EDUCATIONAL QUALIFICATION"
        style={{ marginBottom: '24px' }}
      >
        {loading ? (
          <>
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 1, width: '150px' }}
              style={{ marginBottom: '16px' }}
            />
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 5, width: '100%' }}
            />
          </>
        ) : (
          <Table
            columns={educationColumns}
            dataSource={profile?.education}
            pagination={false}
            bordered
            size="middle"
            locale={{ emptyText: 'No educational data available' }}
          />
        )}
      </Card>

      <Divider />

      {/* Professional Experience Section */}
      <Card
        title="PROFESSIONAL EXPERIENCE"
        style={{ marginBottom: '24px' }}
      >
        {loading ? (
          <>
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 1, width: '150px' }}
              style={{ marginBottom: '16px' }}
            />
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 5, width: '100%' }}
            />
          </>
        ) : (
          <Table
            columns={experienceColumns}
            dataSource={profile?.experience}
            pagination={false}
            bordered
            size="middle"
            locale={{ emptyText: 'No experience data available' }}
          />
        )}
      </Card>

      <Divider />

      {/* Personal Information Section */}
      <Card title="PERSONAL INFORMATION">
        {loading ? (
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 8, width: '100%' }}
          />
        ) : (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
                                {profile?.first_name || '--'}{' '}{profile?.last_name || '--'}

            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {profile?.email || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {profile?.address || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {profile?.phone || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Joining">
              <CalendarOutlined style={{ marginRight: '8px' }} />
              {profile?.date_of_joining || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              <CalendarOutlined style={{ marginRight: '8px' }} />
              {profile?.date_of_birth || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {profile?.gender || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Religion">
              {profile?.religion || '--'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
};

export default Profile;