import{s as n,j as e,B as j}from"./BaseStyles-5cc577b5.js";import{d}from"./index-b271393a.js";import{B as u}from"./Button-144ca23b.js";import{T as c}from"./Typography-fbe59c72.js";import{r as l}from"./index-cb576d23.js";import{r as M}from"./index-d600d685.js";import{C as E}from"./Card-910ce953.js";import{L as B}from"./Loader-96caa853.js";import"./_commonjsHelpers-de833af9.js";import"./BaseButton-6e871efe.js";import"./polished.esm-8995ec32.js";const m=n.div`
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;try{m.displayName="Overlay",m.__docgenInfo={description:"",displayName:"Overlay",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null"}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"DefaultTheme"}},as:{defaultValue:null,description:"",name:"as",required:!1,type:{name:"undefined"}},forwardedAs:{defaultValue:null,description:"",name:"forwardedAs",required:!1,type:{name:"undefined"}}}}}catch{}const D=n.div`
  bottom: 0;
  left: 0;
  outline: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1100;
`,k=n.div`
  outline: 0;
  position: relative;
  width: 100%;
  pointer-events: auto;
`,z=n.div`
  box-shadow:
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
  margin: 5rem auto;
  max-width: ${({size:o})=>o==="sm"?"500px":"90vw"};
  pointer-events: none;
  position: relative;
`,p=({children:o,isOpen:i,onDismiss:s,size:x="sm",title:v})=>{const t=document.createElement("div"),b=r=>{r.stopPropagation()},w=e.jsxs(l.Suspense,{fallback:e.jsx(B,{}),children:[e.jsx(D,{"aria-modal":!0,"aria-label":v,role:"dialog",tabIndex:-1,onClick:s,children:e.jsx(z,{size:x,role:"document",children:e.jsx(k,{onClick:b,children:e.jsx(E,{padding:"lg",children:o})})})}),e.jsx(m,{})]});return l.useEffect(()=>{const r=_=>{_.key==="Escape"&&s()};return document.body.appendChild(t),document.addEventListener("keydown",r,!1),()=>{document.body.removeChild(t),document.body.style.removeProperty("overflow"),document.removeEventListener("keydown",r,!1)}},[t,s]),l.useEffect(()=>{i&&(document.body.style.overflow="hidden")},[i]),i?M.createPortal(w,t):null},g=p;try{p.displayName="Modal",p.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},size:{defaultValue:{value:"sm"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"lg"'}]}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!0,type:{name:"() => void"}}}}}catch{}const R={component:g,decorators:[d.withKnobs]},O=()=>{},C={Large:"lg",Small:"sm"},a={name:"Basic modal",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(j,{}),e.jsxs(g,{isOpen:d.boolean("Show",!0),size:d.select("Size",C,"sm"),title:"My modal",onDismiss:O,children:[e.jsx(c,{rule:!0,component:"h1",variant:"h2",margin:"lg",children:"Are you sure you want to do this?"}),e.jsx(c,{component:"p",variant:"p",margin:"lg",children:"Clicking OK will delete this permanently"}),e.jsx(u,{colour:"danger",children:"Delete"})," ",e.jsx(u,{children:"Actually, don't bother"})]})]})};var y,f,h;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Basic modal',
  render: () => <>
      <BaseStyles />

      <Modal isOpen={boolean('Show', true)} size={select('Size', size, 'sm') as 'sm' | 'lg'} title="My modal" onDismiss={onDismiss}>
        <Typography rule component="h1" variant="h2" margin="lg">
          Are you sure you want to do this?
        </Typography>
        <Typography component="p" variant="p" margin="lg">
          Clicking OK will delete this permanently
        </Typography>
        <Button colour="danger">Delete</Button>{' '}
        <Button>Actually, don&#39;t bother</Button>
      </Modal>
    </>
}`,...(h=(f=a.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};const $=["BasicModal"];export{a as BasicModal,$ as __namedExportsOrder,R as default};
