
  const fpPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = 'https://cdn.jsdelivr.net/npm/'
      + '@fingerprintjs/fingerprintjs-pro@3/dist/fp.min.js';
    document.head.appendChild(script);
  })
    .then(() => FingerprintJS.load({ token: 'VERWXRkqgj2WoJMkBbOd', endpoint: 'https://fp.adahandle.com/' }));

  fpPromise
    .then(fp => fp.get())
    .then(result => console.log(result.visitorId));