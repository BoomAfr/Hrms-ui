import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';


const BackButton = () => {
      const navigate = useNavigate();
    
    return (
        <div>
             <Button 
  type="primary" 
  icon={<ArrowLeftOutlined />} 
  onClick={() => navigate(-1)}
  style={{ marginBottom: '16px' }}
>
  Back
</Button>
            
        </div>
    );
}

export default BackButton;
