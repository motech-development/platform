import{s as c,j as t,B as m}from"./BaseStyles-5cc577b5.js";import{d as r}from"./index-e06dce00.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";const u=c.img`
  ${({$width:a})=>`
    display: block;
    width: ${a?`${a}px`:"auto"};
  `}
`,v=c.div`
  ${({$width:a})=>`
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
    width: ${a?`${a}px`:"auto"};

    ${a?`min-width: ${a}px`:""}
  `}
`,s=({alt:a,src:p,width:n=0})=>t.jsx(v,{$width:n,children:t.jsx(u,{alt:a,src:p,$width:n})}),l=s;try{s.displayName="Avatar",s.__docgenInfo={description:"",displayName:"Avatar",props:{alt:{defaultValue:null,description:"",name:"alt",required:!0,type:{name:"string"}},src:{defaultValue:null,description:"",name:"src",required:!0,type:{name:"string"}},width:{defaultValue:{value:"0"},description:"",name:"width",required:!1,type:{name:"number"}}}}}catch{}const y={component:l,decorators:[r.withKnobs]},e={name:"Basic avatar",render:()=>t.jsxs(t.Fragment,{children:[t.jsx(m,{}),t.jsx(l,{alt:r.text("Alt text","Avatar"),src:r.text("Image Url","https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"),width:r.number("Width",0)})]})};var o,d,i;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'Basic avatar',
  render: () => <>
      <BaseStyles />
      <Avatar alt={text('Alt text', 'Avatar')} src={text('Image Url', 'https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b')} width={number('Width', 0)} />
    </>
}`,...(i=(d=e.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};const A=["BasicAvatar"];export{e as BasicAvatar,A as __namedExportsOrder,y as default};
