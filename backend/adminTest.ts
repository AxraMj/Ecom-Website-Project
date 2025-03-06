import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('Attempting to login...');
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@example.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error: any) {
    console.error('Error testing admin login:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

testAdminLogin(); 