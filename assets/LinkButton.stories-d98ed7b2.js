import{j as o,L as d,B as p}from"./BaseStyles-5cc577b5.js";import{d as e}from"./index-e06dce00.js";import{L as y,M as B}from"./index-6c571180.js";import{b as k,B as f}from"./BaseButton-8dfa71af.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";import"./index-d600d685.js";import"./polished.esm-8995ec32.js";const x=({className:r,colour:n,block:l,...s})=>o.jsx(y,{className:r,...s}),a=({block:r=!1,colour:n="primary",size:l="md",...s})=>o.jsx(d,{theme:k,children:o.jsx(f,{as:x,block:r,colour:n,size:l,...s})}),m=a;try{a.displayName="LinkButton",a.__docgenInfo={description:"",displayName:"LinkButton",props:{block:{defaultValue:{value:"false"},description:"",name:"block",required:!1,type:{name:"boolean"}},colour:{defaultValue:{value:"primary"},description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"danger"'},{value:'"primary"'},{value:'"secondary"'},{value:'"success"'}]}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}}}}}catch{}const T={component:m,decorators:[e.withKnobs]},L={Danger:"danger",Primary:"primary",Secondary:"secondary",Success:"success"},b={Large:"lg",Medium:"md",Small:"sm"},t={name:"Basic link button",render:()=>o.jsxs(B,{children:[o.jsx(p,{}),o.jsx(m,{block:e.boolean("Block display",!1),colour:e.select("Colour",L,"primary"),size:e.select("Size",b,"md"),to:e.text("To","/home"),children:e.text("Title","Button")})]})};var i,c,u;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Basic link button',
  render: () => <MemoryRouter>
      <BaseStyles />
      <LinkButton block={boolean('Block display', false)} colour={select('Colour', colour, 'primary') as 'danger' | 'primary' | 'secondary' | 'success'} size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'} to={text('To', '/home')}>
        {text('Title', 'Button')}
      </LinkButton>
    </MemoryRouter>
}`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};const R=["BasicLinkButton"];export{t as BasicLinkButton,R as __namedExportsOrder,T as default};