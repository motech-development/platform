import{s as c,j as t,B as m}from"./BaseStyles-ba442780.js";import{d as e}from"./index-49721cb5.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./index-633d3215.js";const u=c.img`
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
`,s=({alt:a,src:p,width:n=0})=>t.jsx(v,{$width:n,children:t.jsx(u,{alt:a,src:p,$width:n})}),l=s;try{s.displayName="Avatar",s.__docgenInfo={description:"",displayName:"Avatar",props:{alt:{defaultValue:null,description:"",name:"alt",required:!0,type:{name:"string"}},src:{defaultValue:null,description:"",name:"src",required:!0,type:{name:"string"}},width:{defaultValue:{value:"0"},description:"",name:"width",required:!1,type:{name:"number"}}}}}catch{}const A={component:l,decorators:[e.withKnobs]},r={name:"Basic avatar",render:()=>t.jsxs(t.Fragment,{children:[t.jsx(m,{}),t.jsx(l,{alt:e.text("Alt text","Avatar"),src:e.text("Image Url","https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"),width:e.number("Width",0)})]})};var o,d,i;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'Basic avatar',
  render: () => <>
      <BaseStyles />
      <Avatar alt={text('Alt text', 'Avatar')} src={text('Image Url', 'https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b')} width={number('Width', 0)} />
    </>
}`,...(i=(d=r.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};const b=["BasicAvatar"];export{r as BasicAvatar,b as __namedExportsOrder,A as default};
