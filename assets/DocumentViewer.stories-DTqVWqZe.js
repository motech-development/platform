const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./pdf-Dw_Lud9I.js","./rolldown-runtime-DaJ6WEGw.js","./preload-helper-si3HNj2m.js","./pdf.worker-DrGIgoH1.js","./context-BA1lSQW8.js"])))=>i.map(i=>d[i]);
import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{n as r,t as i}from"./preload-helper-si3HNj2m.js";import{t as a}from"./react-DvlgmmzG.js";import{a as o,o as s}from"./OverlayProvider-D7VNEgVu.js";import{t as c}from"./jsx-runtime-cM__dR4X.js";import{t as l}from"./react-dom-ua_76iqd.js";import{n as u,r as d}from"./BreezeContext-D8B-y9s5.js";import{n as f,t as p}from"./Button-ChqF1UMJ.js";import{n as m,t as h}from"./OverlaySurface-DuIM7I7U.js";import{n as g,t as _}from"./Drawer-Dy748w1T.js";import{a as v,i as y,r as b,t as x}from"./view-transitions-tkkvCyM2.js";import{n as S,t as ee}from"./Skeleton-DFi3t8sP.js";import{n as te,t as ne}from"./AttachmentRow-xE-lzZXq.js";function re(e){let t=e?.trim();if(t)return t.endsWith(`/`)?t:`${t}/`}function ie(e){return e.reason instanceof Error?e.reason:new DOMException(`The PDF load was aborted.`,`AbortError`)}function C(e){if(e.aborted)throw ie(e)}async function ae(e,t,n){C(t);let r=await i(()=>import(`./pdf-Dw_Lud9I.js`),__vite__mapDeps([0,1,2]),import.meta.url);C(t);let a=n?.workerSrc?.trim();a||=(await i(()=>import(`./pdf.worker-DrGIgoH1.js`),__vite__mapDeps([3,1]),import.meta.url)).default,C(t),r.GlobalWorkerOptions.workerSrc=a;let o=re(n?.cMapUrl),s=re(n?.standardFontDataUrl),c=r.getDocument({...o?{cMapPacked:!0,cMapUrl:o}:{},...s?{standardFontDataUrl:s}:{},stopAtErrors:!0,url:e}),l=null,u=()=>{l||=(async()=>{try{await c.destroy()}catch{}})()},d=()=>void 0,f=new Promise((e,n)=>{let r=()=>{u(),n(ie(t))};if(t.aborted){r();return}t.addEventListener(`abort`,r,{once:!0}),d=()=>t.removeEventListener(`abort`,r)});try{let e=await Promise.race([c.promise,f]);return C(t),{dispose:u,document:e,textLayer:r.TextLayer}}catch(e){throw u(),e}finally{d()}}async function w({TextLayer:e,canvas:t,document:n,outputScale:r=1,pageNumber:i,rotation:a,scale:o,signal:s,textLayerContainer:c}){let l=await n.getPage(i);try{if(s.aborted)return;let n=((l.rotate+a)%360+360)%360,i=l.getViewport({rotation:n,scale:o}),u=t,d=c,f=u.getContext(`2d`);if(!f)throw Error(`The browser could not create a PDF canvas context.`);let p=Number.isFinite(r)&&r>0?r:1,m=i.width*i.height,h=Math.min(Math.sqrt(oe/m),oe/Math.max(i.width,i.height)),g=Math.min(p,h);u.width=Math.max(1,Math.floor(i.width*g)),u.height=Math.max(1,Math.floor(i.height*g)),u.style.width=`${i.width}px`,u.style.height=`${i.height}px`,d.replaceChildren(),d.style.width=`${i.width}px`,d.style.height=`${i.height}px`,d.dataset.mainRotation=String(i.rotation);let _=d.parentElement;_?.style.setProperty(`--scale-factor`,String(i.scale)),_?.style.setProperty(`--user-unit`,String(l.userUnit));let v=l.render({canvas:u,canvasContext:f,...g===1?{}:{transform:[g,0,0,g,0,0]},viewport:i}),y=()=>v.cancel();s.addEventListener(`abort`,y,{once:!0}),s.aborted&&y();try{await v.promise}finally{s.removeEventListener(`abort`,y)}if(s.aborted)return;let b=new e({container:d,textContentSource:l.streamTextContent(),viewport:i}),x=()=>b.cancel();s.addEventListener(`abort`,x,{once:!0}),s.aborted&&x();try{await b.render()}finally{s.removeEventListener(`abort`,x)}}finally{l.cleanup()}}var oe,se=t((()=>{r(),oe=16777216}));function ce(e){return e.closest(`.breeze-fullscreen`)??e}function le(e,t){let n=e.createElement(`a`);n.href=t,n.hidden=!0,n.target=`_self`,e.body.append(n),n.click(),n.remove()}async function ue(e,t,n){let{ownerDocument:r}=e.currentTarget,i=r.defaultView,a=new URL(t,r.baseURI);if(!(!i||a.protocol!==`http:`&&a.protocol!==`https:`||a.origin===i.location.origin)){e.preventDefault();try{let e=await fetch(a.href,{credentials:`same-origin`});if(!e.ok)throw Error(`The attachment download failed.`);let t=i.URL.createObjectURL(await e.blob()),o=r.createElement(`a`);o.download=n,o.href=t,o.hidden=!0,r.body.append(o),o.click(),o.remove(),i.setTimeout(()=>i.URL.revokeObjectURL(t),1e3)}catch{le(r,a.href)}}}async function de(e,t){let n=e?.dataset;if(e){let t=N.get(e);t?t.count+=1:N.set(e,{count:1,previous:n?.breezeViewerModeTransition??null}),n&&(n.breezeViewerModeTransition=``)}let r=()=>{if(!n)return;let t=N.get(e);t&&(--t.count,!(t.count>0)&&(N.delete(e),t.previous===null?delete n.breezeViewerModeTransition:n.breezeViewerModeTransition=t.previous))};try{await b(t,[`mode`])}finally{r()}}function fe(){return new Promise(e=>{queueMicrotask(()=>e())})}function pe(e,t,n,r,i){let a=e?JSON.stringify([n,r,i?.cMapUrl??null,i?.standardFontDataUrl??null,i?.workerSrc??null]):null,[o,s]=(0,A.useState)({generation:0,signature:null});return(0,A.useLayoutEffect)(()=>{o.signature!==a&&s(e=>({generation:e.generation+1,signature:a}))},[o.signature,a]),!e||o.signature!==a?null:`${t}:${o.generation}`}function T(e,t){return e?.assetKey===t.assetKey&&e.downloadName===t.downloadName&&e.mediaType===t.mediaType&&e.pageNumber===t.pageNumber&&e.rotation===t.rotation&&e.sourceKey===t.sourceKey&&e.src===t.src&&e.title===t.title&&e.zoom===t.zoom}function me(e,t,n,r){return e&&t?t:!e&&n?n:{assetKey:r.assetKey,downloadName:r.downloadName,mediaType:r.mediaType,pageNumber:r.pageNumber,rotation:r.rotation,sourceKey:r.sourceKey,src:r.src,title:r.title,zoom:r.zoom}}function he({currentViewerState:e,onOpenChange:t,open:n,parentOverlayOpen:r,setClosingTransition:i,setExitState:a,transitionName:o}){return(0,A.useCallback)(s=>{if(s){i(!1),a(null),t(!0);return}if(!n||!o?.trim()||r===!1){i(!1),e&&a(e),t(!1);return}let c=!1,l=!1,u=()=>{if(!c){c=!0;try{(0,Ee.flushSync)(()=>{i(!0),e&&a(e),t(!1)})}catch(e){throw l=!0,e}}};b(u,[`expand`]).catch(e=>{if(l)throw e;u()})},[e,t,n,r,i,a,o])}function ge(e,t,n){let r=t%180!=0,i=r?e.height:e.width;return{mediaBoxStyle:{height:(r?e.width:e.height)*n,width:i*n},mediaContentStyle:{height:e.height,transform:`translate(-50%, -50%) rotate(${t}deg) scale(${n})`,transformOrigin:`center`,width:e.width}}}function _e(e,t,n){let[r,i]=(0,A.useState)(null),[a,o]=(0,A.useState)(null),s=(0,A.useRef)(null);return(0,A.useLayoutEffect)(()=>{if(e&&t){n(!1),s.current=t,o(e=>T(e,t)?e:t),i(null);return}s.current&&=(i(e=>e??s.current),null)},[t,e,n]),{exitState:r,lastViewerState:a,setExitState:i}}function E(e){if(!e)return null;let t=e.getBoundingClientRect(),n=e.ownerDocument.defaultView?.getComputedStyle(e),r=e=>Number.parseFloat(e)||0;return{height:Math.max(0,t.height-r(n?.paddingTop??``)-r(n?.paddingBottom??``)),width:Math.max(0,t.width-r(n?.paddingLeft??``)-r(n?.paddingRight??``))}}function ve({assetKey:e,contentAssetKey:t,contentRotation:n,effectiveOpen:r,fitFrame:i,imageRef:a,setMediaSizeState:o,src:s,stageRef:c}){let l=(0,A.useCallback)(e=>{let r=E(c.current),i=e.naturalWidth||1,a=e.naturalHeight||1,s=n%180!=0,l=(s?r?.height:r?.width)||i,u=(s?r?.width:r?.height)||a,d=Math.min(1,l/i,u/a);o({height:a*d,key:t,width:i*d})},[t,n,o,c]),u=(0,A.useCallback)(()=>{let e=E(c.current),r=n%180!=0;o({height:(r?e?.width:e?.height)||720,key:t,width:(r?e?.height:e?.width)||1024})},[t,n,o,c]);return(0,A.useEffect)(()=>{let e=c.current,t=a.current;if(!r||!e||!t&&!i||typeof ResizeObserver>`u`)return;let n=new ResizeObserver(()=>{t?.complete&&t.naturalWidth>0?l(t):!t&&i&&u()});return n.observe(e),t?.complete&&t.naturalWidth>0?l(t):!t&&i&&u(),()=>n.disconnect()},[e,n,r,i,u,l,a,s,c]),{fitFrameToStage:u,fitImageToStage:l}}function ye({assetKey:e,canvasRef:t,contentMediaType:n,contentSourceKey:r,effectiveOpen:i,mediaType:a,pageNumber:o,pdfAssetOptions:s,setAssetState:c,setMediaSizeState:l,sourceKey:u,src:d,textLayerRef:f,zoom:p}){let[m,h]=(0,A.useState)(null),[g,_]=(0,A.useState)(null),v=(0,A.useRef)(Promise.resolve()),y=m?.key===r?m.session:null,b=r!==null&&g===r&&n===`pdf`;return(0,A.useEffect)(()=>{if(!i||!u||a!==`pdf`)return;let e=!0,t=null,n=new AbortController;return ae(d,n.signal,s).then(r=>{if(t=r,!e||n.signal.aborted){r.dispose();return}h({key:u,session:r})}).catch(()=>{!e||n.signal.aborted||_(u)}),()=>{e=!1,n.abort(),t?.dispose()}},[i,a,s,u,d]),(0,A.useLayoutEffect)(()=>{let n=t.current,r=f.current;if(!i||!u||!e||a!==`pdf`||b||!y||!n||!r)return;let s=new AbortController,d=p*(n.ownerDocument.defaultView?.devicePixelRatio||1);c({failed:!1,key:e,ready:!1});let m=v.current.then(async()=>{s.signal.aborted||(await w({TextLayer:y.textLayer,canvas:n,document:y.document,outputScale:d,pageNumber:o,rotation:0,scale:1,signal:s.signal,textLayerContainer:r}),!s.signal.aborted&&(l({height:Number.parseFloat(n.style.height)||0,key:e,width:Number.parseFloat(n.style.width)||0}),c({failed:!1,key:e,ready:!0})))});return v.current=m.then(()=>void 0,()=>{s.signal.aborted||(_(u),c({failed:!1,key:e,ready:!1}))}),()=>s.abort()},[e,t,i,b,a,o,y,c,l,u,f,p]),{fallback:b,pageCount:y?.document.numPages??0,session:y}}function be({assetKey:e,assetReady:t,contentAssetKey:n,contentSourceKey:r,effectiveOpen:i,sourceKey:a,transitionName:o,viewerRef:s}){let[c,l]=(0,A.useState)(null),[u,d]=(0,A.useState)(null),[f,p]=(0,A.useState)(null),m=(0,A.useRef)(null),h=c===a&&i,g=u===n&&t&&r!==null;return(0,A.useEffect)(()=>{if(!i||!a)return;let e=!0;return v().then(()=>{e&&l(a)}).catch(()=>void 0),()=>{e=!1}},[i,a]),(0,A.useEffect)(()=>{if(!i||!a||!e||!t||!h||g||m.current===e)return;let n=!0;m.current=e;let r=()=>{n&&(d(e),p(a))},c=async()=>{await fe(),n&&(0,Ee.flushSync)(()=>{d(e),p(a)})},l=()=>{m.current===e&&(m.current=null)};return!o?.trim()||f===a?(r(),()=>{n=!1,l()}):(de(s.current,c).catch(()=>{n&&(m.current=null,(0,Ee.flushSync)(()=>{d(e),p(a)}))}),()=>{n=!1,l()})},[e,t,i,g,f,a,o,h,s]),g}function xe(e,t){let[n,r]=(0,A.useState)(!1),i=e&&typeof document<`u`&&document.fullscreenEnabled&&typeof HTMLElement<`u`&&typeof HTMLElement.prototype.requestFullscreen==`function`;return(0,A.useEffect)(()=>{let n=t?.ownerDocument;if(!e||!t||!n){r(!1);return}let i=ce(t),a=()=>{r(n.fullscreenElement===i)};return a(),n.addEventListener(`fullscreenchange`,a),()=>n.removeEventListener(`fullscreenchange`,a)},[e,t]),{fullscreenAvailable:i,isFullscreen:n}}function Se({children:e,name:t,participates:n,onRoot:r}){let i=y({name:t,types:[`expand`,`mode`]}),a=(0,A.useCallback)(e=>{let t=n?i(e):void 0;return r(e),e?()=>{r(null),t?.()}:t},[r,n,i]);return(0,j.jsx)(`div`,{className:M.base.root,ref:a,children:e})}function D({assetKey:e,effectiveOpen:t,fitFrameToStage:n,onAssetStateChange:r,src:i,title:a}){let[o,s]=(0,A.useState)(null),c=(0,A.useRef)(null);return(0,A.useEffect)(()=>{if(!t||o?.key===e)return;let n=new AbortController;return r({failed:!1,key:e,ready:!1}),fetch(i,{credentials:`same-origin`,signal:n.signal}).then(async t=>{if(!t.ok)throw Error(`The PDF fallback request failed.`);let r=await t.blob();if(n.signal.aborted)return;let i=new Blob([r],{type:`application/pdf`}),a=URL.createObjectURL(i);if(n.signal.aborted){URL.revokeObjectURL(a);return}c.current=a,s({key:e,url:a})}).catch(()=>{n.signal.aborted||r({failed:!0,key:e,ready:!0})}),()=>n.abort()},[e,t,o?.key,r,i]),(0,A.useEffect)(()=>()=>{let e=c.current;c.current=null,e&&URL.revokeObjectURL(e)},[]),o?.key===e?(0,j.jsx)(`iframe`,{className:M.base.viewerFrame,onError:()=>r({failed:!0,key:e,ready:!0}),onLoad:()=>{n(),r({failed:!1,key:e,ready:!0})},src:o.url,title:a}):null}function O({assetKey:e,canvasRef:t,effectiveOpen:n,fitFrameToStage:r,fitImageToStage:i,imageRef:a,isPdfCanvas:o,mediaSize:s,mediaType:c,onAssetStateChange:l,pdfSession:u,src:d,textLayerRef:f,title:p}){return e?c===`image`?(0,j.jsx)(`img`,{alt:p,className:M.base.viewerImage,onError:()=>l({failed:!0,key:e,ready:!0}),onLoad:t=>{i(t.currentTarget),l({failed:!1,key:e,ready:!0})},ref:a,src:d,style:{height:s.height,width:s.width}},e):o&&u?(0,j.jsxs)(`div`,{className:M.base.pdfPage,children:[(0,j.jsx)(`canvas`,{"aria-label":p,ref:t}),(0,j.jsx)(`div`,{className:M.base.textLayer,ref:f})]},e):c===`pdf`&&!o?(0,j.jsx)(D,{assetKey:e,effectiveOpen:n,fitFrameToStage:r,onAssetStateChange:l,src:d,title:p},e):c===`document`?(0,j.jsx)(`iframe`,{className:M.base.viewerFrame,onLoad:()=>{r(),l({failed:!1,key:e,ready:!0})},sandbox:`allow-downloads`,src:d,title:p},e):null:null}function Ce({downloadClick:e,downloadName:t,downloadSrc:n,fullscreenAvailable:r,isFullscreen:i,onClose:a,onRemove:o,onReplace:s,onRotationChange:c,onZoomChange:l,rotateAccessibleLabelId:u,rotation:f,viewerRef:m,zoom:h}){let{getMessageLocale:g,messages:_}=d(),v=g(`documentViewerZoom`),y=new Intl.NumberFormat(v,{maximumFractionDigits:0,style:`percent`}).format(h);return(0,j.jsxs)(`div`,{className:M.base.toolbar,children:[(0,j.jsx)(`span`,{className:M.base.toolbarTitle,title:t,children:t}),(0,j.jsxs)(`div`,{className:M.base.toolbarSection,children:[(0,j.jsx)(`span`,{"aria-live":`polite`,className:M.base.zoomStatus,lang:v,role:`status`,children:_.documentViewerZoom.replace(`{zoom}`,y)}),(0,j.jsx)(`span`,{lang:g(`documentViewerZoomOut`),children:(0,j.jsx)(p,{"aria-label":_.documentViewerZoomOut,disabled:h<=.5,onAction:()=>l(Math.max(.5,h-.25)),size:`sm`,variant:`secondary`,children:`−`})}),(0,j.jsx)(`span`,{lang:g(`documentViewerZoomIn`),children:(0,j.jsx)(p,{"aria-label":_.documentViewerZoomIn,disabled:h>=3,onAction:()=>l(Math.min(3,h+.25)),size:`sm`,variant:`secondary`,children:`+`})}),(0,j.jsxs)(`span`,{lang:g(`documentViewerRotateLabel`),children:[(0,j.jsx)(`span`,{className:`breeze:sr-only`,id:u,lang:g(`documentViewerRotate`),children:_.documentViewerRotate}),(0,j.jsx)(p,{"aria-labelledby":u,onAction:()=>c((f+90)%360),size:`sm`,variant:`secondary`,children:_.documentViewerRotateLabel})]}),(0,j.jsx)(`a`,{className:M.base.toolbarLink,download:t,href:n,lang:g(`documentViewerDownload`),onClick:e,children:_.documentViewerDownload}),r?(0,j.jsx)(`span`,{lang:g(i?`documentViewerExitFullScreen`:`documentViewerFullScreen`),children:(0,j.jsx)(p,{onAction:()=>{let e=m.current,t=e?.ownerDocument;if(!e||!t)return;let n=ce(e);(t.fullscreenElement===n?t.exitFullscreen?.():n.requestFullscreen?.())?.catch(()=>void 0)},size:`sm`,variant:`secondary`,children:i?_.documentViewerExitFullScreen:_.documentViewerFullScreen})}):null,s?(0,j.jsx)(`span`,{lang:g(`documentViewerReplace`),children:(0,j.jsx)(p,{onAction:s,size:`sm`,variant:`secondary`,children:_.documentViewerReplace})}):null,o?(0,j.jsx)(`span`,{lang:g(`documentViewerRemove`),children:(0,j.jsx)(p,{onAction:o,size:`sm`,variant:`secondary`,children:_.documentViewerRemove})}):null,(0,j.jsx)(`span`,{lang:g(`close`),children:(0,j.jsx)(p,{onAction:a,size:`sm`,variant:`secondary`,children:_.close})})]})]})}function we({assetFailed:e,assetKey:t,canvasRef:n,effectiveOpen:r,fitFrameToStage:i,fitImageToStage:a,imageRef:o,isPdfCanvas:s,mediaBoxStyle:c,mediaContentStyle:l,mediaSize:u,mediaType:f,onAssetStateChange:p,painted:m,pdfFallback:h,pdfSession:g,setStageRef:_,src:v,textLayerRef:y,title:b}){let{getMessageLocale:x,messages:S}=d();return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(`div`,{className:M.base.viewer,children:(0,j.jsxs)(`section`,{"aria-busy":!m,"aria-label":b,className:M.base.stage,ref:_,tabIndex:0,children:[(0,j.jsx)(`div`,{className:[M.base.stageContent,M.state.painted[m?`visible`:`hidden`]].join(` `),inert:!m,children:(0,j.jsx)(`div`,{className:M.base.mediaBox,style:c,children:(0,j.jsx)(`div`,{className:M.base.mediaContent,style:l,children:(0,j.jsx)(O,{assetKey:t,canvasRef:n,effectiveOpen:r,fitFrameToStage:i,fitImageToStage:a,imageRef:o,isPdfCanvas:s,mediaSize:u,mediaType:f,onAssetStateChange:p,pdfSession:g,src:v,textLayerRef:y,title:b})})})}),m?null:(0,j.jsx)(`div`,{className:M.base.skeletonLayer,children:(0,j.jsx)(`span`,{className:`breeze:block breeze:block-size-full breeze:inline-size-full`,lang:x(`documentViewerLoading`),children:(0,j.jsx)(ee,{blockSize:`100%`,inlineSize:`100%`,label:S.documentViewerLoading,shape:`rectangle`})})})]})}),(0,j.jsx)(`p`,{className:M.base.viewerNotice,lang:x(`documentViewerAccessibility`),children:S.documentViewerAccessibility}),e&&f===`image`?(0,j.jsx)(`p`,{"aria-live":`polite`,className:M.base.viewerNotice,lang:x(`documentViewerImageUnavailable`),children:S.documentViewerImageUnavailable}):null,h&&e?(0,j.jsx)(`p`,{"aria-live":`polite`,className:M.base.viewerNotice,lang:x(`documentViewerFallback`),children:S.documentViewerFallback}):null]})}function Te({currentPage:e,onNextPage:t,onPreviousPage:n,pageCount:r}){let{getMessageLocale:i,messages:a}=d();return(0,j.jsxs)(`div`,{className:M.base.pageToolbar,children:[(0,j.jsx)(`span`,{lang:i(`documentViewerPreviousPage`),children:(0,j.jsx)(p,{disabled:e<=1,onAction:n,size:`sm`,variant:`secondary`,children:a.documentViewerPreviousPage})}),(0,j.jsx)(`span`,{"aria-live":`polite`,className:M.base.pageStatus,lang:i(`documentViewerPage`),children:a.documentViewerPage.replace(`{current}`,String(e)).replace(`{total}`,String(r))}),(0,j.jsx)(`span`,{lang:i(`documentViewerNextPage`),children:(0,j.jsx)(p,{disabled:e>=r,onAction:t,size:`sm`,variant:`secondary`,children:a.documentViewerNextPage})})]})}function k({downloadName:e,mediaType:t,onOpenChange:n,onRemove:r,onReplace:i,open:a,pdfAssets:s,src:c,title:l,transitionName:u}){let d=(0,A.useId)().replace(/[^a-zA-Z0-9_-]/g,``),f=`${d}-rotate-accessible-label`,p=u?.trim(),m=p||`breeze-document-${d}`,g=(0,A.useContext)(o),_=(0,A.useRef)(null),v=(0,A.useRef)(null),y=(0,A.useCallback)(e=>(v.current=e,()=>{v.current=null}),[]),[b,x]=(0,A.useState)(null),S=(0,A.useCallback)(e=>{_.current=e,x(e)},[]),ee=(0,A.useRef)(null),te=(0,A.useRef)(null),ne=(0,A.useRef)(null),[re,ie]=(0,A.useState)(!1),C=a&&g?.open!==!1,ae=(0,A.useMemo)(()=>{if(t!==`pdf`)return;let e=s?.cMapUrl?.trim()||void 0,n=s?.standardFontDataUrl?.trim()||void 0,r=s?.workerSrc?.trim()||void 0;return e||n||r?{cMapUrl:e,standardFontDataUrl:n,workerSrc:r}:void 0},[t,s?.cMapUrl,s?.standardFontDataUrl,s?.workerSrc]),w=pe(C,d,t,c,ae),[oe,se]=(0,A.useState)({key:null,value:1}),[ce,le]=(0,A.useState)({key:null,value:0}),[de,fe]=(0,A.useState)({key:null,value:1}),T=oe.key===w?oe.value:1,E=ce.key===w?ce.value:0,D=de.key===w?de.value:1,O=w?JSON.stringify([w,D]):null,k=(0,A.useMemo)(()=>w&&O?{assetKey:O,downloadName:e,mediaType:t,pageNumber:D,rotation:E,sourceKey:w,src:c,title:l,zoom:T}:null,[O,e,t,D,E,w,c,l,T]),{exitState:Ee,lastViewerState:M,setExitState:N}=_e(C,k,ie),De=he({currentViewerState:k,onOpenChange:n,open:a,parentOverlayOpen:g?.open,setClosingTransition:ie,setExitState:N,transitionName:u}),{assetKey:P,downloadName:Oe,mediaType:F,pageNumber:ke,rotation:I,sourceKey:Ae,src:je,title:Me,zoom:Ne}=me(C,k,Ee??M,{assetKey:O,downloadName:e,mediaType:t,pageNumber:D,rotation:E,sourceKey:w,src:c,title:l,zoom:T}),[L,R]=(0,A.useState)({failed:!1,key:null,ready:!1}),[z,B]=(0,A.useState)({height:0,key:null,width:0}),V=z.key===P?z:{height:0,key:P,width:0},H=L.key===P&&L.ready,Pe=L.key===P&&L.failed,Fe=be({assetKey:O,assetReady:H,contentAssetKey:P,contentSourceKey:Ae,effectiveOpen:C,sourceKey:w,transitionName:u,viewerRef:_}),{fallback:U,pageCount:Ie,session:W}=ye({assetKey:O,canvasRef:ee,contentMediaType:F,contentSourceKey:Ae,effectiveOpen:C,mediaType:t,pageNumber:D,pdfAssetOptions:ae,setAssetState:R,setMediaSizeState:B,sourceKey:w,src:c,textLayerRef:te,zoom:T}),{fullscreenAvailable:G,isFullscreen:K}=xe(C,b),q=F===`pdf`&&!U,{mediaBoxStyle:J,mediaContentStyle:Y}=ge(V,I,Ne),X=Oe?.trim()||Me,{fitFrameToStage:Z,fitImageToStage:Q}=ve({assetKey:O,contentAssetKey:P,contentRotation:I,effectiveOpen:C,fitFrame:F===`document`||U,imageRef:ne,setMediaSizeState:B,src:c,stageRef:v});return(0,j.jsx)(h,{closingTransition:re,fullScreen:!0,kind:`dialog`,onOpenChange:De,open:a,showHeader:!1,title:Me,viewerSurface:!0,children:(0,j.jsxs)(Se,{name:m,onRoot:S,participates:!!p,children:[(0,j.jsx)(Ce,{downloadClick:e=>{ue(e,je,X).catch(()=>void 0)},downloadName:X,downloadSrc:je,fullscreenAvailable:G,isFullscreen:K,onClose:()=>De(!1),onRemove:r,onReplace:i,onRotationChange:e=>le({key:w,value:e}),onZoomChange:e=>se({key:w,value:e}),rotateAccessibleLabelId:f,rotation:E,viewerRef:_,zoom:T}),q&&Ie>1?(0,j.jsx)(Te,{currentPage:ke,onNextPage:()=>fe({key:w,value:D+1}),onPreviousPage:()=>fe({key:w,value:D-1}),pageCount:Ie}):null,(0,j.jsx)(we,{assetFailed:Pe,assetKey:P,canvasRef:ee,effectiveOpen:C,fitFrameToStage:Z,fitImageToStage:Q,imageRef:ne,isPdfCanvas:q,mediaBoxStyle:J,mediaContentStyle:Y,mediaSize:V,mediaType:F,onAssetStateChange:R,painted:Fe,pdfFallback:U,pdfSession:W,setStageRef:y,src:je,textLayerRef:te,title:Me})]})})}var A,Ee,j,M,N,De=t((()=>{A=e(a(),1),Ee=e(l(),1),x(),s(),m(),f(),S(),u(),se(),j=c(),M={base:{mediaBox:`breeze:relative breeze:flex-none`,mediaContent:`breeze-document-viewer-media-content`,pageStatus:`breeze:min-inline-size-[6rem] breeze:text-center breeze:text-breeze-sm breeze:tabular-nums breeze:text-breeze-ink-2`,pageToolbar:`breeze:flex breeze:items-center breeze:justify-center breeze:gap-breeze-2 breeze:border-breeze-line breeze:border-b breeze:bg-breeze-canvas breeze:px-breeze-3 breeze:py-breeze-2`,pdfPage:`breeze-pdf-page breeze:relative breeze:overflow-hidden breeze:bg-white breeze:shadow-overlay`,root:`breeze:flex breeze:block-size-full breeze:inline-size-full breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-col breeze:bg-breeze-canvas`,skeletonLayer:`breeze:absolute breeze:inset-0 breeze:flex breeze:items-center breeze:justify-center`,stage:`breeze-document-viewer-stage breeze:relative breeze:flex breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-1 breeze:overflow-auto breeze:rounded-breeze-sm breeze:bg-breeze-sunken breeze:p-breeze-4`,stageContent:`breeze-document-viewer-stage-content breeze:flex breeze:min-block-size-full breeze:min-inline-size-full`,textLayer:`breeze-pdf-text-layer`,toolbar:`breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-[6px] breeze:border-breeze-line breeze:border-b breeze:bg-breeze-raised breeze:px-breeze-3 breeze:py-breeze-2`,toolbarLink:`breeze:inline-flex breeze:min-block-breeze-sm breeze:items-center breeze:justify-center breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:px-breeze-3 breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:no-underline breeze:hover:bg-breeze-sunken breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap`,toolbarSection:`breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-[6px]`,toolbarTitle:`breeze:grow breeze:min-inline-size-0 breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink-2 breeze:max-breeze-md:basis-full breeze:max-breeze-md:grow-0 breeze:max-breeze-md:shrink-0`,viewer:`breeze:relative breeze:flex breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col breeze:overflow-hidden`,viewerFrame:`breeze:block breeze:block-size-full breeze:min-block-size-0 breeze:inline-size-full breeze:border-0 breeze:bg-breeze-surface`,viewerImage:`breeze:block breeze:object-contain`,viewerNotice:`breeze:m-0 breeze:text-breeze-xs breeze:leading-breeze-snug breeze:text-breeze-ink-3`,zoomStatus:`breeze:min-inline-size-[3rem] breeze:text-center breeze:text-breeze-xs breeze:tabular-nums breeze:text-breeze-ink-2`},compound:{},size:{},state:{painted:{hidden:`breeze:invisible breeze:absolute breeze:inset-0`,visible:`breeze:visible`}},variant:{}},N=new WeakMap;try{k.displayName=`DocumentViewer`,k.__docgenInfo={description:`Opens an image or document in a full-screen viewer with its own toolbar.`,displayName:`DocumentViewer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,methods:[],props:{downloadName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Name used for the download and the labelled viewer dialog.`,name:`downloadName`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`string | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Current open state controlled by the owning application.`,name:`open`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`boolean`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Reports state changes requested by the viewer's actions.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`(open: boolean) => void`}},onReplace:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Called when the app-owned Replace toolbar action is activated.`,name:`onReplace`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},onRemove:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Called when the app-owned Remove toolbar action is activated.`,name:`onRemove`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},src:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`URL of the source image or document.`,name:`src`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`string`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Visible title and accessible name for the viewer dialog.`,name:`title`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`string`}},transitionName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Name shared with the AttachmentRow that opens this viewer.`,name:`transitionName`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`string | undefined`}},mediaType:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`}],description:``,name:`mediaType`,required:!0,tags:{},type:{name:`"document" | "image" | "pdf"`}},pdfAssets:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`}],description:`Optional worker and auxiliary assets used to render the PDF.`,name:`pdfAssets`,required:!1,tags:{},type:{name:`DocumentViewerPdfAssets | undefined`}}},tags:{summary:`A modal attachment preview with lazy PDF rendering.`}}}catch{}})),P=n({FromAttachmentRow:()=>Y,FromAttachmentRowDocs:()=>X,Image:()=>Z,ImageDocs:()=>Q,PdfPageMetadata:()=>J,PdfWorker:()=>K,PdfWorkerDocs:()=>q,SandboxedActiveDocument:()=>$,__namedExportsOrder:()=>Re,default:()=>W});function Oe(e=``){let t=[`<< /Type /Catalog /Pages 2 0 R >>`,`<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>`,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R ${e} >>`,`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,`<< /Length 62 >>
stream
BT /F1 22 Tf 72 700 Td (PDF.js worker rendered page one) Tj ET
endstream`,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 7 0 R >>`,`<< /Length 62 >>
stream
BT /F1 22 Tf 72 700 Td (PDF.js worker rendered page two) Tj ET
endstream`],n=`%PDF-1.7
`,r=[0];t.forEach((e,t)=>{r.push(n.length),n+=`${t+1} 0 obj\n${e}\nendobj\n`});let i=n.length;return n+=`xref\n0 ${t.length+1}\n0000000000 65535 f \n`,r.slice(1).forEach(e=>{n+=`${String(e).padStart(10,`0`)} 00000 n \n`}),n+=`trailer\n<< /Size ${t.length+1} /Root 1 0 R >>\nstartxref\n${i}\n%%EOF`,`data:application/pdf;base64,${btoa(n)}`}async function F(e,t,n=`Workshop invoice`){await V(async()=>{let r=H(e).getByRole(`region`,{name:n});await z(r).toHaveAttribute(`aria-busy`,`false`),await z(r.querySelector(`.breeze-pdf-text-layer`)?.textContent).toContain(t);let i=r.querySelector(`.breeze-pdf-page`),a=r.querySelector(`canvas`);if(await z(i?.getBoundingClientRect().width).toBeGreaterThan(0),await z(i?.getBoundingClientRect().height).toBeGreaterThan(0),await z(a?.width).toBeGreaterThan(0),await z(a?.height).toBeGreaterThan(0),!a)throw Error(`The rendered PDF canvas was not found.`);let o=a.getContext(`2d`)?.getImageData(0,0,a.width,a.height).data;await z(o).toBeDefined();let s=Array.from(o??[]).some((e,t,n)=>t%4==0&&e<96&&(n[t+3]??0)>0);await z(s).toBe(!0)},{timeout:G})}function ke({mediaType:e,src:t,title:n}){let[r,i]=(0,L.useState)(!1);return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(p,{onAction:()=>i(!0),children:`Open ${n}`}),(0,R.jsx)(k,{mediaType:e,onOpenChange:i,open:r,src:t,title:n})]})}function I({mediaType:e,src:t,title:n}){return(0,R.jsx)(ke,{mediaType:e,src:t,title:n})}function Ae(e){return e.slice(1).map((t,n)=>{let r=e[n];if(!r)return 0;let i=r.getBoundingClientRect(),a=t.getBoundingClientRect();return a.top<i.bottom&&a.bottom>i.top?a.left-i.right:a.top-i.bottom})}function je(){let[e,t]=(0,L.useState)(``),[n,r]=(0,L.useState)(!1),i=`workshop-invoice-preview`,a=e=>{t(t=>t?`${t}, ${e}`:e)};return(0,R.jsxs)(_,{title:`Account record`,trigger:`Open account record`,children:[(0,R.jsx)(ne,{fileType:`document`,filename:`workshop-invoice.pdf`,onOpen:()=>r(!0),sizeBytes:91e3,status:`Uploaded`,transitionName:i}),e?(0,R.jsx)(`p`,{role:`status`,children:e}):null,(0,R.jsx)(k,{downloadName:`workshop-invoice.pdf`,mediaType:`pdf`,onRemove:()=>a(`Remove selected`),onOpenChange:r,onReplace:()=>a(`Replace selected`),open:n,src:Pe,title:`Workshop invoice`,transitionName:i})]})}function Me(){return(0,R.jsx)(je,{})}function Ne(){let[e,t]=(0,L.useState)(!1),[n,r]=(0,L.useState)(null);return(0,L.useEffect)(()=>{let e=URL.createObjectURL(new Blob([`<!doctype html><script>parent.postMessage('${Le}', '*')<\/script><svg xmlns="http://www.w3.org/2000/svg" onload="parent.postMessage('${Le}', '*')"></svg>`],{type:`text/html`}));return r(e),()=>URL.revokeObjectURL(e)},[]),(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(p,{disabled:!n,onAction:()=>t(!0),children:`Open sandboxed document`}),n?(0,R.jsx)(k,{mediaType:`document`,onOpenChange:t,open:e,src:n,title:`Sandboxed document`}):null]})}var L,R,z,B,V,H,Pe,Fe,U,Ie,W,G,K,q,J,Y,X,Z,Q,Le,$,Re,ze=t((()=>{L=e(a(),1),f(),g(),te(),De(),R=c(),r(),{expect:z,userEvent:B,waitFor:V,within:H}=__STORYBOOK_MODULE_TEST__,Pe=Oe(),Fe=Oe(`/Rotate 90 /UserUnit 2`),U={mediaType:`pdf`,src:Pe,title:`Workshop invoice`},Ie={mediaType:`image`,src:`data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22320%22 viewBox=%220 0 480 320%22%3E%3Crect width=%22480%22 height=%22320%22 fill=%22%23dcebe6%22/%3E%3Cpath d=%22M0 260 145 110l115 120 75-90 145 150v30H0z%22 fill=%22%23699586%22/%3E%3C/svg%3E`,title:`Workshop entrance`},W={argTypes:{onOpenChange:{control:!1},open:{control:!1}},args:{onOpenChange:()=>void 0,open:!1},component:k,parameters:{docs:{story:{autoplay:!1,height:`600px`,inline:!1}}},title:`Files/DocumentViewer`},G=15e3,K={args:U,play:async()=>{await B.click(H(document.body).getByRole(`button`,{name:`Open Workshop invoice`}));let e=H(document.body).getByRole(`dialog`,{name:`Workshop invoice`});await V(async()=>z(H(e).getByText(`Page 1 of 2`)).toBeVisible(),{timeout:G}),await F(e,`page one`);let t=H(e).getByRole(`region`,{name:`Workshop invoice`}),n=t.querySelector(`.breeze-pdf-page`);if(!n)throw Error(`The rendered PDF page was not found.`);let r=n.getBoundingClientRect(),i=t.getBoundingClientRect();await z(r.width).toBeLessThan(i.width),await z(r.left+r.width/2).toBeCloseTo(i.left+i.width/2,0),await B.click(H(e).getByRole(`button`,{name:`Next page`})),await V(async()=>z(H(e).getByText(`Page 2 of 2`)).toBeVisible(),{timeout:G}),await F(e,`page two`);let a=t.querySelector(`.breeze-pdf-text-layer span`);if(await z(a).not.toBeNull(),!a)throw Error(`The PDF text layer did not create a span.`);await z(getComputedStyle(a).position).toBe(`absolute`),await z(getComputedStyle(a).fontSize).not.toBe(`0px`);let o=H(e).getByRole(`button`,{name:`Zoom in`});await Array.from({length:8}).reduce(e=>e.then(()=>B.click(o)),Promise.resolve()),await B.click(H(e).getByRole(`button`,{name:`Rotate clockwise`}));let s=t.querySelector(`.breeze-pdf-page`);if(!s)throw Error(`The rendered PDF page was not found.`);let c=t.getBoundingClientRect();await V(async()=>{await z(t.scrollWidth).toBeGreaterThan(t.clientWidth),await z(t.scrollHeight).toBeGreaterThan(t.clientHeight)}),t.scrollTo({left:0,top:0}),await V(async()=>{let e=s.getBoundingClientRect();await z(e.left).toBeGreaterThanOrEqual(c.left-1),await z(e.top).toBeGreaterThanOrEqual(c.top-1)}),t.scrollTo({left:t.scrollWidth,top:t.scrollHeight}),await V(async()=>{let e=s.getBoundingClientRect();await z(e.right).toBeLessThanOrEqual(c.right+1),await z(e.bottom).toBeLessThanOrEqual(c.bottom+1)})},render:I},q={args:U,render:I},J={args:{mediaType:`pdf`,src:Fe,title:`Rotated PDF page`},play:async()=>{if(`__vitest_browser__`in globalThis){let{page:e}=await i(async()=>{let{page:e}=await import(`./context-BA1lSQW8.js`);return{page:e}},__vite__mapDeps([4,1]),import.meta.url);await e.viewport(1280,1e3)}await B.click(H(document.body).getByRole(`button`,{name:`Open Rotated PDF page`}));let e=H(document.body).getByRole(`dialog`,{name:`Rotated PDF page`});await V(async()=>z(H(e).getByText(`Page 1 of 2`)).toBeVisible(),{timeout:G}),await F(e,`page one`,`Rotated PDF page`);let t=H(e).getByRole(`region`,{name:`Rotated PDF page`}),n=t.querySelector(`.breeze-pdf-page`),r=t.querySelector(`canvas`),a=t.querySelector(`.breeze-pdf-text-layer`),o=a?.querySelector(`span`);if(!n||!r||!a||!o)throw Error(`The rotated PDF page layers were not rendered.`);await z(n.style.getPropertyValue(`--scale-factor`)).toBe(`1`),await z(n.style.getPropertyValue(`--user-unit`)).toBe(`2`),await z(a.dataset.mainRotation).toBe(`90`),await z(r.width/r.height).toBeCloseTo(792/612,2),await z(getComputedStyle(a).transform).toContain(`matrix`),o.scrollIntoView({block:`center`,inline:`center`});let s=document.createRange();s.selectNodeContents(o);let c=s.getBoundingClientRect(),l=r.getBoundingClientRect(),u=r.getContext(`2d`)?.getImageData(0,0,r.width,r.height).data;if(!u)throw Error(`The rendered PDF pixels were unavailable.`);let d=r.width,f=r.height,p=-1,m=-1;for(let e=0;e<r.height;e+=1)for(let t=0;t<r.width;t+=1){let n=(e*r.width+t)*4;(u[n]??255)<96&&(u[n+1]??255)<96&&(u[n+2]??255)<96&&(u[n+3]??0)>0&&(d=Math.min(d,t),f=Math.min(f,e),p=Math.max(p,t),m=Math.max(m,e))}let h=l.left+(d+p+1)/2*(l.width/r.width),g=l.top+(f+m+1)/2*(l.height/r.height);await z(Math.abs(h-(c.left+c.width/2))).toBeLessThan(12),await z(Math.abs(g-(c.top+c.height/2))).toBeLessThan(12)},render:I},Y={args:U,play:async()=>{if(!(`__vitest_browser__`in globalThis))return;let{page:e}=await i(async()=>{let{page:e}=await import(`./context-BA1lSQW8.js`);return{page:e}},__vite__mapDeps([4,1]),import.meta.url),t=document.defaultView;if(!(typeof document.startViewTransition==`function`&&typeof t?.ViewTransition==`function`&&typeof t.CSS?.supports==`function`&&[`expand`,`mode`].every(e=>t.CSS.supports(`selector(:active-view-transition-type(${e}))`))))return;await e.viewport(1280,800);let n=`workshop-invoice-preview`,r=Object.getOwnPropertyDescriptor(document,`startViewTransition`),a=[],o=document.startViewTransition.bind(document),s=()=>Array.from(document.querySelectorAll(`[data-breeze-transition-name]`)).map(e=>({name:getComputedStyle(e).viewTransitionName,viewer:e.querySelector(`[aria-label="Zoom in"]`)!==null})).filter(({name:e})=>e!==`none`&&e!==``);try{Object.defineProperty(document,"startViewTransition",{configurable:!0,value:e=>{let t=e.update,n={next:[],old:[],transition:null,types:Array.from(e.types??[])};return n.transition=o({...e,update:async()=>{n.old=s(),await t?.(),n.next=s()}}),n.transition.ready.then(()=>{n.rootAnimations=[getComputedStyle(document.documentElement,`::view-transition-old(root)`).animationName,getComputedStyle(document.documentElement,`::view-transition-new(root)`).animationName]},()=>void 0),a.push(n),n.transition}}),await B.click(H(document.body).getByRole(`button`,{name:`Open account record`}));let t=await H(document.body).findByRole(`dialog`,{name:`Account record`});await B.click(H(t).getByRole(`button`,{name:`Open: workshop-invoice.pdf`}));let r=await H(document.body).findByRole(`dialog`,{name:`Workshop invoice`});await V(async()=>z(H(r).getByText(`Page 1 of 2`)).toBeVisible(),{timeout:G}),await F(r,`page one`);let i=a.find(({types:e})=>e.includes(`expand`));if(!i)throw Error(`The row-to-viewer transition did not start.`);await i.transition.ready,await i.transition.updateCallbackDone,await z(i.old).toEqual([{name:n,viewer:!1}]),await z(i.next).toEqual([{name:n,viewer:!0}]),await i.transition.finished;let c=a.find(({types:e})=>e.includes(`mode`));if(!c)throw Error(`The viewer mode transition did not start.`);await c.transition.ready,await z(c.rootAnimations).toEqual([`none`,`none`]),await c.transition.finished;let l=Array.from(document.querySelectorAll(`[data-breeze-transition-name="${n}"]`)).find(e=>e.querySelector(`[aria-label="Zoom in"]`)),u=l?.firstElementChild;if(!l||!u)throw Error(`The document toolbar is missing.`);let d=u.children[1];if(!d)throw Error(`The document toolbar actions are missing.`);let f=Array.from(d.children),p=f.at(-1),m=p?.querySelector(`button`);if(!p||!m)throw Error(`The localized Close button wrapper is missing.`);let h=l.getBoundingClientRect();await z(h.left).toBe(0),await z(h.top).toBe(0),await z(h.width).toBe(window.innerWidth),await z(h.height).toBe(window.innerHeight),await z(u.getBoundingClientRect().width).toBeGreaterThan(0),await z(r.querySelector(`.breeze-overlay-header`)).toBeNull(),await z(H(r).getByRole(`button`,{name:`Rotate clockwise`})).toHaveTextContent(`Rotate`),await z(H(r).getByRole(`button`,{name:`Replace`})).toBeVisible(),await z(H(r).getByRole(`button`,{name:`Remove`})).toBeVisible(),await z(getComputedStyle(d).columnGap).toBe(`6px`),await z(getComputedStyle(d).rowGap).toBe(`6px`),await z(Ae(f)).toEqual(f.slice(1).map(()=>6)),await z(p.getBoundingClientRect().width).toBe(m.getBoundingClientRect().width);let g=await e.screenshot({path:`/tmp/document-viewer-desktop.png`});await z(g.length).toBeGreaterThan(0),await B.click(H(r).getByRole(`button`,{name:`Replace`})),await B.click(H(r).getByRole(`button`,{name:`Remove`})),await e.viewport(390,844);let _=u.querySelector(`[title="workshop-invoice.pdf"]`),v=u.querySelector(`[aria-label="Zoom out"]`);if(!_||!v)throw Error(`The compact toolbar is missing its filename or controls.`);await V(async()=>{await z(getComputedStyle(_).flexBasis).toBe(`100%`),await z(getComputedStyle(d).columnGap).toBe(`6px`),await z(getComputedStyle(d).rowGap).toBe(`6px`),await z(Ae(f)).toEqual(f.slice(1).map(()=>6)),await z(_.getBoundingClientRect().width).toBeGreaterThan(0),await z(v.getBoundingClientRect().top).toBeGreaterThan(_.getBoundingClientRect().top),await z(v.getBoundingClientRect().height).toBeGreaterThanOrEqual(34)});let y=await e.screenshot({path:`/tmp/document-viewer-phone.png`});await z(y.length).toBeGreaterThan(0),await B.click(H(r).getByRole(`button`,{name:`Close`}));let b=a.filter(({types:e})=>e.includes(`expand`))[1];if(!b)throw Error(`The viewer-to-row transition did not start.`);await b.transition.ready,await b.transition.updateCallbackDone,await z(b.old).toEqual([{name:n,viewer:!0}]),await z(b.next).toEqual([{name:n,viewer:!1}]),await V(async()=>z(H(document.body).getByRole(`button`,{name:`Open: workshop-invoice.pdf`})).toHaveFocus()),await b.transition.finished,await z(H(document.body).getByText(`Replace selected, Remove selected`)).toBeVisible()}finally{r?Object.defineProperty(document,"startViewTransition",r):Reflect.deleteProperty(document,`startViewTransition`),await e.viewport(1280,800)}},render:Me},X={args:U,render:Me},Z={args:Ie,play:async()=>{await B.click(H(document.body).getByRole(`button`,{name:`Open Workshop entrance`}));let e=await H(document.body).findByRole(`dialog`,{name:`Workshop entrance`});await V(async()=>{await z(H(e).getByRole(`region`,{name:`Workshop entrance`})).toHaveAttribute(`aria-busy`,`false`)})},render:I},Q={args:Ie,render:I},Le=`document-viewer-frame-executed`,$={args:{mediaType:`document`,src:`/attachments/untrusted-document.html`,title:`Sandboxed document`},play:async()=>{if(!(`__vitest_browser__`in globalThis))return;let{page:e}=await i(async()=>{let{page:e}=await import(`./context-BA1lSQW8.js`);return{page:e}},__vite__mapDeps([4,1]),import.meta.url);await e.viewport(1280,800);let t=[],n=e=>{e.data===Le&&t.push(Le)};window.addEventListener(`message`,n);try{await B.click(H(document.body).getByRole(`button`,{name:`Open sandboxed document`}));let e=await H(document.body).findByRole(`dialog`,{name:`Sandboxed document`}),n=await V(()=>{let t=e.querySelector(`iframe`);if(!t)throw Error(`The sandboxed HTML frame was missing.`);return t});await z(n).toHaveAttribute(`sandbox`,`allow-downloads`);let r=await H(e).findByRole(`region`,{name:`Sandboxed document`});await V(()=>z(r).toHaveAttribute(`aria-busy`,`false`)),await new Promise(e=>{window.setTimeout(e,100)}),await z(t).toEqual([]),await B.click(H(e).getByRole(`button`,{name:`Close`})),await V(()=>z(H(document.body).queryByRole(`dialog`,{name:`Sandboxed document`})).toBeNull())}finally{window.removeEventListener(`message`,n)}},render:()=>(0,R.jsx)(Ne,{})},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: pdfWorkerArgs,
  play: async () => {
    await userEvent.click(within(document.body).getByRole('button', {
      name: 'Open Workshop invoice'
    }));
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Workshop invoice'
    });
    await waitFor(async () => expect(within(dialog).getByText('Page 1 of 2')).toBeVisible(), {
      timeout: pdfRenderWaitTimeout
    });
    await expectPaintedPdfPage(dialog, 'page one');
    const stage = within(dialog).getByRole('region', {
      name: 'Workshop invoice'
    });
    const initialPage = stage.querySelector('.breeze-pdf-page');
    if (!initialPage) throw new Error('The rendered PDF page was not found.');
    const initialPageBounds = initialPage.getBoundingClientRect();
    const initialStageBounds = stage.getBoundingClientRect();
    await expect(initialPageBounds.width).toBeLessThan(initialStageBounds.width);
    await expect(initialPageBounds.left + initialPageBounds.width / 2).toBeCloseTo(initialStageBounds.left + initialStageBounds.width / 2, 0);
    await userEvent.click(within(dialog).getByRole('button', {
      name: 'Next page'
    }));
    await waitFor(async () => expect(within(dialog).getByText('Page 2 of 2')).toBeVisible(), {
      timeout: pdfRenderWaitTimeout
    });
    await expectPaintedPdfPage(dialog, 'page two');
    const text = stage.querySelector('.breeze-pdf-text-layer span');
    await expect(text).not.toBeNull();
    if (!text) throw new Error('The PDF text layer did not create a span.');
    await expect(getComputedStyle(text).position).toBe('absolute');
    await expect(getComputedStyle(text).fontSize).not.toBe('0px');
    const zoomIn = within(dialog).getByRole('button', {
      name: 'Zoom in'
    });
    await Array.from({
      length: 8
    }).reduce<Promise<void>>(clicks => clicks.then(() => userEvent.click(zoomIn)), Promise.resolve());
    await userEvent.click(within(dialog).getByRole('button', {
      name: 'Rotate clockwise'
    }));
    const page = stage.querySelector('.breeze-pdf-page');
    if (!page) throw new Error('The rendered PDF page was not found.');
    const stageBounds = stage.getBoundingClientRect();
    await waitFor(async () => {
      await expect(stage.scrollWidth).toBeGreaterThan(stage.clientWidth);
      await expect(stage.scrollHeight).toBeGreaterThan(stage.clientHeight);
    });
    stage.scrollTo({
      left: 0,
      top: 0
    });
    await waitFor(async () => {
      const bounds = page.getBoundingClientRect();
      await expect(bounds.left).toBeGreaterThanOrEqual(stageBounds.left - 1);
      await expect(bounds.top).toBeGreaterThanOrEqual(stageBounds.top - 1);
    });
    stage.scrollTo({
      left: stage.scrollWidth,
      top: stage.scrollHeight
    });
    await waitFor(async () => {
      const bounds = page.getBoundingClientRect();
      await expect(bounds.right).toBeLessThanOrEqual(stageBounds.right + 1);
      await expect(bounds.bottom).toBeLessThanOrEqual(stageBounds.bottom + 1);
    });
  },
  render: renderDocumentViewerStoryExample
}`,...K.parameters?.docs?.source},description:{story:`A two-page PDF rendered by the optional, lazy PDF.js engine and worker.`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: pdfWorkerArgs,
  render: renderDocumentViewerStoryExample
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    mediaType: 'pdf',
    src: rotatedUserUnitPdfDataUrl,
    title: 'Rotated PDF page'
  },
  play: async () => {
    if ('__vitest_browser__' in globalThis) {
      const {
        page
      } = await import('vitest/browser');
      await page.viewport(1280, 1000);
    }
    await userEvent.click(within(document.body).getByRole('button', {
      name: 'Open Rotated PDF page'
    }));
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Rotated PDF page'
    });
    await waitFor(async () => expect(within(dialog).getByText('Page 1 of 2')).toBeVisible(), {
      timeout: pdfRenderWaitTimeout
    });
    await expectPaintedPdfPage(dialog, 'page one', 'Rotated PDF page');
    const stage = within(dialog).getByRole('region', {
      name: 'Rotated PDF page'
    });
    const pdfPage = stage.querySelector<HTMLDivElement>('.breeze-pdf-page');
    const canvas = stage.querySelector<HTMLCanvasElement>('canvas');
    const textLayer = stage.querySelector<HTMLDivElement>('.breeze-pdf-text-layer');
    const textSpan = textLayer?.querySelector<HTMLSpanElement>('span');
    if (!pdfPage || !canvas || !textLayer || !textSpan) {
      throw new Error('The rotated PDF page layers were not rendered.');
    }
    await expect(pdfPage.style.getPropertyValue('--scale-factor')).toBe('1');
    await expect(pdfPage.style.getPropertyValue('--user-unit')).toBe('2');
    await expect(textLayer.dataset.mainRotation).toBe('90');
    await expect(canvas.width / canvas.height).toBeCloseTo(792 / 612, 2);
    await expect(getComputedStyle(textLayer).transform).toContain('matrix');
    textSpan.scrollIntoView({
      block: 'center',
      inline: 'center'
    });
    const selection = document.createRange();
    selection.selectNodeContents(textSpan);
    const selectionBounds = selection.getBoundingClientRect();
    const canvasBounds = canvas.getBoundingClientRect();
    const pixels = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
    if (!pixels) throw new Error('The rendered PDF pixels were unavailable.');
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const offset = (y * canvas.width + x) * 4;
        if ((pixels[offset] ?? 255) < 96 && (pixels[offset + 1] ?? 255) < 96 && (pixels[offset + 2] ?? 255) < 96 && (pixels[offset + 3] ?? 0) > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    const inkCenterX = canvasBounds.left + (minX + maxX + 1) / 2 * (canvasBounds.width / canvas.width);
    const inkCenterY = canvasBounds.top + (minY + maxY + 1) / 2 * (canvasBounds.height / canvas.height);
    await expect(Math.abs(inkCenterX - (selectionBounds.left + selectionBounds.width / 2))).toBeLessThan(12);
    await expect(Math.abs(inkCenterY - (selectionBounds.top + selectionBounds.height / 2))).toBeLessThan(12);
  },
  render: renderDocumentViewerStoryExample
}`,...J.parameters?.docs?.source},description:{story:`Verifies that intrinsic page rotation and PDF user units align text with its canvas.`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: pdfWorkerArgs,
  play: async () => {
    if (!('__vitest_browser__' in globalThis)) return;
    const {
      page
    } = await import('vitest/browser');
    const view = document.defaultView;
    const supportsTransitions = typeof document.startViewTransition === 'function' && typeof view?.ViewTransition === 'function' && typeof view.CSS?.supports === 'function' && ['expand', 'mode'].every(type => view.CSS.supports(\`selector(:active-view-transition-type(\${type}))\`));
    if (!supportsTransitions) return;
    await page.viewport(1280, 800);
    const transitionName = 'workshop-invoice-preview';
    const startViewTransitionDescriptor = Object.getOwnPropertyDescriptor(document, 'startViewTransition');
    const records: {
      next: {
        name: string;
        viewer: boolean;
      }[];
      old: {
        name: string;
        viewer: boolean;
      }[];
      rootAnimations?: string[];
      transition: ViewTransition;
      types: string[];
    }[] = [];
    const nativeStartViewTransition = document.startViewTransition.bind(document);
    const collectParticipants = () => Array.from(document.querySelectorAll<HTMLElement>('[data-breeze-transition-name]')).map(element => ({
      name: getComputedStyle(element).viewTransitionName,
      viewer: element.querySelector('[aria-label="Zoom in"]') !== null
    })).filter(({
      name
    }) => name !== 'none' && name !== '');
    try {
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: (options: StartViewTransitionOptions) => {
          const update = options.update as (() => void | Promise<void>) | undefined;
          const record: (typeof records)[number] = {
            next: [] as {
              name: string;
              viewer: boolean;
            }[],
            old: [] as {
              name: string;
              viewer: boolean;
            }[],
            transition: null as unknown as ViewTransition,
            types: Array.from(options.types ?? [])
          };
          record.transition = nativeStartViewTransition({
            ...options,
            update: async () => {
              record.old = collectParticipants();
              await update?.();
              record.next = collectParticipants();
            }
          });
          record.transition.ready.then(() => {
            record.rootAnimations = [getComputedStyle(document.documentElement, '::view-transition-old(root)').animationName, getComputedStyle(document.documentElement, '::view-transition-new(root)').animationName];
          }, () => undefined);
          records.push(record);
          return record.transition;
        }
      });
      await userEvent.click(within(document.body).getByRole('button', {
        name: 'Open account record'
      }));
      const recordDialog = await within(document.body).findByRole('dialog', {
        name: 'Account record'
      });
      await userEvent.click(within(recordDialog).getByRole('button', {
        name: 'Open: workshop-invoice.pdf'
      }));
      const dialog = await within(document.body).findByRole('dialog', {
        name: 'Workshop invoice'
      });
      await waitFor(async () => expect(within(dialog).getByText('Page 1 of 2')).toBeVisible(), {
        timeout: pdfRenderWaitTimeout
      });
      await expectPaintedPdfPage(dialog, 'page one');
      const openTransition = records.find(({
        types
      }) => types.includes('expand'));
      if (!openTransition) throw new Error('The row-to-viewer transition did not start.');
      await openTransition.transition.ready;
      await openTransition.transition.updateCallbackDone;
      await expect(openTransition.old).toEqual([{
        name: transitionName,
        viewer: false
      }]);
      await expect(openTransition.next).toEqual([{
        name: transitionName,
        viewer: true
      }]);
      await openTransition.transition.finished;
      const modeTransition = records.find(({
        types
      }) => types.includes('mode'));
      if (!modeTransition) throw new Error('The viewer mode transition did not start.');
      await modeTransition.transition.ready;
      await expect(modeTransition.rootAnimations).toEqual(['none', 'none']);
      await modeTransition.transition.finished;
      const panel = Array.from(document.querySelectorAll<HTMLElement>(\`[data-breeze-transition-name="\${transitionName}"]\`)).find(element => element.querySelector('[aria-label="Zoom in"]'));
      const toolbar = panel?.firstElementChild as HTMLElement | null;
      if (!panel || !toolbar) throw new Error('The document toolbar is missing.');
      const toolbarActions = toolbar.children[1] as HTMLElement | undefined;
      if (!toolbarActions) throw new Error('The document toolbar actions are missing.');
      const actionItems = Array.from(toolbarActions.children) as HTMLElement[];
      const closeWrapper = actionItems.at(-1);
      const closeButton = closeWrapper?.querySelector('button');
      if (!closeWrapper || !closeButton) throw new Error('The localized Close button wrapper is missing.');
      const panelBounds = panel.getBoundingClientRect();
      await expect(panelBounds.left).toBe(0);
      await expect(panelBounds.top).toBe(0);
      await expect(panelBounds.width).toBe(window.innerWidth);
      await expect(panelBounds.height).toBe(window.innerHeight);
      await expect(toolbar.getBoundingClientRect().width).toBeGreaterThan(0);
      await expect(dialog.querySelector('.breeze-overlay-header')).toBeNull();
      await expect(within(dialog).getByRole('button', {
        name: 'Rotate clockwise'
      })).toHaveTextContent('Rotate');
      await expect(within(dialog).getByRole('button', {
        name: 'Replace'
      })).toBeVisible();
      await expect(within(dialog).getByRole('button', {
        name: 'Remove'
      })).toBeVisible();
      await expect(getComputedStyle(toolbarActions).columnGap).toBe('6px');
      await expect(getComputedStyle(toolbarActions).rowGap).toBe('6px');
      await expect(getFlexItemGaps(actionItems)).toEqual(actionItems.slice(1).map(() => 6));
      await expect(closeWrapper.getBoundingClientRect().width).toBe(closeButton.getBoundingClientRect().width);
      const desktopShot = await page.screenshot({
        path: '/tmp/document-viewer-desktop.png'
      });
      await expect(desktopShot.length).toBeGreaterThan(0);
      await userEvent.click(within(dialog).getByRole('button', {
        name: 'Replace'
      }));
      await userEvent.click(within(dialog).getByRole('button', {
        name: 'Remove'
      }));
      await page.viewport(390, 844);
      const filename = toolbar.querySelector<HTMLElement>('[title="workshop-invoice.pdf"]');
      const zoomOut = toolbar.querySelector<HTMLButtonElement>('[aria-label="Zoom out"]');
      if (!filename || !zoomOut) {
        throw new Error('The compact toolbar is missing its filename or controls.');
      }
      await waitFor(async () => {
        await expect(getComputedStyle(filename).flexBasis).toBe('100%');
        await expect(getComputedStyle(toolbarActions).columnGap).toBe('6px');
        await expect(getComputedStyle(toolbarActions).rowGap).toBe('6px');
        await expect(getFlexItemGaps(actionItems)).toEqual(actionItems.slice(1).map(() => 6));
        await expect(filename.getBoundingClientRect().width).toBeGreaterThan(0);
        await expect(zoomOut.getBoundingClientRect().top).toBeGreaterThan(filename.getBoundingClientRect().top);
        await expect(zoomOut.getBoundingClientRect().height).toBeGreaterThanOrEqual(34);
      });
      const phoneShot = await page.screenshot({
        path: '/tmp/document-viewer-phone.png'
      });
      await expect(phoneShot.length).toBeGreaterThan(0);
      await userEvent.click(within(dialog).getByRole('button', {
        name: 'Close'
      }));
      const closeTransition = records.filter(({
        types
      }) => types.includes('expand'))[1];
      if (!closeTransition) throw new Error('The viewer-to-row transition did not start.');
      await closeTransition.transition.ready;
      await closeTransition.transition.updateCallbackDone;
      await expect(closeTransition.old).toEqual([{
        name: transitionName,
        viewer: true
      }]);
      await expect(closeTransition.next).toEqual([{
        name: transitionName,
        viewer: false
      }]);
      await waitFor(async () => expect(within(document.body).getByRole('button', {
        name: 'Open: workshop-invoice.pdf'
      })).toHaveFocus());
      await closeTransition.transition.finished;
      await expect(within(document.body).getByText('Replace selected, Remove selected')).toBeVisible();
    } finally {
      if (startViewTransitionDescriptor) {
        Object.defineProperty(document, 'startViewTransition', startViewTransitionDescriptor);
      } else {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
      await page.viewport(1280, 800);
    }
  },
  render: renderAttachmentMorphExample
}`,...Y.parameters?.docs?.source},description:{story:`Opens from its matching attachment row and morphs into the reader.`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: pdfWorkerArgs,
  render: renderAttachmentMorphExample
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: imageArgs,
  play: async () => {
    await userEvent.click(within(document.body).getByRole('button', {
      name: 'Open Workshop entrance'
    }));
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Workshop entrance'
    });
    await waitFor(async () => {
      await expect(within(dialog).getByRole('region', {
        name: 'Workshop entrance'
      })).toHaveAttribute('aria-busy', 'false');
    });
  },
  render: renderDocumentViewerStoryExample
}`,...Z.parameters?.docs?.source},description:{story:`A photograph uses the same toolbar without loading the PDF engine.`,...Z.parameters?.docs?.description}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: imageArgs,
  render: renderDocumentViewerStoryExample
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    mediaType: 'document',
    src: '/attachments/untrusted-document.html',
    title: 'Sandboxed document'
  },
  play: async () => {
    if (!('__vitest_browser__' in globalThis)) return;
    const {
      page
    } = await import('vitest/browser');
    await page.viewport(1280, 800);
    const executedMessages: string[] = [];
    const onMessage = (event: MessageEvent) => {
      if (event.data === documentFrameMessage) {
        executedMessages.push(documentFrameMessage);
      }
    };
    window.addEventListener('message', onMessage);
    try {
      await userEvent.click(within(document.body).getByRole('button', {
        name: 'Open sandboxed document'
      }));
      const dialog = await within(document.body).findByRole('dialog', {
        name: 'Sandboxed document'
      });
      const htmlFrame = await waitFor(() => {
        const frame = dialog.querySelector('iframe');
        if (!frame) throw new Error('The sandboxed HTML frame was missing.');
        return frame;
      });
      await expect(htmlFrame).toHaveAttribute('sandbox', 'allow-downloads');
      const stage = await within(dialog).findByRole('region', {
        name: 'Sandboxed document'
      });
      await waitFor(() => expect(stage).toHaveAttribute('aria-busy', 'false'));
      await new Promise<void>(resolve => {
        window.setTimeout(resolve, 100);
      });
      await expect(executedMessages).toEqual([]);
      await userEvent.click(within(dialog).getByRole('button', {
        name: 'Close'
      }));
      await waitFor(() => expect(within(document.body).queryByRole('dialog', {
        name: 'Sandboxed document'
      })).toBeNull());
    } finally {
      window.removeEventListener('message', onMessage);
    }
  },
  render: () => <SandboxedDocumentExample />
}`,...$.parameters?.docs?.source},description:{story:`Verifies that active document content cannot execute scripts in the parent page.`,...$.parameters?.docs?.description}}};try{W.displayName=`DocumentViewer`,W.__docgenInfo={description:`Opens an image or document in a full-screen viewer with its own toolbar.`,displayName:`DocumentViewer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.stories.tsx`,methods:[],props:{downloadName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Name used for the download and the labelled viewer dialog.`,name:`downloadName`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`string | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Current open state controlled by the owning application.`,name:`open`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`boolean`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Reports state changes requested by the viewer's actions.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`(open: boolean) => void`}},onReplace:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Called when the app-owned Replace toolbar action is activated.`,name:`onReplace`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},onRemove:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Called when the app-owned Remove toolbar action is activated.`,name:`onRemove`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},src:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`URL of the source image or document.`,name:`src`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`string`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Visible title and accessible name for the viewer dialog.`,name:`title`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!0,tags:{},type:{name:`string`}},transitionName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`}],description:`Name shared with the AttachmentRow that opens this viewer.`,name:`transitionName`,parent:{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`DocumentViewerBaseProps`},required:!1,tags:{},type:{name:`string | undefined`}},mediaType:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`}],description:``,name:`mediaType`,required:!0,tags:{},type:{name:`"document" | "image" | "pdf"`}},pdfAssets:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/DocumentViewer/DocumentViewer.tsx`,name:`TypeLiteral`}],description:`Optional worker and auxiliary assets used to render the PDF.`,name:`pdfAssets`,required:!1,tags:{},type:{name:`DocumentViewerPdfAssets | undefined`}}},tags:{summary:`A modal attachment preview with lazy PDF rendering.`}}}catch{}try{K.displayName=`PdfWorker`,K.__docgenInfo={description:`A two-page PDF rendered by the optional, lazy PDF.js engine and worker.`,displayName:`PdfWorker`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{J.displayName=`PdfPageMetadata`,J.__docgenInfo={description:`Verifies that intrinsic page rotation and PDF user units align text with its canvas.`,displayName:`PdfPageMetadata`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{Y.displayName=`FromAttachmentRow`,Y.__docgenInfo={description:`Opens from its matching attachment row and morphs into the reader.`,displayName:`FromAttachmentRow`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{Z.displayName=`Image`,Z.__docgenInfo={description:`A photograph uses the same toolbar without loading the PDF engine.`,displayName:`Image`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{$.displayName=`SandboxedActiveDocument`,$.__docgenInfo={description:`Verifies that active document content cannot execute scripts in the parent page.`,displayName:`SandboxedActiveDocument`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/DocumentViewer/DocumentViewer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}Re=[`PdfWorker`,`PdfWorkerDocs`,`PdfPageMetadata`,`FromAttachmentRow`,`FromAttachmentRowDocs`,`Image`,`ImageDocs`,`SandboxedActiveDocument`]}));ze();export{Y as FromAttachmentRow,X as FromAttachmentRowDocs,Z as Image,Q as ImageDocs,J as PdfPageMetadata,K as PdfWorker,q as PdfWorkerDocs,$ as SandboxedActiveDocument,Re as __namedExportsOrder,W as default,ze as n,P as t};