import{s as _,j as r,B}from"./BaseStyles-5cc577b5.js";import{d as s}from"./index-89a01c4d.js";import{C as x}from"./Card-2d849b91.js";import{T as w}from"./Typography-47417900.js";import{R as E,C as S}from"./Row-e46a8eb7.js";import{r as d}from"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";const k=()=>{const e=()=>({height:window.innerHeight,width:window.innerWidth}),[t,n]=d.useState(e),o=()=>{n(e)};return d.useEffect(()=>(window.addEventListener("resize",o),()=>{window.removeEventListener("resize",o)}),[]),t},$=()=>{const e=window.matchMedia("(min-width: 992px)"),t=window.matchMedia("(min-width: 768px)"),n=window.matchMedia("(min-width: 576px)");return e.matches?"lg":t.matches?"md":n.matches?"sm":"xs"},z=()=>{const[e,t]=d.useState("xs"),{width:n}=k();return d.useEffect(()=>{t($)},[n]),e},I=_.div`
  ${({$gutter:e})=>`
    margin-bottom: ${e};
  `}
`,i=e=>12/e,u=({children:e,gutter:t="1rem",lg:n,md:o,sm:c,xs:p})=>{const C={lg:n,md:o,sm:c,xs:p},M=z(),h=C[M],l=Array.from(new Array(h),()=>[]);return(Array.isArray(e)?e.flat():[e]).forEach((y,a)=>{const j=a%h;l[j].push(r.jsx(I,{$gutter:t,children:y},a))}),r.jsx(E,{gutter:t,children:l.map((y,a)=>r.jsx(S,{xs:i(p),sm:i(c),md:i(o),lg:i(n),children:l[a]},a))})},b=u;try{u.displayName="Masonry",u.__docgenInfo={description:"",displayName:"Masonry",props:{gutter:{defaultValue:{value:"1rem"},description:"",name:"gutter",required:!1,type:{name:"string"}},lg:{defaultValue:null,description:"",name:"lg",required:!0,type:{name:"number"}},md:{defaultValue:null,description:"",name:"md",required:!0,type:{name:"number"}},sm:{defaultValue:null,description:"",name:"sm",required:!0,type:{name:"number"}},xs:{defaultValue:null,description:"",name:"xs",required:!0,type:{name:"number"}}}}}catch{}const N={component:b,decorators:[s.withKnobs]},m={name:"Basic masonry",render:()=>r.jsxs(r.Fragment,{children:[r.jsx(B,{}),r.jsxs(b,{xs:s.number("Columns in extra small viewport",1),sm:s.number("Columns in small viewport",2),md:s.number("Columns in medium viewport",3),lg:s.number("Columns in large viewport",4),children:[r.jsx(x,{children:r.jsx("div",{style:{height:"200px"},children:r.jsx(w,{rule:!0,component:"h1",variant:"h2",children:"Outside of loop"})})}),[...Array(s.number("Items",5))].map((e,t)=>{const n=`${200+Math.ceil(Math.random()*300)}px`;return r.jsx(x,{children:r.jsx("div",{style:{height:n},children:r.jsx(w,{rule:!0,component:"h1",variant:"h2",children:`Item ${t+1}`})})},t)})]})]})};var g,f,v;m.parameters={...m.parameters,docs:{...(g=m.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Basic masonry',
  render: () => <>
      <BaseStyles />

      <Masonry xs={number('Columns in extra small viewport', 1)} sm={number('Columns in small viewport', 2)} md={number('Columns in medium viewport', 3)} lg={number('Columns in large viewport', 4)}>
        <Card>
          <div style={{
          height: '200px'
        }}>
            <Typography rule component="h1" variant="h2">
              Outside of loop
            </Typography>
          </div>
        </Card>

        {[...Array(number('Items', 5))].map((_, i) => {
        const height = \`\${200 + Math.ceil(Math.random() * 300)}px\`;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Card key={i}>
              <div style={{
              height
            }}>
                <Typography rule component="h1" variant="h2">{\`Item \${i + 1}\`}</Typography>
              </div>
            </Card>
        );
      })}
      </Masonry>
    </>
}`,...(v=(f=m.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};const F=["BasicMasonry"];export{m as BasicMasonry,F as __namedExportsOrder,N as default};
