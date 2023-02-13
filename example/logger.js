
const DEV = true;

const serverURL = "http://localhost:9000";

let loggingGUI = null;

export const log = (thisMsg) => {
   fetch(serverURL + "/", {
      method: "POST",
      mode: 'no-cors',
      body: JSON.stringify({ 
         topic: "log", 
         data: { 
            CLS: true,
            TS: new Date().toLocaleTimeString('en-US'), 
            from: "updateText", 
            msg: thisMsg 
         } 
      })
   });

}
// initialize our EventSource channel
export const initEventSource = (element = null) => {
   // any local UI log element
   loggingGUI = element
   // this is our SSE client; we'll call her `eventSource`
   const eventSource = new EventSource(serverURL + "/sse_registration");
   // display state
   display("CONNECTING");

   // on open; we'll notify UI
   eventSource.addEventListener("open", () => {
      // display state
      display("CONNECTED")
   });

   // notify any eventSource state change 
   eventSource.addEventListener("error", (_e) => {
      switch (eventSource.readyState) {
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
   eventSource.addEventListener("message", (evt) => {
      const { data } = JSON.parse(evt.data)
      const { msg } = data
      if (DEV) console.info('logger got: ', data);
      display(msg, 'onMessage')
   });
};

const display = (what) => {
   if (loggingGUI === null) {
      if (DEV) console.log(what);
      return;
   }
   loggingGUI.textContent = `${what} 
` + loggingGUI.textContent;
}
