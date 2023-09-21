import React, { useState } from 'react';
import { Button } from '@mui/material';
import MyAPI from 'src/config/MyAPI';

const Review = () => {
  const [formData, setFormData] = useState({
    advisor_emp_id: '',
    advisor_name: '',
    tl_name: '',
    manager: '',
    auditor_emp_id: '',
    quality_analyst: '',
    project_name: '',
    collection_date: '',
    audit_date: '',
    reference_of_doc: '',
    unique_id: '',
    observation: '',
    score: '',
    remark: '',
    status: '',
    duration: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    MyAPI.post('/crm/review/add_QaReview').then((res)=>{
    console.log(res)
    })
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit} method="post">
        <label for="advisor_emp_id">Advisor EMP ID:</label>
        <input type="text" id="advisor_emp_id" name="advisor_emp_id" value={formData.advisor_emp_id} onChange={handleChange}  required /><br/><br/>

        <label for="advisor_name">Advisor Name:</label>
        <input type="text" id="advisor_name" name="advisor_name"  value={formData.advisor_name} onChange={handleChange}  required /><br/><br/>

        <label for="tl_name">TL's Name:</label>
        <input type="text" id="tl_name" name="tl_name" required value={formData.tl_name} onChange={handleChange}  /><br/><br/>

        <label for="manager">Manager:</label>
        <input type="text" id="manager" name="manager" required  value={formData.manager} onChange={handleChange} /><br/><br/>

        <label for="auditor_emp_id">Auditor Emp.Id:</label>
        <input type="number" id="auditor_emp_id" name="auditor_emp_id" required value={formData.auditor_emp_id} onChange={handleChange}  /><br/><br/>

        <label for="quality_analyst">Quality Analyst:</label>
        <input type="text" id="quality_analyst" name="quality_analyst" required  value={formData.quality_analyst} onChange={handleChange} /><br/><br/>

        <label for="project_name">Project Name:</label>
        <input type="text" id="project_name" name="project_name" required value={formData.project_name} onChange={handleChange}  /><br/><br/>

        <label for="collection_date">Collection Date:</label>
        <input type="date" id="collection_date" name="collection_date" required value={formData.collection_date} onChange={handleChange}  /><br/><br/>

        <label for="audit_date">Audit Date:</label>
        <input type="date" id="audit_date" name="audit_date" required  value={formData.audit_date} onChange={handleChange} /><br/><br/>

        <label for="reference_of_doc">Reffrence of Doc:</label>
        <input type="text" id="reference_of_doc" name="reference_of_doc" required value={formData.reference_of_doc} onChange={handleChange}  /><br/><br/>

        <label for="unique_id">Unique ID:</label>
        <input type="text" id="unique_id" name="unique_id" required value={formData.unique_id} onChange={handleChange}  /><br/><br/>

        <label for="observation">Observation:</label><br/>
        <textarea id="observation" name="observation" rows="4" cols="50" required value={formData.observation} onChange={handleChange} ></textarea><br/><br/>

        <label for="score">SCORE:</label>
        <input type="number" id="score" name="score" required value={formData.score} onChange={handleChange}  /><br/><br/>

        <label for="remark">REMARK:</label><br/>
        <textarea id="remark" name="remark" rows="4" cols="50" required value={formData.remark} onChange={handleChange} ></textarea><br/><br/>

        <label for="status">STATUS:</label>
        <input type="text" id="status" name="status" required value={formData.status} onChange={handleChange}  /><br/><br/>

        <label for="duration">Duration:</label>
        <input type="text" id="duration" name="duration" required  value={formData.duration} onChange={handleChange} /><br/><br/>

        <Button type='submit' variant="contained" sx={{ marginRight: '10px' }}>
          add Review
        </Button>
    </form>
    </>
  );
};

export default Review;
