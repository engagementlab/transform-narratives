/* eslint-disable import/no-anonymous-default-export */
require('dotenv').config();
const fs = require('fs');
const axios = require('axios').default;
const _ = require('underscore');
let videoData = '';

const getData = async (apiPath) => {
  const response = await axios.get(
    `https://api.vimeo.com${
      apiPath || '/channels/1773240/videos?per_page=100'
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VIMEO_AUTH_TOKEN}`,
      },
    }
  );
  const resData = response.data;
  let m = _.map(resData.data, (val) => {
    return {
      label: val.name,
      value: val.player_embed_url,
      thumb: val.pictures.sizes[val.pictures.sizes.length - 1].link,
      thumbSm: val.pictures.sizes[1].link,
    };
  });
  videoData += JSON.stringify(m);

  // if(resData.paging.next)
  //   getData(resData.paging.next);
  // else {

  if (fs.existsSync('videoData.js')) fs.unlinkSync('videoData.js');

  fs.writeFileSync('videoData.js', `module.exports = ${videoData}`);
  // }
};

module.exports = (async () => {
  const data = await getData();
})();
