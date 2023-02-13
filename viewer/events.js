
import { display } from './app.js'

// deno-lint-ignore-file
export const serverURL = "http://localhost:9000"

// initialize our EventSource channel
export const initEventSource = () => {

   // this is our SSE client; we'll call her `events`
   const events = new EventSource(serverURL + "/sse_registration");

   display("CONNECTING");

   // on open; we'll notify UI
   events.addEventListener("open", () => {
      display("CONNECTED")
   });

   // notify any state change events 
   events.addEventListener("error", (_e) => {
      switch (events.readyState) {
         case EventSource.OPEN:
            display("CONNECTED");
            break;
         case EventSource.CONNECTING:
            display("CONNECTING");
            break;
         case EventSource.CLOSED:
            reject("closed");
            display("DISCONNECTED");
            break;
      }
   });

   // messages from the server
   events.addEventListener("message", (evt) => {
      const {data} = JSON.parse(evt.data)
      display(`${data.TS} - ${data.from} - ${data.msg}`, data.CLS)
   });
};
