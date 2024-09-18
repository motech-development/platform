import{s as P,j as l,L as j}from"./BaseStyles-5cc577b5.js";import{r}from"./index-cb576d23.js";import{s as E,u as C,a as O,b as U}from"./usePopper-6b5093f0.js";import{g as D}from"./_commonjsHelpers-de833af9.js";var w=r.createContext(),M=r.createContext();function F(e){var n=e.children,t=r.useState(null),o=t[0],i=t[1],a=r.useRef(!1);r.useEffect(function(){return function(){a.current=!0}},[]);var u=r.useCallback(function(d){a.current||i(d)},[]);return r.createElement(w.Provider,{value:o},r.createElement(M.Provider,{value:u},n))}var I=function(){},V=function(){return Promise.resolve(null)},q=[];function A(e){var n=e.placement,t=n===void 0?"bottom":n,o=e.strategy,i=o===void 0?"absolute":o,a=e.modifiers,u=a===void 0?q:a,d=e.referenceElement,c=e.onFirstUpdate,f=e.innerRef,b=e.children,p=r.useContext(w),g=r.useState(null),m=g[0],x=g[1],v=r.useState(null),y=v[0],N=v[1];r.useEffect(function(){E(f,m)},[f,m]);var S=r.useMemo(function(){return{placement:t,strategy:i,onFirstUpdate:c,modifiers:[].concat(u,[{name:"arrow",enabled:y!=null,options:{element:y}}])}},[t,i,c,u,y]),h=C(d||p,m,S),s=h.state,R=h.styles,T=h.forceUpdate,k=h.update,_=r.useMemo(function(){return{ref:x,style:R.popper,placement:s?s.placement:t,hasPopperEscaped:s&&s.modifiersData.hide?s.modifiersData.hide.hasPopperEscaped:null,isReferenceHidden:s&&s.modifiersData.hide?s.modifiersData.hide.isReferenceHidden:null,arrowProps:{style:R.arrow,ref:N},forceUpdate:T||I,update:k||V}},[x,N,t,s,R,k,T]);return O(b)(_)}var H=function(){},z=H;const B=D(z);function L(e){var n=e.children,t=e.innerRef,o=r.useContext(M),i=r.useCallback(function(a){E(t,a),U(o,a)},[t,o]);return r.useEffect(function(){return function(){return E(t,null)}},[]),r.useEffect(function(){B(!!o,"`Reference` should not be used outside of a `Manager` component.")},[o]),O(n)({ref:i})}const W={danger:{background:"rgb(199,56,79)",colour:"#fff"},primary:{background:"#007fa8",colour:"#fff"},secondary:{background:"#f6f9fc",colour:"#333"},success:{background:"rgb(0,128,93)",colour:"#fff"}},Y=P.div`
  ${({$colour:e,$placement:n,theme:t})=>`
    height: 0;
    position: absolute;
    width: 0;

    ${(()=>{switch(n){case"bottom":return`
            border-bottom: 5px solid ${t[e].background};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            top: -5px;
          `;case"left":return`
            border-bottom: 5px solid transparent;
            border-left: 5px solid ${t[e].background};
            border-top: 5px solid transparent;
            right: -5px;
          `;case"right":return`
            border-bottom: 5px solid transparent;
            border-right: 5px solid ${t[e].background};
            border-top: 5px solid transparent;
            left: -5px;
          `;case"top":return`
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid ${t[e].background};
            bottom: -5px;
          `;default:return""}})()}
  `}
`,G=P.div`
  display: inline-block;
  position: relative;
`,J=P.div`
  ${({$colour:e,$visible:n,theme:t})=>`
    background-color: ${t[e].background};
    color: ${t[e].colour};
    font-size: 14px;
    line-height: 22px;
    padding: 0 5px;
    visibility: ${n?"visible":"hidden"};
    z-index: 10;
  `}
`,$=({colour:e="primary",message:n,id:t,parent:o,placement:i})=>{let a;const[u,d]=r.useState(!1),c=r.useRef(!1),f=()=>{a=setTimeout(()=>{c.current&&d(!1)},1e3)},b=()=>{clearTimeout(a),d(!0)};return r.useEffect(()=>(c.current=!0,()=>{c.current=!1})),l.jsx(j,{theme:W,children:l.jsxs(F,{children:[l.jsx(L,{children:({ref:p})=>l.jsx(G,{ref:p,onBlur:f,onFocus:b,onMouseOver:b,onMouseOut:f,children:o})}),l.jsx(A,{placement:i,strategy:"fixed",modifiers:[{name:"offset",options:{offset:[0,5]}}],children:({arrowProps:p,placement:g,ref:m,style:x})=>{const v=g;return l.jsxs(J,{$placement:v,$visible:u,id:t,role:"tooltip",ref:m,$colour:e,style:x,children:[n,l.jsx(Y,{$placement:v,ref:p.ref,$colour:e,style:p.style})]})}})]})})},ee=$;try{$.displayName="Tooltip",$.__docgenInfo={description:"",displayName:"Tooltip",props:{colour:{defaultValue:{value:"primary"},description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"primary"'},{value:'"secondary"'},{value:'"danger"'},{value:'"success"'}]}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},message:{defaultValue:null,description:"",name:"message",required:!0,type:{name:"ReactNode"}},parent:{defaultValue:null,description:"",name:"parent",required:!0,type:{name:"ReactNode"}},placement:{defaultValue:null,description:"",name:"placement",required:!0,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'},{value:'"auto-start"'},{value:'"auto"'},{value:'"auto-end"'},{value:'"top-start"'},{value:'"top"'},{value:'"top-end"'},{value:'"right-start"'},{value:'"right-end"'},{value:'"bottom-end"'},{value:'"bottom"'},{value:'"bottom-start"'},{value:'"left-end"'},{value:'"left-start"'}]}}}}}catch{}export{ee as T};
