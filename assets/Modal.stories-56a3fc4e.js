import{s as a,j as e,B as w}from"./BaseStyles-5cc577b5.js";import{d as h}from"./index-7e953490.js";import{B as m}from"./Button-cf87b71b.js";import{T as c}from"./Typography-fd0859c4.js";import{r as s}from"./index-cb576d23.js";import{r as j}from"./index-d600d685.js";import{C as M}from"./Card-fc232f28.js";import{L as E}from"./Loader-96caa853.js";import"./_commonjsHelpers-de833af9.js";import"./BaseButton-c2a13929.js";import"./polished.esm-8995ec32.js";const d=a.div`
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;try{d.displayName="Overlay",d.__docgenInfo={description:"",displayName:"Overlay",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null"}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"any"}},as:{defaultValue:null,description:"",name:"as",required:!1,type:{name:"undefined"}},forwardedAs:{defaultValue:null,description:"",name:"forwardedAs",required:!1,type:{name:"undefined"}}}}}catch{}const B=a.div`
  bottom: 0;
  left: 0;
  outline: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1100;
`,k=a.div`
  outline: 0;
  position: relative;
  width: 100%;
  pointer-events: auto;
`,D=a.div`
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
  margin: 5rem auto;
  max-width: 500px;
  pointer-events: none;
  position: relative;
`,p=({children:n,isOpen:i,onDismiss:l,title:x})=>{const o=document.createElement("div"),v=t=>{t.stopPropagation()},b=e.jsxs(s.Suspense,{fallback:e.jsx(E,{}),children:[e.jsx(B,{"aria-modal":!0,"aria-label":x,role:"dialog",tabIndex:-1,onClick:l,children:e.jsx(D,{role:"document",children:e.jsx(k,{onClick:v,children:e.jsx(M,{padding:"lg",children:n})})})}),e.jsx(d,{})]});return s.useEffect(()=>{const t=_=>{_.key==="Escape"&&l()};return document.body.appendChild(o),document.addEventListener("keydown",t,!1),()=>{document.body.removeChild(o),document.body.style.removeProperty("overflow"),document.removeEventListener("keydown",t,!1)}},[o,l]),s.useEffect(()=>{i&&(document.body.style.overflow="hidden")},[i]),i?j.createPortal(b,o):null},g=p;try{p.displayName="Modal",p.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!0,type:{name:"() => void"}}}}}catch{}const z={component:g,decorators:[h.withKnobs]},O=()=>{},r={name:"Basic modal",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(w,{}),e.jsxs(g,{isOpen:h.boolean("Show",!0),title:"My modal",onDismiss:O,children:[e.jsx(c,{rule:!0,component:"h1",variant:"h2",margin:"lg",children:"Are you sure you want to do this?"}),e.jsx(c,{component:"p",variant:"p",margin:"lg",children:"Clicking OK will delete this permanently"}),e.jsx(m,{colour:"danger",children:"Delete"})," ",e.jsx(m,{children:"Actually, don't bother"})]})]})};var u,y,f;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Basic modal',
  render: () => <>
      <BaseStyles />

      <Modal isOpen={boolean('Show', true)} title="My modal" onDismiss={onDismiss}>
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
}`,...(f=(y=r.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const H=["BasicModal"];export{r as BasicModal,H as __namedExportsOrder,z as default};
