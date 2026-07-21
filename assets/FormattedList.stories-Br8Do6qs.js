import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{n,t as r}from"./FormattedList-DFTqNzcK.js";var i=e({Conjunction:()=>o,Disjunction:()=>s,__namedExportsOrder:()=>c,default:()=>a}),a,o,s,c,l=t((()=>{n(),a={component:r,title:`Formatting/FormattedList`},o={args:{values:[`PDF`,`JPG`,`PNG`]}},s={args:{options:{type:`disjunction`},values:[`Email`,`telephone`,`post`]}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    values: ['PDF', 'JPG', 'PNG']
  }
}`,...o.parameters?.docs?.source},description:{story:`Joins an ordered set of supported file labels with the provider locale's
default conjunction, punctuation, and final separator.

@summary locale-aware conjunction for ordered inline labels`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    options: {
      type: 'disjunction'
    },
    values: ['Email', 'telephone', 'post']
  }
}`,...s.parameters?.docs?.source},description:{story:`Uses disjunction formatting when the application means any one of several
contact methods rather than treating the values as a semantic list.

@summary locale-aware disjunction for alternative inline values`,...s.parameters?.docs?.description}}};try{a.displayName=`FormattedList`,a.__docgenInfo={description:`Joins an ordered text list using the provider locale.`,displayName:`FormattedList`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/formatting/FormattedList/FormattedList.stories.tsx`,methods:[],props:{options:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/formatting/FormattedList/FormattedList.tsx`,name:`FormattedListProps`}],description:"`Intl.ListFormat` options.",name:`options`,parent:{fileName:`breeze-ui/src/formatting/FormattedList/FormattedList.tsx`,name:`FormattedListProps`},required:!1,tags:{},type:{name:`ListFormatOptions | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/formatting/FormattedList/FormattedList.tsx`,name:`FormattedListProps`}],description:`Ref to the rendered span.`,name:`ref`,parent:{fileName:`breeze-ui/src/formatting/FormattedList/FormattedList.tsx`,name:`FormattedListProps`},required:!1,tags:{},type:{name:`Ref<HTMLSpanElement> | undefined`}},values:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/formatting/FormattedList/FormattedList.tsx`,name:`FormattedListProps`}],description:`Ordered text values to join.`,name:`values`,parent:{fileName:`breeze-ui/src/formatting/FormattedList/FormattedList.tsx`,name:`FormattedListProps`},required:!0,tags:{},type:{name:`readonly string[]`}}},tags:{summary:`locale-aware inline conjunction or disjunction text`}}}catch{}try{o.displayName=`Conjunction`,o.__docgenInfo={description:`Joins an ordered set of supported file labels with the provider locale's
default conjunction, punctuation, and final separator.`,displayName:`Conjunction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/formatting/FormattedList/FormattedList.stories.tsx`,methods:[],props:{},tags:{summary:`locale-aware conjunction for ordered inline labels`}}}catch{}try{s.displayName=`Disjunction`,s.__docgenInfo={description:`Uses disjunction formatting when the application means any one of several
contact methods rather than treating the values as a semantic list.`,displayName:`Disjunction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/formatting/FormattedList/FormattedList.stories.tsx`,methods:[],props:{},tags:{summary:`locale-aware disjunction for alternative inline values`}}}catch{}c=[`Conjunction`,`Disjunction`]}));l();export{o as Conjunction,s as Disjunction,c as __namedExportsOrder,a as default,l as n,i as t};