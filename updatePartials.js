const fetch = require('node-fetch');
const fs = require('fs');

// Modify these to work with different form content sections within the UL
const prompt = 'signup-id'; 
const filePath = 'signup-id-form-content-end.html';
const promptEntryPoint = "form-content-end";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;



const apiUrl = `https://${AUTH0_DOMAIN}/api/v2/prompts/${prompt}/partials`;

const updatePartial = async (filePath) => {
  const authResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  const authData = await authResponse.json();
  console.log(authResponse.status);
  if (authResponse.status != 200) {
    console.error(`Failed to authenticate: ${authData}`);
    return;
  }
  var partialData = {}
  partialData[`${prompt}`] = {};
  partialData[`${prompt}`][`${promptEntryPoint}`] = fs.readFileSync(filePath, 'utf8');

    console.log(partialData);

  const updateResponse = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.access_token}`,
    },
    body: JSON.stringify(partialData),
  });

  const updatedPartial = await updateResponse.json();
  console.log(updatedPartial.status);
  if (updateResponse.status !== 200) {
    console.error(`Failed to update partial: ${updatedPartial.error_description}`);
    return;
  }

  console.log('partial updated successfully:', updatedPartial);
};


updatePartial(filePath);