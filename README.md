# twilio-voicejs
App for twilio-client.js.

## Environment Variables
For generating access tokens and TURN credentials. Make sure your account is allowed to use Network Traversal Service APIs

```
export ACCOUNT_SID=********************
export AUTH_TOKEN=********************
export API_KEY=********************
export API_SECRET=********************
```

## SDK Url
You can specify ClientJS sdk url using the following query string. If not provided, default files will be use under the public folder.
```
https://my-dev-site.com?twiliojs=http://mypathto/twilio.js
```

## Device Options
The following device options can be passed via query strings.

* `edge` - Can be comma separated to enable fallback
* `region`
* `appName`
* `appVersion`

**Example**
```
https://my-dev-site.com?edge=ashburn,singapore&appName=myApp&appVersion=1.2
```

## Intallation and Running the Web App

```
npm install
npm start
```

## Multi Device Testing

Access via `http://127.0.0.1:3030/device` endpoint.

### Generating Multiple Tokens
Multi device testing requires a file `tokenUrls.json` under public folder using the following format.
```
[
  {
    "url": "/token?identity=myIdentity1&twimlAppSid=my_twiml_appsid1",
    "identity": "myIdentity1",
    "num_to_call": "123456789"
  },{
    "url": "/token?identity=myIdentity2&twimlAppSid=my_twiml_appsid2",
    "identity": "myIdentity2",
    "num_to_call": "other_identity"
  }
]
```

* `url` - a GET endpoint that returns your token and identity using the identity parameters and twiml app sid provided

  Example: `{ "token": "eyJhbGciOiJIUz....", "identity": "myIdentity1" }`

* `identity` - identity name. Used for filtering on the client side only
* `num_to_call` - optional number or identity. Used to prepopulate the call textbox


### Filtering
You may include any number of identities in `tokenUrls.json`. By default, this app will use them all. If you want to use only one or a few, you can pass a query parameter to filter the identities.
```
https://my-dev-site.com/device?identities=myIdentity1,myIdentity2
```
