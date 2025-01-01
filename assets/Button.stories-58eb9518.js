import{j as e,B as c}from"./BaseStyles-5cc577b5.js";import{d as o}from"./index-b271393a.js";import{B as n}from"./Button-32059e45.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";import"./BaseButton-4f31a05a.js";import"./polished.esm-8995ec32.js";import"./Loader-96caa853.js";const b={component:n,decorators:[o.withKnobs]},i={Danger:"danger",Primary:"primary",Secondary:"secondary",Success:"success"},l={Large:"lg",Medium:"md",Small:"sm"},s={name:"Basic button",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(c,{}),e.jsx(n,{block:o.boolean("Block display",!1),colour:o.select("Colour",i,"primary"),size:o.select("Size",l,"md"),loading:o.boolean("Loading",!1),children:o.text("Title","Button")})]})};var r,t,a;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
  name: 'Basic button',
  render: () => <>
      <BaseStyles />
      <Button block={boolean('Block display', false)} colour={select('Colour', colour, 'primary') as 'danger' | 'primary' | 'secondary' | 'success'} size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'} loading={boolean('Loading', false)}>
        {text('Title', 'Button')}
      </Button>
    </>
}`,...(a=(t=s.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const f=["BasicButton"];export{s as BasicButton,f as __namedExportsOrder,b as default};
