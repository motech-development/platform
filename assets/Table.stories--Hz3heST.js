import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{n as i,t as a}from"./dist-ByKaD744.js";import{a as o,i as s,n as c,r as l}from"./BreezeContext-BIB7r8Lx.js";import{t as u}from"./jsx-runtime-cM__dR4X.js";import{I as d,r as f}from"./icons-frCuGJ60.js";import{n as p,t as ee}from"./Avatar-CwdahOfU.js";import{n as m,t as te}from"./useCollectionEmptyContent-CsbFcRsc.js";import{n as h,t as g}from"./Button-BEpHfrRB.js";import{n as ne,t as re}from"./Stack-0pHCj1U7.js";import{o as _,s as ie}from"./TextField-DUkhVOns.js";import{S as ae,_ as oe,a as se,c as ce,d as v,f as y,g as le,h as ue,i as b,l as de,m as fe,n as pe,o as me,p as he,r as ge,s as _e,t as ve,u as ye,x as be}from"./VirtualizedCollection-BCYQFEQX.js";var xe=t((()=>{oe()}));function Se(e){return e===`all`?`all`:[...e]}function Ce(e){if(e!==void 0)return Number.isInteger(e)?Math.min(Math.max(e,1),1e3):1}function we(e){return typeof e==`number`?`${e}px`:e}function Te({align:e=`start`,children:t,className:n,compactLabel:r=!0,id:i,ref:a,rowHeader:o=!1,sortable:s=!1,textValue:c,width:l,...u}){let d=we(l),f=typeof t==`string`?t.trim():void 0,p=r?c??f:void 0;return(0,C.createElement)(y,{...u,allowsSorting:s,children:t,className:ft({align:e,class:n}),"data-breeze-column":String(i),"data-breeze-column-key":b(i),"data-breeze-column-width":d,"data-breeze-compact-label":String(r),"data-breeze-compact-label-text":p,id:i,isRowHeader:o,ref:a,style:d===void 0?void 0:{width:l},textValue:c})}function x(e){return Te(e)}function Ee(e){return(0,C.isValidElement)(e)&&e.type===x?Te(e.props):e}function S({children:e,className:t,id:n,items:r,ref:i,...a}){let s=o(i),c=typeof e==`function`?t=>Ee(e(t)):C.Children.map(e,Ee);return(0,C.createElement)(le,{...a,children:c,className:dt({class:t}),columns:r,"data-section-key":n,dependencies:[e],ref:s})}function De(e,t){return e?t?`multiple`:`single`:`none`}function Oe(e){let t=[];return C.Children.forEach(e,e=>{(0,C.isValidElement)(e)&&(e.type===x?t.push(b(e.props.id)):e.type===C.Fragment&&t.push(...Oe(e.props.children)))}),t}function ke(e){if(Array.isArray(e))return e;let t=e[Symbol.iterator]();if(!Object.is(t,e[Symbol.iterator]()))return Array.from(e);let n=e,r=xt.get(n);if(r!==void 0)return r;let i=Array.from(e);return xt.set(n,i),i}function Ae(e){let t=!1,n=C.Children.map(e,e=>{if(!(0,C.isValidElement)(e))return e;if(e.type===S){let n=e,{items:r}=n.props;if(r===void 0)return e;let i=ke(r);return Object.is(i,r)?e:(t=!0,(0,C.cloneElement)(n,{items:i}))}if(e.type===C.Fragment){let n=e,r=Ae(n.props.children);return Object.is(r,n.props.children)?e:(t=!0,(0,C.cloneElement)(n,{children:r}))}return e});return t?n:e}function je(e){let{children:t,items:n}=e.props;return n===void 0?Oe(t):Array.from(n,({id:e})=>b(e))}function Me(e){let t=[];return C.Children.forEach(e,e=>{if((0,C.isValidElement)(e)){if(e.type===S)t=je(e);else if(e.type===C.Fragment){let n=Me(e.props.children);n.length>0&&(t=n)}}}),t}function Ne(e,t=`equal`,n=yt){return e===null?new Map:new Map([...e.querySelectorAll(`[data-breeze-column]`)].filter(t=>t.closest(`[data-breeze-table]`)?.isSameNode(e)).flatMap((e,r)=>{let i=e.dataset.breezeColumnKey;if(i===void 0)return[];let a=e.dataset.breezeCompactLabel===`false`?void 0:e.dataset.breezeCompactLabelText;return[[i,{compactHidden:n.has(i),label:a===void 0||a.length===0?void 0:`${a}:`,track:e.dataset.breezeColumnWidth??lt[t][r]??`minmax(0, 1fr)`}]]}))}function Pe(e,t,n,r){let i=n.indexOf(e);if(i<0)return{compactHidden:void 0,span:t};let a=n.slice(i,i+t).filter(e=>!r(e)).length;return{compactHidden:a===0,span:Math.max(a,1)}}function Fe(e,t=Ne(e)){if(e===null)return;let n=[...t.keys()],r=e=>t.get(e)?.compactHidden??!1;e.querySelectorAll(`[data-breeze-cell-column]`).forEach(i=>{if(!i.closest(`[data-breeze-table]`)?.isSameNode(e))return;let{dataset:a}=i,o=a.breezeCellColumnKey??``,s=t.get(o),c=s?.label,l=i.colSpan>1?Pe(o,i.colSpan,n,r):null,u=l===null?s?.compactHidden:l.compactHidden;u===!0?a.breezeCompactHidden=``:u===!1&&delete a.breezeCompactHidden,c!==void 0&&c.length>0?a.label=c:delete a.label,l!==null&&i.style.setProperty(`--breeze-table-compact-column-span`,`span ${l.span} / span ${l.span}`)})}function Ie(e,t=!1){if(e.size!==0)return[...e.values()].filter(({compactHidden:e})=>!t||!e).map(({track:e})=>e).join(` `)}function Le(e,t,n){let r=Ne(e,t,n);return Fe(e,r),{compact:Ie(r,!0),full:Ie(r)}}function Re(e,t){return e.closest(`[data-breeze-table]`)?.isSameNode(t)??!1}function ze(e){return e?.closest(`[data-breeze-cell-column]`)??null}function Be(e,t,n){let r=e.target instanceof n.Element?e.target:null,i=t.ownerDocument.activeElement instanceof n.Element?t.ownerDocument.activeElement:null,a=ze(r),o=a??ze(i);return o!==null&&(a===null?i:r)===o&&Re(o,t)?o:null}function Ve(e,t,n){let r=e.closest(`[role="row"]`);return r===null?[]:[...r.querySelectorAll(`[data-breeze-cell-column]`)].filter(e=>e instanceof n.HTMLElement&&e.closest(`[role="row"]`)?.isSameNode(r)===!0&&Re(e,t))}function He(e){return[...e.querySelectorAll(`[data-breeze-cell-column]`)].filter(t=>Re(t,e))}function Ue(e){return e?.dataset.breezeCompactHidden!==void 0}function We(e){return e[0]}function Ge(e){return e.at(-1)}function Ke(e){return e.find(e=>!Ue(e))}function qe(e){return e.findLast(e=>!Ue(e))}function Je(e,t,n){t.requestAnimationFrame(()=>{n(He(e))?.focus()})}function Ye(e,t,n,r,i,a){let o=e.ctrlKey||e.metaKey;if(o&&i){Je(t,n,a.visibleBoundary);return}let s=o?He(t):r;if(!Ue(a.boundary(s)))return;let c=a.visibleBoundary(s);c!==void 0&&(e.preventDefault(),n.queueMicrotask(()=>c.focus()))}function Xe(e,t,n,r,i){let a=n.getComputedStyle(t).direction===`rtl`?`ArrowLeft`:`ArrowRight`,o=e.key===a?1:-1,s=i.indexOf(r);if(!Ue(i[s+o]))return;let c=(o>0?i.slice(s+1):i.slice(0,s).reverse()).find(e=>!Ue(e));e.preventDefault(),n.queueMicrotask(()=>c?.focus())}function Ze(e,t,n){if(!wt.has(e.key))return;let r=t.ownerDocument.defaultView;if(r===null||!ce(r))return;let i=Be(e,t,r);if(i===null)return;let a=Ve(i,t,r);if(e.key===`Home`||e.key===`End`){Ye(e,t,r,a,n,Tt[e.key]);return}Xe(e,t,r,i,a)}function Qe({boundary:e=`none`,children:t,className:n,compactHiddenColumns:r=vt,defaultSelection:i,defaultSort:a,desktopColumns:s=`equal`,disabledKeys:c,layout:u=`responsive`,multiple:d=!1,onSelectionChange:f,onSortChange:p,readOnly:ee=!1,ref:m,selection:te,sort:h,virtualization:g,...ne}){l();let re=o(m),_=(0,C.useRef)(null),[ie,ae]=(0,C.useState)(a),[oe,ce]=(0,C.useState)({compact:void 0,full:void 0}),v=(0,C.useMemo)(()=>se(r),[r]),y=(0,C.useMemo)(()=>Ae(t),[t]),le=(0,C.useMemo)(()=>Me(y),[y]),ue=i!==void 0||d||f!==void 0||te!==void 0,b=h??ie,de=(0,C.useCallback)(e=>{let t=_.current;t!==null&&Ze(e,t,g!==void 0)},[g]),fe=(0,C.useCallback)(e=>{_.current?.removeEventListener(`keydown`,de,!0),_.current=e,e?.addEventListener(`keydown`,de,!0),re(e)},[de,re]);(0,C.useLayoutEffect)(()=>{let e=_.current;if(e===null)return()=>void 0;let t=()=>{let t=Le(e,s,v);ce(e=>e.compact===t.compact&&e.full===t.full?e:t)};t();let n=new MutationObserver(t);return n.observe(e,{attributeFilter:[`colspan`,`data-breeze-cell-column-key`,`data-breeze-column-width`,`data-breeze-compact-label`,`data-breeze-compact-label-text`],attributes:!0,childList:!0,subtree:!0}),()=>n.disconnect()},[y,v,s]);let me=pe(g),he=oe.full===void 0&&me===void 0?void 0:{...me,"--breeze-table-columns":oe.full,"--breeze-table-compact-columns":oe.compact},ge=(0,C.createElement)(ye,{...ne,"aria-readonly":ee||void 0,children:y,className:ut({boundary:e,class:n,desktopColumns:s,layout:u,virtualized:g!==void 0}),"data-boundary":e,"data-breeze-table":``,"data-layout":u,"data-virtualized":g===void 0?void 0:`true`,defaultSelectedKeys:i,disabledKeys:c,onSelectionChange:e=>f?.(Se(e)),onSortChange:ee?void 0:e=>{let t={column:e.column,direction:e.direction};h===void 0&&ae(t),p?.(t)},ref:fe,selectedKeys:te,selectionMode:De(ue,d),sortDescriptor:b===void 0?void 0:{column:b.column,direction:b.direction},style:he}),_e=g===void 0?ge:(0,C.createElement)(ve,{compactHiddenColumns:v,configuration:g,kind:`table`},ge);return(0,C.createElement)(St.Provider,{value:v},(0,C.createElement)(Ct.Provider,{value:le},_e))}function $e({children:e,className:t,emptyContent:n,id:r,items:i,ref:a,...s}){let c=o(a),l=m(n);return(0,C.createElement)(v,{...s,children:e,className:pt({class:t}),"data-section-key":r,dependencies:[e],items:i,ref:c,renderEmptyState:()=>l})}function et({children:e,className:t,id:n,items:r,ref:i,...a}){let s=o(i);return(0,C.createElement)(de,{...a,children:e,className:mt({class:t}),"data-section-key":n,dependencies:[e],items:r,ref:s})}function tt({"aria-describedby":e,className:t,disabled:n=!1,id:r,onAction:i,presentation:a=`data`,ref:s,textValue:c,tone:l=`default`,...u}){let d=o(s),f=(0,C.useCallback)(t=>{d(t),t&&(e?t.setAttribute(`aria-describedby`,e):t.removeAttribute(`aria-describedby`))},[e,d]);return(0,C.createElement)(fe,{...u,className:gt({actionable:i!==void 0,class:t,presentation:a,tone:l}),"data-presentation":a,"data-tone":l,id:r,isDisabled:n,onAction:i===void 0?void 0:()=>i(r),ref:f,textValue:c})}function nt({align:e=`start`,className:t,column:n,colSpan:r,presentation:i=`data`,ref:a,textValue:s,...c}){let l=(0,C.useContext)(St),u=(0,C.useContext)(Ct),d=o(a),f=Ce(r),p=f!==void 0&&f>1?f:void 0,ee=l.has(b(n)),m=p===void 0?null:Pe(b(n),p,u,e=>l.has(e)),te=p===void 0?void 0:(()=>{let e=`span ${p} / span ${p}`;return{"--breeze-table-column-span":e,"--breeze-table-compact-column-span":m===null?e:`span ${m.span} / span ${m.span}`}})(),h=(0,C.useCallback)(e=>{d(e);let t=e?.closest(`[data-breeze-table]`)??null;Fe(t,Ne(t,void 0,l))},[l,d]),g=(m===null?ee:m.compactHidden)===!0;return(0,C.createElement)(ue,{...c,className:_t({align:e,class:t,presentation:i,spanning:p!==void 0}),colSpan:f,"data-breeze-cell-column":String(n),"data-breeze-cell-column-key":b(n),"data-breeze-compact-hidden":g?``:void 0,ref:h,style:te,textValue:s})}function rt({position:e=`overlay`,...t}){return(0,C.createElement)(nt,{...t,children:(0,at.jsx)(f,{className:`!block`,size:16}),presentation:e===`overlay`?`disclosure`:`data`})}function it({className:e,loading:t=!1,offset:n=1,onLoadMore:r,ref:i,...a}){let s=o(i),c=ae({loading:t,onLoadMore:r}),l=(0,C.useRef)(null),u=(0,C.useCallback)(e=>{l.current=e,e?.removeAttribute(`aria-level`),s(e)},[s]);return(0,C.useLayoutEffect)(()=>{l.current?.removeAttribute(`aria-level`)}),(0,C.createElement)(he,{...a,className:ht({class:e}),isLoading:t,onLoadMore:c,ref:u,scrollOffset:n})}var C,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,w,Et=t((()=>{C=e(r(),1),xe(),a(),d(),me(),te(),be(),ge(),s(),_e(),c(),at=u(),ot=`[&>tbody>tr]:relative [&>tbody>tr]:flex [&>tbody>tr]:flex-col [&>tbody>tr]:items-start [&>tbody>tr]:gap-2 [&>tbody>tr]:px-4 [&>tbody>tr]:py-4 [&>tfoot>tr]:relative [&>tfoot>tr]:flex [&>tfoot>tr]:flex-col [&>tfoot>tr]:items-start [&>tfoot>tr]:gap-2 [&>tfoot>tr]:px-4 [&>tfoot>tr]:py-4 [&>tbody>tr>td]:block [&>tbody>tr>td]:max-w-full [&>tbody>tr>td]:border-0 [&>tbody>tr>td]:p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:max-w-full [&>tfoot>tr>td]:border-0 [&>tfoot>tr>td]:p-0 sm:[&>thead>tr>th]:px-6 sm:[&>thead>tr>th]:py-3 sm:[&>thead>tr>th]:align-middle sm:[&>tbody>tr]:table-row sm:[&>tbody>tr]:border-0 sm:[&>tbody>tr]:p-0 sm:[&>tfoot>tr]:table-row sm:[&>tfoot>tr]:border-0 sm:[&>tfoot>tr]:p-0 sm:[&>tbody>tr>td]:table-cell sm:[&>tbody>tr>td]:border-b sm:[&>tbody>tr>td]:border-[var(--breeze-border)] sm:[&>tbody>tr>td]:px-6 sm:[&>tbody>tr>td]:py-3 sm:[&>tbody>tr>td]:align-middle sm:[&>tfoot>tr>td]:table-cell sm:[&>tfoot>tr>td]:border-b sm:[&>tfoot>tr>td]:border-[var(--breeze-border)] sm:[&>tfoot>tr>td]:px-6 sm:[&>tfoot>tr>td]:py-3 sm:[&>tfoot>tr>td]:align-middle`,st=`sm:!grid sm:grid-cols-[var(--breeze-table-columns)] sm:gap-x-4 sm:[&>thead]:col-span-full sm:[&>thead]:!grid sm:[&>thead]:grid-cols-subgrid sm:[&>tbody]:col-span-full sm:[&>tbody]:!grid sm:[&>tbody]:grid-cols-subgrid sm:[&>tfoot]:col-span-full sm:[&>tfoot]:!grid sm:[&>tfoot]:grid-cols-subgrid sm:[&>thead>tr]:col-span-full sm:[&>thead>tr]:!grid sm:[&>thead>tr]:grid-cols-subgrid sm:[&>thead>tr]:items-center sm:[&>thead>tr]:gap-x-4 sm:[&>thead>tr]:px-6 sm:[&>thead>tr]:py-3 sm:[&>tbody>tr]:col-span-full sm:[&>tbody>tr]:!grid sm:[&>tbody>tr]:grid-cols-subgrid sm:[&>tbody>tr]:items-center sm:[&>tbody>tr]:gap-x-4 sm:[&>tbody>tr]:border-b sm:[&>tbody>tr]:border-[var(--breeze-border)] sm:[&>tbody>tr]:px-6 sm:[&>tbody>tr]:py-3 sm:[&>tfoot>tr]:col-span-full sm:[&>tfoot>tr]:!grid sm:[&>tfoot>tr]:grid-cols-subgrid sm:[&>tfoot>tr]:items-center sm:[&>tfoot>tr]:gap-x-4 sm:[&>tfoot>tr]:px-6 sm:[&>tfoot>tr]:py-3 sm:[&>thead>tr>th]:!flex sm:[&>thead>tr>th]:!h-auto sm:[&>thead>tr>th]:!w-full sm:[&>thead>tr>th]:items-center sm:[&>thead>tr>th]:!border-0 sm:[&>thead>tr>th]:!p-0 sm:[&>tbody>tr>td]:!flex sm:[&>tbody>tr>td]:!h-auto sm:[&>tbody>tr>td]:items-center sm:[&>tbody>tr>td]:!border-0 sm:[&>tbody>tr>td]:!p-0 sm:[&>tfoot>tr>td]:!flex sm:[&>tfoot>tr>td]:!h-auto sm:[&>tfoot>tr>td]:items-center sm:[&>tfoot>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!p-0`,ct=`!grid grid-cols-[var(--breeze-table-compact-columns)] gap-x-4 [&>thead]:col-span-full [&>thead]:grid-cols-subgrid [&>tbody]:col-span-full [&>tbody]:grid [&>tbody]:grid-cols-subgrid [&>tfoot]:col-span-full [&>tfoot]:grid [&>tfoot]:grid-cols-subgrid [&>tbody>tr]:col-span-full [&>tbody>tr]:grid [&>tbody>tr]:min-h-11 [&>tbody>tr]:grid-cols-subgrid [&>tbody>tr]:items-center [&>tbody>tr]:px-4 [&>tbody>tr]:py-4 [&>tfoot>tr]:col-span-full [&>tfoot>tr]:grid [&>tfoot>tr]:min-h-11 [&>tfoot>tr]:grid-cols-subgrid [&>tfoot>tr]:items-center [&>tfoot>tr]:px-4 [&>tfoot>tr]:py-4 [&>tbody>tr>td]:block [&>tbody>tr>td]:!p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:!p-0 [&>tbody>tr]:border-b [&>tbody>tr]:border-[var(--breeze-border)] [&>tbody>tr>td]:border-0 [&>tfoot>tr>td]:border-0`,lt={equal:[],mediaDetailsAction:[`max-content`,`minmax(0, 1.3fr)`,`minmax(0, 0.8fr)`,`minmax(0, 1.2fr)`,`max-content`]},ut=i({base:`group/table block w-full border-separate border-spacing-0 text-start text-[var(--breeze-ink)] outline-none sm:table [&>tbody:last-of-type>tr:last-child]:border-b-0 sm:[&>tbody:last-of-type>tr:last-child>td]:border-b-0 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]`,defaultVariants:{boundary:`none`,desktopColumns:`equal`,layout:`responsive`,virtualized:!1},variants:{boundary:{none:``,strong:`min-w-0 border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)]`},desktopColumns:{equal:``,mediaDetailsAction:``},layout:{grid:`${ct} ${st}`,responsive:ot,responsiveGrid:`${ot} ${st}`},virtualized:{false:``,true:`overflow-auto sm:block`}}}),dt=i({base:`hidden bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink-muted)] sm:table-header-group`}),ft=i({base:`border-b border-[var(--breeze-border)] px-4 py-3 text-start font-[family-name:var(--breeze-font-display)] text-base font-bold outline-none data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[allows-sorting]:cursor-pointer forced-colors:border-[CanvasText]`,defaultVariants:{align:`start`},variants:{align:{center:`text-center sm:justify-center`,end:`text-end sm:justify-end`,start:`text-start sm:justify-start`}}}),pt=i({base:`block sm:table-row-group`}),mt=i({base:`block bg-[var(--breeze-surface-subtle)] sm:table-footer-group`}),ht=i({base:`flex min-h-11 items-center justify-center px-4 py-3 text-sm text-[var(--breeze-ink-muted)]`}),gt=i({base:`grid min-w-0 border-b border-[var(--breeze-border)] bg-[var(--breeze-surface)] py-2 outline-none sm:table-row sm:border-0 sm:py-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[selected]:bg-[var(--breeze-primary-soft)] forced-colors:data-[selected]:border-[Highlight]`,compoundVariants:[{actionable:!0,class:`data-[hovered]:bg-[var(--breeze-table-row-hover)]`,presentation:`data`,tone:`default`},{actionable:!0,class:`data-[hovered]:bg-[var(--breeze-table-row-muted-hover)]`,presentation:`data`,tone:`muted`}],defaultVariants:{presentation:`data`,tone:`default`},variants:{actionable:{false:``,true:`cursor-pointer`},presentation:{data:``,section:`min-h-11 items-center bg-[var(--breeze-table-section)] px-4 py-2 sm:bg-[var(--breeze-table-section)] sm:px-6 [&>td]:!h-auto [&>td]:!border-0 [&>td]:!p-0 [&>td]:before:!hidden`},tone:{default:``,muted:`bg-[var(--breeze-table-row-muted)] text-[var(--breeze-neutral)]`}}}),_t=i({base:`grid min-w-0 grid-cols-[minmax(5rem,auto)_minmax(0,1fr)] gap-4 border-b border-[var(--breeze-border)] px-4 py-2 text-start [overflow-wrap:anywhere] last:border-b-0 before:me-1 before:hidden before:font-[family-name:var(--breeze-font-display)] before:text-base before:leading-[1.4] before:font-bold before:text-[var(--breeze-ink-muted)] data-[label]:before:inline-block data-[label]:before:content-[attr(data-label)] max-sm:data-[breeze-compact-hidden]:!hidden sm:table-cell sm:border-b sm:border-[var(--breeze-border)] sm:px-4 sm:py-3 sm:last:border-b sm:data-[label]:before:hidden [&>*]:min-w-0`,defaultVariants:{align:`start`},variants:{align:{center:`sm:text-center sm:justify-center`,end:`sm:text-end sm:justify-end`,start:`sm:text-start sm:justify-start`},presentation:{data:``,disclosure:`absolute end-4 top-6 h-4 w-4 text-[var(--breeze-ink-muted)] sm:static sm:h-auto sm:w-5 sm:self-stretch sm:text-end [&>*]:ms-auto [&>svg]:size-4`},spanning:{true:`[grid-column:var(--breeze-table-compact-column-span)] sm:[grid-column:var(--breeze-table-column-span)]`}}}),vt=[],yt=new Set,bt=[],xt=new WeakMap,St=(0,C.createContext)(yt),Ct=(0,C.createContext)(bt),wt=new Set([`ArrowLeft`,`ArrowRight`,`End`,`Home`]),Tt={End:{boundary:Ge,visibleBoundary:qe},Home:{boundary:We,visibleBoundary:Ke}},w={Body:$e,Cell:nt,Column:x,Disclosure:rt,Footer:et,Header:S,LoadMore:it,Root:Qe,Row:tt};try{x.displayName=`Column`,x.__docgenInfo={description:`Renders one accessible heading that can optionally request sorting.`,displayName:`Column`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Heading alignment. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Visible accessible column heading.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Derives a compact record label from this heading. Defaults to `true`.",name:`compactLabel`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Stable string or number column key.`,name:`id`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!0,tags:{},type:{name:`CollectionKey`}},rowHeader:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Marks this heading as the row label announced during cell navigation. Defaults to `false`.",name:`rowHeader`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sortable:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Allows this heading to request sort changes. Defaults to `false`.",name:`sortable`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Ref to the rendered column heading.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Plain-text accessible and compact label used when the visible heading is not a string.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`string | undefined`}},width:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`CSS width or grid-track size. Numeric values are pixels; omitted columns share remaining responsive-grid space.`,name:`width`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`TableColumnWidth | undefined`}}},tags:{}}}catch{}try{S.displayName=`Header`,S.__docgenInfo={description:`Renders static or generic accessible column headings.`,displayName:`Header`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Column> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Column) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table header.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{Qe.displayName=`Root`,Qe.__docgenInfo={description:`Coordinates semantic table navigation, row state, sorting, and responsive labels.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{boundary:{defaultValue:{value:`none`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Optional visual treatment for the table's lower edge. Defaults to `none`.",name:`boundary`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableBoundary | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ordered header, body, and optional footer sections.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactHiddenColumns:{defaultValue:{value:`[]`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`One key or reusable key collection omitted below the Breeze small breakpoint.`,name:`compactHiddenColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CompactHiddenColumns | undefined`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Keys whose rows cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},desktopColumns:{defaultValue:{value:`equal`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`.",name:`desktopColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableDesktopColumns | undefined`}},layout:{defaultValue:{value:`responsive`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`.",name:`layout`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableLayout | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Enables multiple row selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ref to the rendered table or virtualized grid element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Optional fixed- or variable-height row windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Current selected row keys.
Current immutable selected row keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Called with the next selected row keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Excluded when selection is controlled.
Initial selected row keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks controlled row selection and sorting as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Current consumer-owned sort descriptor.
Excluded when sorting is uncontrolled.`,name:`sort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}},onSortChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Called when a sortable heading requests a new descriptor.
Called when the internally retained descriptor changes.`,name:`onSortChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`((sort: TableSort) => void) | ((sort: TableSort) => void) | undefined`}},defaultSort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Excluded when sorting is controlled.
Initial sort descriptor.`,name:`defaultSort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}}},tags:{}}}catch{}try{$e.displayName=`Body`,$e.__docgenInfo={description:`Renders a stable ordered table body with static or generic rows.`,displayName:`Body`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},emptyContent:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Content displayed when this body has no rows.`,name:`emptyContent`,required:!1,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table body.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{et.displayName=`Footer`,et.__docgenInfo={description:`Renders a stable ordered table footer with static or generic rows.`,displayName:`Footer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table footer.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{tt.displayName=`Row`,tt.__docgenInfo={description:`Renders one keyed row whose cells follow heading order.`,displayName:`Row`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Ordered cells matching every visible table heading exactly once and in the same order, including after conditional column changes.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Prevents focus, selection, and actions for this row. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Stable string or number row key.`,name:`id`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`CollectionKey`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Called with this row key when its action is invoked.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`((key: CollectionKey) => void) | undefined`}},presentation:{defaultValue:{value:`data`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Record or grouped section geometry. Defaults to `data`.",name:`presentation`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`TableRowPresentation | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Ref to the rendered row.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableRowElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Plain-text row representation used for typeahead and accessibility.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`string`}},tone:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Domain-neutral visual emphasis. Defaults to `default`.",name:`tone`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`TableRowTone | undefined`}}},tags:{}}}catch{}try{nt.displayName=`Cell`,nt.__docgenInfo={description:`Renders one data cell and derives its compact label from the matching heading.`,displayName:`Cell`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:{value:`start`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Cell alignment at table widths. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Visible cell content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`ReactNode`}},column:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Stable key of the corresponding column heading.`,name:`column`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`CollectionKey`}},presentation:{defaultValue:{value:`data`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Canonical content geometry. `disclosure` positions one bare arrow for an actionable row. Defaults to `data`.",name:`presentation`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"data" | "disclosure" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Ref to the rendered data cell.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Plain-text cell value used for accessibility when content is not text.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}try{rt.displayName=`Disclosure`,rt.__docgenInfo={description:`Renders the canonical bare arrow for an actionable row.`,displayName:`Disclosure`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Cell alignment at table widths. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},column:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Stable key of the corresponding column heading.`,name:`column`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`CollectionKey`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Ref to the rendered data cell.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},position:{defaultValue:{value:`overlay`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableDisclosureProps`}],description:"Position over a standard compact row or remain in an explicit grid track. Defaults to `overlay`.",name:`position`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableDisclosureProps`},required:!1,tags:{},type:{name:`"flow" | "overlay" | undefined`}}},tags:{}}}catch{}try{it.displayName=`LoadMore`,it.__docgenInfo={description:`Renders a loading row and deduplicated intersection sentinel.`,displayName:`LoadMore`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Visible loading-row content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!0,tags:{},type:{name:`ReactNode`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:"Shows the loading row and suppresses duplicate requests. Defaults to `false`.",name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onLoadMore:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Called once when more consumer-owned rows should be requested.`,name:`onLoadMore`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!0,tags:{},type:{name:`() => void | Promise<void>`}},offset:{defaultValue:{value:`1`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:"Trigger distance as a proportion of the scroll viewport. Defaults to `1`.",name:`offset`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`number | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Ref to the rendered native or virtualized loading row.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement | HTMLTableRowElement> | undefined`}}},tags:{}}}catch{}try{w.displayName=`Table`,w.__docgenInfo={description:`Coordinates ordered static or generic table sections, responsive record
labels, row interaction, consumer-owned sorting, and optional virtualization.`,displayName:`Table`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{},tags:{summary:`responsive compound data table with optional virtualization`}}}catch{}})),Dt=n({ActionsStayWithApplications:()=>$,CompactConsumerGridPlacement:()=>L,CompactGridColumns:()=>I,CompactGridSpanningVisibility:()=>R,ConditionalOrderedColumns:()=>K,ControlledSortingAndSelection:()=>j,DesktopGridColumnSpan:()=>z,GridGroupedSections:()=>P,ReadOnlyAndEmpty:()=>q,ResponsiveGridColumnVariant:()=>F,ResponsiveGridColumnWidths:()=>B,ResponsiveGroupedSections:()=>V,ResponsiveItems:()=>W,ResponsiveItemsCompact:()=>G,RowTonesAndSections:()=>H,RowTonesAndSectionsCompact:()=>U,StaticOrderedSections:()=>M,StrongBoundary:()=>N,VariableVirtualizationAndLoading:()=>J,VariableVirtualizationAndLoadingCompact:()=>Y,VariableVirtualizationCompactBoundaries:()=>Q,VariableVirtualizationCompactHiddenColumns:()=>X,VariableVirtualizationNarrowDesktop:()=>Z,__namedExportsOrder:()=>Vt,default:()=>A});function Ot(){let[e,t]=(0,Lt.useState)([1]),[n,r]=(0,Lt.useState)({column:`name`,direction:`ascending`});return(0,T.jsxs)(w.Root,{"aria-label":`Controlled items`,onSelectionChange:t,onSortChange:r,selection:e,sort:n,children:[(0,T.jsxs)(w.Header,{id:`headings`,children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,sortable:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`state`,sortable:!0,children:`State`})]}),(0,T.jsxs)(w.Body,{id:`items`,children:[(0,T.jsxs)(w.Row,{id:1,textValue:`Alpha Ready`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Ready`})]}),(0,T.jsxs)(w.Row,{id:2,textValue:`Beta In review`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Beta`}),(0,T.jsx)(w.Cell,{column:`state`,children:`In review`})]}),(0,T.jsxs)(w.Row,{id:3,textValue:`Gamma Draft`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Gamma`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Draft`})]})]})]})}function kt(){return(0,T.jsxs)(w.Root,{"aria-label":`Compact scheduled records`,compactHiddenColumns:[`marker`,`date`,`actions`],layout:`grid`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`marker`,width:`max-content`,children:`Marker`}),(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`date`,width:`max-content`,children:`Date`}),(0,T.jsx)(w.Column,{align:`end`,id:`amount`,width:`max-content`,children:`Amount`}),(0,T.jsx)(w.Column,{id:`actions`,width:`max-content`,children:`Actions`})]}),(0,T.jsxs)(w.Body,{children:[(0,T.jsxs)(w.Row,{id:`subscription`,textValue:`Subscription 12 August £20`,children:[(0,T.jsx)(w.Cell,{column:`marker`,children:`Purchase`}),(0,T.jsx)(w.Cell,{column:`name`,children:`Subscription`}),(0,T.jsx)(w.Cell,{column:`date`,children:`12 August`}),(0,T.jsx)(w.Cell,{align:`end`,column:`amount`,children:`£20`}),(0,T.jsx)(w.Cell,{column:`actions`,children:`View`})]}),(0,T.jsxs)(w.Row,{id:`summary`,textValue:`Summary £40`,children:[(0,T.jsx)(w.Cell,{column:`marker`,children:`Total`}),(0,T.jsx)(w.Cell,{colSpan:2,column:`name`,children:`Summary`}),(0,T.jsx)(w.Cell,{align:`end`,column:`amount`,children:`£40`}),(0,T.jsx)(w.Cell,{column:`actions`,children:`View summary`})]}),(0,T.jsxs)(w.Row,{id:`editable`,textValue:`Editable reference`,children:[(0,T.jsx)(w.Cell,{column:`marker`,children:`Purchase`}),(0,T.jsx)(w.Cell,{column:`name`,children:(0,T.jsx)(_.Root,{"aria-label":`Reference`,defaultValue:`AB`,children:(0,T.jsx)(_.Input,{})})}),(0,T.jsx)(w.Cell,{column:`date`,children:`13 August`}),(0,T.jsx)(w.Cell,{align:`end`,column:`amount`,children:`£15`}),(0,T.jsx)(w.Cell,{column:`actions`,children:`View`})]})]})]})}function At(){return(0,T.jsxs)(w.Root,{"aria-label":`Spanning visibility`,compactHiddenColumns:[`hidden-a`,`hidden-c`,`hidden-d`],layout:`grid`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`hidden-a`,rowHeader:!0,children:`Record`}),(0,T.jsx)(w.Column,{id:`visible-b`,children:`Description`}),(0,T.jsx)(w.Column,{id:`hidden-c`,children:`Category`}),(0,T.jsx)(w.Column,{id:`hidden-d`,children:`Internal note`}),(0,T.jsx)(w.Column,{align:`end`,id:`visible-e`,width:`max-content`,children:`Amount`})]}),(0,T.jsx)(w.Body,{children:(0,T.jsxs)(w.Row,{id:`entry`,textValue:`Subscription £20`,children:[(0,T.jsx)(w.Cell,{colSpan:2,column:`hidden-a`,children:`Subscription`}),(0,T.jsx)(w.Cell,{colSpan:2,column:`hidden-c`,children:`Internal note`}),(0,T.jsx)(w.Cell,{align:`end`,column:`visible-e`,children:`£20`})]})})]})}function jt(){return(0,T.jsxs)(w.Root,{"aria-label":`Semantic row presentations`,className:`grid-cols-2`,layout:`grid`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{align:`end`,id:`score`,children:`Score`})]}),(0,T.jsxs)(w.Body,{children:[(0,T.jsxs)(w.Row,{id:`group-a`,presentation:`section`,textValue:`Group A 20`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Group A`}),(0,T.jsx)(w.Cell,{align:`end`,column:`score`,children:`20`})]}),(0,T.jsxs)(w.Row,{id:`active`,onAction:()=>void 0,textValue:`Active 30`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Active`}),(0,T.jsx)(w.Cell,{align:`end`,column:`score`,children:`30`})]}),(0,T.jsxs)(w.Row,{id:`paused`,onAction:()=>void 0,textValue:`Paused 10`,tone:`muted`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Paused`}),(0,T.jsx)(w.Cell,{align:`end`,column:`score`,children:`10`})]})]})]})}async function Mt(e){let t=k(e),n=t.getByRole(`row`,{name:`Group A`}),r=t.getByRole(`row`,{name:`Active`}),i=t.getByRole(`row`,{name:`Paused`}),a=e.ownerDocument.defaultView;await E(n).toHaveAttribute(`data-presentation`,`section`),await E(n.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await E(a?.getComputedStyle(n).backgroundColor).toBe(`rgb(223, 228, 236)`),await E(a?.getComputedStyle(r).backgroundColor).toBe(`rgb(255, 255, 255)`),await E(i).toHaveAttribute(`data-tone`,`muted`),await E(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(241, 243, 246)`),await D.hover(r),await E(a?.getComputedStyle(r).backgroundColor).toBe(`rgb(248, 250, 255)`),await D.unhover(r),await D.hover(i),await E(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(233, 237, 242)`)}function Nt(){return(0,T.jsxs)(w.Root,{"aria-label":`Responsive items`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{compactLabel:!1,id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`state`,children:`State`})]}),(0,T.jsxs)(w.Body,{children:[(0,T.jsxs)(w.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Ready`})]}),(0,T.jsxs)(w.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Beta`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Review`})]})]})]})}function Pt({compactHiddenState:e=!1,expandedState:t=!1}){let n=t?`Ready with a detailed status that wraps onto several lines`:`Ready`;return(0,T.jsxs)(w.Root,{"aria-label":`Virtual data`,compactHiddenColumns:e?[`state`]:void 0,virtualization:{estimatedRowHeight:52,mode:`variable`,overscan:80,viewportHeight:156},children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`state`,children:`State`})]}),(0,T.jsxs)(w.Body,{children:[(0,T.jsxs)(w.Row,{id:1,textValue:`Alpha ${n}`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`}),(0,T.jsx)(w.Cell,{column:`state`,children:n})]}),(0,T.jsxs)(w.Row,{id:2,textValue:`Beta In review`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Beta`}),(0,T.jsx)(w.Cell,{column:`state`,children:`In review`})]}),(0,T.jsxs)(w.Row,{id:3,textValue:`Gamma Draft`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Gamma`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Draft`})]}),(0,T.jsx)(w.LoadMore,{loading:!0,onLoadMore:()=>void 0,children:`Loading more items`})]})]})}function Ft(){return(0,T.jsxs)(w.Root,{"aria-label":`Virtual boundary records`,compactHiddenColumns:[`marker`,`support`,`actions`],layout:`grid`,virtualization:{estimatedRowHeight:52,mode:`variable`,overscan:0,viewportHeight:156},children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`marker`,children:`Marker`}),(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`support`,children:`Support`}),(0,T.jsx)(w.Column,{id:`amount`,children:`Amount`}),(0,T.jsx)(w.Column,{id:`actions`,children:`Actions`})]}),(0,T.jsx)(w.Body,{items:Bt,children:e=>(0,T.jsxs)(w.Row,{id:e.id,textValue:`${e.name} ${e.amount}`,children:[(0,T.jsxs)(w.Cell,{column:`marker`,children:[`Marker `,e.id]}),(0,T.jsx)(w.Cell,{column:`name`,children:e.name}),(0,T.jsxs)(w.Cell,{column:`support`,children:[`Support `,e.id]}),(0,T.jsx)(w.Cell,{column:`amount`,children:e.amount}),(0,T.jsxs)(w.Cell,{column:`actions`,children:[`Actions `,e.id]})]})})]})}async function It(e,t=!1){let n=k(e),r=n.getByRole(`grid`,{name:`Virtual data`}),i=n.getByRole(`row`,{name:`Alpha`}),a=n.getByRole(`row`,{name:`Beta`}),o=n.getByRole(`rowheader`,{name:`Alpha`}),s=t?n.getByText(/Ready/):n.getByRole(`gridcell`,{name:`Ready`}),c=i.getBoundingClientRect(),l=o.getBoundingClientRect(),u=s.getBoundingClientRect(),d=r.getBoundingClientRect(),f=e.ownerDocument.defaultView,p=(f?.innerWidth??0)<681;if(await E(c.width).toBe(d.width),await E(f?.getComputedStyle(i).borderBottomWidth).toBe(p?`1px`:`0px`),p){let e=a.getBoundingClientRect();t?await E(u.width).toBe(0):(await E(l.width).toBe(u.width),await E(l.x).toBe(u.x),await E(u.y).toBeGreaterThan(l.y)),await E(c.bottom).toBeLessThanOrEqual(e.y),await E(r.scrollWidth).toBe(r.clientWidth);return}let ee=n.getByRole(`columnheader`,{name:`Name`}),m=n.getByRole(`columnheader`,{name:`State`}),te=ee.getBoundingClientRect(),h=m.getBoundingClientRect(),g=a.getBoundingClientRect();await E(l.width).toBe(te.width),await E(u.width).toBe(h.width),await E(l.right).toBe(u.left),await E(c.bottom).toBeLessThanOrEqual(g.y),await E(f?.getComputedStyle(o).borderBottomWidth).toBe(`1px`),await E(f?.getComputedStyle(s).borderBottomWidth).toBe(`1px`)}var Lt,T,E,Rt,D,O,k,A,zt,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,Bt,J,Y,X,Z,Q,$,Vt,Ht=t((()=>{Lt=e(r(),1),p(),h(),ne(),ie(),Et(),T=u(),{expect:E,fireEvent:Rt,userEvent:D,waitFor:O,within:k}=__STORYBOOK_MODULE_TEST__,A={component:Qe,decorators:[e=>(Object.assign(w.Body,{displayName:`Table.Body`}),Object.assign(w.Cell,{displayName:`Table.Cell`}),Object.assign(w.Column,{displayName:`Table.Column`}),Object.assign(w.Disclosure,{displayName:`Table.Disclosure`}),Object.assign(w.Footer,{displayName:`Table.Footer`}),Object.assign(w.Header,{displayName:`Table.Header`}),Object.assign(w.LoadMore,{displayName:`Table.LoadMore`}),Object.assign(w.Root,{displayName:`Table.Root`}),Object.assign(w.Row,{displayName:`Table.Row`}),(0,T.jsx)(e,{}))],subcomponents:{Body:$e,Cell:nt,Column:x,Disclosure:rt,Footer:et,Header:S,LoadMore:it,Row:tt},title:`Collections/Table`},zt={globals:{viewport:{value:`compactBoundary`}},parameters:{viewport:{options:{compactBoundary:{name:`Compact boundary`,styles:{height:`800px`,width:`680px`}}}}}},j={args:{"aria-label":`Items`,children:null},play:async({canvasElement:e})=>{let t=k(e);await D.click(t.getByRole(`columnheader`,{name:`Name`})),await E(t.getByRole(`columnheader`,{name:`Name`})).toHaveAttribute(`aria-sort`,`descending`),await E(t.getByRole(`rowheader`,{name:`Alpha`})).toHaveAttribute(`data-label`,`Name:`)},render:Ot},M={args:{"aria-label":`Static data`,children:null},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Static data`,children:[(0,T.jsxs)(w.Header,{id:`heading-section`,children:[(0,T.jsx)(w.Column,{id:`label`,rowHeader:!0,children:`Label`}),(0,T.jsx)(w.Column,{id:`value`,children:`Value`})]}),(0,T.jsx)(w.Body,{id:`body-section`,children:(0,T.jsxs)(w.Row,{id:`first`,textValue:`First Long value`,children:[(0,T.jsx)(w.Cell,{column:`label`,children:`First`}),(0,T.jsx)(w.Cell,{column:`value`,children:`A long value that wraps in the responsive card presentation`})]})}),(0,T.jsx)(w.Footer,{id:`footer-section`,children:(0,T.jsxs)(w.Row,{id:`summary`,textValue:`Summary One item`,children:[(0,T.jsx)(w.Cell,{column:`label`,children:`Summary`}),(0,T.jsx)(w.Cell,{column:`value`,children:`One item`})]})})]})},N={args:{"aria-label":`Bounded items`,boundary:`strong`,children:null},play:async({canvasElement:e})=>{let t=k(e).getByRole(`grid`,{name:`Bounded items`}),n=getComputedStyle(t);await E(t).toHaveAttribute(`data-boundary`,`strong`),await E(n.borderTopWidth).toBe(`0px`),await E(n.borderRightWidth).toBe(`0px`),await E(n.borderBottomWidth).toBe(`2px`),await E(n.borderLeftWidth).toBe(`0px`)},render:({"aria-label":e,boundary:t})=>(0,T.jsxs)(w.Root,{"aria-label":e,boundary:t,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`state`,children:`State`})]}),(0,T.jsx)(w.Body,{children:(0,T.jsxs)(w.Row,{id:`aurora`,textValue:`Aurora Ready`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Aurora`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Ready`})]})})]})},P={args:{"aria-label":`Grouped grid items`,children:null},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`grid`,{name:`Grouped grid items`}),r=t.getByRole(`row`,{name:`Name State`}),i=t.getByRole(`row`,{name:`Beta`}),a=t.getByRole(`row`,{name:`Gamma`}),o=t.getByRole(`columnheader`,{name:`State`}),s=t.getByRole(`columnheader`,{name:`Name`}),c=t.getByRole(`rowheader`,{name:`Active`}),l=t.getByRole(`gridcell`,{name:`Ready`}),u=t.getByRole(`gridcell`,{name:`Review`}),d=t.getByRole(`gridcell`,{name:`Draft`}),f=e.ownerDocument.defaultView;await E(f?.getComputedStyle(n).display).toBe(`grid`),await E(f?.getComputedStyle(r.parentElement).display).toBe(`grid`),await E(f?.getComputedStyle(r).display).toBe(`grid`),await E(f?.getComputedStyle(i.parentElement).display).toBe(`grid`),await E(f?.getComputedStyle(i).display).toBe(`grid`),await E(c).toHaveAttribute(`colspan`,`2`),await E(c.getBoundingClientRect().left).toBeCloseTo(s.getBoundingClientRect().left,1),await E(c.getBoundingClientRect().right).toBeCloseTo(o.getBoundingClientRect().right,1),await E(f?.getComputedStyle(i).borderBottomWidth).toBe(`1px`),await E(f?.getComputedStyle(a).borderBottomWidth).toBe(`0px`),await E(l.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1),await E(u.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1),await E(d.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1)},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Grouped grid items`,className:`grid-cols-[minmax(0,1fr)_auto]`,layout:`grid`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`state`,children:`State`})]}),(0,T.jsxs)(w.Body,{id:`active`,children:[(0,T.jsx)(w.Row,{id:`active-section`,presentation:`section`,textValue:`Active`,children:(0,T.jsx)(w.Cell,{colSpan:2,column:`name`,children:`Active`})}),(0,T.jsxs)(w.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Ready`})]}),(0,T.jsxs)(w.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Beta`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Review`})]})]}),(0,T.jsxs)(w.Body,{id:`archived`,children:[(0,T.jsx)(w.Row,{id:`archived-section`,presentation:`section`,textValue:`Archived`,children:(0,T.jsx)(w.Cell,{colSpan:2,column:`name`,children:`Archived`})}),(0,T.jsxs)(w.Row,{id:`gamma`,textValue:`Gamma Draft`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Gamma`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Draft`})]})]})]})},F={args:{"aria-label":`Responsive company records`,children:null},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`columnheader`,{name:`Media`}),r=t.getByRole(`columnheader`,{name:`Name`}),i=t.getByRole(`columnheader`,{name:`Number`}),a=t.getByRole(`columnheader`,{name:`Contact`}),o=t.getByRole(`columnheader`,{name:`Action`}),s=t.getByRole(`gridcell`,{name:`AC`}),c=t.getByRole(`rowheader`,{name:`Acme`}),l=t.getByRole(`gridcell`,{name:`View details`});await O(async()=>{await E(l.getBoundingClientRect().left).toBe(o.getBoundingClientRect().left),await E(l.getBoundingClientRect().height).toBeCloseTo(Number.parseFloat(getComputedStyle(l).lineHeight),1),await E(r.getBoundingClientRect().width).toBeGreaterThan(a.getBoundingClientRect().width),await E(a.getBoundingClientRect().width).toBeGreaterThan(i.getBoundingClientRect().width)}),await E(s.getBoundingClientRect().left).toBeCloseTo(n.getBoundingClientRect().left,1),await E(c.getBoundingClientRect().left).toBeCloseTo(r.getBoundingClientRect().left,1),await E(s).toHaveAttribute(`data-breeze-compact-hidden`,``)},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Responsive company records`,compactHiddenColumns:[`media`],desktopColumns:`mediaDetailsAction`,layout:`responsiveGrid`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{compactLabel:!1,id:`media`,children:`Media`}),(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`number`,children:`Number`}),(0,T.jsx)(w.Column,{id:`contact`,children:`Contact`}),(0,T.jsx)(w.Column,{align:`end`,compactLabel:!1,id:`action`,children:`Action`})]}),(0,T.jsxs)(w.Body,{children:[(0,T.jsxs)(w.Row,{id:`acme`,textValue:`Acme 123 contact@example.test`,children:[(0,T.jsx)(w.Cell,{column:`media`,children:`AC`}),(0,T.jsx)(w.Cell,{column:`name`,children:`Acme`}),(0,T.jsx)(w.Cell,{column:`number`,children:`123`}),(0,T.jsx)(w.Cell,{column:`contact`,children:`contact@example.test`}),(0,T.jsx)(w.Cell,{align:`end`,column:`action`,children:`View`})]}),(0,T.jsxs)(w.Row,{id:`northwind`,textValue:`Northwind 456 hello@example.test`,children:[(0,T.jsx)(w.Cell,{column:`media`,children:`NW`}),(0,T.jsx)(w.Cell,{column:`name`,children:`Northwind`}),(0,T.jsx)(w.Cell,{column:`number`,children:`456`}),(0,T.jsx)(w.Cell,{column:`contact`,children:`hello@example.test`}),(0,T.jsx)(w.Cell,{align:`end`,column:`action`,children:`View details`})]})]})]})},I={args:{"aria-label":`Compact scheduled records`,children:null},...zt,play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`grid`,{name:`Compact scheduled records`}),r=t.getByRole(`row`,{name:`Subscription`}),i=t.getByRole(`rowheader`,{name:`Subscription`}),a=t.getByText(`12 August`),o=t.getByRole(`gridcell`,{name:`£20`}),s=t.getByRole(`row`,{name:`Summary`}),c=t.getByRole(`rowheader`,{name:`Summary`}),l=k(s).getByRole(`gridcell`,{name:`£40`});await O(()=>E(getComputedStyle(n).gridTemplateColumns.split(` `)).toHaveLength(2)),await E(a.getBoundingClientRect().width).toBe(0),await E(i.getBoundingClientRect().right).toBeLessThanOrEqual(o.getBoundingClientRect().left),await E(r.getBoundingClientRect().width).toBeGreaterThan(0),await E(c.getBoundingClientRect().right).toBeLessThanOrEqual(l.getBoundingClientRect().left),await D.click(i),await E(i).toHaveFocus(),await D.keyboard(`{ArrowRight}`),await E(o).toHaveFocus(),await D.keyboard(`{ArrowLeft}`),await E(i).toHaveFocus(),await D.keyboard(`{End}`),await E(o).toHaveFocus(),await D.keyboard(`{Home}`),await E(i).toHaveFocus();let u=t.getByRole(`textbox`,{name:`Reference`}),d=t.getByRole(`gridcell`,{name:`£15`});await E(u.getBoundingClientRect().right).toBeLessThan(d.getBoundingClientRect().left),await D.click(u),await D.keyboard(`{ArrowRight}`),await E(u).toHaveFocus()},render:kt},L={args:{"aria-label":`Compact consumer records`,children:null},...zt,play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`row`,{name:`Acme`}),r=t.getByRole(`gridcell`,{name:`Ready`}),i=e.ownerDocument.defaultView,a=i?.getComputedStyle(n),o=n.getBoundingClientRect().width-Number.parseFloat(a?.paddingLeft??`0`)-Number.parseFloat(a?.paddingRight??`0`);await E(i?.getComputedStyle(r).gridColumn).toBe(`span 3 / span 3`),await E(r.getBoundingClientRect().width).toBe(o)},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Compact consumer records`,layout:`responsiveGrid`,children:[(0,T.jsxs)(w.Header,{className:`max-sm:hidden!`,children:[(0,T.jsx)(w.Column,{compactLabel:!1,id:`avatar`,width:`max-content`,children:`Company`}),(0,T.jsx)(w.Column,{compactLabel:!1,id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{align:`end`,compactLabel:!1,id:`balance`,width:`max-content`,children:`Balance`}),(0,T.jsx)(w.Column,{id:`status`,children:`Status`})]}),(0,T.jsx)(w.Body,{className:`max-sm:block!`,children:(0,T.jsxs)(w.Row,{className:`max-sm:grid! max-sm:grid-cols-[max-content_minmax(0,1fr)_max-content] max-sm:items-center! max-sm:gap-x-4`,id:`acme`,textValue:`Acme Ready`,children:[(0,T.jsx)(w.Cell,{className:`max-sm:col-start-1 max-sm:row-start-1`,column:`avatar`,textValue:`Acme`,children:(0,T.jsx)(ee,{initials:`AC`,name:`Acme`,size:`sm`})}),(0,T.jsx)(w.Cell,{className:`max-sm:col-start-2 max-sm:row-start-1`,column:`name`,children:`Acme`}),(0,T.jsx)(w.Cell,{align:`end`,className:`max-sm:col-start-3 max-sm:row-start-1`,column:`balance`,children:`£20`}),(0,T.jsx)(w.Cell,{className:`max-sm:col-span-3 max-sm:row-start-2`,column:`status`,children:`Ready`})]})})]})},R={args:{"aria-label":`Spanning visibility`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=k(e),n=t.getByText(`Subscription`),r=t.getByText(`Internal note`,{selector:`[role="gridcell"]`});await E(n.getBoundingClientRect().width).toBeGreaterThan(0),await E(r.getBoundingClientRect().width).toBe(0)},render:At},z={args:{"aria-label":`Compact scheduled records`,children:null},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`grid`,{name:`Compact scheduled records`}),r=t.getByRole(`row`,{name:`Summary`}),i=t.getByRole(`rowheader`,{name:`Summary`}),a=k(r).getByRole(`gridcell`,{name:`£40`}),o=t.getByRole(`columnheader`,{name:`Name`});await O(()=>E(getComputedStyle(n).gridTemplateColumns.split(` `)).toHaveLength(5)),await E(getComputedStyle(i).gridColumn).toBe(`span 2 / span 2`),await E(i.getBoundingClientRect().left).toBe(o.getBoundingClientRect().left),await E(i.getBoundingClientRect().right).toBeLessThan(a.getBoundingClientRect().left)},render:kt},B={args:{"aria-label":`Responsive records`,children:null},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`gridcell`,{name:`A`}),r=t.getByRole(`rowheader`,{name:`Example record`}),i=t.getByText(`Amount`),a=t.getByText(`£10.00`);await O(async()=>{await E(r.getBoundingClientRect().width).toBeGreaterThan(n.getBoundingClientRect().width),await E(a.getBoundingClientRect().right).toBeCloseTo(i.getBoundingClientRect().right,1)})},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Responsive records`,layout:`responsiveGrid`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{compactLabel:!1,id:`marker`,textValue:`Marker`,width:`max-content`,children:(0,T.jsx)(`span`,{className:`sr-only`,children:`Marker`})}),(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,width:`minmax(0, 1fr)`,children:`Name`}),(0,T.jsx)(w.Column,{align:`end`,id:`amount`,width:`max-content`,children:(0,T.jsx)(`span`,{children:`Amount`})}),(0,T.jsx)(w.Column,{compactLabel:!1,id:`action`,textValue:`Action`,width:`max-content`,children:(0,T.jsx)(`span`,{className:`sr-only`,children:`Action`})})]}),(0,T.jsx)(w.Body,{children:(0,T.jsxs)(w.Row,{id:`record`,textValue:`Example record`,children:[(0,T.jsx)(w.Cell,{column:`marker`,children:(0,T.jsx)(`span`,{className:`flex size-9 items-center justify-center`,children:`A`})}),(0,T.jsx)(w.Cell,{column:`name`,children:`Example record`}),(0,T.jsx)(w.Cell,{align:`end`,column:`amount`,children:(0,T.jsx)(`span`,{children:`£10.00`})}),(0,T.jsx)(w.Disclosure,{column:`action`,position:`flow`})]})})]})},V={args:{"aria-label":`Grouped responsive items`,children:null},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`gridcell`,{name:`Review`}),r=t.getByRole(`gridcell`,{name:`Draft`}),i=e.ownerDocument.defaultView;await E(i?.getComputedStyle(n).borderBottomWidth).toBe(`1px`),await E(i?.getComputedStyle(r).borderBottomWidth).toBe(`0px`)},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Grouped responsive items`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`state`,children:`State`})]}),(0,T.jsxs)(w.Body,{id:`active`,children:[(0,T.jsxs)(w.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Ready`})]}),(0,T.jsxs)(w.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Beta`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Review`})]})]}),(0,T.jsx)(w.Body,{id:`archived`,children:(0,T.jsxs)(w.Row,{id:`gamma`,textValue:`Gamma Draft`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Gamma`}),(0,T.jsx)(w.Cell,{column:`state`,children:`Draft`})]})})]})},H={args:{"aria-label":`Semantic row presentations`,children:null},play:async({canvasElement:e})=>Mt(e),render:()=>(0,T.jsx)(jt,{})},U={args:{"aria-label":`Semantic row presentations`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>Mt(e),render:()=>(0,T.jsx)(jt,{})},W={args:{"aria-label":`Responsive items`,children:null},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`columnheader`,{name:`Name`}),r=t.getByRole(`row`,{name:`Alpha`}),i=t.getByRole(`rowheader`,{name:`Alpha`}),a=t.getByRole(`gridcell`,{name:`Ready`}),o=t.getByRole(`gridcell`,{name:`Review`}),s=e.ownerDocument.defaultView,c=s?.getComputedStyle(n),l=s?.getComputedStyle(i),u=s?.getComputedStyle(a,`::before`);await E(n.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await E(r.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await E(c?.paddingLeft).toBe(l?.paddingLeft),await E(l?.verticalAlign).toBe(`middle`),await E(l?.borderBottomWidth).toBe(`1px`),await E(a).toHaveAttribute(`data-label`,`State:`),await E(u?.display).toBe(`none`),await E(s?.getComputedStyle(o).borderBottomWidth).toBe(`0px`)},render:()=>(0,T.jsx)(Nt,{})},G={args:{"aria-label":`Responsive items`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`row`,{name:`Alpha`}),r=t.getByRole(`row`,{name:`Beta`}),i=t.getByRole(`rowheader`,{name:`Alpha`}),a=t.getByRole(`gridcell`,{name:`Ready`}),o=e.ownerDocument.defaultView,s=o?.getComputedStyle(n),c=o?.getComputedStyle(a),l=o?.getComputedStyle(a,`::before`);await E(s?.display).toBe(`flex`),await E(s?.flexDirection).toBe(`column`),await E(Number.parseFloat(s?.gap??`0`)).toBeGreaterThan(0),await E(s?.borderBottomWidth).toBe(`1px`),await E(o?.getComputedStyle(r).borderBottomWidth).toBe(`0px`),await E(c?.display).toBe(`block`),await E(l?.display).toBe(`inline-block`),await E(c?.paddingTop).toBe(`0px`),await E(c?.borderBottomWidth).toBe(`0px`),await E(a).toHaveAttribute(`data-label`,`State:`),await E(i).not.toHaveAttribute(`data-label`)},render:()=>(0,T.jsx)(Nt,{})},K={args:{"aria-label":`Conditional columns`,children:null},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Conditional columns`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`state`,children:`State`}),(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`})]}),(0,T.jsxs)(w.Body,{children:[(0,T.jsxs)(w.Row,{id:1,textValue:`Ready Alpha`,children:[(0,T.jsx)(w.Cell,{column:`state`,children:`Ready`}),(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`})]}),(0,T.jsxs)(w.Row,{id:2,textValue:`In review Beta`,children:[(0,T.jsx)(w.Cell,{column:`state`,children:`In review`}),(0,T.jsx)(w.Cell,{column:`name`,children:`Beta`})]}),(0,T.jsxs)(w.Row,{id:3,textValue:`Draft Gamma`,children:[(0,T.jsx)(w.Cell,{column:`state`,children:`Draft`}),(0,T.jsx)(w.Cell,{column:`name`,children:`Gamma`})]})]})]})},q={args:{"aria-label":`States`,children:null},render:()=>(0,T.jsxs)(re,{gap:`xl`,children:[(0,T.jsxs)(w.Root,{"aria-label":`Read-only`,readOnly:!0,selection:[1],children:[(0,T.jsx)(w.Header,{children:(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`})}),(0,T.jsx)(w.Body,{children:(0,T.jsx)(w.Row,{id:1,textValue:`Alpha`,children:(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`})})})]}),(0,T.jsxs)(w.Root,{"aria-label":`Empty`,children:[(0,T.jsx)(w.Header,{children:(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`})}),(0,T.jsx)(w.Body,{emptyContent:`No items`,children:null})]})]})},Bt=Array.from({length:20},(e,t)=>({amount:`£${t+1}`,id:t+1,name:`Record ${t+1}`})),J={args:{"aria-label":`Virtual data`,children:null},play:async({canvasElement:e})=>It(e),render:()=>(0,T.jsx)(Pt,{})},Y={args:{"aria-label":`Virtual data`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>It(e),render:()=>(0,T.jsx)(Pt,{})},X={...Y,play:async({canvasElement:e})=>It(e,!0),render:()=>(0,T.jsx)(Pt,{compactHiddenState:!0})},Z={args:{"aria-label":`Virtual data`,children:null},play:async({canvasElement:e})=>It(e,!0),render:()=>(0,T.jsx)(`div`,{style:{width:320},children:(0,T.jsx)(Pt,{compactHiddenState:!0,expandedState:!0})})},Q={args:{"aria-label":`Virtual boundary records`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=k(e),n=t.getByRole(`rowheader`,{name:`Record 1`}),r=t.getByRole(`gridcell`,{name:`£1`});await D.click(n),await D.keyboard(`{ArrowRight}`),await E(r).toHaveFocus(),await D.keyboard(`{ArrowLeft}`),await E(n).toHaveFocus(),await Rt.keyDown(n,{ctrlKey:!0,key:`End`,metaKey:!0}),await O(()=>E(t.getByRole(`gridcell`,{name:`£20`})).toHaveFocus());let i=t.getByRole(`gridcell`,{name:`£20`});await Rt.keyDown(i,{ctrlKey:!0,key:`Home`,metaKey:!0}),await O(()=>E(t.getByRole(`rowheader`,{name:`Record 1`})).toHaveFocus())},render:Ft},$={args:{"aria-label":`Action table`,children:null},render:()=>(0,T.jsxs)(w.Root,{"aria-label":`Action table`,children:[(0,T.jsxs)(w.Header,{children:[(0,T.jsx)(w.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,T.jsx)(w.Column,{id:`action`,children:`Action`})]}),(0,T.jsx)(w.Body,{children:(0,T.jsxs)(w.Row,{id:`alpha`,textValue:`Alpha Inspect`,children:[(0,T.jsx)(w.Cell,{column:`name`,children:`Alpha`}),(0,T.jsx)(w.Cell,{column:`action`,children:(0,T.jsx)(g,{appearance:`ghost`,size:`sm`,children:`Inspect`})})]})})]})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source},description:{story:`Authors columns and rows directly while the application controls selected
keys and the consumer-owned sort descriptor.

@summary explicitly authored table with controlled sorting and selection`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source},description:{story:`Composes keyed static header, body, and footer sections whose cells follow
the visible heading order and retain long-value wrapping.

@summary static ordered header body and footer sections`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source},description:{story:`Adds the canonical strong lower boundary without introducing top or side
borders, preserving the table's relationship to surrounding content.

@summary table with a strong lower boundary`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source},description:{story:`Uses persistent CSS-grid rows across multiple keyed body sections so every
cell stays aligned with its corresponding heading track.

@summary persistent grid layout with grouped body sections`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
    const actionCell = canvas.getByRole('gridcell', {
      name: 'View details'
    });
    await waitFor(async () => {
      await expect(actionCell.getBoundingClientRect().left).toBe(actionHeading.getBoundingClientRect().left);
      await expect(actionCell.getBoundingClientRect().height).toBeCloseTo(Number.parseFloat(getComputedStyle(actionCell).lineHeight), 1);
      await expect(primaryHeading.getBoundingClientRect().width).toBeGreaterThan(tertiaryHeading.getBoundingClientRect().width);
      await expect(tertiaryHeading.getBoundingClientRect().width).toBeGreaterThan(secondaryHeading.getBoundingClientRect().width);
    });
    await expect(mediaCell.getBoundingClientRect().left).toBeCloseTo(mediaHeading.getBoundingClientRect().left, 1);
    await expect(primaryCell.getBoundingClientRect().left).toBeCloseTo(primaryHeading.getBoundingClientRect().left, 1);
    await expect(mediaCell).toHaveAttribute('data-breeze-compact-hidden', '');
  },
  render: () => <Table.Root aria-label="Responsive company records" compactHiddenColumns={['media']} desktopColumns="mediaDetailsAction" layout="responsiveGrid">
      <Table.Header>
        <Table.Column compactLabel={false} id="media">
          Media
        </Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="number">Number</Table.Column>
        <Table.Column id="contact">Contact</Table.Column>
        <Table.Column align="end" compactLabel={false} id="action">
          Action
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="acme" textValue="Acme 123 contact@example.test">
          <Table.Cell column="media">AC</Table.Cell>
          <Table.Cell column="name">Acme</Table.Cell>
          <Table.Cell column="number">123</Table.Cell>
          <Table.Cell column="contact">contact@example.test</Table.Cell>
          <Table.Cell align="end" column="action">
            View
          </Table.Cell>
        </Table.Row>
        <Table.Row id="northwind" textValue="Northwind 456 hello@example.test">
          <Table.Cell column="media">NW</Table.Cell>
          <Table.Cell column="name">Northwind</Table.Cell>
          <Table.Cell column="number">456</Table.Cell>
          <Table.Cell column="contact">hello@example.test</Table.Cell>
          <Table.Cell align="end" column="action">
            View details
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...F.parameters?.docs?.source},description:{story:`Uses a named five-column desktop arrangement while retaining compact card
rows below the Breeze small breakpoint.

@summary typed media, details, and action desktop grid columns`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Compact scheduled records',
    children: null
  },
  ...compactBoundaryViewport,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('grid', {
      name: 'Compact scheduled records'
    });
    const row = canvas.getByRole('row', {
      name: 'Subscription'
    });
    const name = canvas.getByRole('rowheader', {
      name: 'Subscription'
    });
    const date = canvas.getByText('12 August');
    const amount = canvas.getByRole('gridcell', {
      name: '£20'
    });
    const summaryRow = canvas.getByRole('row', {
      name: 'Summary'
    });
    const summary = canvas.getByRole('rowheader', {
      name: 'Summary'
    });
    const summaryAmount = within(summaryRow).getByRole('gridcell', {
      name: '£40'
    });
    await waitFor(() => expect(getComputedStyle(table).gridTemplateColumns.split(' ')).toHaveLength(2));
    await expect(date.getBoundingClientRect().width).toBe(0);
    await expect(name.getBoundingClientRect().right).toBeLessThanOrEqual(amount.getBoundingClientRect().left);
    await expect(row.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(summary.getBoundingClientRect().right).toBeLessThanOrEqual(summaryAmount.getBoundingClientRect().left);
    await userEvent.click(name);
    await expect(name).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(amount).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(name).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(amount).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(name).toHaveFocus();
    const reference = canvas.getByRole<HTMLInputElement>('textbox', {
      name: 'Reference'
    });
    const editableAmount = canvas.getByRole('gridcell', {
      name: '£15'
    });
    await expect(reference.getBoundingClientRect().right).toBeLessThan(editableAmount.getBoundingClientRect().left);
    await userEvent.click(reference);
    await userEvent.keyboard('{ArrowRight}');
    await expect(reference).toHaveFocus();
  },
  render: GridColumnSpanTable
}`,...I.parameters?.docs?.source},description:{story:`Removes supporting desktop-only columns and their grid tracks at the compact
breakpoint while preserving spanning and keyboard geometry.

@summary compact grid omits hidden tracks`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Compact consumer records',
    children: null
  },
  ...compactBoundaryViewport,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('row', {
      name: 'Acme'
    });
    const status = canvas.getByRole('gridcell', {
      name: 'Ready'
    });
    const view = canvasElement.ownerDocument.defaultView;
    const rowStyle = view?.getComputedStyle(row);
    const rowContentWidth = row.getBoundingClientRect().width - Number.parseFloat(rowStyle?.paddingLeft ?? '0') - Number.parseFloat(rowStyle?.paddingRight ?? '0');
    await expect(view?.getComputedStyle(status).gridColumn).toBe('span 3 / span 3');
    await expect(status.getBoundingClientRect().width).toBe(rowContentWidth);
  },
  render: () => <Table.Root aria-label="Compact consumer records" layout="responsiveGrid">
      <Table.Header className="max-sm:hidden!">
        <Table.Column compactLabel={false} id="avatar" width="max-content">
          Company
        </Table.Column>
        <Table.Column compactLabel={false} id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column align="end" compactLabel={false} id="balance" width="max-content">
          Balance
        </Table.Column>
        <Table.Column id="status">Status</Table.Column>
      </Table.Header>
      <Table.Body className="max-sm:block!">
        <Table.Row className="max-sm:grid! max-sm:grid-cols-[max-content_minmax(0,1fr)_max-content] max-sm:items-center! max-sm:gap-x-4" id="acme" textValue="Acme Ready">
          <Table.Cell className="max-sm:col-start-1 max-sm:row-start-1" column="avatar" textValue="Acme">
            <Avatar initials="AC" name="Acme" size="sm" />
          </Table.Cell>
          <Table.Cell className="max-sm:col-start-2 max-sm:row-start-1" column="name">
            Acme
          </Table.Cell>
          <Table.Cell align="end" className="max-sm:col-start-3 max-sm:row-start-1" column="balance">
            £20
          </Table.Cell>
          <Table.Cell className="max-sm:col-span-3 max-sm:row-start-2" column="status">
            Ready
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
}`,...L.parameters?.docs?.source},description:{story:`Preserves consumer-owned compact grid placement for cells that do not use
the compound API's \`colSpan\` contract.

@summary compact grid honours consumer cell placement`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Spanning visibility',
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
    const mixed = canvas.getByText('Subscription');
    const hidden = canvas.getByText('Internal note', {
      selector: '[role="gridcell"]'
    });
    await expect(mixed.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(hidden.getBoundingClientRect().width).toBe(0);
  },
  render: CompactSpanningVisibilityTable
}`,...R.parameters?.docs?.source},description:{story:`Keeps a span visible when any covered column remains in the compact grid and
removes it when every covered column is compact-hidden.

@summary compact spans follow covered column visibility`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Compact scheduled records',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('grid', {
      name: 'Compact scheduled records'
    });
    const summaryRow = canvas.getByRole('row', {
      name: 'Summary'
    });
    const summary = canvas.getByRole('rowheader', {
      name: 'Summary'
    });
    const summaryAmount = within(summaryRow).getByRole('gridcell', {
      name: '£40'
    });
    const nameHeading = canvas.getByRole('columnheader', {
      name: 'Name'
    });
    await waitFor(() => expect(getComputedStyle(table).gridTemplateColumns.split(' ')).toHaveLength(5));
    await expect(getComputedStyle(summary).gridColumn).toBe('span 2 / span 2');
    await expect(summary.getBoundingClientRect().left).toBe(nameHeading.getBoundingClientRect().left);
    await expect(summary.getBoundingClientRect().right).toBeLessThan(summaryAmount.getBoundingClientRect().left);
  },
  render: GridColumnSpanTable
}`,...z.parameters?.docs?.source},description:{story:`Restores the native multi-column span when compact-only columns are visible
above the small breakpoint.

