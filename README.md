# Wttj - Charlie Bradbury

Hello, and thank you for taking the time to review this application. I've broken up this file into a Notes section,
containing my thoughts, decisions, explanations etc, and a regular Readme section (which sadly is unchanged from the 
original, as I didn't get as far as making the app production-ready).

There's also a short demo mp4 video in the root level of this repo which you can watch.

If there are any problems finding the repo / running the code, please do get in touch.

## Notes
As a Java back-end developer with zero experience in Elixir, Phoenix, React.js, Typescript and Websockets, it's fair to 
say this was quite a challenging week. I'm pleased to have completed the core of the task, but there's plenty of things
I would have loved to add / spend more time on - I've documented these towards the end. I kept notes throughout the
development process, so this section will read much like a journal.

After taking some time to read up on the (many) things I'm unfamiliar with, I followed the readme steps to try running
the application. This seemed to work ok - the mix server and front-end loaded up successfully, but it seemed there was
no data initially. This threw me a little as I found the seed.exs script, and it seemed this should be running as part 
of the `mix setup` command. I tried debugging the front-end and found that the console was littered with CORS errors. I
found this article here: https://victorbjorklund.com/cors-error-phoenix-elixir-cors-plug which explained how to manage
this, although it took a little while to get the configuration right (it seemed to require me to explicitly define the 
front end source rather than just use an open policy).

With the CORS policy address I could now see the data, and the many duplicate Jobs from when I'd repeatedly run the
seed migration script. As a starting point I therefore gave myself a nice simple React.js entry task of adding a button
to remove a Job. This was nice and easy - it was pleasing to see how little boiler-plate code was required to achieve
this in Elixir. The biggest challenge was understanding how the router operated - made simpler once I clicked that
"resources" was automatically providing all common REST routes - and that any routes / methods which didn't map exactly
would fail the pre-flight check.

Back to the front-end and time for a slightly more challenging React.js feature - adding a new Job. As this would
require entering new data I decided to go for a modal window. From looking at the existing pages I realised that WTTJ
provides a nice library of components here https://www.welcome-ui.com/, which includes a modal component. After spending
what felt like an age battling with version clashes I was now able to create new Jobs through the UI.

Next step was to implement Drag and Drop functionality for the Candidate cards. After a bit of research I decided on the
"dnd-kit" library https://docs.dndkit.com/ as this seemed to be popular, well-documented and sufficiently feature-rich 
for my usage. This is where things got quite tricky, as although the library itself was well documented, my lack of
Typescript and React.js understanding caught up with me! After some YouTubing and article reading I was sufficiently up
to speed, and managed to get inter-column drag and drop working nicely. (However I have a bone to pick with whoever
added the overflow="hidden" styling to the columns, as it took me ages to work out why the cards were disappearing once
moved!)

Before adding any more features I wanted to address one of the key parts of the exercise - real-time updates. Right now
the application will only really work with a single user - if someone moves a card then it wont be reflected on another
user's screen. I found various options to look into - a lot people are raving about Phoenix LiveView, but I wasn't sure
how that would integrate with a React.js front-end, and it seemed like it might require a fairly significant
re-architecting of what I had already. I did also come across a "LiveReact" library: 
https://github.com/mrdotb/live_react but again this seemed like a potentially heavyweight solution given the amount of
time I had available.

In the end I decided to use a combination of Ecto hooks and Phoenix channels to update the React state via a websocket.
I added event hooks to the Job and Candidate database integrations and used these to send an event to a channel. The
React component then connects to this channel and re-renders its data upon receiving an event. This actually worked
really nicely, although there's a few shortcomings which I would have ideally had time to address;
- Channel is open rather that requiring some kind of security token
- Not scalable as the events are indiscriminate - i.e. a page will re-render even if the changed data is irrelevant
- Inefficient - the websocket just provides a generic notification, requiring a fetch. This could be improved by actually providing the updated date via the channel
- Whilst it works nicely running locally, in a production environment the changes wont be instant, meaning the UI needs to indicate an updating state and prevent further actions until the DOM is refreshed.

The next step was to implement card sorting within columns. I naively thought this would be quite straightforward - and 
it would be if it wasn't for the realtime data requirement! Typically with something like this I would have the data in
a list, and just let its list position dictate its position on screen. But this doesn't work when the data state must
be fully represented by the database - otherwise the order won't be the same for different users. Initially I used JS
methods to "move the other items down the order by one" then assign the active card the new position value. The problem
with this is that you end up making a whole bunch of separate database calls for each candidate with a changed position.
In the end I came up with a solution whereby I set the position of the active card to 0.5 less than the target position
card, updated the DB, then made use of the Ecto triggers to run an update across all cards in that column, ordering by
position, then setting the position value to be the row number. So 1, 1.5, 2, 3 becomes 1, 2, 3, 4 for example. This
works, but I've had to change the database schema to use floats instead of integers, and I've had to disable to unique
constraint. The latter is probably avoidable if it's possible to suspend DB constraints during an operation. That said,
I think if I was doing it again I would simply add a "before_insert" hook, move the other items down by 1 in a single
query, then finally insert the moved item.

### Omissions / Problems
The most glaring omission by far (and I'm ashamed to write this) is the lack of testing coverage. I started with the 
best intentions of using a TDD approach, but unfortunately I found that to be too impractical given that I was learning 
the frameworks and tools as I went along. Ultimately by the time I had written the core functionality I was out of time.
Please do not take this to mean I do not value the importance of tests!

I also didn't get time to make the application production-ready, which would mostly have consisted of containerising it.

The code is also a bit of a mess, particularly in the front-end where some of the JS code should really be moved to
separate modules.

And of course there's loads more that could be done with the front-end, although I deliberately avoided the temptation
to play around with the welcome-ui and add lots of pretty features so that I could focus on things like the real-time 
data. More importantly I would have liked to add some data validation and user-friendly details such as automatically
switching focus to a modal text field.

----

## Readme

### Requirements

- Elixir 1.17.2-otp-27
- Erlang 27.0.1
- Postgresql
- Nodejs 20.11.0
- Yarn

### Getting started

To start your Phoenix server:

- Run `mix setup` to install and setup dependencies
- Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`
- install assets and start front

```bash
cd assets
yarn
yarn dev
```

#### tests
- backend: `mix test`
- front: `cd assets & yarn test`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

### Learn more

- Official website: https://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Forum: https://elixirforum.com/c/phoenix-forum
- Source: https://github.com/phoenixframework/phoenix
