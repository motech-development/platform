import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Description as d,Error as f,FreeText as p,Loading as m,NoMatches as h,ReadOnly as g,n as _,t as v}from"./ComboBox.stories-CZDeXoSW.js";function y(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:v,summary:`A filterable suggestion field with optional free text.`}),`
`,(0,x.jsx)(t.h1,{id:`combobox`,children:`ComboBox`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`ComboBox`}),` is a text field with a list of suggestions that filters as people type. Use it when there are too many options to scan in a select, or when people may enter their own value.`]}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsx)(t.h2,{id:`items`,children:`Items`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass your data as `,(0,x.jsx)(t.code,{children:`items`}),`, and use `,(0,x.jsx)(t.code,{children:`getItem`}),` to return an `,(0,x.jsx)(t.code,{children:`ItemDescriptor`}),` for each one. It has an `,(0,x.jsx)(t.code,{children:`id`}),` and a `,(0,x.jsx)(t.code,{children:`label`}),`, plus an optional `,(0,x.jsx)(t.code,{children:`description`}),`, `,(0,x.jsx)(t.code,{children:`icon`}),`, `,(0,x.jsx)(t.code,{children:`badge`}),` and `,(0,x.jsx)(t.code,{children:`disabled`}),` flag. Items are rendered from these fields only.`]}),`
`,(0,x.jsx)(a,{of:d}),`
`,(0,x.jsx)(t.h2,{id:`filtering-and-free-text`,children:`Filtering and free text`}),`
`,(0,x.jsxs)(t.p,{children:[`Typing filters the suggestions by their labels. Set `,(0,x.jsx)(t.code,{children:`allowsCustomValue`}),` to also accept text that does not match a suggestion; `,(0,x.jsx)(t.code,{children:`onChange`}),` then receives the selected item, the entered text or `,(0,x.jsx)(t.code,{children:`null`}),`.`]}),`
`,(0,x.jsxs)(t.p,{children:[`When nothing matches, or `,(0,x.jsx)(t.code,{children:`items`}),` is empty, the list stays open with a message that repeats the entered text. With `,(0,x.jsx)(t.code,{children:`allowsCustomValue`}),`, the list closes instead, because the entered text is already a valid value.`]}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(t.h2,{id:`validation`,children:`Validation`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`error`}),` to a non-empty message to show it and mark the field invalid. Set `,(0,x.jsx)(t.code,{children:`required`}),` to mark the field as required.`]}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsx)(t.h2,{id:`read-only-and-disabled`,children:`Read only and disabled`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`readOnly`}),` to show a value that cannot be changed, or `,(0,x.jsx)(t.code,{children:`disabled`}),` to prevent interaction.`]}),`
`,(0,x.jsx)(a,{of:g}),`
`,(0,x.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`loading`}),` while the value is unavailable. The field keeps its shape and cannot be used until loading ends.`]}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass `,(0,x.jsx)(t.code,{children:`value`}),` and `,(0,x.jsx)(t.code,{children:`onChange`}),` to control the field. `,(0,x.jsx)(t.code,{children:`onChange`}),` receives the selected item, custom text or `,(0,x.jsx)(t.code,{children:`null`}),`.`]}),`
`,(0,x.jsxs)(t.p,{children:[`For an uncontrolled field, use `,(0,x.jsx)(t.code,{children:`defaultValue`}),` with an optional `,(0,x.jsx)(t.code,{children:`onChange`}),`. Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,x.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event. It reports once when focus leaves the whole field: using the
suggestions button and choosing a suggestion do not count.`]}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,x.jsxs)(t.ul,{children:[`
`,(0,x.jsx)(t.li,{children:`The visible label names the input, and its description and error are announced with it.`}),`
`,(0,x.jsx)(t.li,{children:`Use the arrow keys to move through the suggestions, Enter to choose one and Escape to close the list.`}),`
`]}),`
`,(0,x.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,x.jsx)(i,{})]})}function b(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;e((()=>{x=t(),s(),r(),_()}))();export{b as default};