import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import { Button, MenuItem } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import style from './sales.module.css';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import MyAPI, { Token } from '../config/MyAPI';

// mock
import USERLIST from '../_mock/user';
// CLIENT NAME	CLIENT REGION TYPE	PROJECT LEAD TYPE	CLIENT REGION TYPE	CLIENT ONBOARDED BY	LAST FOLLOW UP	Action
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'CLIENT NAME', label: 'CLIENT NAME', alignRight: false },
  { id: 'CLIENT REGION', label: 'CLIENT REGION', alignRight: false },
  { id: 'PROJECT LEAD', label: 'PROJECT LEAD', alignRight: false },
  { id: 'ONBOARDED BY', label: 'ONBOARDED BY', alignRight: false },
  { id: 'LAST FOLLOW UP', label: 'LAST FOLLOW UP', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user?.customer_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export default function EditSales() {
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState([]);

  const [user, setUser] = useState([]);

  const [filteredUser, setFilteredUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [file, setFile] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const nameRef = useRef();
  const regionTypeRef = useRef();
  const externalSPOCRef = useRef();
  const onboardedByRef = useRef();
  const statusRef = useRef();
  const leadTypeRef = useRef();
  const remarkRef = useRef();
  const lastFollowUpRef = useRef();
  const projectNameRef = useRef();
  const projectStatusRef = useRef();
  const projectSOPRef = useRef();
  const projectDeadlineRef = useRef();
  const projectDepartmentRef = useRef();
  const sampleDeliveryDateRef = useRef();
  const qcDateRef = useRef();
  const deliveryDateRef = useRef();
  const stage1NoteRef = useRef();
  const stage2NoteRef = useRef();
  const clientFeedbackRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const token = Token.getToken();

  useEffect(() => {
    MyAPI.get(`/crm/customer/get-one-customer/${id}`, token).then((res) => {
      console.log(res);
      setData(res?.data);
    });
  }, []);

  const update_client = async (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current.value,
      regionType: regionTypeRef.current.value,
      externalSPOC: externalSPOCRef.current.value,
      onboardedBy: onboardedByRef.current.value,
      status: statusRef.current.value,
      leadType: leadTypeRef.current.value,
      remark: remarkRef.current.value,
      lastFollowUp: lastFollowUpRef.current.value,
      projectName: projectNameRef.current.value,
      projectStatus: projectStatusRef.current.value,
      projectSOP: projectSOPRef.current.value,
      projectDeadline: projectDeadlineRef.current.value,
      projectDepartment: projectDepartmentRef.current.value,
      sampleDeliveryDate: sampleDeliveryDateRef.current.value,
      qcDate: qcDateRef.current.value,
      deliveryDate: deliveryDateRef.current.value,
      stage1Note: stage1NoteRef.current.value,
      stage2Note: stage2NoteRef.current.value,
      clientFeedback: clientFeedbackRef.current.value,
    };

    const res = await MyAPI.put(`/crm/customer/update-customer/${id}`, data, token).then((response) => {
      navigate('/dashboard/sales');
    });
    console.log(res);
  };

  useEffect(() => {
    const token = Token.getToken();
    MyAPI.get(`/users/user-profile/`, token).then((res) => {
      setUser(res.data);
    });
  }, []);

  useEffect(() => {
    if (data && data.projectDepartment) {
      const filtered = user.filter((item) => {
        return item.department.name === data.projectDepartment && item.designation === 'team_leader';
      });
      setFilteredUser(filtered);
    } else {
      console.log('no project or department_id');
    }
  }, []);
  const handleAssign = () => {
    const token = Token.getToken();

    const details = {
      assignedToOperation: selectedUser,
      assignedBy: parseJwt(token).user_id,
    };

    console.log(details);

    MyAPI.put(`/crm/customer/update-customer/${id}/`, details, token).then((res) => {
      console.log(res);
    });
    setIsDialogOpen(false);
    navigate('/dashboard/sales');
  };

  const handleView = (id) => {
    console.log(id);
  };

  return (
    <>
      <Helmet>  
        <title> Sales </title>
      </Helmet>
      <div className="cai97_card">
        <form>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" ref={nameRef} defaultValue={data.name} />
          </div>

          <div>
            <label htmlFor="regionType">Region Type:</label>
            <input type="text" id="regionType" name="regionType" ref={regionTypeRef} defaultValue={data.regionType} />
          </div>

          <div>
            <label htmlFor="externalSPOC">External SPOC:</label>
            <input
              type="text"
              id="externalSPOC"
              name="externalSPOC"
              ref={externalSPOCRef}
              defaultValue={data.externalSPOC}
            />
          </div>

          <div>
            <label htmlFor="onboardedBy">Onboarded By:</label>
            <input
              type="text"
              id="onboardedBy"
              name="onboardedBy"
              ref={onboardedByRef}
              defaultValue={data.onboardedBy}
            />
          </div>

          <div>
            <label htmlFor="status">Status:</label>
            <input type="text" id="status" name="status" ref={statusRef} defaultValue={data.status} />
          </div>

          <div>
            <label htmlFor="leadType">Lead Type:</label>
            <input type="text" id="leadType" name="leadType" ref={leadTypeRef} defaultValue={data.leadType} />
          </div>

          <div>
            <label htmlFor="remark">Remark:</label>
            <input type="text" id="remark" name="remark" ref={remarkRef} defaultValue={data.remark} />
          </div>

          <div>
            <label htmlFor="lastFollowUp">Last Follow Up:</label>
            <input
              type="text"
              id="lastFollowUp"
              name="lastFollowUp"
              ref={lastFollowUpRef}
              defaultValue={data.lastFollowUp}
            />
          </div>

          <div>
            <label htmlFor="projectName">Project Name:</label>
            <input type="text" id="projectName" ref={projectNameRef} defaultValue={data.projectName} />
          </div>

          <div>
            <label htmlFor="projectStatus">Project Status:</label>
            <input
              type="text"
              id="projectStatus"
              name="projectStatus"
              ref={projectStatusRef}
              defaultValue={data.projectStatus}
            />
          </div>

          <div>
            <label htmlFor="projectSOP">Project SOP:</label>
            <input type="text" id="projectSOP" name="projectSOP" ref={projectSOPRef} defaultValue={data.projectSOP} />
          </div>

          <div>
            <label htmlFor="projectDeadline">Project Deadline:</label>
            <input
              type="text"
              id="projectDeadline"
              name="projectDeadline"
              ref={projectDeadlineRef}
              defaultValue={data.projectDeadline}
            />
          </div>

          <div>
            <label htmlFor="projectDepartment">Project Department:</label>
            <input
              type="text"
              id="projectDepartment"
              name="projectDepartment"
              ref={projectDepartmentRef}
              defaultValue={data.projectDepartment}
            />
          </div>

          <div>
            <label htmlFor="sampleDeliveryDate">Sample Delivery Date:</label>
            <input
              type="text"
              id="sampleDeliveryDate"
              name="sampleDeliveryDate"
              ref={sampleDeliveryDateRef}
              defaultValue={data.sampleDeliveryDate}
            />
          </div>

          <div>
            <label htmlFor="qcDate">QC Date:</label>
            <input type="text" id="qcDate" name="qcDate" ref={qcDateRef} defaultValue={data.qcDate} />
          </div>

          <div>
            <label htmlFor="deliveryDate">Delivery Date:</label>
            <input
              type="text"
              id="deliveryDate"
              name="deliveryDate"
              ref={deliveryDateRef}
              defaultValue={data.deliveryDate}
            />
          </div>

          <div>
            <label htmlFor="stage1Note">Stage 1 Note:</label>
            <input type="text" id="stage1Note" name="stage1Note" ref={stage1NoteRef} defaultValue={data.stage1Note} />
          </div>

          <div>
            <label htmlFor="stage2Note">Stage 2 Note:</label>
            <input type="text" id="stage2Note" name="stage2Note" ref={stage2NoteRef} defaultValue={data.stage2Note} />
          </div>

          <div>
            <label htmlFor="clientFeedback">Client Feedback:</label>
            <input
              type="text"
              id="clientFeedback"
              name="clientFeedback"
              ref={clientFeedbackRef}
              defaultValue={data.clientFeedback}
            />
          </div>

          <Button variant="contained" onClick={(e) => update_client(e)}>
            submit
          </Button>
        </form>
      </div>
      <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
        Assign
      </Button>

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
}
