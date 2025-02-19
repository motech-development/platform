import{s as a,j as e,B as w}from"./BaseStyles-5cc577b5.js";import{d as l}from"./index-89a01c4d.js";import{B as p}from"./Button-32059e45.js";import{T as u}from"./Typography-fbe59c72.js";import{r as i}from"./index-cb576d23.js";import{r as _}from"./index-d600d685.js";import{C as j}from"./Card-910ce953.js";import{L as M}from"./Loader-96caa853.js";import"./_commonjsHelpers-de833af9.js";import"./BaseButton-4f31a05a.js";import"./polished.esm-8995ec32.js";const d=a.div`
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;try{d.displayName="Overlay",d.__docgenInfo={description:"",displayName:"Overlay",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null"}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"DefaultTheme"}},as:{defaultValue:null,description:"",name:"as",required:!1,type:{name:"undefined"}},forwardedAs:{defaultValue:null,description:"",name:"forwardedAs",required:!1,type:{name:"undefined"}}}}}catch{}const B=a.div`
  bottom: 0;
  left: 0;
  outline: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1100;
`,E=a.div`
  outline: 0;
  position: relative;
  width: 100%;
  pointer-events: auto;
`,D=a.div`
  box-shadow:
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
  margin: 5rem auto;
  max-width: ${({size:o})=>o==="sm"?"500px":"90vw"};
  pointer-events: none;
  position: relative;
`,m=({children:o,isOpen:n,onDismiss:s,size:h="sm",title:x})=>{const v=t=>{t.stopPropagation()};return i.useEffect(()=>{const t=b=>{b.key==="Escape"&&s()};return document.addEventListener("keydown",t,!1),()=>{document.body.style.removeProperty("overflow"),document.removeEventListener("keydown",t,!1)}},[s]),i.useEffect(()=>{n&&(document.body.style.overflow="hidden")},[n]),n?_.createPortal(e.jsxs(i.Suspense,{fallback:e.jsx(M,{}),children:[e.jsx(B,{"aria-modal":!0,"aria-label":x,role:"dialog",tabIndex:-1,onClick:s,children:e.jsx(D,{size:h,role:"document",children:e.jsx(E,{onClick:v,children:e.jsx(j,{padding:"lg",children:o})})})}),e.jsx(d,{})]}),document.body):null},g=m;try{m.displayName="Modal",m.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},size:{defaultValue:{value:"sm"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"lg"'}]}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!0,type:{name:"() => void"}}}}}catch{}const P={component:g,decorators:[l.withKnobs]},k=()=>{},z={Large:"lg",Small:"sm"},r={name:"Basic modal",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(w,{}),e.jsxs(g,{isOpen:l.boolean("Show",!0),size:l.select("Size",z,"sm"),title:"My modal",onDismiss:k,children:[e.jsx(u,{rule:!0,component:"h1",variant:"h2",margin:"lg",children:"Are you sure you want to do this?"}),e.jsx(u,{component:"p",variant:"p",margin:"lg",children:"Clicking OK will delete this permanently"}),e.jsx(p,{colour:"danger",children:"Delete"})," ",e.jsx(p,{children:"Actually, don't bother"})]})]})};var c,y,f;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(f=(y=r.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const H=["BasicModal"];export{r as BasicModal,H as __namedExportsOrder,P as default};
