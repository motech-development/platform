import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CE7dcNzi.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Locale as l,n as u,t as d}from"./BreezeProvider.stories-jffHVjb0.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Provides the locale, appearance and styles that Breeze UI components require.`}),`
`,(0,m.jsx)(t.h1,{id:`breezeprovider`,children:`BreezeProvider`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`BreezeProvider`}),` provides the locale, appearance and styles that Breeze UI components require. Render it once, above every Breeze UI component. Components rendered without a provider throw an error.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB">
  <Button>Save changes</Button>
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`locale`,children:`Locale`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`locale`}),` takes a BCP 47 language tag. It sets the `,(0,m.jsx)(t.code,{children:`lang`}),` attribute and the text direction of the provider's root element.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Only English (`,(0,m.jsx)(t.code,{children:`en-GB`}),`) messages are bundled. Supply partial `,(0,m.jsx)(t.code,{children:`messages`}),` to translate Breeze's loading announcement and appearance control into the provider locale. Without an override, Breeze's own text uses English and is marked `,(0,m.jsx)(t.code,{children:`lang="en-GB"`}),`, independently of the surrounding content's language.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="fr-FR" messages={{ loading: 'Chargement' }}>
  <Button loading>Enregistrer</Button>
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`appearance`,children:`Appearance`}),`
`,(0,m.jsxs)(t.p,{children:[`Appearance defaults to `,(0,m.jsx)(t.code,{children:`automatic`}),`, which follows the operating system and keeps following it when the preference changes. The provider resolves the choice to `,(0,m.jsx)(t.code,{children:`light`}),` or `,(0,m.jsx)(t.code,{children:`dark`}),`, then applies that value and the matching `,(0,m.jsx)(t.code,{children:`color-scheme`}),` to the document element.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`defaultAppearance`}),` when Breeze should hold the current choice in memory:`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider
  defaultAppearance="automatic"
  locale="en-GB"
  onAppearanceChange={(appearance) => saveAppearance(appearance)}
>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`appearance`}),` with `,(0,m.jsx)(t.code,{children:`onAppearanceChange`}),` when application state controls it. `,(0,m.jsx)(t.code,{children:`appearance`}),` and `,(0,m.jsx)(t.code,{children:`defaultAppearance`}),` are mutually exclusive.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider
  appearance={appearance}
  locale="en-GB"
  onAppearanceChange={setAppearance}
>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsx)(t.p,{children:`The provider never reads or writes durable browser storage. The application decides whether and where to persist the reported choice. If a persisted explicit choice must apply before the application starts, stamp its resolved value on the document element before loading the stylesheet; the stylesheet's media-query default already handles automatic dark mode before script runs.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};