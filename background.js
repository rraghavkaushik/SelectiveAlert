const CLIENT_ID = '1027127631898-2pp43r8r8n4r0hgq93fcc4ddurjv6nv3.apps.googleusercontent.com';
const SENDER_EMAILS = ['ragk2022@gmail.com'];

function getAuthToken(interactive, callback) {
  chrome.identity.getAuthToken({interactive: interactive}, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    callback(token);
  });
}

function fetchEmails(token) {
  fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.messages) {
      data.messages.forEach(message => {
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(response => response.json())
        .then(messageData => {
          let headers = messageData.payload.headers;
          let fromHeader = headers.find(header => header.name === 'From');
          if (fromHeader) {
            let fromEmail = fromHeader.value.match(/<(.+)>/)[1];
            if (SENDER_EMAILS.includes(fromEmail)) {
              let subjectHeader = headers.find(header => header.name === 'Subject');
              let subject = subjectHeader ? subjectHeader.value : 'No Subject';
              chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'New Email',
                message: `From: ${fromEmail}\nSubject: ${subject}`
              });
            }
          }
        });
      });
    }
  })
  .catch(error => console.error('Error fetching emails:', error));
}

chrome.runtime.onInstalled.addListener(() => {
  getAuthToken(true, (token) => {
    fetchEmails(token);
    setInterval(() => getAuthToken(false, fetchEmails), 60000); // Check for new emails every minute
  });
});
