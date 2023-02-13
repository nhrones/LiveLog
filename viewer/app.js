import { initEventSource } from './events.js';

export const display = (what, CLS = false) => {
   if (CLS === true) pre.textContent = '';
   pre.textContent = `${what}
` + pre.textContent;
}
document.getElementById('clear').addEventListener('click', () => {
   pre.textContent = ""
})
const pre = document.getElementById('pre')
pre.textContent = ""
initEventSource();
console.log(new Date().toLocaleTimeString('en-US'));
