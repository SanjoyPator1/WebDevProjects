import * as dotenv from 'dotenv'
dotenv.config()

import app from "./server"

const port = 3001;
// creates and starts a server for our API on a defined port
app.listen(port, () => {
  console.log(`camunda poc app listening at http://localhost:${port}`);
});