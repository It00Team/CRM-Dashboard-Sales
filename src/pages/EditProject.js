import React, { useState, useEffect, useRef } from 'react';
import MyAPI, { Token } from '../config/MyAPI';
import { useParams, useNavigate } from 'react-router-dom';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from '@mui/material';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = Token.getToken();
    MyAPI.get(`/crm/project/get-one-project/${id}`, token).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  }, []);

  const [department, setDepartment] = useState([]);
  useEffect(() => {
    const token = Token.getToken();
    MyAPI.get('/hrms/department/show-department/', token).then((res) => {
      setDepartment(res.data);
      console.log(res.data);
    });
  }, []);

  const nameRef = useRef();
  const end_dateRef = useRef();
  const statusRef = useRef();
  // const customerRef = useRef();
  const departmentRef = useRef();
  const reqRef = useRef();

  const update_project = (e) => {
    e.preventDefault();

    const details = {
      project_name: nameRef.current.value,
      //   project_deadline: end_dateRef.current.value,
      project_status: statusRef.current.value,
      department_id: departmentRef.current.value,
      project_requirement: reqRef.current.value,
    };

    try {
      const token = Token.getToken();
      MyAPI.put(`/crm/project/update-project/${id}/`, details, token).then((res) => {
        // console.log(res);
        handleSubmit(id);
        navigate('/show-project');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (id) => {
    const data = new FormData();
    data.append('file', file);
    // console.log(file)

    try {
      const res = await MyAPI.put(`/crm/project/save-file/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  // assign project start
  const [user, setUser] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const token = Token.getToken();
    MyAPI.get(`/users/user-profile/`, token).then((res) => {
      setUser(res.data);
    });
  }, []);

  useEffect(() => {
    if (data && data.department_id) {
      const filtered = user.filter((item) => {
        return item.department_id === data.department_id && item.designation === 'team_leader';
      });
      setFilteredUser(filtered);
    } else {
      console.log('no project or department_id');
    }
  });

  const handleAssign = () => {
    const token = Token.getToken();
    const details = {
      assigned_to_operation: selectedUser,
    };

    MyAPI.put(`/crm/project/update-project/${id}/`, details, token).then((res) => {
      console.log(res);
    });
    setIsDialogOpen(false);
    navigate('/dashboard/sales');
  };
  // assign project end

  return (
    <>
      <div className="cai97_card">
        <h2 style={{ textAlign: 'center', padding: '20px' }}>Update Product Details</h2>
        <div className="xadmi9812_card-body">
          <form className="forms-sample">
            <div className="sch798_form-group">
              <label htmlFor="exampleInputName1">Project Name:</label>
              <input
                ref={nameRef}
                placeholder="Project Name"
                type="text"
                id="exampleInputName1"
                className="ec90_form-control form-control"
                defaultValue={data.project_name}
              />
            </div>
            {/* <div className="sch798_form-group">
              <label htmlFor="exampleInputName1">Deadline:</label>
              <input
                ref={end_dateRef}
                placeholder="Deadline"
                type="date"
                id="exampleInputName1"
                className="ec90_form-control form-control"
                defaultValue={data.project_deadline}
              />
            </div> */}
            <div className="sch798_form-group">
              <label htmlFor="exampleInputName1">Project Status:</label>
              <select
                ref={statusRef}
                className="ec90_form-control form-control form-control"
                id="exampleInputName1"
                defaultValue={data.project_status}
              >
                <option value="Onboarded">Onboarded</option>
                <option value="Completed">Completed</option>
                <option value="Working">Working</option>
              </select>
            </div>

            <div className="sch798_form-group">
              <label htmlFor="exampleInputName1">Department:</label>
              <select
                ref={departmentRef}
                className="ec90_form-control form-control form-control"
                id="exampleInputName1"
              >
                {department ? (
                  department.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="">No data available</option>
                )}
              </select>
            </div>
            <div className="sch798_form-group">
              <label htmlFor="exampleInputName1">Project Requirement:</label>
              <input
                ref={reqRef}
                placeholder="Project Requirement"
                type="text"
                id="exampleInputName1"
                className="ec90_form-control form-control"
                defaultValue={data.project_requirement}
              />
            </div>
            <div className="sch798_form-group">
              <label htmlFor="exampleInputName1">Project SOP:</label>
              <input
                onChange={handleFileChange}
                type="file"
                id="exampleInputName1"
                className="ec90_form-control form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button variant="contained" onClick={update_project}>
                Update
              </Button>
              <Button variant="contained"  onClick={() => setIsDialogOpen(true)}>
                Assign
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Assign Project To</DialogTitle>
        <DialogContent>
          <FormControl>
            Select Team Leader
            <Select value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)}>
              {filteredUser ? (
                filteredUser.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No data available</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAssign} color="primary">
            Assign
          </Button>
       
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateProject;
