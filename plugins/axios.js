import { getCookie, setCookie, clearCookie } from "../cookies.js";
let qs = require("qs");
const cookieparser = process.server ? require("cookieparser") : undefined;

export default function(app) {
  const { $axios, env, redirect, req, store } = app;

  $axios.onRequest(config => {

    let cookie = !process.server
      ? getCookie("user", app)
      : req && req.headers && req.headers.cookie
      ? cookieparser.parse(req.headers.cookie)
      : "";
    cookie = !process.server ? cookie : cookie.user;
    let user = cookie && JSON.parse(cookie);
    const service = config.url_instance;

    let userEmail = store.state.courseData.emailId;
    if (cookie) {
      config.headers["X-Tenant-ID"] = user.tenantId;
      config.headers["X-User-ID"] = userEmail;
      config.headers["X-User-Role"] = "student";
      config.headers["X-Access-Token"] = user.accessToken;
    }
    config.baseURL = config.url_instance;
    config.url = config.baseURL + config.url_suffix;
    config.url =
      config.url.indexOf("?") > 0
        ? config.url + `&timestamp=${new Date().getTime()}`
        : config.url + `?timestamp=${new Date().getTime()}`;
  });

  $axios.onResponseError(async err => {
    let cookie = !process.server
      ? getCookie("user", app)
      : req && req.headers && req.headers.cookie
      ? cookieparser.parse(req.headers.cookie)
      : "";
    cookie = !process.server ? cookie : cookie.user;
    let user = cookie && JSON.parse(cookie);
    let isRefreshTokenCall =
      err && err.config && err.config.url_suffix === "/refreshToken"
        ? true
        : false;
    const code = parseInt(err.response && err.response.status);
    let originalRequest = err.config;
    
    if ([401, 403].includes(code)) {
      originalRequest.__isRetryRequest = true;
      let params = {
        refresh_token: user && user.refreshToken
      };
      try {
        if (code === 403) {
          // if (isRefreshTokenCall) {
            console.log("checking for refresh token");
          await new Promise(async (resolve, reject) => {
            
            console.log("promise of refresh token");
            await $axios({
              url_instance: process.env.API_AUTH,
              method: "post",
              url_suffix: "/refreshToken",
              data: qs.stringify(params)
            })
              .then(async response => {
                
                console.log("success for refresh token");
                if (response.status === 200) {
                  
                  console.log("status 200 for refresh token");
                  if (user.refreshToken) {
                    console.log("got refresh token :P 200 for refresh token");
                    if (response.data && response.data.tokenFull) {
                      var expiresAt = new Date(user.refreshTokenExpiresAt);
                      const data = {
                        tenantId: user.tenantId,
                        userRole: 'student',
                        userEmail: user.userEmail,
                        refreshToken:
                          response.data.tokenFull.refreshToken || "",
                        accessToken: response.data.tokenFull.accessToken || "",
                      };
                      setCookie("user", JSON.stringify(data), {
                        expires: expiresAt
                      });
                    }
                  }
                } else {
                  console.log("not found status 200 for refresh token");
                  await logout($axios, redirect, req, app);
                  throw new Error("logout user 1");
                }
                resolve(response);
              })
              .catch(async e => {
                console.log("catch for refresh token");
                await logout($axios, redirect, req, app);
                reject(e.response && e.response.data);
              });
          });
          return $axios(originalRequest);
        } else {
          console.log("else for error 2 for refresh token");
          await logout($axios, redirect, req, app);
          throw new Error("logout user 2");
        }
      } catch (e) {
        await logout($axios, redirect, req, app);
        console.log("catch  errpr 3 for refresh token");
        throw new Error("logout user 3");
      }
    }
    return Promise.reject(err);
  });
}

const logout = async (redirect, req, app) => {
  let cookie = !process.server
    ? getCookie('user', app)
    : req && req.headers && req.headers.cookie
    ? cookieparser.parse(req.headers.cookie)
    : ''

  cookie = !process.server ? cookie : cookie.user

  if (cookie) {
    redirect('/unauthorized/')
    clearCookie('user')
    clearCookie('refreshToken')
    clearCookie('token')

    if (!process.server) {
      localStorage.clear()
    }
  }
}
