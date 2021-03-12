import express, { Express } from 'express';
import { Server } from 'http';
import { google } from 'googleapis';
import stateRobot from './state';

export interface StartWebServerResponse {
  app: Express;
  server: Server;
}

async function youtubeRobot() {
  const OAuth2 = google.auth.OAuth2;

  const state = stateRobot.load();

  await authenticateWithOAuth();
  // await uploadVideo();
  // await uploadThumbnail();

  async function authenticateWithOAuth() {
    const webServer = await startWebServer();
    const OAuthClient = await createOAuthClient();
    await requestUserConsent(OAuthClient);
    const authorizationToken = await waitForGoogleCallback(webServer);
    await requestGoogleAccessTokens(OAuthClient, authorizationToken);
    setGoogleGlobalAuthentication(OAuthClient);
    await stopWebServer(webServer);

    async function startWebServer() {
      return new Promise<StartWebServerResponse>((resolve, reject) => {
        const port = 5000;
        const app = express();

        const server = app.listen(port, () => {
          console.log(`> listening on http://localhost:${port}`);
        });

        resolve({ app, server });
      })
    }

    async function createOAuthClient() {
      const redirectURIs = JSON.parse(process.env.OAUTH_REDIRECT_URIS || '');

      const OAuthClient = new OAuth2(
        process.env.OAUTH_CLIENT_ID,    
        process.env.OAUTH_CLIENT_KEY,
        redirectURIs[0]    
      );

      return OAuthClient;
    }

    async function requestUserConsent(OauthClient: any) {
      const consentURL = OauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube']
      });

      console.log(`> please, give your consent: ${consentURL}`);
    }

    async function waitForGoogleCallback(webServer: StartWebServerResponse) {
      return new Promise((resolve, reject) => {
        console.log('> waiting for the user consent');

        webServer.app.get('/oauth2callback', (req, res) => {
          const authCode = req.query.code;
          
          console.log(`> consent given: ${authCode}`);

          res.send('<h1>Thank you!</h1><p>Now close this tab</p>');
          resolve(authCode);
        });
      });
    }

    async function requestGoogleAccessTokens(OAuthClient: any, token: any) {
      return new Promise<void>((resolve, reject) => {
        OAuthClient.getToken(token, (error: any, tokens: any) => {
          if (error) {
            return reject(error);
          }

          OAuthClient.setCredentials(tokens);
          resolve();
        });
      })
    }

    function setGoogleGlobalAuthentication(OAuthClient: any) {
      google.options({
        auth: OAuthClient,
      });
    }

    async function stopWebServer(webServer: StartWebServerResponse) {
      return new Promise<void>((resolve, reject) => {
        webServer.server.close(() => resolve());
      });
    }
  }
}

export default youtubeRobot;