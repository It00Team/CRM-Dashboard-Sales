import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyAPI, { Token } from '../config/MyAPI.jsx';

const AddEvent = () => {
  const token = Token.getToken();
  const [data, setData] = useState({
    event_name: '',
    event_start: '',
    event_end: '',
    event_priority: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleClick = (e) => {
    e.preventDefault()
    console.log(data);
    MyAPI.post('/crm/events/add-event', data, token)
      .then((res) => {
        console.log(res);
        navigate('/dashboard/calendar');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form>
      <div>
        <label for="">Event Name</label>
        <input type="text" name="event_name" value={data.event_name} onChange={handleChange} />
      </div>

      <div>
        <label for="">Event Start</label>
        <input type="date" name="event_start" value={data.event_start} onChange={handleChange} />
      </div>

      <div>
        <label for="">Event End</label>
        <input type="date" name="event_end" value={data.event_end} onChange={handleChange} />
      </div>

      <div>
        <label for="">Event Priority</label>
        <select name="event_priority" id="cars" value={data.event_priority} onChange={handleChange}>
          <option value="high_priority">High priority</option>
          <option value="medium_priority">Medium priority</option>
          <option value="low_priority">Low priority</option>
        </select>
      </div>

      <button onClick={handleClick}>submit</button>
    </form>
  );
};

export default AddEvent;
