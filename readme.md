# LiveLog

LiveLog is a utility service used to remotely log messages.   

This service recieves POST requests from one or more applications.   

These requests are then live streamed to any registered listeners (EventSource
clients).   

LiveLog is effectively a pub/sub remote console.log service.
One or more applications could stream messages to one or more viewers.

<br/>

![Alt text](livelog.png)

## LiveLog Viewer
The LiveLog server, on start, will open a Viewer web app in your default browser.   
In the above example, the Viewer is displaying log messages from the DWM-GUI desktop app on the right. Whenever a UI event happens in the TextArea, a message is logged in the viewer.   
      
This included viewer app will register for the log stream, and then display any recieved log messages from this service. (localhost:9000)   

## Example
The included example app demonstrates the usage with a simple UI.
Please start the LiveLog service first.
```
deno run -A --unstable server.ts
cd example
// open index.html with 'Live Server' or any other server of your choice. 
```


## Interface
The message interface is as follows:

```ts
type Payload {
   CLS: boolean   // clear the screen first (default = false)
   TS: string     // a timestamp string 
   from: string   // typically an app_name + method_name 
   msg: string    // a string or JSON.stringified object 
}
 
type LogEvent {
   topic: string
   data: Payload
}

// example usage
export function log(thisMsg: string, clearFirst = true) {
   
   const jsonBody = JSON.stringify({ 
      topic: 'log', 
      data: { 
         CLS: clearFirst, // clear the screen first
         TS: new Date().toLocaleTimeString('en-US'), // time stamp 
         from: "updateText", // an event name
         msg: thisMsg        // the payload string
      } 
   })

   fetch("http://localhost:9000/", {
      method: "POST",
      body: jsonBody
   })
}
```

## Further Usage
I've deployed a copy of the server as a service on Deno Deploy.   
I now use a local Deno-Desktop-View DWM-GUI app that streams from this service.   
This make a very handy log-companion for DWM-GUI dev work :)
  
I've also deno-installed a copy of the html View app on my laptop.    
I can now use a simple `log` command:
```
$ log
```
This immediately opens the View app connected to a local stream service.   
I see no reason to exercise Deploy needlessly.

## DWM client usage
See: `dwm-client.md`