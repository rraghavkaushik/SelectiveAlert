document.getElementById('save').addEventListener('click', () => {
    const keyword = document.getElementById('keyword').value;
    chrome.storage.sync.set({keyword: keyword}, () => {
      alert('Keyword saved!');
    });
  });
  
  // Load saved keyword
  chrome.storage.sync.get(['keyword'], (result) => {
    if (result.keyword) {
      document.getElementById('keyword').value = result.keyword;
    }
  });
  