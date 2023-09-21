import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyAPI, { Token } from 'src/config/MyAPI';
import { AppTrafficBySite } from '../sections/@dashboard/app';
import { Grid, Button } from '@mui/material';
import Iconify from '../components/iconify';
import './btn.css';
import MyButton from './youtube';
import FacebookButton from './facebook';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DoTask = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const id = useParams().id;
  console.log(id);
  const token = Token.getToken('token');

  const millisecondsToTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;

    return formattedTime;
  };

  const AddStartTime = () => {
    const currentDate = new Date();
    const formattedTime = currentDate.toISOString();
    localStorage.setItem('task_start_time', formattedTime);
  };

  const AddEndTime = () => {
    const currentDate = new Date();
    const formattedTime2 = currentDate.toISOString();
    localStorage.setItem('task_end_time', formattedTime2);

    const start_time = new Date(localStorage.getItem('task_start_time'));
    const end_time = new Date(localStorage.getItem('task_end_time'));
    console.log(start_time, end_time)
    localStorage.removeItem('task_start_time');
    localStorage.removeItem('task_end_time');

    const total = millisecondsToTime(end_time - start_time);
    console.log(total);

    const data = {
      hours_worked: total,
    };

    MyAPI.post(`/crm/performance/add-performance`, data, token).then((res) => {
      console.log(res);
    });
  };

  // shudhanshu code
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [recordedTimes, setRecordedTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [hasStoredTime, setHasStoredTime] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  // Load the data from local storage when the component mounts
  useEffect(() => {
    const storedTimes = localStorage.getItem('recordedTimes');
    if (storedTimes) {
      setRecordedTimes(JSON.parse(storedTimes));
    }
  }, []);

  // Save the data to local storage whenever recordedTimes changes
  useEffect(() => {
    localStorage.setItem('recordedTimes', JSON.stringify(recordedTimes));
  }, [recordedTimes]);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setStartTime(Date.now() - timer * 1000);
      setHasStoredTime(false); // Reset the flag when the timer starts again
    } else {
      clearInterval(interval);
      if (!hasStoredTime && timer > 0) {
        // Store the elapsed time when stopped for the first time
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setRecordedTimes([...recordedTimes, { website: 'Youtube', elapsedTime }]);
        setHasStoredTime(true); // Set the flag to true after storing the time
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timer, recordedTimes, startTime, hasStoredTime]);

  useEffect(() => {
    // Calculate the total time whenever recordedTimes changes
    const newTotalTime = recordedTimes.reduce((total, time) => total + time.elapsedTime, 0);
    setTotalTime(newTotalTime);
  }, [recordedTimes]);

  const handleStart = () => {
    setIsActive(!isActive); // Toggle timer start/stop
    if (!isActive) {
      setTimer(0); // Reset the timer when starting

      // Open YouTube in a new browser tab
      window.open('https://www.youtube.com', '_blank');
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimer(0);
    setHasStoredTime(false); // Reset the flag when resetting the timer
    setTotalTime(0); // Reset the total time
  };

  const handleFacebook = () => {
    if (!isActive) {
      // Start the timer and open Facebook in a new tab
      setIsActive(true);
      setTimer(0);

      // Open Facebook in a new browser tab
      window.open('https://www.facebook.com', '_blank');
    } else {
      // Stop the timer
      setIsActive(false);

      if (!hasStoredTime && timer > 0) {
        // Store the elapsed time when stopped for the first time
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setRecordedTimes([...recordedTimes, { website: 'Facebook', elapsedTime }]);
        setHasStoredTime(true); // Set the flag to true after storing the time
      }
    }
  };

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(recordedTimes);

    XLSX.utils.book_append_sheet(wb, ws, 'RecordedTimes');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    const fileName = 'recorded_times.xlsx';
    saveAs(blob, fileName);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  return (
    <>
      <Button variant="contained" onClick={AddStartTime}>
        Start Task
      </Button>
      <Button variant="contained" onClick={AddEndTime}>
        End Task
      </Button>
      <FacebookButton isActive={isActive} onClick={handleFacebook} /><br></br><br></br>
      <MyButton text={isActive ? 'Stop' : 'Start Youtube'} onClick={handleStart} className="vds87" /><br></br><br></br>
      <button onClick={handleDownload} className="vds87"><br></br><br></br>
        Download Excel
      </button>
    </>
  );
};

export default DoTask;
