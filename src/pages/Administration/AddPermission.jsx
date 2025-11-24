import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Card, Row, Col, Select, message, Input, Checkbox, Tree } from 'antd';
import { useToast } from '../../hooks/useToast';
import { usePages } from '../../hooks/pages/usePages';
import { useAddRoles } from '../../hooks/useAddRole';
import { getIconComponent } from '../../constants/menuItem';

const { Option } = Select;

const AddPermission = () => {
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const { Toast, contextHolder } = useToast();
  const { loading: pagesLoading, allPages, allowedPages, error, updateRolePermission, fetchPagesByRole } = usePages();
  const { roles } = useAddRoles();

  // Transform API data to match our component structure
  const transformedMenuItems = useMemo(() => {
    if (!allPages || !Array.isArray(allPages)) return [];
    
    const transformItems = (items) => {
      return items.map(item => ({
        key: item.key,
        label: item.label,
        icon: getIconComponent(item.icon),
        id: item.id,
        codename: item.codename,
        children: item.children ? transformItems(item.children) : [],
      }));
    };
    
    return transformItems(allPages);
  }, [allPages]);

  // Get ONLY leaf nodes (actual pages, not modules/folders)
  const getAllLeafKeys = useMemo(() => {
    const leafKeys = new Set();
    
    const extractLeafKeys = (items) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          // This has children, so it's a folder/module - skip it and check children
          extractLeafKeys(item.children);
        } else {
          // This is a leaf node (actual page) - only add if it's a page (not a module)
          // Check if this is an actual page by looking at URL pattern or ID range
          if (item.id && item.id >= 55) { // Page IDs start from 55 in your data
            leafKeys.add(item.key);
          }
        }
      });
    };
    
    extractLeafKeys(transformedMenuItems);
    return Array.from(leafKeys);
  }, [transformedMenuItems]);

  // Get leaf keys for a specific module (only actual pages)
  const getModuleLeafKeys = (module) => {
    const leafKeys = [];
    
    const extractLeafKeys = (items) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          extractLeafKeys(item.children);
        } else {
          // Only add if it's an actual page (ID >= 55)
          if (item.id && item.id >= 55) {
            leafKeys.push(item.key);
          }
        }
      });
    };
    
    extractLeafKeys([module]);
    return leafKeys;
  };

  // Function to find key by page ID
  const findKeyByPageId = (pageId, items = transformedMenuItems) => {
    for (let item of items) {
      if (item.id === pageId) {
        return item.key;
      }
      if (item.children && item.children.length > 0) {
        const foundKey = findKeyByPageId(pageId, item.children);
        if (foundKey) return foundKey;
      }
    }
    return null;
  };

  // Function to find page ID by key - WITH VALIDATION
  const findPageIdByKey = (key, items = transformedMenuItems) => {
    for (let item of items) {
      if (item.key === key && item.id && item.id >= 55) { // Only return valid page IDs
        return item.id;
      }
      if (item.children && item.children.length > 0) {
        const foundId = findPageIdByKey(key, item.children);
        if (foundId) return foundId;
      }
    }
    return null;
  };

  // Convert assigned page IDs to checked keys
  const convertPageIdsToCheckedKeys = (pageIds) => {
    const keys = [];
    pageIds.forEach(pageId => {
      const key = findKeyByPageId(pageId);
      if (key) {
        keys.push(key);
      }
    });
    return keys;
  };

  // Handle role selection
  const handleRoleChange = async (roleId) => {
    setSelectedRoleId(roleId);
    if (roleId) {
      try {
        await fetchPagesByRole(roleId);
      } catch (error) {
        message.error('Failed to fetch role permissions');
        console.error('Error fetching permissions:', error);
      }
    } else {
      setCheckedKeys([]);
    }
  };

  // Effect to update checked keys when allowedPages changes
  useEffect(() => {
    if (selectedRoleId && allowedPages && allowedPages.role_id === selectedRoleId) {
      const assignedPageIds = allowedPages.assigned_page_ids || [];
      const checkedKeysFromBackend = convertPageIdsToCheckedKeys(assignedPageIds);
      setCheckedKeys(checkedKeysFromBackend);
    }
  }, [allowedPages, selectedRoleId]);

  // Check if all leaf nodes in a module are selected
  const isModuleFullySelected = (module) => {
    const moduleLeafKeys = getModuleLeafKeys(module);
    return moduleLeafKeys.length > 0 && moduleLeafKeys.every(key => checkedKeys.includes(key));
  };

  // Check if some leaf nodes in a module are selected
  const isModulePartiallySelected = (module) => {
    const moduleLeafKeys = getModuleLeafKeys(module);
    return moduleLeafKeys.some(key => checkedKeys.includes(key)) && !isModuleFullySelected(module);
  };

  // Handle checkbox change for individual items
  const handleCheckboxChange = (key, checked) => {
    let newCheckedKeys = [...checkedKeys];
    
    if (checked) {
      if (!newCheckedKeys.includes(key)) {
        newCheckedKeys.push(key);
      }
    } else {
      newCheckedKeys = newCheckedKeys.filter(k => k !== key);
    }
    
    setCheckedKeys(newCheckedKeys);
  };

  // Handle module header checkbox change
  const handleModuleHeaderChange = (module) => {
    const moduleLeafKeys = getModuleLeafKeys(module);
    
    if (isModuleFullySelected(module)) {
      // Remove all module leaf keys
      const newCheckedKeys = checkedKeys.filter(key => !moduleLeafKeys.includes(key));
      setCheckedKeys(newCheckedKeys);
    } else {
      // Add all module leaf keys that aren't already included
      const newCheckedKeys = [...new Set([...checkedKeys, ...moduleLeafKeys])];
      setCheckedKeys(newCheckedKeys);
    }
  };

  // Handle select all - WITH VALIDATION
  const handleSelectAll = () => {
  const allLeafKeys = getAllLeafKeys;
  
  // Find parent pages that are needed for module structure
  const necessaryParentPages = new Set();
  
  const findNecessaryParents = (items) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        // Check if any child is selected
        const hasSelectedChild = item.children.some(child => 
          allLeafKeys.includes(child.key)
        );
        
        if (hasSelectedChild && item.id && item.id >= 55) {
          necessaryParentPages.add(item.key);
        }
        
        // Recursively check children
        findNecessaryParents(item.children);
      }
    });
  };
  
  findNecessaryParents(transformedMenuItems);
  
  // Combine leaf keys with necessary parent pages
  const allKeysToSelect = [...new Set([...allLeafKeys, ...necessaryParentPages])];
  
  console.log('Selecting all keys:', {
    leafKeys: allLeafKeys,
    necessaryParents: Array.from(necessaryParentPages),
    finalSelection: allKeysToSelect
  });
  
  setCheckedKeys(allKeysToSelect);
};

  // Handle deselect all
  const handleDeselectAll = () => {
    setCheckedKeys([]);
  };

  // Save permissions - WITH ENHANCED VALIDATION
  const handleSavePermissions = async () => {
    if (!selectedRoleId) {
      message.warning('Please select a role first');
      return;
    }

    try {
      // Convert checked keys back to page IDs with strict validation
      const selectedPageIds = checkedKeys
        .map(key => findPageIdByKey(key))
        .filter(id => id !== null && id !== undefined && id >= 55) // Only valid page IDs
        .map(id => Number(id));

      console.log('Saving permissions for role:', selectedRoleId);
      console.log('Selected Keys:', checkedKeys);
      console.log('Selected Page IDs (valid only):', selectedPageIds);

      // Additional validation
      const invalidKeys = checkedKeys.filter(key => {
        const pageId = findPageIdByKey(key);
        return pageId === null || pageId < 55;
      });

      if (invalidKeys.length > 0) {
        console.warn('Invalid keys filtered out:', invalidKeys);
      }

      if (selectedPageIds.length === 0) {
        message.warning('Please select at least one valid permission');
        return;
      }

      // Final payload validation
      console.log('Final Payload to Send:', { page_ids: selectedPageIds });

      // Call API to update permissions
      await updateRolePermission(selectedRoleId, { page_ids: selectedPageIds }, Toast);
      
    } catch (error) {
      message.error('Failed to update permissions');
      console.error('Error updating permissions:', error);
    }
  };

  // Convert menu items to tree data format with checkboxes
  const convertMenuToTreeData = (menuItems) => {
    return menuItems.map(item => ({
      key: item.key,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px' }}>
            {item.icon} {item.label}
          </span>
          {!item.children || item.children.length === 0 ? (
            <Checkbox 
              checked={checkedKeys.includes(item.key)}
              onChange={(e) => handleCheckboxChange(item.key, e.target.checked)}
              size="small"
            />
          ) : (
            <div style={{ opacity: 0.6, fontSize: '10px', color: '#999' }}>
              Folder
            </div>
          )}
        </div>
      ),
      children: item.children ? convertMenuToTreeData(item.children) : [],
    }));
  };

  // Group modules for display (3 cards per row)
  const groupedModules = useMemo(() => {
    const groups = [];
    for (let i = 0; i < transformedMenuItems.length; i += 3) {
      groups.push(transformedMenuItems.slice(i, i + 3));
    }
    return groups;
  }, [transformedMenuItems]);

  return (
    <div style={{ padding: '24px' }}>
      {contextHolder}
      <Card
        title="Role Permission Management"
        extra={
          <Space>
            <Button disabled={!selectedRoleId} onClick={handleSelectAll}>Select All</Button>
            <Button disabled={!selectedRoleId} onClick={handleDeselectAll}>Deselect All</Button>
            <Button 
              disabled={!selectedRoleId} 
              loading={pagesLoading} 
              type="primary" 
              onClick={handleSavePermissions}
            >
              Save Permissions
            </Button>
          </Space>
        }
      >
        <Row style={{ marginBottom: 16 }} align="middle" justify="space-between">
          <Col>
            <Select 
              placeholder="Select Role" 
              style={{ width: 250 }}
              onChange={handleRoleChange}
              value={selectedRoleId}
              loading={pagesLoading}
            >
              {Array.isArray(roles) && 
                roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))
              }
            </Select>
          </Col>
        </Row>

        {selectedRoleId ? (
          <div style={{ marginTop: 16 }}>
            {groupedModules.map((rowModules, rowIndex) => (
              <Row gutter={[16, 16]} key={rowIndex} style={{ marginBottom: 16 }}>
                {rowModules.map((module) => {
                  const isFullySelected = isModuleFullySelected(module);
                  const isPartiallySelected = isModulePartiallySelected(module);
                  
                  return (
                    <Col xs={24} sm={12} md={8} key={module.key}>
                      <Card 
                        size="small"
                        title={
                          <div 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              background: isFullySelected ? '#e6f7ff' : 'transparent',
                              padding: '4px 8px',
                              margin: '-8px -8px 8px -8px',
                              borderRadius: '6px',
                              border: isFullySelected ? '1px solid #1890ff' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              <Checkbox 
                                checked={isFullySelected}
                                indeterminate={isPartiallySelected}
                                onChange={() => handleModuleHeaderChange(module)}
                                style={{ marginRight: '8px' }}
                              />
                              <span style={{ fontSize: '14px', fontWeight: 'bold', flex: 1 }}>
                                {module.icon} {module.label}
                              </span>
                            </div>
                            <Button 
                              size="small" 
                              type={isFullySelected ? "primary" : "default"}
                              onClick={() => handleModuleHeaderChange(module)}
                              style={{ 
                                fontSize: '10px',
                                fontWeight: 'bold',
                                background: isFullySelected ? '#1890ff' : undefined,
                                borderColor: isFullySelected ? '#1890ff' : undefined
                              }}
                            >
                              {isFullySelected ? 'Selected All' : 'Select All'}
                            </Button>
                          </div>
                        }
                        style={{ 
                          height: '100%',
                          border: '1px solid #d9d9d9',
                          borderTop: isFullySelected ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        bodyStyle={{ 
                          padding: '8px', 
                          maxHeight: '300px', 
                          overflow: 'auto' 
                        }}
                      >
                        {module.children && module.children.length > 0 ? (
                          <Tree
                            treeData={convertMenuToTreeData(module.children)}
                            checkedKeys={checkedKeys}
                            checkable={false}
                            defaultExpandAll={false}
                            showLine={true}
                            selectable={false}
                            style={{ background: 'transparent' }}
                          />
                        ) : (
                          <div style={{ 
                            textAlign: 'center', 
                            color: '#999',
                            padding: '20px'
                          }}>
                            No pages available
                          </div>
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#999',
            background: '#fafafa',
            borderRadius: 6
          }}>
            Please select a role to manage permissions
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddPermission;