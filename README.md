**Auth0 Signup Partials Utility**

The Auth0 Universal Login allows you to specify custom fields to include within the signup form for more advanced data collection.  Learn more here: https://auth0.com/docs/sign-up-prompt-customizations.

First create an M2M app in your Auth0 tenant and give it full permissions to the Management API: https://auth0.com/docs/get-started/auth0-overview/create-applications/machine-to-machine-apps.

You can look at an example of the config file in `config.env.sample`.

You will then need to supply your own values for Auth0 Domain, Client ID and Secret to make this work.  Then edit the HTML and run the utility to make this work.

Run the utility with the command `node --env-file=config.env updatePartials.js`

We have also supplied the sample Action for this code base to make the data capture work as well in `pre-register-action.js`.

Note: This does require Node 20 or greater to work natively with .env files.  Consider hard-coding the configs if necessary.

Currently live example at https://demo0.samyap.dev -> Click `Signup` button
