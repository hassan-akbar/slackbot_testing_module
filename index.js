const express = require("express");
const app = express();
const port = 3000;
const SLACK_SIGNING_SECRET = "0e2a500a00e6949c8b0873f7f8f6a448";
//const SLACK_TOKEN = "xoxb-1355900218177-1347475202419-MsYFPYeRVFqmjSyThUh5SgIg";

const { createEventAdapter } = require("@slack/events-api");
const slackEvents = createEventAdapter(SLACK_SIGNING_SECRET);

const { WebClient } = require("@slack/web-api");

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
//test deployment on heroku
const web = new WebClient(token);

app.use("/slack/events", slackEvents.expressMiddleware());

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on("message", async (event) => {
  console.log(event);
  console.log(process.env.SLACK_TOKEN);
  if (event.text.toLowerCase().includes("hi")) {
    const res = await web.chat.postMessage({
      type: "message",
      channel: event.user,
      channel_type: "im",
      text: "Hello there",
    });
  } else if (event.text.toLowerCase().includes("report")) {
    const res = await web.chat.postMessage({
      type: "message",
      channel: event.user,
      channel_type: "im",
      text: "The user details are as followed  \n User : " + event.user,
    });
  } else {
  }
  //console.log("Message sent: ", res.ts);

  // `res` contains information about the posted message
});

// Handle errors (see `errorCodes` export)
slackEvents.on("error", console.error);

app.get("/", (req, res) => res.send("hello world"));
app.listen(process.env.PORT || 3000, () =>
  console.log("This apps running at https://localhost:%d", port)
);
