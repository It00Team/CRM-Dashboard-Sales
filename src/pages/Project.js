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
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Project Name', label: 'Project Name', alignRight: false },
  { id: 'Customer Name', label: 'Customer Name', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'Dead Line', label: 'Dead Line', alignRight: false },
  { id: 'Requirement', label: 'Requirement', alignRight: false },
  { id: 'SOP File', label: 'SOP File', alignRight: false },
  { id: '' },
];

// ID	Project Name	Customer Name	Dead Line	Requirement	SOP File	Status	Update	View

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
    return filter(array, (_user) => _user?.project_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Project() {
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

  const [myusers, setMyUsers] = useState([]);

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

  useEffect(() => {
    MyAPI.get('/crm/project/get-all-project/', token).then((res) => {
      console.log(res, 'res');
      if (res.status === 401) {
        navigate('/login');
      }
      setData(res.data);
    });
  }, []);

  const openAddPopup = () => {
    setOpenAdd(true);
  };

  const handleView = (id) => {
    console.log(id);
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    navigate(`/dashboard/edit-project/${id}`);
    console.log(id);
  };

  

  function formatDate(dateString) {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  return (
    <>
      <Helmet>
        <title> Project </title>
      </Helmet>
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
                Name: <span>{viewData.project_name}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Project
          </Typography>

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
                      project_name,
                      customer,
                      project_status,
                      project_deadline,
                      avatarUrl,
                      project_requirement,
                    } = row;
                    const selectedUser = selected.indexOf(project_name) !== -1;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={project_name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {project_name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{customer?.customer_name}</TableCell>

                        <TableCell align="left">
                          <Label color={(project_status === 'lost' && 'error') || 'success'}>
                            {sentenceCase(project_status)}
                          </Label>
                        </TableCell>

                        <TableCell align="left">{formatDate(project_deadline)}</TableCell>

                        <TableCell align="left">{project_requirement}</TableCell>

                        <TableCell align="left">{'sop'}</TableCell>

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
                            Edit {id}
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
