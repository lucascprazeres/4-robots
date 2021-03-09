<div id="header" align="center">
  <img src=".github/youtube-logo.png" width="120"/>
  <h1>Video Maker</h1>
  <h3>A nodejs way of creating YouTube videos</h3>

  <div>
    <img src="https://img.shields.io/badge/nodejs-v15.3-green" />
    <img src="https://img.shields.io/badge/typescript-v4.2-blue" />
    <img src="https://img.shields.io/badge/googleapis-v67.1-red" />
    <img src="https://img.shields.io/badge/watson-v6.0-blueviolet" />
  </div>
</div>

## 🔎 About

**Video maker** is an **open-source** nodejs project developed on [Filipe Deschamps](https://github.com/filipedeschamps) YouTube [channel](https://www.youtube.com/playlist?list=PLMdYygf53DP4YTVeu0JxVnWq01uXrLwHi). It's usage complexity is as simple as asking you a search term and prefix, then rendering a 30 second video containing a small presentation about what was searched. Behind the scenes, however, it takes advantages of some special integrations such as a **Wikipedia web scrapper service**, **Deep Learning** with **IBM Watson** and a **custom Google search engine**!

What makes this version different from what was presented by Deschamps is the addition of **TypeScript** to the project (bringing a more modern syntax to it) and the usage of an **open-source nodejs video renderer**.

## 🚀 Technologies

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Algorithmia Wikipedia parser](https://algorithmia.com/algorithms/web/WikipediaParser)
- [IBM Watson - Natural Language Understanding](https://www.ibm.com/br-pt/cloud/watson-natural-language-understanding)
- [Google Cloud Search Engine](https://cloud.google.com/)
- [GraphicsMagick (imageMagick)](https://github.com/aheckmann/gm)
- [videoshow](https://github.com/h2non/videoshow)
- [fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

## 🛠️ Setting up the project

... 🚧 Coming soon 🚧 ...

## 🔥 Running the app

**Build version**

```bash
# build the typescript code into faster javascript
yarn build

# then run the build version
yarn start

```

**Development version**

```bash
# run the typescript development code
# it's more flexible to make changes but it's algo slower
yarn dev
```

both versions will run the project

## 🧑‍🚀 Contributing

**All contributions are welcome, so why don't you send me your idea?**

If you walked through the [Setting up the project](#Setting-up-the-project) tutorial, then you're good to go!

```bash
# create your own branch to make the process safer
git checkout -b <your-branch>

# add your code. Then, commit your changes and send to the GitHub repository
git add .
git commit -m "type(scope): description"
git push origin <your-branch>
```

*if you are not familiar with the structure presented in the commit message, I suggest you to look this [link](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)*

## 👋 Get in Touch

... 🚧 Coming soon 🚧 ...

## 📝 License

This project is under the **MIT**. For further info, check the [**LICENSE**](LICENSE) file.

<hr />

<h4 align=center>Made with ❤️ by <a href="https://www.linkedin.com/in/lucas-prazeres/">Lucas Prazeres</a></h4>