## DWM LiveLog client implementation  
  
`/core/host/main.ts`
```ts
/**
 * The DWM main loop ~60fps
 */
await mainloop(render); // <------ /core/host/uiContainer.ts
```
`/core/host/uiContainer.ts`
```ts
/** 
 * render any dirty UI Views ~60fps
 * dispatch any queued log events
 */
export const render = async() => {
   // dispatch any log events
   await dispatch();   // <----------- /core/coms/logger.ts dispatch
   // refresh the view - render views
   renderNodes();
   // flush pending ctx ops
   Host.flush();
}
```
`/core/coms/logger.ts`
```ts
const payloads: string[] = []
/** 
 * any log calls land here where they are queued for dispatch 
 */
export const log = async(from: string, thisMsg: string, clear = false) => {
   const payload = JSON.stringify(
      {
         topic: "log",
         data: {
            CLS: clear,
            TS: new Date().toLocaleTimeString('en-US'),
            from: from,
            msg: thisMsg
         }
      }
   )
   payloads.push(payload)
}

/** 
 *  Here we dispatch any queued messages to the stream service 
 *  this is called on every tick of the mainloop ~60fps
 */
export const dispatch = async() => {
   if ( payloads.length === 0 ) return;
   await fetch(serviceURL, {
         method: "POST",
         body: payloads.pop()
      })
         .then((result: Response) => console.info(result.status))
         .catch((reason: any) => console.log('Fetch Error: ', reason))
}
  ```

Anywhere in the program ...
```ts
   let txt = `
text ${this.text}
HLtxt - ${this.lines[this.insertionRow].substring(selectStart, selectEnd)}
insert:${this.insertionPoint}
selection Start:${selectStart}, End:${selectEnd}
   `;
   // the third (optional) paramater controls 
   // if the log-view is cleared first (defaults to false)      
   log (`onUpdateTextArea`, txt, true);
```