@summary desktop grid preserves full spans`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Responsive records',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const marker = canvas.getByRole('gridcell', {
      name: 'A'
    });
    const name = canvas.getByRole('rowheader', {
      name: 'Example record'
    });
    const amountHeading = canvas.getByText('Amount');
    const amount = canvas.getByText('£10.00');
    await waitFor(async () => {
      await expect(name.getBoundingClientRect().width).toBeGreaterThan(marker.getBoundingClientRect().width);
      await expect(amount.getBoundingClientRect().right).toBeCloseTo(amountHeading.getBoundingClientRect().right, 1);
    });
  },
  render: () => <Table.Root aria-label="Responsive records" layout="responsiveGrid">
      <Table.Header>
        <Table.Column compactLabel={false} id="marker" textValue="Marker" width="max-content">
          <span className="sr-only">Marker</span>
        </Table.Column>
        <Table.Column id="name" rowHeader width="minmax(0, 1fr)">
          Name
        </Table.Column>
        <Table.Column align="end" id="amount" width="max-content">
          <span>Amount</span>
        </Table.Column>
        <Table.Column compactLabel={false} id="action" textValue="Action" width="max-content">
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
}`,...B.parameters?.docs?.source},description:{story:`Applies content-sized supporting columns and a flexible primary column
through the generic column API.

@summary responsive grid driven by column widths`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source},description:{story:`Keeps separate responsive body sections visually bounded while removing the
final table-row divider only at the end of the complete collection.

@summary responsive table with grouped body sections`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Semantic row presentations',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectSemanticRowPresentations(canvasElement),
  render: () => <SemanticRowPresentations />
}`,...H.parameters?.docs?.source},description:{story:`Compares non-actionable section geometry with default and muted actionable
data-row treatments at the standard viewport width.

