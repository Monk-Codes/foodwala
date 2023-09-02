import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";
import "regenerator-runtime/runtime";

const timeout = function (s) {
 return new Promise(function (_, reject) {
  setTimeout(function () {
   reject(new Error(`Request took too long! Timeout after ${s} seconds`));
  }, s * 1000);
 });
};

export const AJAX = async function (url, upload = undefined) {
 try {
  const fetchPro = upload
   ? fetch(url, {
      method: "POST",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify(upload),
     })
   : fetch(url);
  const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
 } catch (error) {
  throw error;
 }
};
