import{r as s}from"./index-cb576d23.js";const u=(e,n)=>{s.useEffect(()=>{const t=o=>{!e||e.contains(o.target)||n(o)};return document.addEventListener("mousedown",t),document.addEventListener("touchstart",t),()=>{document.removeEventListener("mousedown",t),document.removeEventListener("touchstart",t)}},[n,e])};export{u};