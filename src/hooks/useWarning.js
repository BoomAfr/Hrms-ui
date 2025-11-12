import { warningApi } from "../services/warningService";
import {manageEmployeeApi} from "../services/manageEmployeeServices";
import {useState,useEffect} from 'react';

export const useWarning = ()=>{
    const [warnings,setWarnings] = useState([]);
    const [employees, setEmployees] = useState([]);

    const fetchAllWarnings = async()=>{
        try{
            const response = await warningApi.getAll();
            console.log(response,'response')
            setWarnings(response?.data?.results || []);
        }
        catch(error){
            console.error("Error");
        }
        finally{

        }

    }
    const fetchEmployees = async () => {   // ⬅ added
    try {
      const response = await manageEmployeeApi.getAll();
      setEmployees(response?.data?.results || []);
    } catch (error) {
      console.error("Error fetching employees");
    }
  };

   const addWarning = (data) =>{
    console.log("addWarningdata",data)
        try{
            warningApi.create(data);
            fetchAllWarnings();

        }catch{

        }finally{}
    }

    useEffect(()=>{
        fetchAllWarnings();
        fetchEmployees();   // ⬅ added
       },[])

       return(
        
           { warnings,
            addWarning,
            employees  // ⬅ added
        }
        
       )
}