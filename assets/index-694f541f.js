import{r as l,a as Z}from"./index-cb576d23.js";import"./index-d600d685.js";/**
 * @remix-run/router v1.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function S(){return S=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},S.apply(this,arguments)}var C;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(C||(C={}));function H(e){e===void 0&&(e={});let{initialEntries:t=["/"],initialIndex:n,v5Compat:a=!1}=e,r;r=t.map((s,d)=>h(s,typeof s=="string"?null:s.state,d===0?"default":void 0));let i=f(n??r.length-1),o=C.Pop,u=null;function f(s){return Math.min(Math.max(s,0),r.length-1)}function c(){return r[i]}function h(s,d,v){d===void 0&&(d=null);let y=ne(r?c().pathname:"/",s,d,v);return ee(y.pathname.charAt(0)==="/","relative pathnames are not supported in memory history: "+JSON.stringify(s)),y}function p(s){return typeof s=="string"?s:O(s)}return{get index(){return i},get action(){return o},get location(){return c()},createHref:p,createURL(s){return new URL(p(s),"http://localhost")},encodeLocation(s){let d=typeof s=="string"?P(s):s;return{pathname:d.pathname||"",search:d.search||"",hash:d.hash||""}},push(s,d){o=C.Push;let v=h(s,d);i+=1,r.splice(i,r.length,v),a&&u&&u({action:o,location:v,delta:1})},replace(s,d){o=C.Replace;let v=h(s,d);r[i]=v,a&&u&&u({action:o,location:v,delta:0})},go(s){o=C.Pop;let d=f(i+s),v=r[d];i=d,u&&u({action:o,location:v,delta:s})},listen(s){return u=s,()=>{u=null}}}}function m(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function ee(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function te(){return Math.random().toString(36).substr(2,8)}function ne(e,t,n,a){return n===void 0&&(n=null),S({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?P(t):t,{state:n,key:t&&t.key||a||te()})}function O(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function P(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}var j;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(j||(j={}));function z(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}function ae(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:r=""}=typeof e=="string"?P(e):e;return{pathname:n?n.startsWith("/")?n:re(n,t):t,search:oe(a),hash:le(r)}}function re(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function _(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function ie(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function J(e,t){let n=ie(e);return t?n.map((a,r)=>r===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function F(e,t,n,a){a===void 0&&(a=!1);let r;typeof e=="string"?r=P(e):(r=S({},e),m(!r.pathname||!r.pathname.includes("?"),_("?","pathname","search",r)),m(!r.pathname||!r.pathname.includes("#"),_("#","pathname","hash",r)),m(!r.search||!r.search.includes("#"),_("#","search","hash",r)));let i=e===""||r.pathname==="",o=i?"/":r.pathname,u;if(o==null)u=n;else{let p=t.length-1;if(!a&&o.startsWith("..")){let g=o.split("/");for(;g[0]==="..";)g.shift(),p-=1;r.pathname=g.join("/")}u=p>=0?t[p]:"/"}let f=ae(r,u),c=o&&o!=="/"&&o.endsWith("/"),h=(i||o===".")&&n.endsWith("/");return!f.pathname.endsWith("/")&&(c||h)&&(f.pathname+="/"),f}const K=e=>e.join("/").replace(/\/\/+/g,"/"),oe=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,le=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e,V=["post","put","patch","delete"];new Set(V);const se=["get",...V];new Set(se);/**
 * React Router v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function U(){return U=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},U.apply(this,arguments)}const $=l.createContext(null),b=l.createContext(null),T=l.createContext(null),E=l.createContext({outlet:null,matches:[],isDataRoute:!1});function ue(e,t){let{relative:n}=t===void 0?{}:t;L()||m(!1);let{basename:a,navigator:r}=l.useContext(b),{hash:i,pathname:o,search:u}=G(e,{relative:n}),f=o;return a!=="/"&&(f=o==="/"?a:K([a,o])),r.createHref({pathname:f,search:u,hash:i})}function L(){return l.useContext(T)!=null}function M(){return L()||m(!1),l.useContext(T).location}function q(e){l.useContext(b).static||l.useLayoutEffect(e)}function ce(){let{isDataRoute:e}=l.useContext(E);return e?ve():fe()}function fe(){L()||m(!1);let e=l.useContext($),{basename:t,future:n,navigator:a}=l.useContext(b),{matches:r}=l.useContext(E),{pathname:i}=M(),o=JSON.stringify(J(r,n.v7_relativeSplatPath)),u=l.useRef(!1);return q(()=>{u.current=!0}),l.useCallback(function(c,h){if(h===void 0&&(h={}),!u.current)return;if(typeof c=="number"){a.go(c);return}let p=F(c,JSON.parse(o),i,h.relative==="path");e==null&&t!=="/"&&(p.pathname=p.pathname==="/"?t:K([t,p.pathname])),(h.replace?a.replace:a.push)(p,h.state,h)},[t,a,o,i,e])}function G(e,t){let{relative:n}=t===void 0?{}:t,{future:a}=l.useContext(b),{matches:r}=l.useContext(E),{pathname:i}=M(),o=JSON.stringify(J(r,a.v7_relativeSplatPath));return l.useMemo(()=>F(e,JSON.parse(o),i,n==="path"),[e,o,i,n])}var X=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(X||{}),Y=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(Y||{});function he(e){let t=l.useContext($);return t||m(!1),t}function pe(e){let t=l.useContext(E);return t||m(!1),t}function de(e){let t=pe(),n=t.matches[t.matches.length-1];return n.route.id||m(!1),n.route.id}function ve(){let{router:e}=he(X.UseNavigateStable),t=de(Y.UseNavigateStable),n=l.useRef(!1);return q(()=>{n.current=!0}),l.useCallback(function(r,i){i===void 0&&(i={}),n.current&&(typeof r=="number"?e.navigate(r):e.navigate(r,U({fromRouteId:t},i)))},[e,t])}const W={};function ge(e,t){W[t]||(W[t]=!0,console.warn(t))}const R=(e,t,n)=>ge(e,"⚠️ React Router Future Flag Warning: "+t+". "+("You can use the `"+e+"` future flag to opt-in early. ")+("For more information, see "+n+"."));function me(e,t){e!=null&&e.v7_startTransition||R("v7_startTransition","React Router will begin wrapping state updates in `React.startTransition` in v7","https://reactrouter.com/v6/upgrading/future#v7_starttransition"),!(e!=null&&e.v7_relativeSplatPath)&&(!t||!t.v7_relativeSplatPath)&&R("v7_relativeSplatPath","Relative route resolution within Splat routes is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath"),t&&(t.v7_fetcherPersist||R("v7_fetcherPersist","The persistence behavior of fetchers is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist"),t.v7_normalizeFormMethod||R("v7_normalizeFormMethod","Casing of `formMethod` fields is being normalized to uppercase in v7","https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod"),t.v7_partialHydration||R("v7_partialHydration","`RouterProvider` hydration behavior is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_partialhydration"),t.v7_skipActionErrorRevalidation||R("v7_skipActionErrorRevalidation","The revalidation behavior after 4xx/5xx `action` responses is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation"))}const ye="startTransition",A=Z[ye];function Oe(e){let{basename:t,children:n,initialEntries:a,initialIndex:r,future:i}=e,o=l.useRef();o.current==null&&(o.current=H({initialEntries:a,initialIndex:r,v5Compat:!0}));let u=o.current,[f,c]=l.useState({action:u.action,location:u.location}),{v7_startTransition:h}=i||{},p=l.useCallback(g=>{h&&A?A(()=>c(g)):c(g)},[c,h]);return l.useLayoutEffect(()=>u.listen(p),[u,p]),l.useEffect(()=>me(i),[i]),l.createElement(xe,{basename:t,children:n,location:f.location,navigationType:f.action,navigator:u,future:i})}function xe(e){let{basename:t="/",children:n=null,location:a,navigationType:r=C.Pop,navigator:i,static:o=!1,future:u}=e;L()&&m(!1);let f=t.replace(/^\/*/,"/"),c=l.useMemo(()=>({basename:f,navigator:i,static:o,future:U({v7_relativeSplatPath:!1},u)}),[f,u,i,o]);typeof a=="string"&&(a=P(a));let{pathname:h="/",search:p="",hash:g="",state:s=null,key:d="default"}=a,v=l.useMemo(()=>{let y=z(h,f);return y==null?null:{location:{pathname:y,search:p,hash:g,state:s,key:d},navigationType:r}},[f,h,p,g,s,d,r]);return v==null?null:l.createElement(b.Provider,{value:c},l.createElement(T.Provider,{children:n,value:v}))}new Promise(()=>{});/**
 * React Router DOM v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function N(){return N=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},N.apply(this,arguments)}function Ce(e,t){if(e==null)return{};var n={},a=Object.keys(e),r,i;for(i=0;i<a.length;i++)r=a[i],!(t.indexOf(r)>=0)&&(n[r]=e[r]);return n}function Re(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function be(e,t){return e.button===0&&(!t||t==="_self")&&!Re(e)}const Pe=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],we="6";try{window.__reactRouterVersion=we}catch{}const Se=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Ue=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ne=l.forwardRef(function(t,n){let{onClick:a,relative:r,reloadDocument:i,replace:o,state:u,target:f,to:c,preventScrollReset:h,viewTransition:p}=t,g=Ce(t,Pe),{basename:s}=l.useContext(b),d,v=!1;if(typeof c=="string"&&Ue.test(c)&&(d=c,Se))try{let x=new URL(window.location.href),w=c.startsWith("//")?new URL(x.protocol+c):new URL(c),I=z(w.pathname,s);w.origin===x.origin&&I!=null?c=I+w.search+w.hash:v=!0}catch{}let y=ue(c,{relative:r}),D=Ee(c,{replace:o,state:u,target:f,preventScrollReset:h,relative:r,viewTransition:p});function Q(x){a&&a(x),x.defaultPrevented||D(x)}return l.createElement("a",N({},g,{href:d||y,onClick:v||i?a:Q,ref:n,target:f}))});var k;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(k||(k={}));var B;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(B||(B={}));function Ee(e,t){let{target:n,replace:a,state:r,preventScrollReset:i,relative:o,viewTransition:u}=t===void 0?{}:t,f=ce(),c=M(),h=G(e,{relative:o});return l.useCallback(p=>{if(be(p,n)){p.preventDefault();let g=a!==void 0?a:O(c)===O(h);f(e,{replace:g,state:r,preventScrollReset:i,relative:o,viewTransition:u})}},[c,f,h,a,r,n,e,i,o,u])}export{Ne as L,Oe as M};