@summary semantic section rows and actionable row tones`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source},description:{story:`Verifies that section geometry and default or muted actionable row emphasis
remain distinguishable in the canonical compact viewport.

@summary compact semantic section rows and row tones`,...U.parameters?.docs?.description}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source},description:{story:`Shows ordinary columnar records at table width with header-derived compact
labels prepared but visually suppressed above the small breakpoint.

@summary responsive records in columnar table layout`,...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source},description:{story:`Adapts the same records into stacked compact rows and derives visible cell
labels from headings without duplicating the row-header label.

@summary compact records with heading-derived cell labels`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source},description:{story:`Authors state before name in both the header and every row so the visible
cell order remains aligned with its headings.

@summary reordered columns with matched cell order`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source},description:{story:`Compares an immutable selected row with application-authored empty content
for a body whose current item collection is empty.

@summary read-only selection and empty table content`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual data',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectVirtualizedTableGeometry(canvasElement),
  render: () => <VirtualizedTable />
}`,...J.parameters?.docs?.source},description:{story:`Windows variable-height rows inside a bounded viewport and renders a loading
sentinel while preserving desktop heading and cell geometry.

@summary variable-height virtualized rows with loading sentinel`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source},description:{story:`Verifies variable-height row windowing and the loading sentinel against the
stacked compact record presentation without horizontal overflow.

@summary compact variable-height virtualized table`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  ...VariableVirtualizationAndLoadingCompact,
  play: async ({
    canvasElement
  }) => expectVirtualizedTableGeometry(canvasElement, true),
  render: () => <VirtualizedTable compactHiddenState />
}`,...X.parameters?.docs?.source},description:{story:`Keeps virtual row measurements and separators aligned when a supporting
column is explicitly hidden in the compact presentation.

