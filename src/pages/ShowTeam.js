import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import MyAPI, { Token } from '../config/MyAPI';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const ShowOneTeam = () => {
  const [data, setData] = useState();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUser] = useState();

  const { id } = useParams();

  useEffect(() => {
    MyAPI.get(`/crm/team/get-one-team/${id}`).then((res) => {
      console.log(res?.data.Users);
      setData(res?.data);
      setUsers(res?.data.Users);
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState('');
  const [hours, setHours] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleChange = (id) => {
    setSelectedUser(id);
  };

  const findPerformance = (e) => {
    e.preventDefault();
    console.log(selectedDate);
    MyAPI.get(`/crm/performance/show-performance/${selectedDate}/${selectedUsers}`).then((res) => {
      console.log(res?.data);
      setHours(res?.data);
      console.log(hours);
    });
  };

  return (
    <>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <button onClick={(e) => findPerformance(e)}>Filter</button>
      {/* <p>{hours ? hours : 'NA'}</p> */}
      <div className="table-outer-box">
        <div className="table-top-box">
          <h4 className="table-top-heading">Teams Table</h4>
        </div>
        <div className="main-table">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Total Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  ? users.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input type="checkbox" value={item.id} onChange={() => handleChange(item.id)} />
                        </TableCell>
                        <TableCell>{item.username ?? 'NA'}</TableCell>
                        <TableCell>{item.name ?? 'NA'}</TableCell>
                        <TableCell>
                          {hours
                            ? hours
                                .filter((performance) => performance.user_id === item.id)
                                .map((performance) => performance.hours_worked)
                                .join(', ') ?? '0'
                            : ''}
                        </TableCell>
                      </TableRow>
                    ))
                  : 'no data'}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default ShowOneTeam;
