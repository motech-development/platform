import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{n,t as r}from"./FormattedNumber-B-NxIXb-.js";var i=e({Currency:()=>s,Decimal:()=>o,__namedExportsOrder:()=>c,default:()=>a}),a,o,s,c,l=t((()=>{n(),a={component:r,title:`Formatting/FormattedNumber`},o={args:{options:{maximumFractionDigits:2,minimumFractionDigits:2},value:24862.4}},s={args:{options:{currency:`GBP`,style:`currency`},value:1042.16}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    options: {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    },
    value: 24862.4
  }
}`,...o.parameters?.docs?.source},description:{story:`Applies an application-owned two-decimal display policy to a domain-neutral
numeric value using the locale supplied by BreezeProvider.

@summary localized decimal with fixed application-owned precision`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    options: {
      currency: 'GBP',
      style: 'currency'
    },
    value: 1042.16
  }
}`,...s.parameters?.docs?.source},description:{story:`Supplies GBP currency meaning explicitly through Intl options so the
formatter can localize the symbol, grouping, and decimal presentation.

@summary localized GBP currency from explicit Intl options`,...s.parameters?.docs?.description}}};try{a.displayName=`FormattedNumber`,a.__docgenInfo={description:`Formats a domain-neutral number using the Breeze provider locale.`,displayName:`FormattedNumber`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/formatting/FormattedNumber/FormattedNumber.stories.tsx`,methods:[],props:{options:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/formatting/FormattedNumber/FormattedNumber.tsx`,name:`FormattedNumberProps`}],description:"`Intl.NumberFormat` options applied using the provider locale.",name:`options`,parent:{fileName:`breeze-ui/src/formatting/FormattedNumber/FormattedNumber.tsx`,name:`FormattedNumberProps`},required:!1,tags:{},type:{name:`NumberFormatOptions | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/formatting/FormattedNumber/FormattedNumber.tsx`,name:`FormattedNumberProps`}],description:`Ref to the rendered span.`,name:`ref`,parent:{fileName:`breeze-ui/src/formatting/FormattedNumber/FormattedNumber.tsx`,name:`FormattedNumberProps`},required:!1,tags:{},type:{name:`Ref<HTMLSpanElement> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/formatting/FormattedNumber/FormattedNumber.tsx`,name:`FormattedNumberProps`}],description:`Numeric value to format.`,name:`value`,parent:{fileName:`breeze-ui/src/formatting/FormattedNumber/FormattedNumber.tsx`,name:`FormattedNumberProps`},required:!0,tags:{},type:{name:`number | bigint`}}},tags:{summary:`locale-aware domain-neutral numeric output`}}}catch{}try{o.displayName=`Decimal`,o.__docgenInfo={description:`Applies an application-owned two-decimal display policy to a domain-neutral
numeric value using the locale supplied by BreezeProvider.`,displayName:`Decimal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/formatting/FormattedNumber/FormattedNumber.stories.tsx`,methods:[],props:{},tags:{summary:`localized decimal with fixed application-owned precision`}}}catch{}try{s.displayName=`Currency`,s.__docgenInfo={description:`Supplies GBP currency meaning explicitly through Intl options so the
formatter can localize the symbol, grouping, and decimal presentation.`,displayName:`Currency`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/formatting/FormattedNumber/FormattedNumber.stories.tsx`,methods:[],props:{},tags:{summary:`localized GBP currency from explicit Intl options`}}}catch{}c=[`Decimal`,`Currency`]}));l();export{s as Currency,o as Decimal,c as __namedExportsOrder,a as default,l as n,i as t};