import{j as e,B as q}from"./BaseStyles-5cc577b5.js";import{B as n}from"./Button-bbdb68ac.js";import{C as t}from"./Card-2d849b91.js";import{r as l}from"./index-cb576d23.js";import{R as d,C as s}from"./Row-64fa5a15.js";import{P as z}from"./ProgressBar-a2948d7e.js";import"./_commonjsHelpers-de833af9.js";import"./BaseButton-69b6d0a5.js";import"./polished.esm-8995ec32.js";import"./Loader-96caa853.js";const i=({children:o,enableNext:f=()=>!0,nextLabel:C,onComplete:y,onStart:p,previousLabel:B,start:_=0})=>{const[r,c]=l.useState(_),k=l.Children.toArray(o)[r],u=l.Children.count(o)-1,v=()=>{c(r+1)},m=r<u,N=()=>{c(r-1)},x=r===0,L=r/u*100,g=x&&p;return e.jsxs(d,{children:[e.jsx(s,{children:k}),e.jsx(s,{children:e.jsx(d,{children:e.jsxs(s,{xs:12,md:6,mdOffset:7,children:[e.jsx(t,{padding:"none",children:e.jsx(z,{progress:L})}),e.jsx(t,{padding:"lg",children:e.jsxs(d,{children:[e.jsxs(s,{xs:12,md:6,children:[g&&p,!g&&e.jsx(n,{block:!0,disabled:x,size:"lg",onClick:N,children:B})]}),e.jsxs(s,{xs:12,md:6,align:"right",children:[m&&e.jsx(n,{block:!0,disabled:!f(r),size:"lg",onClick:v,children:C}),!m&&y]})]})})]})})})]})},j=i;try{i.displayName="Stepper",i.__docgenInfo={description:"",displayName:"Stepper",props:{nextLabel:{defaultValue:null,description:"",name:"nextLabel",required:!0,type:{name:"string"}},onComplete:{defaultValue:null,description:"",name:"onComplete",required:!1,type:{name:"ReactNode"}},onStart:{defaultValue:null,description:"",name:"onStart",required:!1,type:{name:"ReactNode"}},previousLabel:{defaultValue:null,description:"",name:"previousLabel",required:!0,type:{name:"string"}},start:{defaultValue:{value:"0"},description:"",name:"start",required:!1,type:{name:"number"}},enableNext:{defaultValue:{value:"() => true"},description:"",name:"enableNext",required:!1,type:{name:"((step: number) => boolean)"}}}}}catch{}const I={component:j},a={name:"Basic stepper",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(q,{}),e.jsxs(j,{previousLabel:"Go back",nextLabel:"Next",onComplete:e.jsx(n,{block:!0,disabled:!0,colour:"success",size:"lg",children:"The end!"}),onStart:e.jsx(n,{block:!0,colour:"secondary",size:"lg",children:"Exit"}),children:[e.jsx(t,{padding:"lg",children:"Step 1"}),e.jsx(t,{padding:"lg",children:"Step 2"}),e.jsx(t,{padding:"lg",children:"Step 3"}),e.jsx(t,{padding:"lg",children:"Step 4"})]})]})};var h,S,b;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Basic stepper',
  render: () => <>
      <BaseStyles />

      <Stepper previousLabel="Go back" nextLabel="Next" onComplete={<Button block disabled colour="success" size="lg">
            The end!
          </Button>} onStart={<Button block colour="secondary" size="lg">
            Exit
          </Button>}>
        <Card padding="lg">Step 1</Card>

        <Card padding="lg">Step 2</Card>

        <Card padding="lg">Step 3</Card>

        <Card padding="lg">Step 4</Card>
      </Stepper>
    </>
}`,...(b=(S=a.parameters)==null?void 0:S.docs)==null?void 0:b.source}}};const $=["BasicStepper"];export{a as BasicStepper,$ as __namedExportsOrder,I as default};
