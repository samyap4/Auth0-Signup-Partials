const axios = require('axios');
const fs = require('fs-extra');

async function main() {
    const inquirer = await import('inquirer');

  const { AUTH0_DOMAIN, CLIENT_ID, CLIENT_SECRET } = process.env; 

  const promptChoices = [
    'signup',
    'signup-id',
    'signup-password',
    'login',
    'login-id',
    'login-password',
  ];

  const promptToScreenMapping = {
    'signup': ['signup'],
    'signup-id': ['signup-id'],
    'signup-password': ['signup-password'],
    'login': ['login'],
    'login-id': ['login-id'],
    'login-password': ['login-password'],
  };

  const entryPointQuestions = [
    {
      type: 'input',
      name: 'formContentStart',
      message: 'Path to HTML file for form-content-start (leave blank if not applicable):',
    },
    {
      type: 'input',
      name: 'formContentEnd',
      message: 'Path to HTML file for form-content-end (leave blank if not applicable):',
    },
    {
      type: 'input',
      name: 'formFooterStart',
      message: 'Path to HTML file for form-footer-start (leave blank if not applicable):',
    },
    {
      type: 'input',
      name: 'formFooterEnd',
      message: 'Path to HTML file for form-footer-end (leave blank if not applicable):',
    },
  ];

  const promptResponse = await inquirer.default.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'Select the prompt to update:',
      choices: promptChoices,
    }
  ]);
  console.log(promptResponse)

  const screens = promptToScreenMapping[promptResponse.prompt];

  let payload = {};

  for (const screen of screens) {
    console.log(`Configuring screen: ${screen}`);
    payload[screen] = {};
    const entryPointsResponses = await inquirer.default.prompt(entryPointQuestions);
    for (const [key, value] of Object.entries(entryPointsResponses)) {
      if (value) {
        const htmlContent = await fs.readFile(value, 'utf8');
        const entryPoint = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        payload[screen][entryPoint] = htmlContent;
      }
    }
  }

  try {
    const tokenResponse = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    grant_type: 'client_credentials',
  });

  const { access_token } = tokenResponse.data;

    
    await axios.put(`https://${AUTH0_DOMAIN}/api/v2/prompts/${promptResponse.prompt}/partials`, payload, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    

    console.log('Partial updated successfully.');
  } catch (error) {
    console.error('Error updating partial:', error.response?.data || error.message);
  }
}

main();
