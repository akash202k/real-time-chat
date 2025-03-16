## Real Time Chat

Build a simple chat application using raw WebSockets in Node.js that supports the following features:

- Allow an admin to create a new chat session/room. The admin should be allowed to set the following properties on the room:
    - Name
    - start_time
    - is_open
    - cool_down_time
- Allow users to join the room and send messages.
- Allow users to upvote chat messages.
- If chat messages reach more than 3 upvotes, move them to a separate section.
- If chat messages reach more than 10 upvotes, alert the admin to answer.