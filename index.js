// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = 'abcn82LQg9kXrVsI7CC0QG2Zap6SM6K4REsHQOl0'
const clientSecret = 'ZDMmLZ7dsMacHhnK8AQLjiKwCb4joFkx2FylADePGKk56nbOJ1zuEyObhiyKLHiGz9dkq3oGLFKrn70dqvc9Zb28ECwovP0WA6TG0SofjO5SwXncsmNoSAOybpgd3Zy4'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');
const qs = require('qs');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);

  const data = qs.stringify({
    'state': 'xyz',
    'client_id': 'abcn82LQg9kXrVsI7CC0QG2Zap6SM6K4REsHQOl0',
    'client_secret': 'ZDMmLZ7dsMacHhnK8AQLjiKwCb4joFkx2FylADePGKk56nbOJ1zuEyObhiyKLHiGz9dkq3oGLFKrn70dqvc9Zb28ECwovP0WA6TG0SofjO5SwXncsmNoSAOybpgd3Zy4',
    'grant_type': 'authorization_code',
    'code': `${requestToken}`
  });
  const config = {
    method: 'post',
    url: 'https://arkid.demo.longguikeji.com/oauth/token/',
    headers: { 
      'Authorization': 'Basic YWJjbjgyTFFnOWtYclZzSTdDQzBRRzJaYXA2U002SzRSRXNIUU9sMDpaRE1tTFo3ZHNNYWNIaG5LOEFRTGppS3dDYjRqb0ZreDJGeWxBRGVQR0trNTZuYk9KMXp1RXlPYmhpeUtMSGlHejlka3Ezb0dMRktybjcwZHF2YzlaYjI4RUN3b3ZQMFdBNlRHMFNvZmpPNVN3WG5jc21Ob1NBT3licGdkM1p5NA==', 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  const tokenResponse = await axios(config);

	//const tokenResponse = await axios({
  	//  method: 'post',
  	//  url: 'https://arkid.demo.longguikeji.com/oauth/token/?' +
  	//    `client_id=${clientID}&` +
  	//    `client_secret=${clientSecret}&` +
  	//    `code=${requestToken}`,
  	//  headers: {
  	//    accept: 'application/json'
  	//  }
  	//});

  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'get',
    url: `https://arkid.demo.longguikeji.com/oauth/userinfo/`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.data.user.name;

  ctx.response.redirect(`/welcome.html?name=${name}`);
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));

app.listen(8081);
