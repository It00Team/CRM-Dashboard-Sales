import React, { useState } from 'react';
import MyAPI, { Token } from '../config/MyAPI.jsx';


const AddClients = () => {
    const token = Token.getToken()
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const add_client = async(e) => {
    e.preventDefault()
    const data = new FormData();
    data.append('file', file);

    try {
        const res = await MyAPI.post(`/crm/customer/add-many-customers`, data, token, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
      } catch (error) {
        console.error(error);
      } 
  };
  return (
    <>
      <input type="file" onChange={(e)=>handleFileChange(e)} ></input>
      <input type="button" onClick={(e)=>add_client(e)} value='submit' />
    </>
  );
};

export default AddClients;
