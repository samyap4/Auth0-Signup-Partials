exports.onExecutePreUserRegistration = async (event, api) => {
    const birthday = event.request.body['ulp-birthday'];
    const accountType = event.request.body['ulp-account-type'];
    const otherAccountType = event.request.body['ulp-other-account-type'];
    const tosAccepted = event.request.body['ulp-terms-of-service'];
    console.log(event.request.body);
  
    if (birthday) {
      const formattedDate = new Date(Date.parse(birthday));
      if (formattedDate < new Date(1900,1,1) || formattedDate > new Date(Date.now())) {
        api.validation.error("invalid_payload", "Please enter a valid birthday");
      }
    }
    
    api.user.setUserMetadata("otherAccountType", otherAccountType);
    api.user.setUserMetadata("accountType", accountType);
    api.user.setUserMetadata("birthday", birthday);
    api.user.setUserMetadata("tosAccepted", tosAccepted === 'on' ? true : false);
  };