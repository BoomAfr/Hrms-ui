import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeProvider';
import './ThemeToggle.css';

const ThemeToggle = ({ size = 'middle', type = 'text' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <Button
        type={type}
        size={size}
        icon={isDark ? <BulbFilled /> : <BulbOutlined />}
        onClick={toggleTheme}
        className="theme-toggle-button"
        style={{
          color: isDark ? '#faad14' : '#1890ff',
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
