import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{n as i,t as a}from"./dist-ByKaD744.js";import{a as o,i as s,n as c,r as l}from"./BreezeContext-BIB7r8Lx.js";import{t as u}from"./jsx-runtime-cM__dR4X.js";import{I as d,r as f}from"./icons-frCuGJ60.js";import{n as p,t as ee}from"./useCollectionEmptyContent-CsbFcRsc.js";import{n as m,t as h}from"./Button-BEpHfrRB.js";import{n as g,t as te}from"./Stack-0pHCj1U7.js";import{_,a as ne,c as v,d as re,f as ie,g as ae,i as oe,l as se,n as ce,o as y,r as le,s as ue,t as de,u as fe}from"./VirtualizedCollection-Bn1fGehv.js";var pe=t((()=>{ie()}));function me(e){return e===`all`?`all`:[...e]}function he(e){if(e!==void 0)return Number.isInteger(e)?Math.min(Math.max(e,1),1e3):1}function ge(e){return typeof e==`number`?`${e}px`:e}function _e(e,t){return e?t?`multiple`:`single`:`none`}function ve(e,t=`equal`){return e===null?new Map:new Map([...e.querySelectorAll(`[data-breeze-column]`)].flatMap((e,n)=>{let r=e.dataset.breezeColumn;if(r===void 0)return[];let i=e.dataset.breezeCompactLabel===`false`?void 0:e.dataset.breezeCompactLabelText;return[[r,{label:i===void 0||i.length===0?void 0:`${i}:`,track:e.dataset.breezeColumnWidth??De[t][n]??`minmax(0, 1fr)`}]]}))}function ye(e,t=ve(e)){e!==null&&e.querySelectorAll(`[data-breeze-cell-column]`).forEach(e=>{let{dataset:n}=e,r=t.get(n.breezeCellColumn??``)?.label;r!==void 0&&r.length>0?n.label=r:delete n.label})}function be(e){if(e.size!==0)return[...e.values()].map(({track:e})=>e).join(` `)}function xe(e,t){let n=ve(e,t);return ye(e,n),be(n)}function b({boundary:e=`none`,children:t,className:n,defaultSelection:r,defaultSort:i,desktopColumns:a=`equal`,disabledKeys:s,layout:c=`responsive`,multiple:u=!1,onSelectionChange:d,onSortChange:f,readOnly:p=!1,ref:ee,selection:m,sort:h,virtualization:g,...te}){l();let _=o(ee),v=(0,k.useRef)(null),[re,ie]=(0,k.useState)(i),[ae,oe]=(0,k.useState)(),se=r!==void 0||u||d!==void 0||m!==void 0,y=h??re,le=(0,k.useCallback)(e=>{v.current=e,_(e)},[_]);(0,k.useLayoutEffect)(()=>{let e=v.current;if(e===null)return()=>void 0;let t=()=>{let t=xe(e,a);oe(e=>e===t?e:t)};t();let n=new MutationObserver(t);return n.observe(e,{attributeFilter:[`data-breeze-column-width`,`data-breeze-compact-label`,`data-breeze-compact-label-text`],attributes:!0,childList:!0,subtree:!0}),()=>n.disconnect()},[t,a]);let ue=ce(g),fe=ae===void 0&&ue===void 0?void 0:{...ue,"--breeze-table-columns":ae},pe=(0,k.createElement)(ne,{...te,"aria-readonly":p||void 0,children:t,className:Oe({boundary:e,class:n,desktopColumns:a,layout:c,virtualized:g!==void 0}),"data-boundary":e,"data-breeze-table":``,"data-layout":c,"data-virtualized":g===void 0?void 0:`true`,defaultSelectedKeys:r,disabledKeys:s,onSelectionChange:e=>d?.(me(e)),onSortChange:p?void 0:e=>{let t={column:e.column,direction:e.direction};h===void 0&&ie(t),f?.(t)},ref:le,selectedKeys:m,selectionMode:_e(se,u),sortDescriptor:y===void 0?void 0:{column:y.column,direction:y.direction},style:fe});return g===void 0?pe:(0,k.createElement)(de,{configuration:g,kind:`table`},pe)}function Se({align:e=`start`,children:t,className:n,compactLabel:r=!0,id:i,ref:a,rowHeader:o=!1,sortable:s=!1,textValue:c,width:l,...u}){let d=ge(l),f=typeof t==`string`?t.trim():void 0,p=r?c??f:void 0;return(0,k.createElement)(ue,{...u,allowsSorting:s,children:t,className:Ae({align:e,class:n}),"data-breeze-column":String(i),"data-breeze-column-width":d,"data-breeze-compact-label":String(r),"data-breeze-compact-label-text":p,id:i,isRowHeader:o,ref:a,style:d===void 0?void 0:{width:l},textValue:c})}function x(e){return Se(e)}function Ce(e){return(0,k.isValidElement)(e)&&e.type===x?Se(e.props):e}function S({children:e,className:t,id:n,items:r,ref:i,...a}){let s=o(i),c=typeof e==`function`?t=>Ce(e(t)):k.Children.map(e,Ce);return(0,k.createElement)(re,{...a,children:c,className:ke({class:t}),columns:r,"data-section-key":n,dependencies:[e],ref:s})}function C({children:e,className:t,emptyContent:n,id:r,items:i,ref:a,...s}){let c=o(a),l=p(n);return(0,k.createElement)(y,{...s,children:e,className:je({class:t}),"data-section-key":r,dependencies:[e],items:i,ref:c,renderEmptyState:()=>l})}function w({children:e,className:t,id:n,items:r,ref:i,...a}){let s=o(i);return(0,k.createElement)(oe,{...a,children:e,className:Me({class:t}),"data-section-key":n,dependencies:[e],items:r,ref:s})}function T({"aria-describedby":e,className:t,disabled:n=!1,id:r,onAction:i,presentation:a=`data`,ref:s,textValue:c,tone:l=`default`,...u}){let d=o(s),f=(0,k.useCallback)(t=>{d(t),t&&(e?t.setAttribute(`aria-describedby`,e):t.removeAttribute(`aria-describedby`))},[e,d]);return(0,k.createElement)(se,{...u,className:Pe({actionable:i!==void 0,class:t,presentation:a,tone:l}),"data-presentation":a,"data-tone":l,id:r,isDisabled:n,onAction:i===void 0?void 0:()=>i(r),ref:f,textValue:c})}function E({align:e=`start`,className:t,column:n,colSpan:r,presentation:i=`data`,ref:a,textValue:s,...c}){let l=o(a),u=he(r),d=u===void 0||u<=1?void 0:{gridColumn:`span ${u} / span ${u}`},f=(0,k.useCallback)(e=>{l(e),ye(e?.closest(`[data-breeze-table]`)??null)},[l]);return(0,k.createElement)(fe,{...c,className:Fe({align:e,class:t,presentation:i}),colSpan:u,"data-breeze-cell-column":String(n),ref:f,style:d,textValue:s})}function D({position:e=`overlay`,...t}){return(0,k.createElement)(E,{...t,children:(0,we.jsx)(f,{className:`!block`,size:16}),presentation:e===`overlay`?`disclosure`:`data`})}function O({className:e,loading:t=!1,offset:n=1,onLoadMore:r,ref:i,...a}){let s=o(i),c=_({loading:t,onLoadMore:r}),l=(0,k.useRef)(null),u=(0,k.useCallback)(e=>{l.current=e,e?.removeAttribute(`aria-level`),s(e)},[s]);return(0,k.useLayoutEffect)(()=>{l.current?.removeAttribute(`aria-level`)}),(0,k.createElement)(v,{...a,className:Ne({class:e}),isLoading:t,onLoadMore:c,ref:u,scrollOffset:n})}var k,we,Te,Ee,A,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,j,Ie=t((()=>{k=e(r(),1),pe(),a(),d(),ee(),ae(),le(),s(),c(),we=u(),Te=`[&>tbody>tr]:relative [&>tbody>tr]:flex [&>tbody>tr]:flex-col [&>tbody>tr]:items-start [&>tbody>tr]:gap-2 [&>tbody>tr]:px-4 [&>tbody>tr]:py-4 [&>tfoot>tr]:relative [&>tfoot>tr]:flex [&>tfoot>tr]:flex-col [&>tfoot>tr]:items-start [&>tfoot>tr]:gap-2 [&>tfoot>tr]:px-4 [&>tfoot>tr]:py-4 [&>tbody>tr>td]:block [&>tbody>tr>td]:max-w-full [&>tbody>tr>td]:border-0 [&>tbody>tr>td]:p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:max-w-full [&>tfoot>tr>td]:border-0 [&>tfoot>tr>td]:p-0 sm:[&>thead>tr>th]:px-6 sm:[&>thead>tr>th]:py-3 sm:[&>thead>tr>th]:align-middle sm:[&>tbody>tr]:table-row sm:[&>tbody>tr]:border-0 sm:[&>tbody>tr]:p-0 sm:[&>tfoot>tr]:table-row sm:[&>tfoot>tr]:border-0 sm:[&>tfoot>tr]:p-0 sm:[&>tbody>tr>td]:table-cell sm:[&>tbody>tr>td]:border-b sm:[&>tbody>tr>td]:border-[var(--breeze-border)] sm:[&>tbody>tr>td]:px-6 sm:[&>tbody>tr>td]:py-3 sm:[&>tbody>tr>td]:align-middle sm:[&>tfoot>tr>td]:table-cell sm:[&>tfoot>tr>td]:border-b sm:[&>tfoot>tr>td]:border-[var(--breeze-border)] sm:[&>tfoot>tr>td]:px-6 sm:[&>tfoot>tr>td]:py-3 sm:[&>tfoot>tr>td]:align-middle`,Ee=`${Te} sm:!block sm:[&>thead]:!block sm:[&>tbody]:!block sm:[&>tfoot]:!block sm:[&>thead>tr]:!grid sm:[&>thead>tr]:w-full sm:[&>thead>tr]:items-center sm:[&>thead>tr]:gap-x-4 sm:[&>thead>tr]:px-6 sm:[&>thead>tr]:py-3 sm:[&>tbody>tr]:!grid sm:[&>tbody>tr]:w-full sm:[&>tbody>tr]:items-center sm:[&>tbody>tr]:gap-x-4 sm:[&>tbody>tr]:border-b sm:[&>tbody>tr]:border-[var(--breeze-border)] sm:[&>tbody>tr]:px-6 sm:[&>tbody>tr]:py-3 sm:[&>tfoot>tr]:!grid sm:[&>tfoot>tr]:w-full sm:[&>tfoot>tr]:items-center sm:[&>tfoot>tr]:gap-x-4 sm:[&>tfoot>tr]:px-6 sm:[&>tfoot>tr]:py-3 sm:[&>thead>tr>th]:!flex sm:[&>thead>tr>th]:!h-auto sm:[&>thead>tr>th]:items-center sm:[&>thead>tr>th]:!border-0 sm:[&>thead>tr>th]:!p-0 sm:[&>tbody>tr>td]:!flex sm:[&>tbody>tr>td]:!h-auto sm:[&>tbody>tr>td]:items-center sm:[&>tbody>tr>td]:!border-0 sm:[&>tbody>tr>td]:!p-0 sm:[&>tbody>tr>td:last-child]:justify-end sm:[&>tfoot>tr>td]:!flex sm:[&>tfoot>tr>td]:!h-auto sm:[&>tfoot>tr>td]:items-center sm:[&>tfoot>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!p-0`,A=`sm:[&>thead>tr]:grid-cols-[var(--breeze-table-columns)] sm:[&>tbody>tr]:grid-cols-[var(--breeze-table-columns)] sm:[&>tfoot>tr]:grid-cols-[var(--breeze-table-columns)]`,De={equal:[],mediaDetailsAction:[`2.25rem`,`minmax(0, 1.3fr)`,`minmax(0, 0.8fr)`,`minmax(0, 1.2fr)`,`1.25rem`]},Oe=i({base:`group/table block w-full border-separate border-spacing-0 text-start text-[var(--breeze-ink)] outline-none sm:table [&>tbody:last-of-type>tr:last-child]:border-b-0 sm:[&>tbody:last-of-type>tr:last-child>td]:border-b-0 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]`,compoundVariants:[{class:A,desktopColumns:`equal`,layout:`responsiveGrid`},{class:A,desktopColumns:`mediaDetailsAction`,layout:`responsiveGrid`}],defaultVariants:{boundary:`none`,desktopColumns:`equal`,layout:`responsive`,virtualized:!1},variants:{boundary:{none:``,strong:`min-w-0 border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)]`},desktopColumns:{equal:``,mediaDetailsAction:``},layout:{grid:`!grid grid-cols-[var(--breeze-table-columns)] [&>thead]:col-span-full [&>thead]:grid-cols-subgrid sm:[&>thead]:grid [&>tbody]:col-span-full [&>tbody]:grid [&>tbody]:grid-cols-subgrid [&>tfoot]:col-span-full [&>tfoot]:grid [&>tfoot]:grid-cols-subgrid sm:[&>thead>tr]:col-span-full sm:[&>thead>tr]:grid sm:[&>thead>tr]:min-h-11 sm:[&>thead>tr]:grid-cols-subgrid sm:[&>thead>tr]:items-center sm:[&>thead>tr]:px-6 [&>tbody>tr]:col-span-full [&>tbody>tr]:grid [&>tbody>tr]:min-h-11 [&>tbody>tr]:grid-cols-subgrid [&>tbody>tr]:items-center [&>tbody>tr]:px-4 sm:[&>tbody>tr]:px-6 [&>tfoot>tr]:col-span-full [&>tfoot>tr]:grid [&>tfoot>tr]:min-h-11 [&>tfoot>tr]:grid-cols-subgrid [&>tfoot>tr]:items-center [&>tfoot>tr]:px-4 sm:[&>tfoot>tr]:px-6 sm:[&>thead>tr>th]:block sm:[&>thead>tr>th]:!p-0 [&>tbody>tr>td]:block [&>tbody>tr>td]:!p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:!p-0 sm:[&>thead>tr]:border-b sm:[&>thead>tr]:border-[var(--breeze-border)] sm:[&>thead>tr>th]:border-0 [&>tbody>tr]:border-b [&>tbody>tr]:border-[var(--breeze-border)] [&>tbody>tr>td]:border-0 [&>tfoot>tr>td]:border-0 sm:[&>tbody>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!border-0`,responsive:Te,responsiveGrid:Ee},virtualized:{false:``,true:`overflow-auto sm:block`}}}),ke=i({base:`hidden bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink-muted)] sm:table-header-group`}),Ae=i({base:`border-b border-[var(--breeze-border)] px-4 py-3 text-start font-[family-name:var(--breeze-font-display)] text-base font-bold outline-none data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[allows-sorting]:cursor-pointer forced-colors:border-[CanvasText]`,defaultVariants:{align:`start`},variants:{align:{center:`text-center sm:justify-center`,end:`text-end sm:justify-end`,start:`text-start sm:justify-start`}}}),je=i({base:`block sm:table-row-group`}),Me=i({base:`block bg-[var(--breeze-surface-subtle)] sm:table-footer-group`}),Ne=i({base:`flex min-h-11 items-center justify-center px-4 py-3 text-sm text-[var(--breeze-ink-muted)]`}),Pe=i({base:`grid min-w-0 border-b border-[var(--breeze-border)] bg-[var(--breeze-surface)] py-2 outline-none sm:table-row sm:border-0 sm:py-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[selected]:bg-[var(--breeze-primary-soft)] forced-colors:data-[selected]:border-[Highlight]`,compoundVariants:[{actionable:!0,class:`data-[hovered]:bg-[var(--breeze-table-row-hover)]`,presentation:`data`,tone:`default`},{actionable:!0,class:`data-[hovered]:bg-[var(--breeze-table-row-muted-hover)]`,presentation:`data`,tone:`muted`}],defaultVariants:{presentation:`data`,tone:`default`},variants:{actionable:{false:``,true:`cursor-pointer`},presentation:{data:``,section:`min-h-11 items-center bg-[var(--breeze-table-section)] px-4 py-2 sm:bg-[var(--breeze-table-section)] sm:px-6 [&>td]:!h-auto [&>td]:!border-0 [&>td]:!p-0 [&>td]:before:!hidden`},tone:{default:``,muted:`bg-[var(--breeze-table-row-muted)] text-[var(--breeze-neutral)]`}}}),Fe=i({base:`grid min-w-0 grid-cols-[minmax(5rem,auto)_minmax(0,1fr)] gap-4 border-b border-[var(--breeze-border)] px-4 py-2 text-start [overflow-wrap:anywhere] last:border-b-0 before:me-1 before:hidden before:font-[family-name:var(--breeze-font-display)] before:text-base before:leading-[1.4] before:font-bold before:text-[var(--breeze-ink-muted)] data-[label]:before:inline-block data-[label]:before:content-[attr(data-label)] sm:table-cell sm:border-b sm:border-[var(--breeze-border)] sm:px-4 sm:py-3 sm:last:border-b sm:data-[label]:before:hidden [&>*]:min-w-0`,defaultVariants:{align:`start`},variants:{align:{center:`sm:text-center sm:justify-center`,end:`sm:text-end sm:justify-end`,start:`sm:text-start sm:justify-start`},presentation:{data:``,disclosure:`absolute end-4 top-6 h-4 w-4 text-[var(--breeze-ink-muted)] sm:static sm:h-auto sm:w-5 sm:self-stretch sm:text-end [&>*]:ms-auto [&>svg]:size-4`}}}),j={Body:C,Cell:E,Column:x,Disclosure:D,Footer:w,Header:S,LoadMore:O,Root:b,Row:T};try{b.displayName=`Root`,b.__docgenInfo={description:`Coordinates semantic table navigation, row state, sorting, and responsive labels.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{boundary:{defaultValue:{value:`none`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Optional visual treatment for the table's lower edge. Defaults to `none`.",name:`boundary`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableBoundary | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ordered header, body, and optional footer sections.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Keys whose rows cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},desktopColumns:{defaultValue:{value:`equal`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`.",name:`desktopColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableDesktopColumns | undefined`}},layout:{defaultValue:{value:`responsive`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`.",name:`layout`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableLayout | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Enables multiple row selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ref to the rendered table or virtualized grid element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Optional fixed- or variable-height row windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Current selected row keys.
Current immutable selected row keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Called with the next selected row keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Excluded when selection is controlled.
Initial selected row keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks controlled row selection and sorting as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Current consumer-owned sort descriptor.
Excluded when sorting is uncontrolled.`,name:`sort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}},onSortChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Called when a sortable heading requests a new descriptor.
Called when the internally retained descriptor changes.`,name:`onSortChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`((sort: TableSort) => void) | ((sort: TableSort) => void) | undefined`}},defaultSort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Excluded when sorting is controlled.
Initial sort descriptor.`,name:`defaultSort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}}},tags:{}}}catch{}try{x.displayName=`Column`,x.__docgenInfo={description:`Renders one accessible heading that can optionally request sorting.`,displayName:`Column`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Heading alignment. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Visible accessible column heading.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Derives a compact record label from this heading. Defaults to `true`.",name:`compactLabel`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Stable string or number column key.`,name:`id`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!0,tags:{},type:{name:`CollectionKey`}},rowHeader:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Marks this heading as the row label announced during cell navigation. Defaults to `false`.",name:`rowHeader`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sortable:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Allows this heading to request sort changes. Defaults to `false`.",name:`sortable`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Ref to the rendered column heading.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Plain-text accessible and compact label used when the visible heading is not a string.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`string | undefined`}},width:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`CSS width or grid-track size. Numeric values are pixels; omitted columns share remaining responsive-grid space.`,name:`width`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`TableColumnWidth | undefined`}}},tags:{}}}catch{}try{S.displayName=`Header`,S.__docgenInfo={description:`Renders static or generic accessible column headings.`,displayName:`Header`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Column> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Column) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table header.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{C.displayName=`Body`,C.__docgenInfo={description:`Renders a stable ordered table body with static or generic rows.`,displayName:`Body`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},emptyContent:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Content displayed when this body has no rows.`,name:`emptyContent`,required:!1,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table body.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{w.displayName=`Footer`,w.__docgenInfo={description:`Renders a stable ordered table footer with static or generic rows.`,displayName:`Footer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table footer.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{T.displayName=`Row`,T.__docgenInfo={description:`Renders one keyed row whose cells follow heading order.`,displayName:`Row`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Ordered cells matching every visible table heading exactly once and in the same order, including after conditional column changes.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Prevents focus, selection, and actions for this row. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Stable string or number row key.`,name:`id`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`CollectionKey`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Called with this row key when its action is invoked.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`((key: CollectionKey) => void) | undefined`}},presentation:{defaultValue:{value:`data`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Record or grouped section geometry. Defaults to `data`.",name:`presentation`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`TableRowPresentation | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Ref to the rendered row.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableRowElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Plain-text row representation used for typeahead and accessibility.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`string`}},tone:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Domain-neutral visual emphasis. Defaults to `default`.",name:`tone`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`TableRowTone | undefined`}}},tags:{}}}catch{}try{E.displayName=`Cell`,E.__docgenInfo={description:`Renders one data cell and derives its compact label from the matching heading.`,displayName:`Cell`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:{value:`start`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Cell alignment at table widths. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Visible cell content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`ReactNode`}},column:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Stable key of the corresponding column heading.`,name:`column`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`CollectionKey`}},presentation:{defaultValue:{value:`data`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Canonical content geometry. `disclosure` positions one bare arrow for an actionable row. Defaults to `data`.",name:`presentation`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"data" | "disclosure" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Ref to the rendered data cell.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Plain-text cell value used for accessibility when content is not text.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}try{D.displayName=`Disclosure`,D.__docgenInfo={description:`Renders the canonical bare arrow for an actionable row.`,displayName:`Disclosure`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Cell alignment at table widths. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},column:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Stable key of the corresponding column heading.`,name:`column`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`CollectionKey`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Ref to the rendered data cell.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},position:{defaultValue:{value:`overlay`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableDisclosureProps`}],description:"Position over a standard compact row or remain in an explicit grid track. Defaults to `overlay`.",name:`position`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableDisclosureProps`},required:!1,tags:{},type:{name:`"flow" | "overlay" | undefined`}}},tags:{}}}catch{}try{O.displayName=`LoadMore`,O.__docgenInfo={description:`Renders a loading row and deduplicated intersection sentinel.`,displayName:`LoadMore`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Visible loading-row content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!0,tags:{},type:{name:`ReactNode`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:"Shows the loading row and suppresses duplicate requests. Defaults to `false`.",name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onLoadMore:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Called once when more consumer-owned rows should be requested.`,name:`onLoadMore`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!0,tags:{},type:{name:`() => void | Promise<void>`}},offset:{defaultValue:{value:`1`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:"Trigger distance as a proportion of the scroll viewport. Defaults to `1`.",name:`offset`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`number | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Ref to the rendered native or virtualized loading row.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement | HTMLTableRowElement> | undefined`}}},tags:{}}}catch{}try{j.displayName=`Table`,j.__docgenInfo={description:`Coordinates ordered static or generic table sections, responsive record
labels, row interaction, consumer-owned sorting, and optional virtualization.`,displayName:`Table`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{},tags:{summary:`responsive compound data table with optional virtualization`}}}catch{}})),Le=n({ActionsStayWithApplications:()=>$,ConditionalOrderedColumns:()=>Y,ControlledSortingAndSelection:()=>R,GridGroupedSections:()=>V,ReadOnlyAndEmpty:()=>X,ResponsiveGridColumnVariant:()=>H,ResponsiveGridColumnWidths:()=>U,ResponsiveGroupedSections:()=>W,ResponsiveItems:()=>q,ResponsiveItemsCompact:()=>J,RowTonesAndSections:()=>G,RowTonesAndSectionsCompact:()=>K,StaticOrderedSections:()=>z,StrongBoundary:()=>B,VariableVirtualizationAndLoading:()=>Z,VariableVirtualizationAndLoadingCompact:()=>Q,__namedExportsOrder:()=>We,default:()=>L});function Re(){let[e,t]=(0,M.useState)([1]),[n,r]=(0,M.useState)({column:`name`,direction:`ascending`});return(0,N.jsxs)(j.Root,{"aria-label":`Controlled items`,onSelectionChange:t,onSortChange:r,selection:e,sort:n,children:[(0,N.jsxs)(j.Header,{id:`headings`,children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,sortable:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`state`,sortable:!0,children:`State`})]}),(0,N.jsxs)(j.Body,{id:`items`,children:[(0,N.jsxs)(j.Row,{id:1,textValue:`Alpha Ready`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`})]}),(0,N.jsxs)(j.Row,{id:2,textValue:`Beta In review`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Beta`}),(0,N.jsx)(j.Cell,{column:`state`,children:`In review`})]}),(0,N.jsxs)(j.Row,{id:3,textValue:`Gamma Draft`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Gamma`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Draft`})]})]})]})}function ze(){return(0,N.jsxs)(j.Root,{"aria-label":`Semantic row presentations`,className:`grid-cols-2`,layout:`grid`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{align:`end`,id:`score`,children:`Score`})]}),(0,N.jsxs)(j.Body,{children:[(0,N.jsxs)(j.Row,{id:`group-a`,presentation:`section`,textValue:`Group A 20`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Group A`}),(0,N.jsx)(j.Cell,{align:`end`,column:`score`,children:`20`})]}),(0,N.jsxs)(j.Row,{id:`active`,onAction:()=>void 0,textValue:`Active 30`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Active`}),(0,N.jsx)(j.Cell,{align:`end`,column:`score`,children:`30`})]}),(0,N.jsxs)(j.Row,{id:`paused`,onAction:()=>void 0,textValue:`Paused 10`,tone:`muted`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Paused`}),(0,N.jsx)(j.Cell,{align:`end`,column:`score`,children:`10`})]})]})]})}async function Be(e){let t=I(e),n=t.getByRole(`row`,{name:`Group A`}),r=t.getByRole(`row`,{name:`Active`}),i=t.getByRole(`row`,{name:`Paused`}),a=e.ownerDocument.defaultView;await P(n).toHaveAttribute(`data-presentation`,`section`),await P(n.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await P(a?.getComputedStyle(n).backgroundColor).toBe(`rgb(223, 228, 236)`),await P(a?.getComputedStyle(r).backgroundColor).toBe(`rgb(255, 255, 255)`),await P(i).toHaveAttribute(`data-tone`,`muted`),await P(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(241, 243, 246)`),await F.hover(r),await P(a?.getComputedStyle(r).backgroundColor).toBe(`rgb(248, 250, 255)`),await F.unhover(r),await F.hover(i),await P(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(233, 237, 242)`)}function Ve(){return(0,N.jsxs)(j.Root,{"aria-label":`Responsive items`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{compactLabel:!1,id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`state`,children:`State`})]}),(0,N.jsxs)(j.Body,{children:[(0,N.jsxs)(j.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`})]}),(0,N.jsxs)(j.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Beta`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Review`})]})]})]})}function He(){return(0,N.jsxs)(j.Root,{"aria-label":`Virtual data`,virtualization:{estimatedRowHeight:52,mode:`variable`,overscan:80,viewportHeight:156},children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`state`,children:`State`})]}),(0,N.jsxs)(j.Body,{children:[(0,N.jsxs)(j.Row,{id:1,textValue:`Alpha Ready`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`})]}),(0,N.jsxs)(j.Row,{id:2,textValue:`Beta In review`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Beta`}),(0,N.jsx)(j.Cell,{column:`state`,children:`In review`})]}),(0,N.jsxs)(j.Row,{id:3,textValue:`Gamma Draft`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Gamma`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Draft`})]}),(0,N.jsx)(j.LoadMore,{loading:!0,onLoadMore:()=>void 0,children:`Loading more items`})]})]})}async function Ue(e){let t=I(e),n=t.getByRole(`grid`,{name:`Virtual data`}),r=t.getByRole(`row`,{name:`Alpha`}),i=t.getByRole(`row`,{name:`Beta`}),a=t.getByRole(`rowheader`,{name:`Alpha`}),o=t.getByRole(`gridcell`,{name:`Ready`}),s=r.getBoundingClientRect(),c=a.getBoundingClientRect(),l=o.getBoundingClientRect(),u=n.getBoundingClientRect(),d=e.ownerDocument.defaultView,f=(d?.innerWidth??0)<681;if(await P(s.width).toBe(u.width),await P(d?.getComputedStyle(r).borderBottomWidth).toBe(f?`1px`:`0px`),f){let e=i.getBoundingClientRect();await P(c.width).toBe(l.width),await P(c.x).toBe(l.x),await P(l.y).toBeGreaterThan(c.y),await P(s.bottom).toBeLessThanOrEqual(e.y),await P(n.scrollWidth).toBe(n.clientWidth);return}let p=t.getByRole(`columnheader`,{name:`Name`}),ee=t.getByRole(`columnheader`,{name:`State`}),m=p.getBoundingClientRect(),h=ee.getBoundingClientRect();await P(c.width).toBe(m.width),await P(l.width).toBe(h.width),await P(c.right).toBe(l.left),await P(d?.getComputedStyle(a).borderBottomWidth).toBe(`1px`),await P(d?.getComputedStyle(o).borderBottomWidth).toBe(`1px`)}var M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,We,Ge=t((()=>{M=e(r(),1),m(),g(),Ie(),N=u(),{expect:P,userEvent:F,within:I}=__STORYBOOK_MODULE_TEST__,L={component:b,decorators:[e=>(Object.assign(j.Body,{displayName:`Table.Body`}),Object.assign(j.Cell,{displayName:`Table.Cell`}),Object.assign(j.Column,{displayName:`Table.Column`}),Object.assign(j.Disclosure,{displayName:`Table.Disclosure`}),Object.assign(j.Footer,{displayName:`Table.Footer`}),Object.assign(j.Header,{displayName:`Table.Header`}),Object.assign(j.LoadMore,{displayName:`Table.LoadMore`}),Object.assign(j.Root,{displayName:`Table.Root`}),Object.assign(j.Row,{displayName:`Table.Row`}),(0,N.jsx)(e,{}))],subcomponents:{Body:C,Cell:E,Column:x,Disclosure:D,Footer:w,Header:S,LoadMore:O,Row:T},title:`Collections/Table`},R={args:{"aria-label":`Items`,children:null},play:async({canvasElement:e})=>{let t=I(e);await F.click(t.getByRole(`columnheader`,{name:`Name`})),await P(t.getByRole(`columnheader`,{name:`Name`})).toHaveAttribute(`aria-sort`,`descending`),await P(t.getByRole(`rowheader`,{name:`Alpha`})).toHaveAttribute(`data-label`,`Name:`)},render:Re},z={args:{"aria-label":`Static data`,children:null},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Static data`,children:[(0,N.jsxs)(j.Header,{id:`heading-section`,children:[(0,N.jsx)(j.Column,{id:`label`,rowHeader:!0,children:`Label`}),(0,N.jsx)(j.Column,{id:`value`,children:`Value`})]}),(0,N.jsx)(j.Body,{id:`body-section`,children:(0,N.jsxs)(j.Row,{id:`first`,textValue:`First Long value`,children:[(0,N.jsx)(j.Cell,{column:`label`,children:`First`}),(0,N.jsx)(j.Cell,{column:`value`,children:`A long value that wraps in the responsive card presentation`})]})}),(0,N.jsx)(j.Footer,{id:`footer-section`,children:(0,N.jsxs)(j.Row,{id:`summary`,textValue:`Summary One item`,children:[(0,N.jsx)(j.Cell,{column:`label`,children:`Summary`}),(0,N.jsx)(j.Cell,{column:`value`,children:`One item`})]})})]})},B={args:{"aria-label":`Bounded items`,boundary:`strong`,children:null},play:async({canvasElement:e})=>{let t=I(e).getByRole(`grid`,{name:`Bounded items`}),n=getComputedStyle(t);await P(t).toHaveAttribute(`data-boundary`,`strong`),await P(n.borderTopWidth).toBe(`0px`),await P(n.borderRightWidth).toBe(`0px`),await P(n.borderBottomWidth).toBe(`2px`),await P(n.borderLeftWidth).toBe(`0px`)},render:({"aria-label":e,boundary:t})=>(0,N.jsxs)(j.Root,{"aria-label":e,boundary:t,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`state`,children:`State`})]}),(0,N.jsx)(j.Body,{children:(0,N.jsxs)(j.Row,{id:`aurora`,textValue:`Aurora Ready`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Aurora`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`})]})})]})},V={args:{"aria-label":`Grouped grid items`,children:null},play:async({canvasElement:e})=>{let t=I(e),n=t.getByRole(`grid`,{name:`Grouped grid items`}),r=t.getByRole(`row`,{name:`Name State`}),i=t.getByRole(`row`,{name:`Beta`}),a=t.getByRole(`row`,{name:`Gamma`}),o=t.getByRole(`columnheader`,{name:`State`}),s=t.getByRole(`columnheader`,{name:`Name`}),c=t.getByRole(`rowheader`,{name:`Active`}),l=t.getByRole(`gridcell`,{name:`Ready`}),u=t.getByRole(`gridcell`,{name:`Review`}),d=t.getByRole(`gridcell`,{name:`Draft`}),f=e.ownerDocument.defaultView;await P(f?.getComputedStyle(n).display).toBe(`grid`),await P(f?.getComputedStyle(r.parentElement).display).toBe(`grid`),await P(f?.getComputedStyle(r).display).toBe(`grid`),await P(f?.getComputedStyle(i.parentElement).display).toBe(`grid`),await P(f?.getComputedStyle(i).display).toBe(`grid`),await P(f?.getComputedStyle(l).display).toBe(`block`),await P(c).toHaveAttribute(`colspan`,`2`),await P(c.getBoundingClientRect().left).toBeCloseTo(s.getBoundingClientRect().left,1),await P(c.getBoundingClientRect().right).toBeCloseTo(o.getBoundingClientRect().right,1),await P(f?.getComputedStyle(i).borderBottomWidth).toBe(`1px`),await P(f?.getComputedStyle(a).borderBottomWidth).toBe(`0px`),await P(l.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1),await P(u.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1),await P(d.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1)},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Grouped grid items`,className:`grid-cols-[minmax(0,1fr)_auto]`,layout:`grid`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`state`,children:`State`})]}),(0,N.jsxs)(j.Body,{id:`active`,children:[(0,N.jsx)(j.Row,{id:`active-section`,presentation:`section`,textValue:`Active`,children:(0,N.jsx)(j.Cell,{colSpan:2,column:`name`,children:`Active`})}),(0,N.jsxs)(j.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`})]}),(0,N.jsxs)(j.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Beta`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Review`})]})]}),(0,N.jsxs)(j.Body,{id:`archived`,children:[(0,N.jsx)(j.Row,{id:`archived-section`,presentation:`section`,textValue:`Archived`,children:(0,N.jsx)(j.Cell,{colSpan:2,column:`name`,children:`Archived`})}),(0,N.jsxs)(j.Row,{id:`gamma`,textValue:`Gamma Draft`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Gamma`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Draft`})]})]})]})},H={args:{"aria-label":`Responsive company records`,children:null},play:async({canvasElement:e})=>{let t=I(e),n=t.getByRole(`columnheader`,{name:`Media`}),r=t.getByRole(`columnheader`,{name:`Name`}),i=t.getByRole(`columnheader`,{name:`Number`}),a=t.getByRole(`columnheader`,{name:`Contact`}),o=t.getByRole(`columnheader`,{name:`Action`}),s=t.getByRole(`gridcell`,{name:`AC`}),c=t.getByRole(`rowheader`,{name:`Acme`});await P(n.getBoundingClientRect().width).toBeCloseTo(36,1),await P(o.getBoundingClientRect().width).toBeCloseTo(20,1),await P(r.getBoundingClientRect().width).toBeGreaterThan(a.getBoundingClientRect().width),await P(a.getBoundingClientRect().width).toBeGreaterThan(i.getBoundingClientRect().width),await P(s.getBoundingClientRect().left).toBeCloseTo(n.getBoundingClientRect().left,1),await P(c.getBoundingClientRect().left).toBeCloseTo(r.getBoundingClientRect().left,1)},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Responsive company records`,desktopColumns:`mediaDetailsAction`,layout:`responsiveGrid`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{compactLabel:!1,id:`media`,children:`Media`}),(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`number`,children:`Number`}),(0,N.jsx)(j.Column,{id:`contact`,children:`Contact`}),(0,N.jsx)(j.Column,{compactLabel:!1,id:`action`,children:`Action`})]}),(0,N.jsx)(j.Body,{children:(0,N.jsxs)(j.Row,{id:`acme`,textValue:`Acme 123 contact@example.test`,children:[(0,N.jsx)(j.Cell,{column:`media`,children:`AC`}),(0,N.jsx)(j.Cell,{column:`name`,children:`Acme`}),(0,N.jsx)(j.Cell,{column:`number`,children:`123`}),(0,N.jsx)(j.Cell,{column:`contact`,children:`contact@example.test`}),(0,N.jsx)(j.Cell,{column:`action`,children:`View`})]})})]})},U={args:{"aria-label":`Responsive records`,children:null},play:async({canvasElement:e})=>{let t=I(e),n=t.getByRole(`row`,{name:`Example record`}),r=getComputedStyle(n).gridTemplateColumns.split(` `),i=t.getByText(`Amount`),a=t.getByText(`£10.00`);await P(r[0]).toBe(`36px`),await P(r.at(-1)).toBe(`20px`),await P(a.getBoundingClientRect().right).toBeCloseTo(i.getBoundingClientRect().right,1)},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Responsive records`,layout:`responsiveGrid`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{compactLabel:!1,id:`marker`,textValue:`Marker`,width:36,children:(0,N.jsx)(`span`,{className:`sr-only`,children:`Marker`})}),(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{align:`end`,id:`amount`,width:`max-content`,children:(0,N.jsx)(`span`,{children:`Amount`})}),(0,N.jsx)(j.Column,{compactLabel:!1,id:`action`,textValue:`Action`,width:`1.25rem`,children:(0,N.jsx)(`span`,{className:`sr-only`,children:`Action`})})]}),(0,N.jsx)(j.Body,{children:(0,N.jsxs)(j.Row,{id:`record`,textValue:`Example record`,children:[(0,N.jsx)(j.Cell,{column:`marker`,children:(0,N.jsx)(`span`,{className:`flex size-9 items-center justify-center`,children:`A`})}),(0,N.jsx)(j.Cell,{column:`name`,children:`Example record`}),(0,N.jsx)(j.Cell,{align:`end`,column:`amount`,children:(0,N.jsx)(`span`,{children:`£10.00`})}),(0,N.jsx)(j.Disclosure,{column:`action`,position:`flow`})]})})]})},W={args:{"aria-label":`Grouped responsive items`,children:null},play:async({canvasElement:e})=>{let t=I(e),n=t.getByRole(`gridcell`,{name:`Review`}),r=t.getByRole(`gridcell`,{name:`Draft`}),i=e.ownerDocument.defaultView;await P(i?.getComputedStyle(n).borderBottomWidth).toBe(`1px`),await P(i?.getComputedStyle(r).borderBottomWidth).toBe(`0px`)},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Grouped responsive items`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`state`,children:`State`})]}),(0,N.jsxs)(j.Body,{id:`active`,children:[(0,N.jsxs)(j.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`})]}),(0,N.jsxs)(j.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Beta`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Review`})]})]}),(0,N.jsx)(j.Body,{id:`archived`,children:(0,N.jsxs)(j.Row,{id:`gamma`,textValue:`Gamma Draft`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Gamma`}),(0,N.jsx)(j.Cell,{column:`state`,children:`Draft`})]})})]})},G={args:{"aria-label":`Semantic row presentations`,children:null},play:async({canvasElement:e})=>Be(e),render:()=>(0,N.jsx)(ze,{})},K={args:{"aria-label":`Semantic row presentations`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>Be(e),render:()=>(0,N.jsx)(ze,{})},q={args:{"aria-label":`Responsive items`,children:null},play:async({canvasElement:e})=>{let t=I(e),n=t.getByRole(`columnheader`,{name:`Name`}),r=t.getByRole(`row`,{name:`Alpha`}),i=t.getByRole(`rowheader`,{name:`Alpha`}),a=t.getByRole(`gridcell`,{name:`Ready`}),o=t.getByRole(`gridcell`,{name:`Review`}),s=e.ownerDocument.defaultView,c=s?.getComputedStyle(n),l=s?.getComputedStyle(i),u=s?.getComputedStyle(a,`::before`);await P(n.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await P(r.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await P(c?.paddingLeft).toBe(l?.paddingLeft),await P(l?.verticalAlign).toBe(`middle`),await P(l?.borderBottomWidth).toBe(`1px`),await P(a).toHaveAttribute(`data-label`,`State:`),await P(u?.display).toBe(`none`),await P(s?.getComputedStyle(o).borderBottomWidth).toBe(`0px`)},render:()=>(0,N.jsx)(Ve,{})},J={args:{"aria-label":`Responsive items`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=I(e),n=t.getByRole(`row`,{name:`Alpha`}),r=t.getByRole(`row`,{name:`Beta`}),i=t.getByRole(`rowheader`,{name:`Alpha`}),a=t.getByRole(`gridcell`,{name:`Ready`}),o=e.ownerDocument.defaultView,s=o?.getComputedStyle(n),c=o?.getComputedStyle(a),l=o?.getComputedStyle(a,`::before`);await P(s?.display).toBe(`flex`),await P(s?.flexDirection).toBe(`column`),await P(Number.parseFloat(s?.gap??`0`)).toBeGreaterThan(0),await P(s?.borderBottomWidth).toBe(`1px`),await P(o?.getComputedStyle(r).borderBottomWidth).toBe(`0px`),await P(c?.display).toBe(`block`),await P(l?.display).toBe(`inline-block`),await P(c?.paddingTop).toBe(`0px`),await P(c?.borderBottomWidth).toBe(`0px`),await P(a).toHaveAttribute(`data-label`,`State:`),await P(i).not.toHaveAttribute(`data-label`)},render:()=>(0,N.jsx)(Ve,{})},Y={args:{"aria-label":`Conditional columns`,children:null},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Conditional columns`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`state`,children:`State`}),(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`})]}),(0,N.jsxs)(j.Body,{children:[(0,N.jsxs)(j.Row,{id:1,textValue:`Ready Alpha`,children:[(0,N.jsx)(j.Cell,{column:`state`,children:`Ready`}),(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`})]}),(0,N.jsxs)(j.Row,{id:2,textValue:`In review Beta`,children:[(0,N.jsx)(j.Cell,{column:`state`,children:`In review`}),(0,N.jsx)(j.Cell,{column:`name`,children:`Beta`})]}),(0,N.jsxs)(j.Row,{id:3,textValue:`Draft Gamma`,children:[(0,N.jsx)(j.Cell,{column:`state`,children:`Draft`}),(0,N.jsx)(j.Cell,{column:`name`,children:`Gamma`})]})]})]})},X={args:{"aria-label":`States`,children:null},render:()=>(0,N.jsxs)(te,{gap:`xl`,children:[(0,N.jsxs)(j.Root,{"aria-label":`Read-only`,readOnly:!0,selection:[1],children:[(0,N.jsx)(j.Header,{children:(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`})}),(0,N.jsx)(j.Body,{children:(0,N.jsx)(j.Row,{id:1,textValue:`Alpha`,children:(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`})})})]}),(0,N.jsxs)(j.Root,{"aria-label":`Empty`,children:[(0,N.jsx)(j.Header,{children:(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`})}),(0,N.jsx)(j.Body,{emptyContent:`No items`,children:null})]})]})},Z={args:{"aria-label":`Virtual data`,children:null},play:async({canvasElement:e})=>Ue(e),render:He},Q={args:{"aria-label":`Virtual data`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>Ue(e),render:()=>(0,N.jsx)(He,{})},$={args:{"aria-label":`Action table`,children:null},render:()=>(0,N.jsxs)(j.Root,{"aria-label":`Action table`,children:[(0,N.jsxs)(j.Header,{children:[(0,N.jsx)(j.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,N.jsx)(j.Column,{id:`action`,children:`Action`})]}),(0,N.jsx)(j.Body,{children:(0,N.jsxs)(j.Row,{id:`alpha`,textValue:`Alpha Inspect`,children:[(0,N.jsx)(j.Cell,{column:`name`,children:`Alpha`}),(0,N.jsx)(j.Cell,{column:`action`,children:(0,N.jsx)(h,{appearance:`ghost`,size:`sm`,children:`Inspect`})})]})})]})},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Items',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('columnheader', {
      name: 'Name'
    }));
    await expect(canvas.getByRole('columnheader', {
      name: 'Name'
    })).toHaveAttribute('aria-sort', 'descending');
    await expect(canvas.getByRole('rowheader', {
      name: 'Alpha'
    })).toHaveAttribute('data-label', 'Name:');
  },
  render: ControlledTable
}`,...R.parameters?.docs?.source},description:{story:`Authors columns and rows directly while the application controls selected
keys and the consumer-owned sort descriptor.

@summary explicitly authored table with controlled sorting and selection`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Static data',
    children: null
  },
  render: () => <Table.Root aria-label="Static data">
      <Table.Header id="heading-section">
        <Table.Column id="label" rowHeader>
          Label
        </Table.Column>
        <Table.Column id="value">Value</Table.Column>
      </Table.Header>
      <Table.Body id="body-section">
        <Table.Row id="first" textValue="First Long value">
          <Table.Cell column="label">First</Table.Cell>
          <Table.Cell column="value">
            A long value that wraps in the responsive card presentation
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer id="footer-section">
        <Table.Row id="summary" textValue="Summary One item">
          <Table.Cell column="label">Summary</Table.Cell>
          <Table.Cell column="value">One item</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
}`,...z.parameters?.docs?.source},description:{story:`Composes keyed static header, body, and footer sections whose cells follow
the visible heading order and retain long-value wrapping.

@summary static ordered header body and footer sections`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Bounded items',
    boundary: 'strong',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const table = within(canvasElement).getByRole('grid', {
      name: 'Bounded items'
    });
    const style = getComputedStyle(table);
    await expect(table).toHaveAttribute('data-boundary', 'strong');
    await expect(style.borderTopWidth).toBe('0px');
    await expect(style.borderRightWidth).toBe('0px');
    await expect(style.borderBottomWidth).toBe('2px');
    await expect(style.borderLeftWidth).toBe('0px');
  },
  render: ({
    'aria-label': ariaLabel,
    boundary
  }) => <Table.Root aria-label={ariaLabel} boundary={boundary}>
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="aurora" textValue="Aurora Ready">
          <Table.Cell column="name">Aurora</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...B.parameters?.docs?.source},description:{story:`Adds the canonical strong lower boundary without introducing top or side
borders, preserving the table's relationship to surrounding content.

@summary table with a strong lower boundary`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Grouped grid items',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('grid', {
      name: 'Grouped grid items'
    });
    const headerRow = canvas.getByRole('row', {
      name: 'Name State'
    });
    const firstSectionLastRow = canvas.getByRole('row', {
      name: 'Beta'
    });
    const finalRow = canvas.getByRole('row', {
      name: 'Gamma'
    });
    const stateHeading = canvas.getByRole('columnheader', {
      name: 'State'
    });
    const nameHeading = canvas.getByRole('columnheader', {
      name: 'Name'
    });
    const activeSection = canvas.getByRole('rowheader', {
      name: 'Active'
    });
    const cell = canvas.getByRole('gridcell', {
      name: 'Ready'
    });
    const reviewCell = canvas.getByRole('gridcell', {
      name: 'Review'
    });
    const draftCell = canvas.getByRole('gridcell', {
      name: 'Draft'
    });
    const view = canvasElement.ownerDocument.defaultView;
    await expect(view?.getComputedStyle(table).display).toBe('grid');
    await expect(view?.getComputedStyle(headerRow.parentElement as HTMLElement).display).toBe('grid');
    await expect(view?.getComputedStyle(headerRow).display).toBe('grid');
    await expect(view?.getComputedStyle(firstSectionLastRow.parentElement as HTMLElement).display).toBe('grid');
    await expect(view?.getComputedStyle(firstSectionLastRow).display).toBe('grid');
    await expect(view?.getComputedStyle(cell).display).toBe('block');
    await expect(activeSection).toHaveAttribute('colspan', '2');
    await expect(activeSection.getBoundingClientRect().left).toBeCloseTo(nameHeading.getBoundingClientRect().left, 1);
    await expect(activeSection.getBoundingClientRect().right).toBeCloseTo(stateHeading.getBoundingClientRect().right, 1);
    await expect(view?.getComputedStyle(firstSectionLastRow).borderBottomWidth).toBe('1px');
    await expect(view?.getComputedStyle(finalRow).borderBottomWidth).toBe('0px');
    await expect(cell.getBoundingClientRect().left).toBeCloseTo(stateHeading.getBoundingClientRect().left, 1);
    await expect(reviewCell.getBoundingClientRect().left).toBeCloseTo(stateHeading.getBoundingClientRect().left, 1);
    await expect(draftCell.getBoundingClientRect().left).toBeCloseTo(stateHeading.getBoundingClientRect().left, 1);
  },
  render: () => <Table.Root aria-label="Grouped grid items" className="grid-cols-[minmax(0,1fr)_auto]" layout="grid">
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body id="active">
        <Table.Row id="active-section" presentation="section" textValue="Active">
          <Table.Cell colSpan={2} column="name">
            Active
          </Table.Cell>
        </Table.Row>
        <Table.Row id="alpha" textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id="beta" textValue="Beta Review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">Review</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Body id="archived">
        <Table.Row id="archived-section" presentation="section" textValue="Archived">
          <Table.Cell colSpan={2} column="name">
            Archived
          </Table.Cell>
        </Table.Row>
        <Table.Row id="gamma" textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...V.parameters?.docs?.source},description:{story:`Uses persistent CSS-grid rows across multiple keyed body sections so every
cell stays aligned with its corresponding heading track.

@summary persistent grid layout with grouped body sections`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Responsive company records',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const mediaHeading = canvas.getByRole('columnheader', {
      name: 'Media'
    });
    const primaryHeading = canvas.getByRole('columnheader', {
      name: 'Name'
    });
    const secondaryHeading = canvas.getByRole('columnheader', {
      name: 'Number'
    });
    const tertiaryHeading = canvas.getByRole('columnheader', {
      name: 'Contact'
    });
    const actionHeading = canvas.getByRole('columnheader', {
      name: 'Action'
    });
    const mediaCell = canvas.getByRole('gridcell', {
      name: 'AC'
    });
    const primaryCell = canvas.getByRole('rowheader', {
      name: 'Acme'
    });
    await expect(mediaHeading.getBoundingClientRect().width).toBeCloseTo(36, 1);
    await expect(actionHeading.getBoundingClientRect().width).toBeCloseTo(20, 1);
    await expect(primaryHeading.getBoundingClientRect().width).toBeGreaterThan(tertiaryHeading.getBoundingClientRect().width);
    await expect(tertiaryHeading.getBoundingClientRect().width).toBeGreaterThan(secondaryHeading.getBoundingClientRect().width);
    await expect(mediaCell.getBoundingClientRect().left).toBeCloseTo(mediaHeading.getBoundingClientRect().left, 1);
    await expect(primaryCell.getBoundingClientRect().left).toBeCloseTo(primaryHeading.getBoundingClientRect().left, 1);
  },
  render: () => <Table.Root aria-label="Responsive company records" desktopColumns="mediaDetailsAction" layout="responsiveGrid">
      <Table.Header>
        <Table.Column compactLabel={false} id="media">
          Media
        </Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="number">Number</Table.Column>
        <Table.Column id="contact">Contact</Table.Column>
        <Table.Column compactLabel={false} id="action">
          Action
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="acme" textValue="Acme 123 contact@example.test">
          <Table.Cell column="media">AC</Table.Cell>
          <Table.Cell column="name">Acme</Table.Cell>
          <Table.Cell column="number">123</Table.Cell>
          <Table.Cell column="contact">contact@example.test</Table.Cell>
          <Table.Cell column="action">View</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...H.parameters?.docs?.source},description:{story:`Uses a named five-column desktop arrangement while retaining compact card
rows below the Breeze small breakpoint.

@summary typed media, details, and action desktop grid columns`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Responsive records',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('row', {
      name: 'Example record'
    });
    const columns = getComputedStyle(row).gridTemplateColumns.split(' ');
    const amountHeading = canvas.getByText('Amount');
    const amount = canvas.getByText('£10.00');
    await expect(columns[0]).toBe('36px');
    await expect(columns.at(-1)).toBe('20px');
    await expect(amount.getBoundingClientRect().right).toBeCloseTo(amountHeading.getBoundingClientRect().right, 1);
  },
  render: () => <Table.Root aria-label="Responsive records" layout="responsiveGrid">
      <Table.Header>
        <Table.Column compactLabel={false} id="marker" textValue="Marker" width={36}>
          <span className="sr-only">Marker</span>
        </Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column align="end" id="amount" width="max-content">
          <span>Amount</span>
        </Table.Column>
        <Table.Column compactLabel={false} id="action" textValue="Action" width="1.25rem">
          <span className="sr-only">Action</span>
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="record" textValue="Example record">
          <Table.Cell column="marker">
            <span className="flex size-9 items-center justify-center">A</span>
          </Table.Cell>
          <Table.Cell column="name">Example record</Table.Cell>
          <Table.Cell align="end" column="amount">
            <span>£10.00</span>
          </Table.Cell>
          <Table.Disclosure column="action" position="flow" />
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...U.parameters?.docs?.source},description:{story:`Applies intrinsic and icon widths from the generic column API while the
remaining columns share the available desktop width.

@summary responsive grid driven by column widths`,...U.parameters?.docs?.description}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Grouped responsive items',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstSectionFinalCell = canvas.getByRole('gridcell', {
      name: 'Review'
    });
    const tableFinalCell = canvas.getByRole('gridcell', {
      name: 'Draft'
    });
    const view = canvasElement.ownerDocument.defaultView;
    await expect(view?.getComputedStyle(firstSectionFinalCell).borderBottomWidth).toBe('1px');
    await expect(view?.getComputedStyle(tableFinalCell).borderBottomWidth).toBe('0px');
  },
  render: () => <Table.Root aria-label="Grouped responsive items">
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body id="active">
        <Table.Row id="alpha" textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id="beta" textValue="Beta Review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">Review</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Body id="archived">
        <Table.Row id="gamma" textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...W.parameters?.docs?.source},description:{story:`Keeps separate responsive body sections visually bounded while removing the
final table-row divider only at the end of the complete collection.

@summary responsive table with grouped body sections`,...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Semantic row presentations',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectSemanticRowPresentations(canvasElement),
  render: () => <SemanticRowPresentations />
}`,...G.parameters?.docs?.source},description:{story:`Compares non-actionable section geometry with default and muted actionable
data-row treatments at the standard viewport width.

@summary semantic section rows and actionable row tones`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Semantic row presentations',
    children: null
  },
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => expectSemanticRowPresentations(canvasElement),
  render: () => <SemanticRowPresentations />
}`,...K.parameters?.docs?.source},description:{story:`Verifies that section geometry and default or muted actionable row emphasis
remain distinguishable in the canonical compact viewport.

@summary compact semantic section rows and row tones`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Responsive items',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('columnheader', {
      name: 'Name'
    });
    const firstRow = canvas.getByRole('row', {
      name: 'Alpha'
    });
    const firstCell = canvas.getByRole('rowheader', {
      name: 'Alpha'
    });
    const labelledCell = canvas.getByRole('gridcell', {
      name: 'Ready'
    });
    const finalCell = canvas.getByRole('gridcell', {
      name: 'Review'
    });
    const view = canvasElement.ownerDocument.defaultView;
    const headingStyle = view?.getComputedStyle(heading);
    const firstCellStyle = view?.getComputedStyle(firstCell);
    const compactLabelStyle = view?.getComputedStyle(labelledCell, '::before');
    await expect(heading.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(firstRow.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(headingStyle?.paddingLeft).toBe(firstCellStyle?.paddingLeft);
    await expect(firstCellStyle?.verticalAlign).toBe('middle');
    await expect(firstCellStyle?.borderBottomWidth).toBe('1px');
    await expect(labelledCell).toHaveAttribute('data-label', 'State:');
    await expect(compactLabelStyle?.display).toBe('none');
    await expect(view?.getComputedStyle(finalCell).borderBottomWidth).toBe('0px');
  },
  render: () => <ResponsiveItemsExample />
}`,...q.parameters?.docs?.source},description:{story:`Shows ordinary columnar records at table width with header-derived compact
labels prepared but visually suppressed above the small breakpoint.

@summary responsive records in columnar table layout`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Responsive items',
    children: null
  },
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstRow = canvas.getByRole('row', {
      name: 'Alpha'
    });
    const finalRow = canvas.getByRole('row', {
      name: 'Beta'
    });
    const primaryCell = canvas.getByRole('rowheader', {
      name: 'Alpha'
    });
    const labelledCell = canvas.getByRole('gridcell', {
      name: 'Ready'
    });
    const view = canvasElement.ownerDocument.defaultView;
    const rowStyle = view?.getComputedStyle(firstRow);
    const cellStyle = view?.getComputedStyle(labelledCell);
    const compactLabelStyle = view?.getComputedStyle(labelledCell, '::before');
    await expect(rowStyle?.display).toBe('flex');
    await expect(rowStyle?.flexDirection).toBe('column');
    await expect(Number.parseFloat(rowStyle?.gap ?? '0')).toBeGreaterThan(0);
    await expect(rowStyle?.borderBottomWidth).toBe('1px');
    await expect(view?.getComputedStyle(finalRow).borderBottomWidth).toBe('0px');
    await expect(cellStyle?.display).toBe('block');
    await expect(compactLabelStyle?.display).toBe('inline-block');
    await expect(cellStyle?.paddingTop).toBe('0px');
    await expect(cellStyle?.borderBottomWidth).toBe('0px');
    await expect(labelledCell).toHaveAttribute('data-label', 'State:');
    await expect(primaryCell).not.toHaveAttribute('data-label');
  },
  render: () => <ResponsiveItemsExample />
}`,...J.parameters?.docs?.source},description:{story:`Adapts the same records into stacked compact rows and derives visible cell
labels from headings without duplicating the row-header label.

