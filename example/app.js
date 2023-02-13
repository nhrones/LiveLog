
import {initEventSource, log} from './logger.js'
const $ = (id) => document.getElementById(id)
 
const msgInput = $('msg')

$('send').addEventListener('click', () => {
   if (msgInput.value.length) {
      log(`insertionPoint: 45
start: 45
end: 56
text: 'text'
`);
   }
})

const pre = $('pre')
pre.textContent = ""

initEventSource(pre)
