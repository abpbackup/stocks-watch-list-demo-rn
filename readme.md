# Stocks Watchlist React Native app

## Description

This project is a very basic learning material that covers key aspects of building a react native application using Expo, AsyncStorage, and TypeScript. It demonstrates the use of the Fetch API, error handling, reactive UI and some other user-friendly app behaviors.

**Note:** This project is intended for educational purposes and is not suitable for production environments.

## Prerequisites

- Expo app [AppStore](https://apps.apple.com/us/app/expo-go/id982107779), [GooglePlay](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)
- npm

## Installation

Run the following command in the project's root directory to install dependencies:
`npm i`

## Run Metro server

To run Expo framework and Metro server, use:
`npx expo start`

## Run the app

Use your phone and scan the QR code with your camera. Then tap on "Open in Expo Go". Make sure you have
the Expo Go app installed (check the Prerequisites section)

## Testing

To execute tests, run:
`npm test`

## API access

Add the proper `ApiUrl` and `ApiKey` in app.json file under the `extra` key .

## Troubleshooting

Visit the [discussion](https://github.com/abpbackup/stocks-watch-list-demo-rn/discussions/new/choose) page

## Next steps

- Basic Auth
- Get all the available stocks to save them in local storage so the search happens locally (for this we need a new
  end point)
- Github actions to run testing, pull-request validation and deployment to Expo, Apple and Google stores
- Logging with Datadog or any other provider

## Contributing

Contributions to this project are welcome. To contribute, please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