@summary compact records with heading-derived cell labels`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Conditional columns',
    children: null
  },
  render: () => <Table.Root aria-label="Conditional columns">
      <Table.Header>
        <Table.Column id="state">State</Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id={1} textValue="Ready Alpha">
          <Table.Cell column="state">Ready</Table.Cell>
          <Table.Cell column="name">Alpha</Table.Cell>
        </Table.Row>
        <Table.Row id={2} textValue="In review Beta">
          <Table.Cell column="state">In review</Table.Cell>
          <Table.Cell column="name">Beta</Table.Cell>
        </Table.Row>
        <Table.Row id={3} textValue="Draft Gamma">
          <Table.Cell column="state">Draft</Table.Cell>
          <Table.Cell column="name">Gamma</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...Y.parameters?.docs?.source},description:{story:`Authors state before name in both the header and every row so the visible
cell order remains aligned with its headings.

@summary reordered columns with matched cell order`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'States',
    children: null
  },
  render: () => <Stack gap="xl">
      <Table.Root aria-label="Read-only" readOnly selection={[1]}>
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id={1} textValue="Alpha">
            <Table.Cell column="name">Alpha</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <Table.Root aria-label="Empty">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body emptyContent="No items">{null}</Table.Body>
      </Table.Root>
    </Stack>
}`,...X.parameters?.docs?.source},description:{story:`Compares an immutable selected row with application-authored empty content
for a body whose current item collection is empty.

@summary read-only selection and empty table content`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual data',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectVirtualizedTableGeometry(canvasElement),
  render: VirtualizedTable
}`,...Z.parameters?.docs?.source},description:{story:`Windows variable-height rows inside a bounded viewport and renders a loading
sentinel while preserving desktop heading and cell geometry.

