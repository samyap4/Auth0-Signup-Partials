const axios = require('axios');
const fs = require('fs');

const prompt = 'signup-id'; 
const filePath = 'signup-id-form-content-end.html';
const promptEntryPoint = "form-content-end";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const apiUrl = `https://${AUTH0_DOMAIN}/api/v2/prompts/${prompt}/partials`;

const updatePartial = async (filePath) => {
  try {
    const authResponse = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    });

    if (authResponse.status !== 200) {
      console.error(`Failed to authenticate: ${authResponse.data}`);
      return;
    }

    const partialData = {};
    partialData[`${prompt}`] = {};
    partialData[`${prompt}`][`${promptEntryPoint}`] = fs.readFileSync(filePath, 'utf8');

    console.log(partialData);

    const updateResponse = await axios.put(apiUrl, partialData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authResponse.data.access_token}`,
      },
    });

    if (updateResponse.status !== 200) {
      console.error(`Failed to update partial: ${updateResponse.data.error_description}`);
      return;
    }

    console.log('Partial updated successfully:', updateResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

updatePartial(filePath);