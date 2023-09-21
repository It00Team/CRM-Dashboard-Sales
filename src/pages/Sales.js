import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
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
    return filter(array, (_user) => _user?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Sales() {
  const [data, setData] = useState([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAdd, setOpenAdd] = useState(false);

  const [openView, setOpenView] = useState(false);

  const [viewData, setViewData] = useState({});

  const [department, setDepartment] = useState([]);

  const [file, setFile] = useState();

  const navigate = useNavigate();

  const componentRef = useRef();


  useEffect(() => {
    MyAPI.get('/crm/customer/all-customer', token).then((res) => {
      console.log(res);
      setData(res?.data);
    });
  }, []);

  const exportCSV = () => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  const token = Token.getToken();

 

  const openAddPopup = () => {
    setOpenAdd(true);
  };

  const addSOP = async (id) => {
    const data = new FormData();
    data.append('file', file);
    console.log(file);

    try {
      const res = await MyAPI.put(`/crm/customer/save-file/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      if(res.status == 201){
        navigate('dashboard/sales')
      }
    } catch (error) {
      console.error(error);
    }
  };

  

  const [formData, setFormData] = useState({
    name: '',
    regionType: '',
    externalSPOC: '',
    onboardedBy: '',
    status: '',
    leadType: '',
    remark: '',
    lastFollowUp: '',
    projectName: '',
    projectStatus: '',
    projectDeadline: '',
    projectDepartment: '',
    sampleDeliveryDate: '',
    qcDate: '',
    deliveryDate: '',
    stage1Note: '',
    stage2Note: '',
    clientFeedback: '',
    assignedToOperation: '',
    assignedBy: '',
    assignedToQc: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      console.log(formData)
      const customer = await MyAPI.post(`/crm/customer/add-customer`, formData, token )
      console.log(customer)
      console.log(customer.id, customer.data.id)
      addSOP(customer.data.id)
    } catch (error) {
      console.log(error)
    }
  }

  const handleView = (id) => {
    console.log(id);
  };

  const handleEdit = (e, id) => {
    console.log(id);
    e.preventDefault();
    handleCloseMenu();
    navigate(`/dashboard/edit-client/${id}`);
    console.log(id);
  };

  const handleDelete = async (e, id)=>{
    e.preventDefault()
    const token = Token.getToken();
    console.log(id)
    await MyAPI.delete(`/crm/customer/delete-customer/${id}/`, token).then((res)=>{
      console.log(res)
      handleCloseMenu()
    })
  }

  return (
    <>
      <Helmet>
        <title> Sales </title>
      </Helmet>
      {/* add popup */}
      <div className={style.popup} style={!openAdd ? { display: 'none' } : { position: 'absolute' }}>
        <button
          type="button"
          class="btn-close m-1"
          style={{ float: 'right', color: 'red' }}
          onClick={() => setOpenAdd(false)}
          aria-label="Close"
        ></button>
        <div className={style.container}>
          <form onSubmit={(e)=>handleSubmit(e)} >
            <div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="regionType">Region Type:</label>
              <input
                type="text"
                id="regionType"
                name="regionType"
                value={formData.regionType}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="externalSPOC">External SPOC:</label>
              <input
                type="text"
                id="externalSPOC"
                name="externalSPOC"
                value={formData.externalSPOC}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="onboardedBy">Onboarded By:</label>
              <input
                type="text"
                id="onboardedBy"
                name="onboardedBy"
                value={formData.onboardedBy}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="status">Status:</label>
              <input type="text" id="status" name="status" value={formData.status} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="leadType">Lead Type:</label>
              <input type="text" id="leadType" name="leadType" value={formData.leadType} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="remark">Remark:</label>
              <input type="text" id="remark" name="remark" value={formData.remark} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="lastFollowUp">Last Follow Up:</label>
              <input
                type="text"
                id="lastFollowUp"
                name="lastFollowUp"
                value={formData.lastFollowUp}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="projectName">Project Name:</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="projectStatus">Project Status:</label>
              <input
                type="text"
                id="projectStatus"
                name="projectStatus"
                value={formData.projectStatus}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="projectSOP">Project SOP:</label>
              <input
                type="file"
                id="projectSOP"
                name="projectSOP"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label htmlFor="projectDeadline">Project Deadline:</label>
              <input
                type="text"
                id="projectDeadline"
                name="projectDeadline"
                value={formData.projectDeadline}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="projectDepartment">Project Department:</label>
              <input
                type="text"
                id="projectDepartment"
                name="projectDepartment"
                value={formData.projectDepartment}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="sampleDeliveryDate">Sample Delivery Date:</label>
              <input
                type="text"
                id="sampleDeliveryDate"
                name="sampleDeliveryDate"
                value={formData.sampleDeliveryDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="qcDate">QC Date:</label>
              <input type="text" id="qcDate" name="qcDate" value={formData.qcDate} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="deliveryDate">Delivery Date:</label>
              <input
                type="text"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="stage1Note">Stage 1 Note:</label>
              <input
                type="text"
                id="stage1Note"
                name="stage1Note"
                value={formData.stage1Note}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="stage2Note">Stage 2 Note:</label>
              <input
                type="text"
                id="stage2Note"
                name="stage2Note"
                value={formData.stage2Note}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="clientFeedback">Client Feedback:</label>
              <input
                type="text"
                id="clientFeedback"
                name="clientFeedback"
                value={formData.clientFeedback}
                onChange={handleChange}
              />
            </div>

            <button type="submit" > Submit</button>
          </form>
        </div>
      </div>

      {/* view popup */}
      <div className={style.popup} style={!openView ? { display: 'none' } : { position: 'absolute' }}>
        <button
          type="button"
          class="btn-close m-1"
          style={{ float: 'right', color: 'red' }}
          onClick={() => setOpenView(false)}
          aria-label="Close"
        ></button>
        <ReactToPrint
          trigger={() => {
            return <a href="#">Print</a>;
          }}
          content={() => componentRef.current}
        />
        <div className={style.container}>
          <div id="print" ref={componentRef}>
            <h3 className="text-center">Cient Detail</h3>
            <div className="container">
              <h5>
                Name: <span>{viewData.name}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            SALES
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openAddPopup}>
            New Sales
          </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={exportCSV}>
            Export To CSV
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      id,
                      name,
                      externalSPOC,
                      onboardedBy,
                      leadType,
                      avatarUrl,
                      lastFollowUp,
                    } = row;
                    const selectedUser = selected.indexOf(name) !== -1;
                    // CLIENT NAME	CLIENT REGION TYPE	PROJECT LEAD TYPE	CLIENT REGION TYPE	CLIENT ONBOARDED BY	LAST FOLLOW UP
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{externalSPOC}</TableCell>

                        <TableCell align="left">
                          <Label color={(leadType === 'lost' && 'error') || 'success'}>
                            {sentenceCase(leadType)}
                          </Label>
                        </TableCell>

                        <TableCell align="left">{onboardedBy}</TableCell>

                        <TableCell align="left">{lastFollowUp}</TableCell>

                        <TableCell
                          align="right"
                          onClick={() => {
                            setViewData(row);
                          }}
                        >
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>

                        <Popover
                          open={Boolean(open)}
                          anchorEl={open}
                          onClose={handleCloseMenu}
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          PaperProps={{
                            sx: {
                              p: 1,
                              width: 140,
                              '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                              },
                            },
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              setOpenView(true);
                              handleCloseMenu();
                            }}
                          >
                            <Iconify icoSn={'eva:edit-fill'} sx={{ mr: 2 }} />
                            View
                          </MenuItem>
                          <MenuItem onClick={(e) => handleEdit(e, id)}>
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            Edit
                          </MenuItem>

                          <MenuItem onClick={(e)=> handleDelete(e, id)} sx={{ color: 'error.main' }}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Delete
                          </MenuItem>
                        </Popover>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
