import React, { useState, useEffect } from 'react'; // new update
import Calendar from 'react-awesome-calendar';
import MyAPI, { Token } from '../config/MyAPI.jsx'


export default function CalendarView() {

  const [data, setData] = useState([])
  useEffect(() => {
    const token = Token.getToken()
    MyAPI.get('/crm/events/get-event/', token).then((res) => {
      console.log(res)
      const convertedEvents = res.data.map(item => {
        return {
          id: item.id,
          // color : "#fd3153",
          color: item.event_priority === 'high_priority' ? '#fd3153' : 
          item.event_priority === 'medium_priority' ? '#3694DF': 
          item.event_priority === 'low_priority' ? '#1ccb9e' : '#1ccb9e',
          from: item.event_start,
          to: item.event_end,
          title: item.event_name,
        };
      });
      setData(convertedEvents);
    });
  }, [])

  // const events = [
  //   {
  //     id: 1,
  //     color: '#fd3153',
  //     from: '2023-09-02T18:00:00+00:00',
  //     to: '2023-09-05T19:00:00+00:00',
  //     title: 'This is an event',
  //   },
  //   {
  //     id: 2,
  //     color: '#1ccb9e',
  //     from: '2023-09-01T13:00:00+00:00',
  //     to: '2023-09-05T14:00:00+00:00',
  //     title: 'This is another event',
  //   },
  //   {
  //     id: 3,
  //     color: '#3694DF',
  //     from: '2023-09-06T13:00:00+00:00',
  //     to: '2023-09-06T20:00:00+00:00',
  //     title: 'New heelo Event',
  //   },
  // ];

  return (
    <>
      <Calendar events={data} />
    </>
  );
}
