# Instructions To Add the Bot In Your Server

To use this code, follow the instructions:

**Local Setup**

1) Install all dependencies:

    `npm i`



2) Create the environment variables in .env file:
    - **DISCORDJS_BOT_TOKEN** - Your Bot Token

3) Run `npm run start` or `npm run dev` in the project directory


**Production**

We can either use some process manager or just run the process in screen

1) Login to you server
2) Clone the repo
3) Type `screen` to open a new screen
4) Do All Steps from **Local Setup** above.

### How to get your bot token?

1. In your browser, navigate to the [Discord Developer Portal](https://discord.com/developers/applications). Click
   the 'New Application' button. Discord will prompt you to enter the name of your application and a description of it.
   The name and description can be anything you want. The application is simply to give the bot the ability to 
   communicate with Discord APIs.
   
2. Once you have created your application, click on the 'OAuth2' tab.
   You should see a CLIENT ID under the application name. Copy this ID. You'll need it later.



3. Click on the 'Bot' tab and click the 'Add bot' button. When prompted, confirm that you want to add the
   bot to the application. On the Bot tab, you should now see your bot. You should also see a 'TOKEN' field
   under the 'USERNAME' field. Copy this token, it should be later added as DISCORDJS_BOT_TOKEN in .env file
   
4. Use this client id in this link to add it to your server: https://discord.com/oauth2/authorize?client_id=<client_id>&scope=bot


Currently Deployed Bot:
You can just click on this and add it to your server: https://discord.com/oauth2/authorize?client_id=832538529993195560&scope=bot