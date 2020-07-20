(function() {
  
  class DeviceView {
    constructor(tokenUrl, defaultNumberToCall) {
      this.tokenUrl = tokenUrl;
      this.defaultNumberToCall = defaultNumberToCall;
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
