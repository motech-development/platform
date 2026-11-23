import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Locale as l,n as u,t as d}from"./BreezeProvider.stories-jIbyM9vH.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Provides the locale, appearance and styles that Breeze UI components require.`}),`
`,(0,m.jsx)(t.h1,{id:`breezeprovider`,children:`BreezeProvider`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`BreezeProvider`}),` supplies the locale, appearance and messages that Breeze UI components need. Render it once, at the root of your application, above every Breeze UI component. A component rendered outside a provider throws an error.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB">
  <Button>Save changes</Button>
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`locale`,children:`Locale`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`locale`}),` takes a BCP 47 language tag, such as `,(0,m.jsx)(t.code,{children:`en-GB`}),` or `,(0,m.jsx)(t.code,{children:`fr-FR`}),`. It sets the language and text direction of everything inside the provider, and the locale used to format numbers, amounts and dates.`]}),`
`,(0,m.jsx)(t.h3,{id:`translating-messages`,children:`Translating messages`}),`
`,(0,m.jsxs)(t.p,{children:[`Breeze includes English (`,(0,m.jsx)(t.code,{children:`en-GB`}),`) text only. To translate it, pass a partial `,(0,m.jsx)(t.code,{children:`messages`}),` object; any key you leave out stays in English and is marked as English for screen readers, whatever the page language. Messages cover:`]}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`loading and required-field announcements`}),`
`,(0,m.jsxs)(t.li,{children:[`the `,(0,m.jsx)(t.code,{children:`DatePicker`}),` placeholder, Today and clear actions`]}),`
`,(0,m.jsxs)(t.li,{children:[`the `,(0,m.jsx)(t.code,{children:`ComboBox`}),` no-match message and the `,(0,m.jsx)(t.code,{children:`RowList`}),` empty message`]}),`
`,(0,m.jsx)(t.li,{children:(0,m.jsx)(t.code,{children:`AppearanceControl`})}),`
`,(0,m.jsx)(t.li,{children:`the close button on overlays`}),`
`,(0,m.jsxs)(t.li,{children:[`the `,(0,m.jsx)(t.code,{children:`Popover`}),` unread indicator`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`FileDropZone`}),` instructions and feedback`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`DocumentViewer`}),` controls and messages`]}),`
`,(0,m.jsx)(t.li,{children:`attachment labels and actions`}),`
`,(0,m.jsxs)(t.li,{children:[`the `,(0,m.jsx)(t.code,{children:`SkipLink`}),` text and the `,(0,m.jsx)(t.code,{children:`ApplicationShell`}),` navigation label`]}),`
`]}),`
`,(0,m.jsx)(t.p,{children:`Other built-in interaction labels are available in English only.`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider
  locale="fr-FR"
  messages={{ loading: 'Chargement', selectDate: 'Sélectionner une date' }}
>
  <Button loading>Enregistrer</Button>
  <DatePicker label="Date" />
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.p,{children:`Some messages contain placeholders that are replaced with values. Keep them in your translations:`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`{query}`}),` in `,(0,m.jsx)(t.code,{children:`comboBoxNoMatches`}),` is the text the person typed.`]}),`
`,(0,m.jsxs)(t.li,{children:[`In the `,(0,m.jsx)(t.code,{children:`FileDropZone`}),` messages, `,(0,m.jsx)(t.code,{children:`{types}`}),` is the accepted file types, `,(0,m.jsx)(t.code,{children:`{size}`}),` the size limit, `,(0,m.jsx)(t.code,{children:`{count}`}),` the number of files added, `,(0,m.jsx)(t.code,{children:`{current}`}),` and `,(0,m.jsx)(t.code,{children:`{max}`}),` the attachment count and limit, `,(0,m.jsx)(t.code,{children:`{fileName}`}),` a rejected file, and `,(0,m.jsx)(t.code,{children:`{fileNames}`}),` the files rejected for exceeding the total limit.`]}),`
`,(0,m.jsxs)(t.li,{children:[`In the `,(0,m.jsx)(t.code,{children:`DocumentViewer`}),` messages, `,(0,m.jsx)(t.code,{children:`{current}`}),` and `,(0,m.jsx)(t.code,{children:`{total}`}),` in `,(0,m.jsx)(t.code,{children:`documentViewerPage`}),` are the current page and the page count, and `,(0,m.jsx)(t.code,{children:`{zoom}`}),` in `,(0,m.jsx)(t.code,{children:`documentViewerZoom`}),` is the zoom level as a percentage.`]}),`
`]}),`
`,(0,m.jsx)(t.p,{children:`For example:`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider
  locale="fr-FR"
  messages={{
    fileDropZoneChooseFiles: 'Choisir des fichiers',
    fileDropZoneAddedMany: '{count} fichiers ajoutés.',
    fileDropZoneTypeRejected:
      '{fileName} : Type de fichier non accepté. Formats autorisés : {types}.',
    attachmentDocument: 'Document',
    attachmentPhoto: 'Photo',
    attachmentOpen: 'Ouvrir',
    attachmentMoreActions: 'Plus d’actions',
  }}
>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsx)(t.h2,{id:`time-zone`,children:`Time zone`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`timeZone`}),` takes an IANA time-zone name, such as `,(0,m.jsx)(t.code,{children:`Europe/London`}),`, used to format times of day. Without it, the browser's time zone is used. The provider throws a `,(0,m.jsx)(t.code,{children:`RangeError`}),` for a name the browser does not recognise.`]}),`
`,(0,m.jsx)(t.p,{children:(0,m.jsxs)(t.strong,{children:[`No component formats a time of day yet, so `,(0,m.jsx)(t.code,{children:`timeZone`}),` currently has no visible effect.`]})}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB" timeZone="Europe/London">
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`timeZone`}),` does not affect calendar dates, such as `,(0,m.jsx)(t.code,{children:`Typography`}),` with `,(0,m.jsx)(t.code,{children:`format="date"`}),`. A calendar date names a day rather than a moment in time, so it always displays the day you pass.`]}),`
`,(0,m.jsx)(t.h2,{id:`appearance`,children:`Appearance`}),`
`,(0,m.jsxs)(t.p,{children:[`Appearance can be `,(0,m.jsx)(t.code,{children:`light`}),`, `,(0,m.jsx)(t.code,{children:`dark`}),` or `,(0,m.jsx)(t.code,{children:`automatic`}),`. The default, `,(0,m.jsx)(t.code,{children:`automatic`}),`, follows the operating system's colour scheme, including when it changes while the page is open.`]}),`
`,(0,m.jsxs)(t.p,{children:[`To let the provider manage the current choice, set `,(0,m.jsx)(t.code,{children:`defaultAppearance`}),`. Use `,(0,m.jsx)(t.code,{children:`onAppearanceChange`}),` to save the choice, for example when someone changes it with `,(0,m.jsx)(t.code,{children:`AppearanceControl`}),`:`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider
  defaultAppearance="automatic"
  locale="en-GB"
  onAppearanceChange={(appearance) => saveAppearance(appearance)}
>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsxs)(t.p,{children:[`To control appearance from your own state, pass both `,(0,m.jsx)(t.code,{children:`appearance`}),` and `,(0,m.jsx)(t.code,{children:`onAppearanceChange`}),`. `,(0,m.jsx)(t.code,{children:`appearance`}),` and `,(0,m.jsx)(t.code,{children:`defaultAppearance`}),` cannot be combined.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider
  appearance={appearance}
  locale="en-GB"
  onAppearanceChange={setAppearance}
>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsx)(t.p,{children:`The provider does not save the choice. Store it wherever suits your application, such as local storage or a user profile, and pass it back on the next visit.`}),`
`,(0,m.jsxs)(t.p,{children:[`To apply a saved `,(0,m.jsx)(t.code,{children:`light`}),` or `,(0,m.jsx)(t.code,{children:`dark`}),` choice before your application's JavaScript runs, and so avoid a flash of the wrong colour scheme, set `,(0,m.jsx)(t.code,{children:`data-theme="light"`}),` or `,(0,m.jsx)(t.code,{children:`data-theme="dark"`}),` on the `,(0,m.jsx)(t.code,{children:`<html>`}),` element before the stylesheet loads. You do not need to do this for `,(0,m.jsx)(t.code,{children:`automatic`}),`: the stylesheet already follows the operating system before any script runs.`]}),`
`,(0,m.jsx)(t.h2,{id:`overlay-portal`,children:`Overlay portal`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Dialog`}),`, `,(0,m.jsx)(t.code,{children:`Drawer`}),` and `,(0,m.jsx)(t.code,{children:`Popover`}),` stay in your React tree, so context, error boundaries and events work as usual. Only their DOM is rendered in a portal, outside the provider's DOM, in a container the provider adds to `,(0,m.jsx)(t.code,{children:`document.body`}),`. To render them somewhere else, such as inside an embedded application, set `,(0,m.jsx)(t.code,{children:`portalContainer`}),` to an existing `,(0,m.jsx)(t.code,{children:`HTMLElement`}),`.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB" portalContainer={overlayContainer}>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsx)(t.p,{children:`The provider adds its own element inside that container and removes it when it unmounts. Overlays keep the provider's styles, locale and text direction wherever they render.`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`portalContainer`}),` and every overlay trigger must be in the current document. Containers in another document, such as an iframe, or inside a shadow root are not supported.`]}),`
`,(0,m.jsx)(t.h2,{id:`client-side-navigation`,children:`Client-side navigation`}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`router`}),` when your application uses a client-side router. A `,(0,m.jsx)(t.code,{children:`Link`}),` to a same-origin page then calls `,(0,m.jsx)(t.code,{children:`router.navigate`}),` with the destination and the link's `,(0,m.jsx)(t.code,{children:`transitionTypes`}),`, instead of loading a new page. Your router performs the navigation and can use browser view transitions; see `,(0,m.jsx)(`a`,{href:`./?path=/docs/guides-04-motion--docs`,target:`_top`,children:`Motion`}),`.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB" router={router}>
  <App />
</BreezeProvider>
`})}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`transitionTypes`}),` defaults to an empty list, so a `,(0,m.jsx)(t.code,{children:`navigate`}),` function that takes only the destination works unchanged. External links, downloads, links with another `,(0,m.jsx)(t.code,{children:`target`}),`, clicks with a modifier key and links containing a `,(0,m.jsx)(t.code,{children:`#`}),` fragment use normal browser navigation. See `,(0,m.jsx)(t.code,{children:`Link`}),` for details.`]}),`
`,(0,m.jsx)(t.h2,{id:`confirmations`,children:`Confirmations`}),`
`,(0,m.jsxs)(t.p,{children:[`Call `,(0,m.jsx)(t.code,{children:`useToast`}),` in a component below the provider to confirm a completed action. Up to three messages are shown at once; further messages wait and appear in the order they were sent. Each message stays on screen for 2.6 seconds.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { useToast } from '@motech-development/breeze-ui';

function SaveAction() {
  const enqueue = useToast();

  return <Button onAction={() => enqueue('Changes saved')}>Save</Button>;
}
`})}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`toastLimit`}),` to change how many messages are shown at once. Toasts are 288px wide at every screen size and have no action or dismiss button. See `,(0,m.jsx)(t.code,{children:`Toast`}),` for details.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};