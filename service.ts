
import { serve } from "https://deno.land/std@0.174.0/http/server.ts"
import { join } from "https://deno.land/std@0.174.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.174.0/http/file_server.ts"

const DEBUG = false;
const DEV = false;

//////////////////////////////////////
//         Start our Server         //
//////////////////////////////////////
serve(handleRequest, { hostname: "localhost", port: 9000 })
   .then(() => console.log("Server closed"))
   .catch((err) => console.info('Server caught error - ', err))


//////////////////////////////////////
//    Handle all http requests      //
//////////////////////////////////////
async function handleRequest(request: Request): Promise<Response> {

   // Get and adjust the requested path name
   let { pathname } = new URL(request.url); // get the path name
   if (pathname === '/') pathname = '/index.html'; // fix root

   //////////////////////////////////////////////////////
   //  was request to register for Server Sent Events  //
   //////////////////////////////////////////////////////
   if (pathname.includes("sse_registration")) {
      if (DEBUG) console.log('got sse_registration request!')
      return registerClient(request)
   }

   ///////////////////////////////////////////////////
   //  A POST request: client is sending a message  //
   ///////////////////////////////////////////////////  
   else if (request.method === 'POST') {   
      const data = await request.json();
      if (DEBUG) console.info('handling POST request! ', data)
      const bc = new BroadcastChannel("sse");
      bc.postMessage(data);
      bc.close();
      return new Response("", { status: 200 })
   }

   ///////////////////////////////////////////////////
   //           A file request: - send it           //
   /////////////////////////////////////////////////// 
   else {
      // the requested full-path (client folder?)
      const fullPath = join(Deno.cwd() + '\\' + 'viewer' + pathname)
      if (DEV) console.log(`Serving ${fullPath}`); // show what was requested
      // find the file -> get the content -> return it in a response
      return serveFile(request, fullPath);
   }
}

////////////////////////////////////////////////////////
//              Server Sent Events                    //
// Subscribes a client to a Server Sent Event stream  //
////////////////////////////////////////////////////////

function registerClient(_req: Request): Response {

   // channel per connection
   const sseChannel = new BroadcastChannel("sse");
   const stream = new ReadableStream({
      start: (controller) => {

         // listening for sseChannel messages
         sseChannel.onmessage = (e) => {
            const { topic, data } = e.data
            if (DEV) console.info(data)
            // pack it
            const reply = JSON.stringify({
               topic: topic,
               data: data
            })
            // send it
            controller.enqueue('data: ' + reply + '\n\n');
         }
      },
      cancel() {
         sseChannel.close();
      }
   })

   // stream any messages 
   return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: {
         "content-type": "text/event-stream",
         "Access-Control-Allow-Origin": "*",
         "Cache-Control": "no-cache"
      },
   })
}
