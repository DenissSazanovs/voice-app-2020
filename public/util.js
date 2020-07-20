(function() {
  window.Util = {
    async getCredsIndentities() {
      const creds = await Util.getJson('tokenUrls.json');
      const identities = {};
      Util.getUrlParam('identities', 'search').split(',').filter((name) => !!name).forEach((name) => {
        identities[name] = true;
      });
  
      // If no identity filter, use all
      if (!Object.keys(identities).length) {
        creds.forEach((data) => {
          identities[data.identity] = true;
        });
      }
  
      return { creds, identities };
    },

    getUrlParam(param, part) {
      const params = window.location[part].substring(1);
      let result = '';
    
      params.split('&').some((part) => {
        const item = part.split('=');
    
        if (item[0] === param) {
          result = decodeURIComponent(item[1]);
          return true;
        }
      });
      return result;
    },

    getJson (url) {
      return new Promise(resolve => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText));
          }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
      });
    },

    loadScript(url) {
      return new Promise(resolve => {
        let script = document.createElement('script');
        script.onload = () => resolve();
        
        script.src = url;
        document.head.appendChild(script);
      });
    },

    log (type, msg) {
      console.log('[Diagnostics SDK]', type, msg);
      const logEl = document.getElementsByClassName('log')[0];
      if(typeof msg === 'object') {
        msg = JSON.stringify(msg, null, 2);
      }
      const log = `${Date.now()} ${type} ${msg}`;
      const p = document.createElement('pre');
      p.innerText = log;
      logEl.appendChild(p);
      logEl.scrollTop = logEl.scrollHeight;
    },

    setButtonEnabled(buttonName) {
      Array.from(document.getElementsByClassName('button'))
      .forEach(el => {
        if (el.id.indexOf(buttonName) !== -1) {
          el.removeAttribute('disabled');
          el.value = 'Stop ' + el.value;
          el.classList.add('glow-button');
        } else if (buttonName) {
          el.setAttribute('disabled', true);
          el.classList.remove('glow-button');
        } else {
          el.removeAttribute('disabled');
          el.classList.remove('glow-button');
          el.value = el.value.replace('Stop', '').trim();
        }
      });
    }
  };
})();
