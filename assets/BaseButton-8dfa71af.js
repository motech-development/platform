import{c as l}from"./polished.esm-8995ec32.js";import{s as t}from"./BaseStyles-5cc577b5.js";const d={danger:{background:"rgb(199,56,79)",colour:"#fff"},primary:{background:"#007fa8",colour:"#fff"},secondary:{background:"#f6f9fc",colour:"#333"},success:{background:"rgb(0,128,93)",colour:"#fff"}},r=t("button").withConfig({shouldForwardProp:e=>!["block","colour","size"].includes(e)})`
  ${({block:e=!1,colour:a="primary",size:o="md",theme:n})=>`
    appearance: none;
    background-color: ${n[a].background};
    border: 0;
    color: ${n[a].colour};
    cursor: pointer;
    font-family: 'Cabin', sans-serif;
    font-weight: 600;
    position: relative;
    vertical-align: middle;
    text-align: center;
    text-decoration: none;
    user-select: none;
    white-space: nowrap;

    ${e?`
          display: block;
          width: 100%;
        `:`
          display: inline-block;
        `}

    ${(()=>{switch(o){case"sm":return`
            font-size: 16px;
            height: 32px;
            line-height: 32px;
            padding: ${e?"0":"0 16px"};
          `;case"lg":return`
            font-size: 18px;
            height: 46px;
            line-height: 46px;
            padding: ${e?"0":"0 32px"};
          `;default:return`
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            padding: ${e?"0":"0 24px"};
          `}})()}

    :hover {
      background-color: ${l(.1,n[a].background??"")};
    }

    :disabled {
      background-color: ${n[a].background};
      opacity: .6;
    }
  `}
`;try{r.displayName="BaseButton",r.__docgenInfo={description:"",displayName:"BaseButton",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLButtonElement | null) => void) | RefObject<HTMLButtonElement> | null"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},block:{defaultValue:null,description:"",name:"block",required:!1,type:{name:"boolean"}},colour:{defaultValue:null,description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"danger"'},{value:'"primary"'},{value:'"secondary"'},{value:'"success"'}]}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"any"}},as:{defaultValue:null,description:"",name:"as",required:!1,type:{name:"undefined"}},forwardedAs:{defaultValue:null,description:"",name:"forwardedAs",required:!1,type:{name:"undefined"}}}}}catch{}export{r as B,d as b};
