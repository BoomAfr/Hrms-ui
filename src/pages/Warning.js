import React, { useState } from 'react';
import CommonTable from '../components/common/SharedTable/CommonTable';
import { useWarning } from '../hooks/useWarning';
import { Button, DatePicker, Input } from 'antd';
import { Select } from 'antd';
const { Option } = Select;

const Warning = () => {
    const {warnings,addWarning,employees} = useWarning();
    const [isModalOpen,setIsModalOpen] = useState(false)
    const tableColumns =[
        {
        key :'id',
        dataIndex:'id',
        title:"S/L"
    },
     {
        key :'id',
        dataIndex:'id',
        title:"Employee Name"
    },
     {
        key :'id',
        dataIndex:'id',
        title:"Warning Date"
    },
     {
        key :'id',
        dataIndex:'id',
        title:"subject"
    },
     {
        key :'id',
        dataIndex:'id',
        title:"Warning Type"
    },
     {
        key :'id',
        dataIndex:'id',
        title:"Warning By"
    },
    {
        id:"id",
        dataIndex:"Action",
        title:"Action",
        render : (record,key) =>(record)
    }
]
// const handleAddWarning = ()=> (navigate(""))
const addWarningButton = (<Button type="primary" onClick={()=> setIsModalOpen(true)} >Add Warnings</Button>)
// const onSubmit = ()=>{

// }
const deleteModal ={
isModalOpen,
  setIsModalOpen,
  onSubmit: (values) =>addWarning(values),
//   editingDept,
  title:'Add Warning',
//   fieldLabel:['Employee Name',"Warning Type","subject","Warning By","Warning Date","Description"],
 
}
 const handleSubmit = (values) => {
        console.log('Form values:', values);
        addWarning(values);
        setIsModalOpen(false);
    };
const formModal ={
isModalOpen,
  setIsModalOpen,
  onSubmit: handleSubmit,
//   editingDept,
  title:'Add Warning',
 fieldLabel:[
     {
    name:'employee_name',
    isRequired:true,
    label:"Employee Name",
    component : (
      <Select placeholder="Select Employee">
        {employees.map((emp) => (
          <Option key={emp.id} value={emp.id}>
            {emp.name || emp.employee_name}
          </Option>
        ))}
      </Select>
    )
  },
   {
    name:'warning_type',
    isRequired:true,
    label:"Warning Type",
    component : <Input/>
  }, {
    name:'subject',
    isRequired:true,
    label:"subject",
    component : <Input/>
  }, {
    name:'warning_by',
    isRequired:true,
    label:"Warning By",
    component : <Input/>
  }, {
    name:'warning_date',
    isRequired:true,
    label:"Warning Date",
    component : <DatePicker/>
  }, {
    name:'Description',
    isRequired:true,
    label:"Description",
    component : <Input/>
  },
  ],}

// { }
    return (
       <CommonTable
            title=" Warning List"
            data={warnings}
            columns={tableColumns}
            showSearch={true}
            showFilters={true}
            // filters={employeeFilters}
            // onSearch={handleSearch}
            // onFilterChange={handleFilterChange}
            // onRefresh={handleRefresh}
            searchPlaceholder="Search.."
            extraButtons={addWarningButton}
            deleteModal={null}
            formModal={formModal}
        />
    );
}

export default Warning;
