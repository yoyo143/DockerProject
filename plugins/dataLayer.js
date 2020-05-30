import { getCookie } from "@/cookies.js";
import LocalStorageUtil from "~/utils/localStorageUtil.js";
import routeConfig from '@/routeConfig';
const cookieparser = process.server ? require("cookieparser") : undefined;

export default ({ app }, context) => {

  let cookie = !process.server
    ? getCookie("user", context)
    : context &&
      context.req &&
      context.req.headers &&
      context.req.headers.cookie
    ? cookieparser.parse(context.req.headers.cookie)
    : "";
  cookie = !process.server ? cookie : cookie.user;

  function setDigitalData(to) { 
    return new Promise(resolve => {
      setTimeout(() => {
        if(to){
          window.digitalData.pageName =  routeConfig[to.name] ? routeConfig[to.name].pageName : "Adoption Overview";
          window.digitalData.SiteSection =  routeConfig[to.name] ? routeConfig[to.name].siteSection : "Misc";
        } else {
          window.digitalData.pageName = document.title;
          window.digitalData.SiteSection = "Misc";
        }
        if(cookie) {
          var user = JSON.parse(cookie);
          window.digitalData.InstitutionName = LocalStorageUtil.tenantName;
          window.digitalData.InstitutionID = user.tenantId;
          window.digitalData.UserId = user.userId;
          window.digitalData.UserPermission = user.currentRoleId;
          window.digitalData.Company = LocalStorageUtil.company;
        } else {
          window.digitalData.InstitutionName = "";
          window.digitalData.InstitutionID = "";
          window.digitalData.UserId = "";
          window.digitalData.UserPermission = "";
          window.digitalData.Company = "";
        }
        resolve("done");
      }, 500);
    });
  }
  
  async function waitforSetDigitalData(to) {
    var x = await setDigitalData(to);
  }


  const adobeTrackScript = () => {
    const adobeScr = (process.env.NODE_ENV === "production" && process.env.DEPLOY_ENV === "prod")? 
        "//assets.adobedtm.com/launch-EN5ad214ae51254919a88258f4a4faa971.min.js"
        : "//assets.adobedtm.com/launch-EN10ef728ffd8d472396ad3fd7aa948fbd-development.min.js";
    const adobeScriptTag = document.createElement("script");
    adobeScriptTag.src = adobeScr;
    document.head.appendChild(adobeScriptTag);
  }

  const fireViewStartCustomEvent = () => {
    var event=new CustomEvent('event-view-start', {
      detail: window.digitalData
    });
    var obj = document.dispatchEvent(event);
  }

  if (cookie) {
    window.digitalData = {};
    waitforSetDigitalData().then(() =>{
      adobeTrackScript();
      fireViewStartCustomEvent();
    });

    var obj = document.querySelector("body");
    obj.addEventListener('event-view-end', (e) => {});
    const fireViewEndCustomEvent = () => {
      var event=new CustomEvent('event-view-end', {
        detail: window.digitalData
      });
      obj.dispatchEvent(event);
    }

    app.router.afterEach((to, from) => {
      waitforSetDigitalData(to).then(()=>{
        try{
          fireViewEndCustomEvent();
          if(window && window.s && window.s.t){
            window.s.t();
          }
        } catch(e) {
          
        }
      });
    });
  } else {
    window.digitalData = {};
    waitforSetDigitalData().then(() =>{  
      adobeTrackScript();
      fireViewStartCustomEvent();
    });
  }

};

/* IE11 Polyfill*/
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  window.CustomEvent = CustomEvent;
})();