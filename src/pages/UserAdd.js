import React, { useRef, useState, useEffect } from "react";
import MyAPI, { Token } from "../config/MyAPI.jsx";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import { MenuItem, Button, Select } from "@mui/material";

const UserAdd = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const designationRef = useRef('');
  const nameRef = useRef();
  const departmentRef = useRef('');

  const navigate = useNavigate();

  const [department, setDepartment] = useState([]);
  useEffect(() => {
    const token = Token.getToken();
    MyAPI.get("/hrms/department/show-department/").then((res) => {
      setDepartment(res.data);
      console.log(res);
    });
  }, []);

  const handleClick = () => {
    try { 
      const details = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
        designation: designationRef.current,
        department_id: departmentRef.current,
        email: emailRef.current.value,
      };

      console.log(details);

      MyAPI.post("/users/user-add/", details).then((res) => {
        console.log(res);
        Token.setToken(res.data.token);
        navigate("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card sx={{ display: "flex", alignItems: "center", width: "50%" }}>
          <CardMedia
            component="img"
            sx={{ width: "50%", height: "100%", objectFit: "cover" }}
            image="https://images.pexels.com/photos/2103864/pexels-photo-2103864.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Live from space album cover"
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "50%",
              padding: "20px",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Name" 
              variant="outlined"
              inputRef={nameRef}
              sx={{ mb: 2 }}
            />
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              inputRef={usernameRef}
              sx={{ mb: 2 }}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              inputRef={passwordRef}
              sx={{ mb: 2 }}
              type="password"
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              inputRef={emailRef}
              sx={{ mb: 2 }}
            />
            <Select
              sx={{ mb: 2 }}
              labelId="project-status-label"
              id="exampleSelectProjectStatus"
              value={designationRef.current}
              label="Designation"
              onChange={(e) => {
                designationRef.current = e.target.value;
              }}
            >
              <MenuItem value="">select</MenuItem>
              <MenuItem value="team_leader">Team Leader</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="super_admin">Super Admin</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
            </Select>
            <Select
              sx={{ mb: 2 }}
              labelId="project-status-label"
              id="exampleSelectProjectStatus"
              value={departmentRef.current}
              onChange={(e) => {
                departmentRef.current = e.target.value;
              }}
              label="Department"
            >
              <MenuItem value="">select</MenuItem>
              {department
                ? department.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })
                : ""}
            </Select>
            <Button variant="contained" color="primary" onClick={handleClick}>
              add
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default UserAdd;