@summary compact virtualization with an explicitly hidden column`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual data',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectVirtualizedTableGeometry(canvasElement, true),
  render: () => <div style={{
    width: 320
  }}>
      <VirtualizedTable compactHiddenState expandedState />
    </div>
}`,...Z.parameters?.docs?.source},description:{story:`Keeps desktop row measurement aligned with viewport-driven responsive CSS
when the virtualized table itself is narrower than the small breakpoint.

@summary narrow desktop virtualization keeps visible cells in measurement`,...Z.parameters?.docs?.description}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual boundary records',
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
    const firstName = canvas.getByRole('rowheader', {
      name: 'Record 1'
    });
    const firstAmount = canvas.getByRole('gridcell', {
      name: '£1'
    });
    await userEvent.click(firstName);
    await userEvent.keyboard('{ArrowRight}');
    await expect(firstAmount).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(firstName).toHaveFocus();
    await fireEvent.keyDown(firstName, {
      ctrlKey: true,
      key: 'End',
      metaKey: true
    });
    await waitFor(() => expect(canvas.getByRole('gridcell', {
      name: '£20'
    })).toHaveFocus());
    const lastAmount = canvas.getByRole('gridcell', {
      name: '£20'
    });
    await fireEvent.keyDown(lastAmount, {
      ctrlKey: true,
      key: 'Home',
      metaKey: true
    });
    await waitFor(() => expect(canvas.getByRole('rowheader', {
      name: 'Record 1'
    })).toHaveFocus());
  },
  render: VirtualizedBoundaryTable
}`,...Q.parameters?.docs?.source},description:{story:`Preserves collection-wide modified Home and End navigation while compact
boundary columns are hidden and rows are windowed.

