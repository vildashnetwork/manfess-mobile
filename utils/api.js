import axios from 'axios';

const API_URL = 'https://yourbackend.com/api';

export const submitMarks = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/marks`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchTimetable = async (teacherId) => {
  try {
    const res = await axios.get(`${API_URL}/timetable/${teacherId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
