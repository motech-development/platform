import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-noU9Sgrf.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Locale as l,n as u,t as d}from"./BreezeProvider.stories-CzIQU-eB.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Provides the locale and styles that Breeze UI components require.`}),`
`,(0,m.jsx)(t.h1,{id:`breezeprovider`,children:`BreezeProvider`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`BreezeProvider`}),` provides the locale and styles that Breeze UI components require. Render it once, above every Breeze UI component. Components rendered without a provider throw an error.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB">
  <Button>Save changes</Button>
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`locale`,children:`Locale`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`locale`}),` takes a BCP 47 language tag. It sets the `,(0,m.jsx)(t.code,{children:`lang`}),` attribute and the text direction of the provider's root element.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Only English (`,(0,m.jsx)(t.code,{children:`en-GB`}),`) messages are bundled. Supply `,(0,m.jsx)(t.code,{children:`messages`}),` to translate Breeze's loading announcement into the provider locale. Without an override, the announcement uses the English message and is marked `,(0,m.jsx)(t.code,{children:`lang="en-GB"`}),`, independently of the surrounding content's language.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="fr-FR" messages={{ loading: 'Chargement' }}>
  <Button loading>Enregistrer</Button>
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`colour-scheme`,children:`Colour scheme`}),`
`,(0,m.jsxs)(t.p,{children:[`Components follow the operating system colour scheme. To set the scheme from your application, add `,(0,m.jsx)(t.code,{children:`data-theme="light"`}),` or `,(0,m.jsx)(t.code,{children:`data-theme="dark"`}),` to the `,(0,m.jsx)(t.code,{children:`html`}),` element.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};