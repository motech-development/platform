import{_ as S}from"./iframe-7e711e71.js";import"../sb-preview/runtime.js";const{addons:f}=__STORYBOOK_MODULE_PREVIEW_API__,{global:U}=__STORYBOOK_MODULE_GLOBAL__;var o="storybook/a11y",y=`${o}/result`,L=`${o}/request`,d=`${o}/running`,A=`${o}/error`,T=`${o}/manual`,r={RESULT:y,REQUEST:L,RUNNING:d,ERROR:A,MANUAL:T},{document:g}=U,a=f.getChannel(),l=!1,_,R={config:{},options:{}},v=async(n,e)=>{e!=null&&e.manual||await i(n,e??R)},i=async(n,e=R)=>{_=n;try{if(!l){l=!0,a.emit(r.RUNNING);let{default:t}=await S(()=>import("./axe-f8e7d4de.js").then(N=>N.a),["./axe-f8e7d4de.js","./_commonjsHelpers-de833af9.js"],import.meta.url),{element:m="#storybook-root",config:s,options:O={}}=e,E=g.querySelector(m);if(!E)return;t.reset(),s&&t.configure(s);let c=await t.run(E,O),u=JSON.parse(JSON.stringify(c));_===n?a.emit(r.RESULT,u):(l=!1,i(_))}}catch(t){a.emit(r.ERROR,t)}finally{l=!1}};a.on(r.REQUEST,v);a.on(r.MANUAL,i);
