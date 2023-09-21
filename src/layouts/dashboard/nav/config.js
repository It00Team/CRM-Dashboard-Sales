// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'sales',
    path: '/dashboard/sales',
    icon: icon('ic_user'),
  },
  {
    title: 'calendar', //new update
    path: '/dashboard/calendar',
    icon: icon('ic_cart'),
  },
  {
    title: 'event',
    path: '/dashboard/add-event',
    icon: icon('ic_lock'),
  },
  {
    title: 'email',
    path: '/dashboard/email',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