@summary virtualized compact navigation reaches collection boundaries`,...Q.parameters?.docs?.description}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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

@summary application-owned action inside a table cell`,...$.parameters?.docs?.description}}};try{A.displayName=`Root`,A.__docgenInfo={description:`Coordinates semantic table navigation, row state, sorting, and responsive labels.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{boundary:{defaultValue:{value:`none`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Optional visual treatment for the table's lower edge. Defaults to `none`.",name:`boundary`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableBoundary | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ordered header, body, and optional footer sections.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactHiddenColumns:{defaultValue:{value:`[]`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`One key or reusable key collection omitted below the Breeze small breakpoint.`,name:`compactHiddenColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CompactHiddenColumns | undefined`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Keys whose rows cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},desktopColumns:{defaultValue:{value:`equal`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`.",name:`desktopColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableDesktopColumns | undefined`}},layout:{defaultValue:{value:`responsive`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`.",name:`layout`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableLayout | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Enables multiple row selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ref to the rendered table or virtualized grid element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Optional fixed- or variable-height row windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Current selected row keys.
Current immutable selected row keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Called with the next selected row keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Excluded when selection is controlled.
Initial selected row keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks controlled row selection and sorting as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Current consumer-owned sort descriptor.
Excluded when sorting is uncontrolled.`,name:`sort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}},onSortChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Called when a sortable heading requests a new descriptor.
Called when the internally retained descriptor changes.`,name:`onSortChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`((sort: TableSort) => void) | ((sort: TableSort) => void) | undefined`}},defaultSort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Excluded when sorting is controlled.
Initial sort descriptor.`,name:`defaultSort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}}},tags:{}}}catch{}try{j.displayName=`ControlledSortingAndSelection`,j.__docgenInfo={description:`Authors columns and rows directly while the application controls selected
keys and the consumer-owned sort descriptor.`,displayName:`ControlledSortingAndSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`explicitly authored table with controlled sorting and selection`}}}catch{}try{M.displayName=`StaticOrderedSections`,M.__docgenInfo={description:`Composes keyed static header, body, and footer sections whose cells follow
the visible heading order and retain long-value wrapping.`,displayName:`StaticOrderedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`static ordered header body and footer sections`}}}catch{}try{N.displayName=`StrongBoundary`,N.__docgenInfo={description:`Adds the canonical strong lower boundary without introducing top or side
borders, preserving the table's relationship to surrounding content.`,displayName:`StrongBoundary`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`table with a strong lower boundary`}}}catch{}try{P.displayName=`GridGroupedSections`,P.__docgenInfo={description:`Uses persistent CSS-grid rows across multiple keyed body sections so every
cell stays aligned with its corresponding heading track.`,displayName:`GridGroupedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`persistent grid layout with grouped body sections`}}}catch{}try{F.displayName=`ResponsiveGridColumnVariant`,F.__docgenInfo={description:`Uses a named five-column desktop arrangement while retaining compact card
rows below the Breeze small breakpoint.`,displayName:`ResponsiveGridColumnVariant`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`typed media, details, and action desktop grid columns`}}}catch{}try{I.displayName=`CompactGridColumns`,I.__docgenInfo={description:`Removes supporting desktop-only columns and their grid tracks at the compact
breakpoint while preserving spanning and keyboard geometry.`,displayName:`CompactGridColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact grid omits hidden tracks`}}}catch{}try{L.displayName=`CompactConsumerGridPlacement`,L.__docgenInfo={description:"Preserves consumer-owned compact grid placement for cells that do not use\nthe compound API's `colSpan` contract.",displayName:`CompactConsumerGridPlacement`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact grid honours consumer cell placement`}}}catch{}try{R.displayName=`CompactGridSpanningVisibility`,R.__docgenInfo={description:`Keeps a span visible when any covered column remains in the compact grid and
removes it when every covered column is compact-hidden.`,displayName:`CompactGridSpanningVisibility`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact spans follow covered column visibility`}}}catch{}try{z.displayName=`DesktopGridColumnSpan`,z.__docgenInfo={description:`Restores the native multi-column span when compact-only columns are visible
above the small breakpoint.`,displayName:`DesktopGridColumnSpan`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`desktop grid preserves full spans`}}}catch{}try{B.displayName=`ResponsiveGridColumnWidths`,B.__docgenInfo={description:`Applies content-sized supporting columns and a flexible primary column
through the generic column API.`,displayName:`ResponsiveGridColumnWidths`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive grid driven by column widths`}}}catch{}try{V.displayName=`ResponsiveGroupedSections`,V.__docgenInfo={description:`Keeps separate responsive body sections visually bounded while removing the
final table-row divider only at the end of the complete collection.`,displayName:`ResponsiveGroupedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive table with grouped body sections`}}}catch{}try{H.displayName=`RowTonesAndSections`,H.__docgenInfo={description:`Compares non-actionable section geometry with default and muted actionable
data-row treatments at the standard viewport width.`,displayName:`RowTonesAndSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`semantic section rows and actionable row tones`}}}catch{}try{U.displayName=`RowTonesAndSectionsCompact`,U.__docgenInfo={description:`Verifies that section geometry and default or muted actionable row emphasis
remain distinguishable in the canonical compact viewport.`,displayName:`RowTonesAndSectionsCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact semantic section rows and row tones`}}}catch{}try{W.displayName=`ResponsiveItems`,W.__docgenInfo={description:`Shows ordinary columnar records at table width with header-derived compact
labels prepared but visually suppressed above the small breakpoint.`,displayName:`ResponsiveItems`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive records in columnar table layout`}}}catch{}try{G.displayName=`ResponsiveItemsCompact`,G.__docgenInfo={description:`Adapts the same records into stacked compact rows and derives visible cell
labels from headings without duplicating the row-header label.`,displayName:`ResponsiveItemsCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact records with heading-derived cell labels`}}}catch{}try{K.displayName=`ConditionalOrderedColumns`,K.__docgenInfo={description:`Authors state before name in both the header and every row so the visible
cell order remains aligned with its headings.`,displayName:`ConditionalOrderedColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`reordered columns with matched cell order`}}}catch{}try{q.displayName=`ReadOnlyAndEmpty`,q.__docgenInfo={description:`Compares an immutable selected row with application-authored empty content
for a body whose current item collection is empty.`,displayName:`ReadOnlyAndEmpty`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`read-only selection and empty table content`}}}catch{}try{J.displayName=`VariableVirtualizationAndLoading`,J.__docgenInfo={description:`Windows variable-height rows inside a bounded viewport and renders a loading
sentinel while preserving desktop heading and cell geometry.`,displayName:`VariableVirtualizationAndLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`variable-height virtualized rows with loading sentinel`}}}catch{}try{Y.displayName=`VariableVirtualizationAndLoadingCompact`,Y.__docgenInfo={description:`Verifies variable-height row windowing and the loading sentinel against the
stacked compact record presentation without horizontal overflow.`,displayName:`VariableVirtualizationAndLoadingCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact variable-height virtualized table`}}}catch{}try{X.displayName=`VariableVirtualizationCompactHiddenColumns`,X.__docgenInfo={description:`Keeps virtual row measurements and separators aligned when a supporting
column is explicitly hidden in the compact presentation.`,displayName:`VariableVirtualizationCompactHiddenColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact virtualization with an explicitly hidden column`}}}catch{}try{Z.displayName=`VariableVirtualizationNarrowDesktop`,Z.__docgenInfo={description:`Keeps desktop row measurement aligned with viewport-driven responsive CSS
when the virtualized table itself is narrower than the small breakpoint.`,displayName:`VariableVirtualizationNarrowDesktop`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`narrow desktop virtualization keeps visible cells in measurement`}}}catch{}try{Q.displayName=`VariableVirtualizationCompactBoundaries`,Q.__docgenInfo={description:`Preserves collection-wide modified Home and End navigation while compact
boundary columns are hidden and rows are windowed.`,displayName:`VariableVirtualizationCompactBoundaries`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`virtualized compact navigation reaches collection boundaries`}}}catch{}try{$.displayName=`ActionsStayWithApplications`,$.__docgenInfo={description:`Places an application-owned action control in an ordinary keyed cell rather
than teaching Table application commands or business workflows.`,displayName:`ActionsStayWithApplications`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`application-owned action inside a table cell`}}}catch{}Vt=[`ControlledSortingAndSelection`,`StaticOrderedSections`,`StrongBoundary`,`GridGroupedSections`,`ResponsiveGridColumnVariant`,`CompactGridColumns`,`CompactConsumerGridPlacement`,`CompactGridSpanningVisibility`,`DesktopGridColumnSpan`,`ResponsiveGridColumnWidths`,`ResponsiveGroupedSections`,`RowTonesAndSections`,`RowTonesAndSectionsCompact`,`ResponsiveItems`,`ResponsiveItemsCompact`,`ConditionalOrderedColumns`,`ReadOnlyAndEmpty`,`VariableVirtualizationAndLoading`,`VariableVirtualizationAndLoadingCompact`,`VariableVirtualizationCompactHiddenColumns`,`VariableVirtualizationNarrowDesktop`,`VariableVirtualizationCompactBoundaries`,`ActionsStayWithApplications`]}));Ht();export{$ as ActionsStayWithApplications,L as CompactConsumerGridPlacement,I as CompactGridColumns,R as CompactGridSpanningVisibility,K as ConditionalOrderedColumns,j as ControlledSortingAndSelection,z as DesktopGridColumnSpan,P as GridGroupedSections,q as ReadOnlyAndEmpty,F as ResponsiveGridColumnVariant,B as ResponsiveGridColumnWidths,V as ResponsiveGroupedSections,W as ResponsiveItems,G as ResponsiveItemsCompact,H as RowTonesAndSections,U as RowTonesAndSectionsCompact,M as StaticOrderedSections,N as StrongBoundary,J as VariableVirtualizationAndLoading,Y as VariableVirtualizationAndLoadingCompact,Q as VariableVirtualizationCompactBoundaries,X as VariableVirtualizationCompactHiddenColumns,Z as VariableVirtualizationNarrowDesktop,Vt as __namedExportsOrder,A as default,Ht as n,Dt as t};