@summary variable-height virtualized rows with loading sentinel`,...Z.parameters?.docs?.description}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual data',
    children: null
  },
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => expectVirtualizedTableGeometry(canvasElement),
  render: () => <VirtualizedTable />
}`,...Q.parameters?.docs?.source},description:{story:`Verifies variable-height row windowing and the loading sentinel against the
stacked compact record presentation without horizontal overflow.

@summary compact variable-height virtualized table`,...Q.parameters?.docs?.description}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Action table',
    children: null
  },
  render: () => <Table.Root aria-label="Action table">
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="action">Action</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="alpha" textValue="Alpha Inspect">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="action">
            <Button appearance="ghost" size="sm">
              Inspect
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...$.parameters?.docs?.source},description:{story:`Places an application-owned action control in an ordinary keyed cell rather
than teaching Table application commands or business workflows.

@summary application-owned action inside a table cell`,...$.parameters?.docs?.description}}};try{L.displayName=`Root`,L.__docgenInfo={description:`Coordinates semantic table navigation, row state, sorting, and responsive labels.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{boundary:{defaultValue:{value:`none`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Optional visual treatment for the table's lower edge. Defaults to `none`.",name:`boundary`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableBoundary | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ordered header, body, and optional footer sections.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Keys whose rows cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},desktopColumns:{defaultValue:{value:`equal`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`.",name:`desktopColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableDesktopColumns | undefined`}},layout:{defaultValue:{value:`responsive`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`.",name:`layout`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableLayout | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Enables multiple row selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ref to the rendered table or virtualized grid element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Optional fixed- or variable-height row windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Current selected row keys.
Current immutable selected row keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Called with the next selected row keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Excluded when selection is controlled.
Initial selected row keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks controlled row selection and sorting as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Current consumer-owned sort descriptor.
Excluded when sorting is uncontrolled.`,name:`sort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}},onSortChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Called when a sortable heading requests a new descriptor.
Called when the internally retained descriptor changes.`,name:`onSortChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`((sort: TableSort) => void) | ((sort: TableSort) => void) | undefined`}},defaultSort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Excluded when sorting is controlled.
Initial sort descriptor.`,name:`defaultSort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}}},tags:{}}}catch{}try{R.displayName=`ControlledSortingAndSelection`,R.__docgenInfo={description:`Authors columns and rows directly while the application controls selected
keys and the consumer-owned sort descriptor.`,displayName:`ControlledSortingAndSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`explicitly authored table with controlled sorting and selection`}}}catch{}try{z.displayName=`StaticOrderedSections`,z.__docgenInfo={description:`Composes keyed static header, body, and footer sections whose cells follow
the visible heading order and retain long-value wrapping.`,displayName:`StaticOrderedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`static ordered header body and footer sections`}}}catch{}try{B.displayName=`StrongBoundary`,B.__docgenInfo={description:`Adds the canonical strong lower boundary without introducing top or side
borders, preserving the table's relationship to surrounding content.`,displayName:`StrongBoundary`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`table with a strong lower boundary`}}}catch{}try{V.displayName=`GridGroupedSections`,V.__docgenInfo={description:`Uses persistent CSS-grid rows across multiple keyed body sections so every
cell stays aligned with its corresponding heading track.`,displayName:`GridGroupedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`persistent grid layout with grouped body sections`}}}catch{}try{H.displayName=`ResponsiveGridColumnVariant`,H.__docgenInfo={description:`Uses a named five-column desktop arrangement while retaining compact card
rows below the Breeze small breakpoint.`,displayName:`ResponsiveGridColumnVariant`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`typed media, details, and action desktop grid columns`}}}catch{}try{U.displayName=`ResponsiveGridColumnWidths`,U.__docgenInfo={description:`Applies intrinsic and icon widths from the generic column API while the
remaining columns share the available desktop width.`,displayName:`ResponsiveGridColumnWidths`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive grid driven by column widths`}}}catch{}try{W.displayName=`ResponsiveGroupedSections`,W.__docgenInfo={description:`Keeps separate responsive body sections visually bounded while removing the
final table-row divider only at the end of the complete collection.`,displayName:`ResponsiveGroupedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive table with grouped body sections`}}}catch{}try{G.displayName=`RowTonesAndSections`,G.__docgenInfo={description:`Compares non-actionable section geometry with default and muted actionable
data-row treatments at the standard viewport width.`,displayName:`RowTonesAndSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`semantic section rows and actionable row tones`}}}catch{}try{K.displayName=`RowTonesAndSectionsCompact`,K.__docgenInfo={description:`Verifies that section geometry and default or muted actionable row emphasis
remain distinguishable in the canonical compact viewport.`,displayName:`RowTonesAndSectionsCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact semantic section rows and row tones`}}}catch{}try{q.displayName=`ResponsiveItems`,q.__docgenInfo={description:`Shows ordinary columnar records at table width with header-derived compact
labels prepared but visually suppressed above the small breakpoint.`,displayName:`ResponsiveItems`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive records in columnar table layout`}}}catch{}try{J.displayName=`ResponsiveItemsCompact`,J.__docgenInfo={description:`Adapts the same records into stacked compact rows and derives visible cell
labels from headings without duplicating the row-header label.`,displayName:`ResponsiveItemsCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact records with heading-derived cell labels`}}}catch{}try{Y.displayName=`ConditionalOrderedColumns`,Y.__docgenInfo={description:`Authors state before name in both the header and every row so the visible
cell order remains aligned with its headings.`,displayName:`ConditionalOrderedColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`reordered columns with matched cell order`}}}catch{}try{X.displayName=`ReadOnlyAndEmpty`,X.__docgenInfo={description:`Compares an immutable selected row with application-authored empty content
for a body whose current item collection is empty.`,displayName:`ReadOnlyAndEmpty`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`read-only selection and empty table content`}}}catch{}try{Z.displayName=`VariableVirtualizationAndLoading`,Z.__docgenInfo={description:`Windows variable-height rows inside a bounded viewport and renders a loading
sentinel while preserving desktop heading and cell geometry.`,displayName:`VariableVirtualizationAndLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`variable-height virtualized rows with loading sentinel`}}}catch{}try{Q.displayName=`VariableVirtualizationAndLoadingCompact`,Q.__docgenInfo={description:`Verifies variable-height row windowing and the loading sentinel against the
stacked compact record presentation without horizontal overflow.`,displayName:`VariableVirtualizationAndLoadingCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact variable-height virtualized table`}}}catch{}try{$.displayName=`ActionsStayWithApplications`,$.__docgenInfo={description:`Places an application-owned action control in an ordinary keyed cell rather
than teaching Table application commands or business workflows.`,displayName:`ActionsStayWithApplications`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`application-owned action inside a table cell`}}}catch{}We=[`ControlledSortingAndSelection`,`StaticOrderedSections`,`StrongBoundary`,`GridGroupedSections`,`ResponsiveGridColumnVariant`,`ResponsiveGridColumnWidths`,`ResponsiveGroupedSections`,`RowTonesAndSections`,`RowTonesAndSectionsCompact`,`ResponsiveItems`,`ResponsiveItemsCompact`,`ConditionalOrderedColumns`,`ReadOnlyAndEmpty`,`VariableVirtualizationAndLoading`,`VariableVirtualizationAndLoadingCompact`,`ActionsStayWithApplications`]}));Ge();export{$ as ActionsStayWithApplications,Y as ConditionalOrderedColumns,R as ControlledSortingAndSelection,V as GridGroupedSections,X as ReadOnlyAndEmpty,H as ResponsiveGridColumnVariant,U as ResponsiveGridColumnWidths,W as ResponsiveGroupedSections,q as ResponsiveItems,J as ResponsiveItemsCompact,G as RowTonesAndSections,K as RowTonesAndSectionsCompact,z as StaticOrderedSections,B as StrongBoundary,Z as VariableVirtualizationAndLoading,Q as VariableVirtualizationAndLoadingCompact,We as __namedExportsOrder,L as default,Ge as n,Le as t};