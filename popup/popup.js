document.getElementById('checkEmails').addEventListener('click', () => {
    chrome.runtime.sendMessage({type: "checkEmails"}, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background script:", chrome.runtime.lastError);
      } else {
        console.log("Message sent to background script:", response);
      }
    });
  });
  