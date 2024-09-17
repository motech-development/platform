import{j as o,B as m}from"./BaseStyles-ba442780.js";import{d as e}from"./index-49721cb5.js";import{B as p}from"./Button-46c99480.js";import{T as i}from"./Tooltip-2941d287.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./index-633d3215.js";import"./BaseButton-7c7255d1.js";import"./polished.esm-8995ec32.js";import"./Loader-4ebfd022.js";import"./usePopper-f596e70c.js";import"./index-6bb76072.js";const S={component:i,decorators:[e.withKnobs]},c={Danger:"danger",Primary:"primary",Secondary:"secondary",Success:"success"},l={Bottom:"bottom",Left:"left",Right:"right",Top:"top"},t={name:"Basic tooltip",render:()=>o.jsxs(o.Fragment,{children:[o.jsx(m,{}),o.jsx(i,{id:"test",parent:o.jsx(p,{colour:"primary",size:"lg",children:"Hover over me"}),placement:e.select("Placement",l,"bottom"),colour:e.select("Colour",c,"primary"),message:e.text("Text","This is a tooltip!")})]})};var r,s,a;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  name: 'Basic tooltip',
  render: () => <>
      <BaseStyles />

      <Tooltip id="test" parent={<Button colour="primary" size="lg">
            Hover over me
          </Button>} placement={select('Placement', placement, 'bottom') as 'bottom' | 'left' | 'right' | 'top'} colour={select('Colour', colour, 'primary') as 'danger' | 'primary' | 'secondary' | 'success'} message={text('Text', 'This is a tooltip!')} />
    </>
}`,...(a=(s=t.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const v=["BasicTooltip"];export{t as BasicTooltip,v as __namedExportsOrder,S as default};
