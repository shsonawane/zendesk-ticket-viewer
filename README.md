# Zendesk Ticket Viewer
An API integrated web application to view zendesk tickets.

## Requirements
    - NPM
    - NodeJS

## Codebase
```
.
├── src             # Source code
│   ├── api         # All API handlers                
│   ├── config      # Configuration files
│   ├── public      # Static website source code
│   └── util        # Reusable utilities/modules
└── test            # Unit tests
```

## Setup
```
npm install
```

## Start Server
```
PORT=<PORT_NUMBER> CRED='<EMAIL_ID>:<PASSWORD>' npm start
```
*Note:* 
 - If port is not specified then server will start on default port 9000.
 - If credentials are not specified then program will read credentials from `src/config/credentials` config file (by default file has no credentials).

Running above command will start serve and display following output
```

Open this link in browser to view the site

http://localhost:<PORT>

```
Open displayed link in browser to view the site.

## Lint
```
npm run lint
```

## Test
```
npm run test
```

## Development
```
npm run dev
```
