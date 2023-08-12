import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'EmoView Student REST Tensorflow Faris',
  description: 'An extension to recognize emotions on Google Meet using REST API',
  version: '1.0',
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: ['https://meet.google.com/*-*-*'],
      js: ['src/content/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['storage'],
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAprN2xYdZPLt+DiG+EHZdViCI9DhuJhX9SIEoUipbAUcMjFW2tEfXfvE7B6lb6P6DVAOaXC2agWXTrwVAM7NJpXKldkWoGt3i60pVHTOF0C06XN34F4iF9ESD+EOTTRwPa9ElevuQgVo5RAJiepdFooVVcjrWhVqqQWyM23dviqtJ9xPoyeBn39mAK8v4YFxCLExoK8w75fODwk8enDw981mViC6fr0UpjMbiH0slB6DyceepEyB9MSvxROrHTJAzu08fGBRJeEs6FSPeYrvTsxCeGRBoS/U9pzcru6hC0QLCqYBKr4OTzdMWxnEzCsCohbaVgZoXRLGAB1AuzacD7wIDAQAB',
})
