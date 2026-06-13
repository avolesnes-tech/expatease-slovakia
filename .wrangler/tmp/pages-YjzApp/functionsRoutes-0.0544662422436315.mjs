import { onRequestOptions as __airtable_submit_js_onRequestOptions } from "/Users/annalockwoodova/Documents/GitHub/ExpatEase/ExpatEase/ExpatEase/functions/airtable-submit.js"
import { onRequestPost as __airtable_submit_js_onRequestPost } from "/Users/annalockwoodova/Documents/GitHub/ExpatEase/ExpatEase/ExpatEase/functions/airtable-submit.js"
import { onRequestOptions as __submit_business_js_onRequestOptions } from "/Users/annalockwoodova/Documents/GitHub/ExpatEase/ExpatEase/ExpatEase/functions/submit-business.js"
import { onRequestPost as __submit_business_js_onRequestPost } from "/Users/annalockwoodova/Documents/GitHub/ExpatEase/ExpatEase/ExpatEase/functions/submit-business.js"

export const routes = [
    {
      routePath: "/airtable-submit",
      mountPath: "/",
      method: "OPTIONS",
      middlewares: [],
      modules: [__airtable_submit_js_onRequestOptions],
    },
  {
      routePath: "/airtable-submit",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__airtable_submit_js_onRequestPost],
    },
  {
      routePath: "/submit-business",
      mountPath: "/",
      method: "OPTIONS",
      middlewares: [],
      modules: [__submit_business_js_onRequestOptions],
    },
  {
      routePath: "/submit-business",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__submit_business_js_onRequestPost],
    },
  ]