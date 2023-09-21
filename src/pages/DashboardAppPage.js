import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppClientStatus,
  AppPitcherBar,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useEffect, useState } from 'react';
import MyAPI, { Token } from 'src/config/MyAPI';

export default function DashboardAppPage() {
  const theme = useTheme();
  const [department, setDepartment] = useState();
  const [employee, setEmployee] = useState();
  const [customer, setCustomer] = useState();
  const [project, setProject] = useState();
  const [completed_project, setCompleted_project] = useState();
  const [working_project, setWorking_project] = useState();
  const [onboarded_project, setOnboarded_project] = useState();
  const [pending_project, setPending_project] = useState();
  const [latest_project , setLatest_project] = useState();

  const [ridaCustomer, setRidaCustomer] = useState();
  const [nupendraCustomer, setNupendraCustomer] = useState();
  const [poonamCustomer, setPoonamCustomer] = useState();


  const token = Token.getToken();

  const [task, setTask] = useState();
  useEffect(() => {
    MyAPI.get('/crm/task/show-user-task/', token).then((res) => {
      console.log(res);
      setTask(res?.data);
    });
  }, []);

  useEffect(() => {
    MyAPI.get('/dashboard/get', token).then((res) => {
      if (res.data) {
        setDepartment(res.data?.department);
        setEmployee(res.data?.employee);
        setCustomer(res.data?.customer);
        setProject(res.data?.project);
        setCompleted_project(res.data?.completed_projects);
        setWorking_project(res.data?.working_projects);
        setOnboarded_project(res.data?.onboarded_projects);
        setPending_project(res.data?.pending_projects);
        setLatest_project(res.data?.latest_project)

        let rida_array = Array.from({length :12}, ()=> 0);
        res.data?.rida_customer.forEach(item=>{
          const {month, count} = item;
          rida_array[month - 1] += count;
        })
        let nupendra_array = Array.from({length :12}, ()=> 0);
        res.data?.nupendra_customer.forEach(item=>{
          const {month, count} = item;
          nupendra_array[month - 1] += count;
        })
        let poonam_array = Array.from({length :12}, ()=> 0);
        res.data?.poonam_customer.forEach(item=>{
          const {month, count} = item;
          poonam_array[month - 1] += count;
        })

        setRidaCustomer(rida_array);
        setNupendraCustomer(nupendra_array);
        setPoonamCustomer(poonam_array)

      }
    });
  }, []);
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome to Avyaan CRM
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Department" total={department?? ''} color="info" icon={'mingcute:department-fill'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Employee" total={employee ?? ''} color="success" icon={'clarity:employee-group-solid'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Projects" total={project?? ''} color="warning" icon={'octicon:project-roadmap-16'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Clients" total={customer ?? ''} color="error" icon={'mdi:account-arrow-down'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppPitcherBar
              title="Clients Pitcher Summary"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Rida',
                  type: 'column',
                  fill: 'solid',
                  data: ridaCustomer?? [],
                },
                {
                  name: 'Nupendra',
                  type: 'area',
                  fill: 'gradient',
                  data: nupendraCustomer ?? [],
                },
                {
                  name: 'Poonam',
                  type: 'line',
                  fill: 'solid',
                  data: poonamCustomer ?? [],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppClientStatus
              title="Project Status"
              chartData={[
                { label: 'Complete', value: completed_project ?? 0 },
                { label: 'Working', value: working_project ?? 0 },
                { label: 'Pending', value: pending_project ?? 0 },
                { label: 'Onboarded', value: onboarded_project ?? 0 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Transcription Data"
              subheader="(+13%) than last month"
              chartData={[
                { label: 'English', value: 400 },
                { label: 'Hindi', value: 430 },
                { label: 'Telgu', value: 448 },
                { label: 'German', value: 470 },
                { label: 'French', value: 540 },
                { label: 'Arabic', value: 580 },
                { label: 'Tamil', value: 690 },
                { label: 'Spanish', value: 1100 },
                { label: 'Bengali', value: 1200 },
                { label: 'Russian', value: 1500 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Status"
              chartLabels={['Collection', 'Transcription', 'QC', 'Rework', 'Deliveries']}
              chartData={[
                { name: 'Project 1', data: [80, 50, 30, 40, 100] },
                { name: 'Project 2', data: [20, 30, 40, 80, 20] },
                { name: 'Project 3', data: [44, 76, 78, 13, 43] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Updates"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: ['Project On Boarded', 'Sample Delivery', 'QC', 'Final Delivery', 'Client Feedback'][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'Transcription',
                  value: 1,
                  icon: '',
                },
                {
                  name: 'Google',
                  value: 3,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Audio Editer',
                  value: 4,
                  icon: '',
                },
                {
                  name: 'Annotation',
                  value: 2,
                  icon: '',
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
             
              list={
                task ? task.map((item) => ({
                  id: item.id,
                  label: item.task_name,
                  status : item.task_status
                })) : []
              }
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
