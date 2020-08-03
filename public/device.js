(function() {
  
  class DeviceView {
    constructor(tokenUrl, defaultNumberToCall) {
      this.tokenUrl = tokenUrl;
      this.defaultNumberToCall = defaultNumberToCall;
    }
  
    async setupDevice(onReady) {
      this.log('INFO', 'Setting up device');
      const data = await Util.getJson(this.tokenUrl);
      this.identity = data.identity;
    
      //Setup Device
      
      this.setIdentityUI();
      this.setupHandlers(onReady);
    }
  
    showHideButtons(buttonsToShow) {
      if (!Array.isArray(buttonsToShow)) {
        buttonsToShow = [buttonsToShow];
      }
      const buttonsToShowHash = {};
      buttonsToShow.forEach((name) => {
        buttonsToShowHash[name] = true;
      });
      this.buttonData.forEach((data) => {
        if (buttonsToShowHash[data.value]) {
          data.el.style.display = 'inline-block';
        } else {
          data.el.style.display = 'none';
        }
      });
    }
  
    //Set device handlers
    
    //Set connection handlers
    
    //Set on button click handlers
    
    log(type, msg) {
      const log = `${type}: ${msg}`;
      const p = document.createElement('p');
      p.innerText = log;
    
      console.log(log);
    
      this.logEl.appendChild(p);
    
      this.logEl.scrollTop = this.logEl.scrollHeight;
    }
  
    setIdentityUI() {
      const div = document.createElement('div');
      div.classList.add('label');
      div.innerText = 'Identity: ' + this.identity;
      this.deviceEl.prepend(div);
    }
  
    setCallSidUI(connection) {
      this.callSidEl.innerText = 'Call SID: ' + connection.mediaStream.callSid;
    }
    
    render() {
      this.deviceEl = document.createElement('div');
      this.deviceEl.classList.add('device');
      
      this.callSidEl = document.createElement('div');
      this.callSidEl.classList.add('label');
      this.callSidEl.innerText = 'Call SID:';
      this.deviceEl.appendChild(this.callSidEl);
      
      this.numberEl = document.createElement('input');
      this.numberEl.classList.add('textbox');
      this.numberEl.setAttribute('type', 'text');
      this.numberEl.value = this.defaultNumberToCall;
      this.numberEl.setAttribute('placeholder', 'Phone Number');
      this.deviceEl.appendChild(this.numberEl);
      
      const buttonsWrapper = document.createElement('div');
      buttonsWrapper.classList.add('buttons');
      this.buttonData = [{
        className: 'call-btn',
        value: 'Call',
        onClick: () => this.onCallClick()
      },{
        className: 'hangup-btn',
        value: 'Hangup',
        onClick: () => this.onHangupClick()
      },{
        className: 'accept-btn',
        value: 'Accept',
        onClick: () => this.onAcceptClick()
      },{
        className: 'reject-btn',
        value: 'Reject',
        onClick: () => this.onRejectClick()
      },{
        className: 'ignore-btn',
        value: 'Ignore',
        onClick: () => this.onIgnoreClick()
      }];
      
      this.buttonData.forEach((btnData) => {
        const btnEl = document.createElement('input');
        btnEl.classList.add(btnData.className);
        btnEl.setAttribute('type', 'button');
        btnEl.setAttribute('value', btnData.value);
        
        btnEl.onclick = btnData.onClick;
        btnEl.style.display = 'none';
        
        btnData.el = btnEl;
        buttonsWrapper.appendChild(btnData.el);
      });
      this.deviceEl.appendChild(buttonsWrapper);
      
      this.logEl = document.createElement('div');
      this.logEl.classList.add('log');
      this.deviceEl.appendChild(this.logEl);
      
      return this.deviceEl;
    }
  }
  
  async function initDevices() {
    const { creds, identities } = await Util.getCredsIndentities();
    creds.filter((data) => identities[data.identity]).forEach((data, index) => {
      const deviceView = new DeviceView(data.url, data.num_to_call);
      root.appendChild(deviceView.render());
      deviceView.setupDevice();
      
      // For debugging in the console
      window['device' + (index + 1)] = deviceView;
    });
  }
  
  let scriptClient = document.createElement('script');
  scriptClient.onload = () => {
    
    const initBtn = document.getElementById('init-button');
    initBtn.onclick = () => {
      initBtn.style.display = 'none';
      initDevices();
    };
    initBtn.style.display = 'block';
    
  };
  scriptClient.src = Util.getUrlParam('twiliojs', 'search') || 'lib/twilio.js';
  document.head.appendChild(scriptClient);
  
})();
