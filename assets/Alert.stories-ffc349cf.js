import{s as m,j as e,L as $,B as E}from"./BaseStyles-5cc577b5.js";import{F as k,f as S,a as q}from"./index.es-96800a20.js";import{d as n}from"./index-e06dce00.js";import{r as o}from"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";const T={danger:{background:"rgb(199,56,79)",colour:"#fff"},primary:{background:"#007fa8",colour:"#fff"},secondary:{background:"#f6f9fc",colour:"#333"},success:{background:"rgb(0,128,93)",colour:"#fff"}},w=m.div`
  ${({$colour:s,$icon:r,$spacing:a,theme:t})=>`
    background-color: ${t[s].background};
    color: ${t[s].colour};
    margin-bottom: ${(()=>{switch(a){case"lg":return"20px";case"md":return"10px";default:return"5px"}})()};
    padding: 12px 56px 12px ${r?"56px":"20px"};
    position: relative;
  `}
`,B=m.div`
  left: 20px;
  position: absolute;
  top: 12px;
`,C=m.button`
  ${({$colour:s,theme:r})=>`
    appearance: none;
    background-color: ${r[s].background};
    border: 0;
    color: ${r[s].colour};
    cursor: pointer;
    font-size: inherit;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 20px;
    top: 12px;
  `}
`,c=({colour:s="primary",dismissable:r=!1,icon:a,message:t,spacing:V="md",onDismiss:d})=>{const p=o.useRef(0),[_,f]=o.useState(!0),g=()=>{f(!1),d&&d()};return o.useEffect(()=>{p.current+=1},[]),o.useEffect(()=>()=>{p.current>=1&&f(!1)},[]),o.useEffect(()=>{let l;return typeof r=="number"&&(l=setTimeout(g,r)),()=>{l&&clearTimeout(l)}},[]),_?e.jsx($,{theme:T,children:e.jsxs(w,{role:"alert",$colour:s,$icon:!!a,$spacing:V,children:[a&&e.jsx(B,{children:a}),t,r&&e.jsx(C,{type:"button","aria-label":"Dismiss",$colour:s,onClick:g,children:e.jsx(k,{icon:S})})]})}):null},u=c;try{c.displayName="Alert",c.__docgenInfo={description:"",displayName:"Alert",props:{colour:{defaultValue:{value:"primary"},description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"danger"'},{value:'"primary"'},{value:'"secondary"'},{value:'"success"'}]}},dismissable:{defaultValue:{value:"false"},description:"",name:"dismissable",required:!1,type:{name:"number | boolean"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}},message:{defaultValue:null,description:"",name:"message",required:!0,type:{name:"string"}},spacing:{defaultValue:{value:"md"},description:"",name:"spacing",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!1,type:{name:"(() => void)"}}}}}catch{}const H={component:u,decorators:[n.withKnobs]},D={Danger:"danger",Primary:"primary",Secondary:"secondary",Success:"success"},F={Large:"lg",Medium:"md",Small:"sm"},b=()=>n.text("Message","Hello world"),x=()=>n.select("Colour",D,"primary"),y=()=>n.select("Spacing",F,"md"),v=()=>n.boolean("Dismissable",!1),i={name:"Various alerts",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(E,{}),e.jsx(u,{message:b(),colour:x(),dismissable:v(),spacing:y()}),e.jsx(u,{message:b(),colour:x(),dismissable:v(),icon:e.jsx(k,{icon:q}),spacing:y()})]})};var A,h,j;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'Various alerts',
  render: () => <>
      <BaseStyles />

      <Alert message={message()} colour={colour()} dismissable={dismissable()} spacing={spacing()} />

      <Alert message={message()} colour={colour()} dismissable={dismissable()} icon={<FontAwesomeIcon icon={faExclamationTriangle} />} spacing={spacing()} />
    </>
}`,...(j=(h=i.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};const K=["VariousAlerts"];export{i as VariousAlerts,K as __namedExportsOrder,H as default};
