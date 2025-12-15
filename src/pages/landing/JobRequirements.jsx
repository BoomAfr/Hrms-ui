import React, { useState } from 'react';
import { Typography, Card, Row, Col, Tag, Button, Input, Select, Modal, Form, Upload, message, Badge, Divider } from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SearchOutlined,
  UploadOutlined,
  LinkedinOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  CalendarOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const jobListings = [
  {
    id: 1,
    job_title: "Senior Frontend Developer",
    job_post: "Frontend Development",
    description: "We are looking for an experienced Frontend Developer with expertise in React, TypeScript, and modern web technologies.",
    published_by: "Admin",
    job_publish_date: "2024-12-01",
    application_end_date: "2025-12-31",
    status: "PUBLISHED",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    experience_required: "5+ years",
    salary_range: "$80,000 - $120,000",
    skills_required: ["React", "TypeScript", "CSS", "REST APIs"],
  },
  {
    id: 2,
    job_title: "UI/UX Designer",
    job_post: "Design",
    description: "Seeking a creative UI/UX Designer to create beautiful and intuitive user interfaces.",
    published_by: "Super Admin",
    job_publish_date: "2024-12-02",
    application_end_date: "2024-12-25",
    status: "PUBLISHED",
    department: "Design",
    location: "Mumbai",
    employment_type: "Full-time",
    experience_required: "3+ years",
    salary_range: "$70,000 - $100,000",
    skills_required: ["Figma", "Adobe XD", "Prototyping", "User Research"],
  },
  {
    id: 3,
    job_title: "Backend Engineer",
    job_post: "Backend Development",
    description: "Looking for a skilled Backend Engineer proficient in Node.js and database management.",
    published_by: "Admin",
    job_publish_date: "2024-11-28",
    application_end_date: "2024-12-20",
    status: "PUBLISHED",
    department: "Engineering",
    location: "Pune",
    employment_type: "Full-time",
    experience_required: "4+ years",
    salary_range: "$90,000 - $130,000",
    skills_required: ["Node.js", "PostgreSQL", "MongoDB", "Docker"],
  },
];

