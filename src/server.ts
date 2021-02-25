import express, { Request, Response } from 'express';

const app = express();

app.get('/', (request: Request, response: Response) => {
  return response.send('Hello World');
});

app.listen(3333, () => {
  console.log("server is running");
});