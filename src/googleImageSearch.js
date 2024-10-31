const apiKey = 'AIzaSyDAa_DWnSUwZCEQ3GojHlrJhBKAAT89dbw'
const engineId = '103f947ca17b6456e'

const GoogleImages = require('google-images');
const client = new GoogleImages(engineId, apiKey);

export function searchForImage() {
    client.search('Steve Angello', {page: 2});
}
