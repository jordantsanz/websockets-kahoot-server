# websockets-kahoot-server

This is the server for the websockets hack-a-thing-2 project that I worked on. This project was extremely difficult, and even though I spent many hours on trying to develop this, I was unfortunately unable to make the websockets work correctly.

## What did work
Users were able to generate a new game id, and then join that room with their name. The users that joined the room could then see their name on the host's screen.

## What didn't work
Redux was extremely difficult to connect to websockets, and I still am unsure of how to make this work. Additionally, sockets were extremely finnicky with their syntax. Sometimes, I would be able to access the rooms of the sockets, but sometimes, this would throw an undefined error. I am still unsure of why this is, and would love some guidance and explanation as to how these sockets work in this context. 
Finally, even just setting up the sockets and the servers themsevles took quite some time. There is so much conflicting documentation as to how to use socket.io, and so, it is extremely difficult to determine what works and what doesn't with the current setup of the front-end and backend. 
I will continue to work on this as it will be a main part of my CS 98 project. 
