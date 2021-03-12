import express, { Express } from 'express';
import fs from 'fs';
import { Server } from 'http';
import { google, youtube_v3 } from 'googleapis';
import stateRobot from './state';
import { State } from '../interfaces';

export interface StartWebServerResponse {
  app: Express;
  server: Server;
}

async function youtubeRobot() {
  const OAuth2 = google.auth.OAuth2;
  const youtube = google.youtube({ version: 'v3' });

  const state = stateRobot.load();

  await authenticateWithOAuth();
  const videoInformation = await uploadVideo(state);
  // await uploadThumbnail(videoInformation);

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

  async function uploadVideo(state: State) {
    const videoFilePath = './images/video-maker.mp4';
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = `${state.prefix} ${state.searchTerm}`;
    const videoTags = [state.searchTerm, ...state.sentences[0].keywords];
    const videoDescription = state.sentences.map(sentence =>
      sentence.text
    ).join('\n\n');

    const requestParameters = {
      part: 'snippet, status',
      requestBody: {
        title: videoTitle,
        description: videoDescription,
        tags: videoTags,
      },
      status: {
        privacyStatus: 'unlisted',
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      }
    } as any;

    const youtubeResponse = await youtube.videos.insert(requestParameters, {
      onUploadProgress,
    });

    console.log(`video available at: https://youtu.be/${youtubeResponse.data.id}`);
    return youtubeResponse.data;

    function onUploadProgress(event: any) {
      const progress = Math.round((event.bytesRead / videoFileSize) * 100);
      console.log(`> ${progress}% completed`);
    }
  }

  // async function uploadThumbnail(videoInformation: youtube_v3.Schema$Video) {
  //   const videoId = videoInformation.id || '';
  //   const videoThumbnailFilePath = './images/youtube-thumbnail.jpeg';

  //   const requestParameters = {
  //     videoId,
  //     media: {
  //       mimeType: 'image/jpeg',
  //       body: fs.createReadStream(videoThumbnailFilePath),
  //     }
  //   };

  //   const youtubeResponse = await youtube.thumbnails.set(requestParameters);
  //   console.log('> thumbnail uploaded!');
  // }
}

export default youtubeRobot;