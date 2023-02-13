# Logger Module
usage:
```js 
// in host app, first import:
import {initEventSource, log} from './logger.js';
 
// next initialize the logger service 
initEventSource()
 
// use the log function to remotely log events
log(`insertionPoint: 45
start: 45
end: 56
text: 'text'`
);
```