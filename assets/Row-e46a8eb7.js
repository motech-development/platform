import{s as o,j as m}from"./BaseStyles-5cc577b5.js";const g=o.div`
  ${({$align:e,$lg:a,$lgOffset:l,$md:n,$mdOffset:i,$sm:t,$smOffset:s,$verticalAlign:d,$xs:r,$xsOffset:u})=>`
    grid-column: ${u>0?`${u} / span ${r}`:`span ${r}`};
    position: relative;
    text-align ${e==="centre"?"center":e};

    ${d?`
      align-items: center;
      display: flex;
    `:""}

    ${t?`
      @media (min-width: 576px) {
        grid-column: ${s>0?`${s} / span ${t}`:`span ${t}`};
      }
    `:""}

    ${n?`
      @media (min-width: 768px) {
        grid-column: ${i>0?`${i} / span ${n}`:`span ${n}`};
      }
    `:""}

    ${a?`
      @media (min-width: 992px) {
        grid-column: ${l>0?`${l} / span ${a}`:`span ${a}`};
      }
    `:""}
  `}
`,$=o.div`
  flex: 1;
`,f=({children:e,align:a="left",lg:l=0,lgOffset:n=0,md:i=0,mdOffset:t=0,sm:s=0,smOffset:d=0,verticalAlign:r=null,xs:u=12,xsOffset:c=0})=>m.jsx(g,{$align:a,$lg:l,$lgOffset:n,$md:i,$mdOffset:t,$sm:s,$smOffset:d,$verticalAlign:!!r,$xs:u,$xsOffset:c,children:r?m.jsx($,{children:e}):e});try{f.displayName="Col",f.__docgenInfo={description:"",displayName:"Col",props:{align:{defaultValue:{value:"left"},description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'},{value:'"centre"'}]}},lg:{defaultValue:{value:"0"},description:"",name:"lg",required:!1,type:{name:"number"}},lgOffset:{defaultValue:{value:"0"},description:"",name:"lgOffset",required:!1,type:{name:"number"}},md:{defaultValue:{value:"0"},description:"",name:"md",required:!1,type:{name:"number"}},mdOffset:{defaultValue:{value:"0"},description:"",name:"mdOffset",required:!1,type:{name:"number"}},sm:{defaultValue:{value:"0"},description:"",name:"sm",required:!1,type:{name:"number"}},smOffset:{defaultValue:{value:"0"},description:"",name:"smOffset",required:!1,type:{name:"number"}},verticalAlign:{defaultValue:{value:"null"},description:"",name:"verticalAlign",required:!1,type:{name:"enum",value:[{value:'"middle"'}]}},xs:{defaultValue:{value:"12"},description:"",name:"xs",required:!1,type:{name:"number"}},xsOffset:{defaultValue:{value:"0"},description:"",name:"xsOffset",required:!1,type:{name:"number"}}}}}catch{}const v=o.div`
  ${({$columns:e,$gutter:a})=>`
    display: grid;
    gap: ${a};
    grid-template-columns: repeat(${e},1fr);
  `}
`,p=({children:e,columns:a=12,gutter:l="1rem"})=>m.jsx(v,{$columns:a,$gutter:l,children:e}),x=p;try{p.displayName="Row",p.__docgenInfo={description:"",displayName:"Row",props:{columns:{defaultValue:{value:"12"},description:"",name:"columns",required:!1,type:{name:"number"}},gutter:{defaultValue:{value:"1rem"},description:"",name:"gutter",required:!1,type:{name:"string"}}}}}catch{}export{f as C,x as R};