const JobRequirements = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form] = Form.useForm();

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const isPublished = job.status === 'PUBLISHED';

    return matchesSearch && matchesDepartment && matchesLocation && isPublished;
  });

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setDetailsModalVisible(true);
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplyModalVisible(true);
    setDetailsModalVisible(false);
  };

  const handleSubmitApplication = (values) => {
    console.log('Application submitted:', values);
    message.success('Application submitted successfully! We will contact you soon.');
    setApplyModalVisible(false);
    form.resetFields();
  };

  const departments = ['all', ...new Set(jobListings.map(job => job.department))];
  const locations = ['all', ...new Set(jobListings.map(job => job.location))];

  const getDepartmentColor = (dept) => {
    const colors = {
      Engineering: '#1677ff',
      Design: '#722ed1',
      Marketing: '#52c41a',
      Sales: '#fa8c16'
    };
    return colors[dept] || '#1677ff';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)' }}>
      {/* Header */}
      <div style={{ padding: 'clamp(60px, 10vw, 100px) 24px clamp(40px, 6vw, 60px)', textAlign: 'center', position: 'relative' }}>
        {/* Back to Home Button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          size="large"
          style={{
            position: 'absolute',
            left: '24px',
            top: 'clamp(60px, 10vw, 100px)',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          Back to Home
        </Button>

        <div style={{ marginBottom: '16px' }}>
          <RocketOutlined style={{ fontSize: '48px', color: '#1677ff' }} />
        </div>
        <Title level={1} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '16px' }}>
          Join Our <span className="gradient-text">Amazing Team</span>
        </Title>
        <Paragraph style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#64748b', maxWidth: '700px', margin: '0 auto 32px' }}>
          Explore exciting career opportunities and be part of something great.
        </Paragraph>

        {/* Stats */}
        <Row gutter={[24, 24]} justify="center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
          <Col xs={8}>
            <Card className="glass-panel" style={{ borderRadius: '16px', border: 'none', textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#1677ff' }}>{jobListings.filter(j => j.status === 'PUBLISHED').length}</Title>
              <Text type="secondary">Open Positions</Text>
            </Card>
          </Col>
          <Col xs={8}>
            <Card className="glass-panel" style={{ borderRadius: '16px', border: 'none', textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#52c41a' }}>{departments.length - 1}</Title>
              <Text type="secondary">Departments</Text>
            </Card>
          </Col>
          <Col xs={8}>
            <Card className="glass-panel" style={{ borderRadius: '16px', border: 'none', textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#722ed1' }}>{locations.length - 1}</Title>
              <Text type="secondary">Locations</Text>
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card
          className="glass-panel"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Input
                size="large"
                placeholder="Search jobs by title or description..."
                prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ borderRadius: '12px', height: '52px' }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                size="large"
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                style={{ width: '100%', borderRadius: '12px' }}
                suffixIcon={<TeamOutlined />}
              >
                <Select.Option value="all">All Departments</Select.Option>
                {departments.filter(d => d !== 'all').map(dept => (
                  <Select.Option key={dept} value={dept}>{dept}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={6}>
              <Select
                size="large"
                value={selectedLocation}
                onChange={setSelectedLocation}
                style={{ width: '100%', borderRadius: '12px' }}
                suffixIcon={<EnvironmentOutlined />}
              >
                <Select.Option value="all">All Locations</Select.Option>
                {locations.filter(l => l !== 'all').map(loc => (
                  <Select.Option key={loc} value={loc}>{loc}</Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Job Listings */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Title level={3} style={{ margin: 0, marginBottom: '4px' }}>Available Positions</Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} found
            </Text>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {filteredJobs.map((job) => (
            <Col xs={24} lg={12} key={job.id}>
              <Card
                className="pricing-card"
                style={{
                  borderRadius: '24px',
                  border: '1px solid #f0f0f0',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                bodyStyle={{ padding: 0 }}
              >
                {/* Department Badge */}
                <div style={{
                  background: `linear-gradient(135deg, ${getDepartmentColor(job.department)}15 0%, ${getDepartmentColor(job.department)}05 100%)`,
                  padding: '24px 32px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <Badge
                      count={job.department}
                      style={{
                        background: getDepartmentColor(job.department),
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 12px',
                        height: 'auto'
                      }}
                    />
                    <Tag color="green" style={{ margin: 0 }}>
                      <CalendarOutlined /> New
                    </Tag>
                  </div>
                  <Title level={3} style={{ marginBottom: '8px', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                    {job.job_title}
                  </Title>
                </div>

                <div style={{ padding: 'clamp(24px, 4vw, 32px)' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f0f5ff', borderRadius: '8px' }}>
                      <EnvironmentOutlined style={{ color: '#1677ff' }} />
                      <Text strong>{job.location}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f6ffed', borderRadius: '8px' }}>
                      <ClockCircleOutlined style={{ color: '#52c41a' }} />
                      <Text strong>{job.employment_type}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f9f0ff', borderRadius: '8px' }}>
                      <DollarOutlined style={{ color: '#722ed1' }} />
                      <Text strong>{job.salary_range}</Text>
                    </div>
                  </div>

                  <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: '20px', color: '#64748b', fontSize: '15px' }}>
                    {job.description}
                  </Paragraph>

                  <Divider style={{ margin: '16px 0' }} />

                  <div style={{ marginBottom: '24px' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
                      Required Skills:
                    </Text>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {job.skills_required.map((skill, index) => (
                        <Tag key={index} color="blue" style={{ padding: '4px 12px', fontSize: '13px', borderRadius: '6px' }}>
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                      type="default"
                      onClick={() => handleViewDetails(job)}
                      style={{ flex: 1, height: '48px', borderRadius: '12px', fontWeight: 600 }}
                    >
                      View Details
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => handleApply(job)}
                      style={{
                        flex: 1,
                        height: '48px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${getDepartmentColor(job.department)} 0%, ${getDepartmentColor(job.department)}dd 100%)`,
                        border: 'none'
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredJobs.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <Title level={3}>No jobs found</Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748b' }}>
              Try adjusting your search criteria or filters
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setSearchText('');
                setSelectedDepartment('all');
                setSelectedLocation('all');
              }}
              style={{ marginTop: '16px', borderRadius: '12px' }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {/* Job Details Modal */}
      <Modal
        title={null}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
        style={{ top: 20 }}
      >
        {selectedJob && (
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${getDepartmentColor(selectedJob.department)}15 0%, ${getDepartmentColor(selectedJob.department)}05 100%)`,
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <Badge
                count={selectedJob.department}
                style={{
                  background: getDepartmentColor(selectedJob.department),
                  marginBottom: '12px'
                }}
              />
              <Title level={2} style={{ marginBottom: '8px' }}>{selectedJob.job_title}</Title>
              <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                {selectedJob.location} • {selectedJob.employment_type}
              </Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Card size="small" style={{ background: '#f8fafc', border: 'none' }}>
                  <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>Experience Required</Text>
                  <Text strong style={{ fontSize: '16px' }}>{selectedJob.experience_required}</Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#f8fafc', border: 'none' }}>
                  <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>Salary Range</Text>
                  <Text strong style={{ fontSize: '16px' }}>{selectedJob.salary_range}</Text>
                </Card>
              </Col>
            </Row>

            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Job Description</Title>
              <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '15px', lineHeight: '1.8' }}>
                {selectedJob.description}
              </Paragraph>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Required Skills</Title>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedJob.skills_required.map((skill, index) => (
                  <Tag key={index} color="blue" style={{ padding: '6px 16px', fontSize: '14px', borderRadius: '8px' }}>
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>

            <Card style={{ background: '#fff7e6', border: '1px solid #ffd591', marginBottom: '24px' }}>
              <Text type="secondary">
                <CalendarOutlined /> Application Deadline: <Text strong>{new Date(selectedJob.application_end_date).toLocaleDateString()}</Text>
              </Text>
            </Card>

            <Button
              type="primary"
              size="large"
              block
              onClick={() => handleApply(selectedJob)}
              style={{
                height: '56px',
                fontSize: '18px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${getDepartmentColor(selectedJob.department)} 0%, ${getDepartmentColor(selectedJob.department)}dd 100%)`,
                border: 'none'
              }}
            >
              Apply for this Position
            </Button>
          </div>
        )}
      </Modal>

      {/* Application Form Modal */}
      <Modal
        title={<Title level={3}>Apply for {selectedJob?.job_title}</Title>}
        open={applyModalVisible}
        onCancel={() => {
          setApplyModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitApplication}
          requiredMark="optional"
        >
          {/* Personal Information */}
          <Title level={4} style={{ marginTop: '0' }}>Personal Information</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input size="large" placeholder="john@example.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input size="large" placeholder="+1 (123) 456-7890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="linkedin" label="LinkedIn Profile">
                <Input size="large" prefix={<LinkedinOutlined />} placeholder="linkedin.com/in/yourprofile" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="portfolio" label="Portfolio/Website">
            <Input size="large" prefix={<GlobalOutlined />} placeholder="https://yourportfolio.com" />
          </Form.Item>

          {/* Professional Details */}
          <Divider />
          <Title level={4} style={{ marginTop: '24px' }}>Professional Details</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="experience"
                label="Years of Experience"
                rules={[{ required: true, message: 'Please select your experience' }]}
              >
                <Select size="large" placeholder="Select experience">
                  <Select.Option value="0-1">0-1 years</Select.Option>
                  <Select.Option value="1-3">1-3 years</Select.Option>
                  <Select.Option value="3-5">3-5 years</Select.Option>
                  <Select.Option value="5-8">5-8 years</Select.Option>
                  <Select.Option value="8+">8+ years</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currentCompany" label="Current Company">
                <Input size="large" placeholder="Company Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="skills" label="Skills" rules={[{ required: true, message: 'Please add your skills' }]}>
            <Select
              mode="tags"
              size="large"
              placeholder="Type and press enter to add skills"
              style={{ width: '100%' }}
            />
          </Form.Item>

          {/* Education */}
          <Divider />
          <Title level={4} style={{ marginTop: '24px' }}>Education</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="degree" label="Highest Degree" rules={[{ required: true }]}>
                <Input size="large" placeholder="e.g., Bachelor's in Computer Science" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="institution" label="Institution" rules={[{ required: true }]}>
                <Input size="large" placeholder="University Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="graduationYear" label="Graduation Year" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select year">
              {Array.from({ length: 40 }, (_, i) => 2031 - i).map(year => (
                <Select.Option key={year} value={year}>{year}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Additional Info */}
          <Divider />
          <Title level={4} style={{ marginTop: '24px' }}>Additional Information</Title>
          <Form.Item name="certifications" label="Certifications (Optional)">
            <TextArea rows={3} placeholder="List any relevant certifications..." />
          </Form.Item>
          <Form.Item
            name="resume"
            label="Upload Resume/CV"
            rules={[{ required: true, message: 'Please upload your resume' }]}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.docx"
            >
              <Button icon={<UploadOutlined />} size="large" block style={{ height: '52px' }}>
                Click to Upload (PDF, DOC, DOCX)
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="coverLetter" label="Cover Letter (Optional)">
            <TextArea rows={4} placeholder="Tell us why you're a great fit for this role..." />
          </Form.Item>

          {/* Submit */}
          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{
                height: '56px',
                fontSize: '18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #52c41a 0%, #1677ff 100%)',
                border: 'none'
              }}
            >
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobRequirements;