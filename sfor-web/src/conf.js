const conf = {
  contact: {
    email: 'admin@vuics.com'
  },

  api: {
    url: process.env.REACT_APP_API_URL || 'http://localhost:6209/v1',
  },

  interestForm: {
    url: process.env.REACT_APP_INTEREST_FORM_URL || 'https://forms.gle/bB8mQovNHsRiqYbz5',
  },

  // chat: {
  //   limit: 5,
  // }
}

export default conf
