import{s,j as n}from"./BaseStyles-ba442780.js";import{r as a}from"./polished.esm-8995ec32.js";const t=s.progress`
  appearance: none;
  background-color: ${a("#007fa8",.25)};
  border: none;
  height: 20px;
  margin: 0;
  padding: 0;
  width: 100%;

  &::-webkit-progress-bar {
    background-color: ${a("#007fa8",.25)};
    height: 20px;
  }

  &::-webkit-progress-value {
    background-color: #007fa8;
    height: 20px;
  }

  &::-moz-progress-bar {
    background-color: #007fa8;
    height: 20px;
  }
`,r=({max:e=100,progress:o})=>n.jsx(t,{max:e,value:o}),i=r;try{r.displayName="ProgressBar",r.__docgenInfo={description:"",displayName:"ProgressBar",props:{max:{defaultValue:{value:"100"},description:"",name:"max",required:!1,type:{name:"number"}},progress:{defaultValue:null,description:"",name:"progress",required:!0,type:{name:"number"}}}}}catch{}export{i as P};
