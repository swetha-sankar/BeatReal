import express from "express";

class MyObject {
  constructor(public msg: string, public value: number = 42) {}
}

export class Controller {
  //returns something.
  public getHello(req: express.Request, res: express.Response): void {
    res.send(new MyObject("hello world"));
  }

  //returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
  public postHello(req: express.Request, res: express.Response): void {
    res.send({ body: req.body });
  }
}
