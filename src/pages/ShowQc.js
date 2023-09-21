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
  { id: 'QUALITY ANALYST', label: 'QUALITY ANALYST', alignRight: false },
  { id: 'ADVISOR NAME', label: 'ADVISOR NAME', alignRight: false },
  { id: 'PROJECT NAME', label: 'PROJECT NAME', alignRight: false },
  { id: 'STATUS', label: 'STATUS', alignRight: false },
  { id: 'AUDIT DATE', label: 'AUDIT DATE', alignRight: false },
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

export default function ShowQC() {
  const token = Token.getToken();

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

  const navigate = useNavigate();

  const componentRef = useRef();
  
  useEffect(()=>{
    MyAPI.get('/crm/review/get-review', token)
    .then((res) => {
        console.log(res)
        setData(res.data);
        
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
  }, [])
  


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


  const openAddPopup = () => {
    setOpenAdd(true);
  };


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
    // customer_id : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
    console.log(formData)
    MyAPI.post('/crm/review/add', formData, token).then((res) => {
      console.log(res);
      navigate('/dashboard/qc')
    });
  };

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
          <form onSubmit={handleSubmit} method="post">
            <label for="advisor_emp_id">Advisor EMP ID:</label>
            <input
              type="text"
              id="advisor_emp_id"
              name="advisor_emp_id"
              value={formData.advisor_emp_id}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <label for="advisor_name">Advisor Name:</label>
            <input
              type="text"
              id="advisor_name"
              name="advisor_name"
              value={formData.advisor_name}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <label for="tl_name">TL's Name:</label>
            <input type="text" id="tl_name" name="tl_name" required value={formData.tl_name} onChange={handleChange} />
            <br />
            <br />

            <label for="manager">Manager:</label>
            <input type="text" id="manager" name="manager" required value={formData.manager} onChange={handleChange} />
            <br />
            <br />

            <label for="auditor_emp_id">Auditor Emp.Id:</label>
            <input
              type="text"
              id="auditor_emp_id"
              name="auditor_emp_id"
              required
              value={formData.auditor_emp_id}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="quality_analyst">Quality Analyst:</label>
            <input
              type="text"
              id="quality_analyst"
              name="quality_analyst"
              required
              value={formData.quality_analyst}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="project_name">Project Name:</label>
            <input
              type="text"
              id="project_name"
              name="project_name"
              required
              value={formData.project_name}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="collection_date">Collection Date:</label>
            <input
              type="date"
              id="collection_date"
              name="collection_date"
              required
              value={formData.collection_date}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="audit_date">Audit Date:</label>
            <input
              type="date"
              id="audit_date"
              name="audit_date"
              required
              value={formData.audit_date}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="reference_of_doc">Reffrence of Doc:</label>
            <input
              type="text"
              id="reference_of_doc"
              name="reference_of_doc"
              required
              value={formData.reference_of_doc}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="unique_id">Unique ID:</label>
            <input
              type="text"
              id="unique_id"
              name="unique_id"
              required
              value={formData.unique_id}
              onChange={handleChange}
            />
            <br />
            <br />

            <label for="observation">Observation:</label>
            <br />
            <textarea
              id="observation"
              name="observation"
              rows="4"
              cols="50"
              required
              value={formData.observation}
              onChange={handleChange}
            ></textarea>
            <br />
            <br />

            <label for="score">SCORE:</label>
            <input type="text" id="score" name="score" required value={formData.score} onChange={handleChange} />
            <br />
            <br />

            <label for="remark">REMARK:</label>
            <br />
            <textarea
              id="remark"
              name="remark"
              rows="4"
              cols="50"
              required
              value={formData.remark}
              onChange={handleChange}
            ></textarea>
            <br />
            <br />

            <label for="status">STATUS:</label>
            <input type="text" id="status" name="status" required value={formData.status} onChange={handleChange} />
            <br />
            <br />

            <label for="duration">Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              required
              value={formData.duration}
              onChange={handleChange}
            />
            <br />
            <br />

            <Button type="submit" variant="contained" sx={{ marginRight: '10px' }}>
              add Review
            </Button>
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
                Name: <span>{viewData.customer_name}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            QC
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openAddPopup}>
            ADD review
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
                    const { id, advisor_name, status, quality_analyst, project_name, audit_date, avatarUrl } = row;
                    const selectedUser = selected.indexOf(quality_analyst) !== -1;
                    // CLIENT NAME	CLIENT REGION TYPE	PROJECT LEAD TYPE	CLIENT REGION TYPE	CLIENT ONBOARDED BY	LAST FOLLOW UP
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={quality_analyst} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {quality_analyst}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{advisor_name}</TableCell>

                        <TableCell align="left">{project_name}</TableCell>

                        <TableCell align="left">{status}</TableCell>
                        <TableCell align="left">{audit_date}</TableCell>

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

                          <MenuItem sx={{ color: 'error.main' }}>
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
