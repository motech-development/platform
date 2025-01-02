import{j as o,B as m}from"./BaseStyles-5cc577b5.js";import{d as e}from"./index-b271393a.js";import{B as c}from"./Button-2edf0684.js";import{T as i}from"./Tooltip-9ebde6b7.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";import"./BaseButton-94a046be.js";import"./polished.esm-8995ec32.js";import"./Loader-96caa853.js";import"./usePopper-6b5093f0.js";import"./index-d600d685.js";const b={component:i,decorators:[e.withKnobs]},p={Danger:"danger",Primary:"primary",Secondary:"secondary",Success:"success"},l={Bottom:"bottom",Left:"left",Right:"right",Top:"top"},t={name:"Basic tooltip",render:()=>o.jsxs(o.Fragment,{children:[o.jsx(m,{}),o.jsx(i,{id:"test",parent:o.jsx(c,{colour:"primary",size:"lg",children:"Hover over me"}),placement:e.select("Placement",l,"bottom"),colour:e.select("Colour",p,"primary"),message:e.text("Text","This is a tooltip!")})]})};var r,s,a;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  name: 'Basic tooltip',
  render: () => <>
      <BaseStyles />

      <Tooltip id="test" parent={<Button colour="primary" size="lg">
            Hover over me
          </Button>} placement={select('Placement', placement, 'bottom') as 'bottom' | 'left' | 'right' | 'top'} colour={select('Colour', colour, 'primary') as 'danger' | 'primary' | 'secondary' | 'success'} message={text('Text', 'This is a tooltip!')} />
    </>
}`,...(a=(s=t.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const S=["BasicTooltip"];export{t as BasicTooltip,S as __namedExportsOrder,b as default};
