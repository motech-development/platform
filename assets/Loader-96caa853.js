import{s,j as r}from"./BaseStyles-5cc577b5.js";const o=s.circle`
  ${({$colour:e})=>`
    animation: dash 1.5s ease-in-out infinite;
    stroke: ${e==="default"?"#007fa8":"#fff"};
    stroke-linecap: round;

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  `}
`,i=s.svg`
  animation: rotate 2s linear infinite;
  height: 50px;
  left: 50%;
  margin: -25px 0 0 -25px;
  position: absolute;
  top: 50%;
  width: 50px;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`,a=({colour:e="default",className:t=""})=>r.jsx(i,{className:t,viewBox:"0 0 50 50",children:r.jsx(o,{$colour:e,cx:"25",cy:"25",r:"20",fill:"none",strokeWidth:"4"})}),n=a;try{a.displayName="Loader",a.__docgenInfo={description:"",displayName:"Loader",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string"}},colour:{defaultValue:{value:"default"},description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"secondary"'}]}}}}}catch{}export{n as L};
