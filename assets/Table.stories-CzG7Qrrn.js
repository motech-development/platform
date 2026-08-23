import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{n as i,t as a}from"./dist-ByKaD744.js";import{a as o,i as s,n as c,r as l}from"./BreezeContext-BIB7r8Lx.js";import{t as u}from"./jsx-runtime-cM__dR4X.js";import{I as d,r as f}from"./icons-frCuGJ60.js";import{n as p,t as m}from"./useCollectionEmptyContent-CsbFcRsc.js";import{n as ee,t as h}from"./Button-BEpHfrRB.js";import{n as g,t as _}from"./Stack-0pHCj1U7.js";import{o as te,s as ne}from"./TextField-DUkhVOns.js";import{S as v,_ as re,a as ie,c as ae,d as oe,f as se,g as y,h as b,i as x,l as ce,m as le,n as ue,o as de,p as fe,r as pe,s as me,t as he,u as ge,x as _e}from"./VirtualizedCollection-BCYQFEQX.js";var ve=t((()=>{re()}));function ye(e){return e===`all`?`all`:[...e]}function be(e){if(e!==void 0)return Number.isInteger(e)?Math.min(Math.max(e,1),1e3):1}function xe(e){return typeof e==`number`?`${e}px`:e}function Se({align:e=`start`,children:t,className:n,compactLabel:r=!0,id:i,ref:a,rowHeader:o=!1,sortable:s=!1,textValue:c,width:l,...u}){let d=xe(l),f=typeof t==`string`?t.trim():void 0,p=r?c??f:void 0;return(0,E.createElement)(se,{...u,allowsSorting:s,children:t,className:st({align:e,class:n}),"data-breeze-column":String(i),"data-breeze-column-key":x(i),"data-breeze-column-width":d,"data-breeze-compact-label":String(r),"data-breeze-compact-label-text":p,id:i,isRowHeader:o,ref:a,style:d===void 0?void 0:{width:l},textValue:c})}function S(e){return Se(e)}function Ce(e){return(0,E.isValidElement)(e)&&e.type===S?Se(e.props):e}function C({children:e,className:t,id:n,items:r,ref:i,...a}){let s=o(i),c=typeof e==`function`?t=>Ce(e(t)):E.Children.map(e,Ce);return(0,E.createElement)(y,{...a,children:c,className:ot({class:t}),columns:r,"data-section-key":n,dependencies:[e],ref:s})}function we(e,t){return e?t?`multiple`:`single`:`none`}function Te(e){let t=[];return E.Children.forEach(e,e=>{(0,E.isValidElement)(e)&&(e.type===S?t.push(x(e.props.id)):e.type===E.Fragment&&t.push(...Te(e.props.children)))}),t}function Ee(e){if(Array.isArray(e))return e;let t=e[Symbol.iterator]();if(!Object.is(t,e[Symbol.iterator]()))return Array.from(e);let n=e,r=gt.get(n);if(r!==void 0)return r;let i=Array.from(e);return gt.set(n,i),i}function De(e){let t=!1,n=E.Children.map(e,e=>{if(!(0,E.isValidElement)(e))return e;if(e.type===C){let n=e,{items:r}=n.props;if(r===void 0)return e;let i=Ee(r);return Object.is(i,r)?e:(t=!0,(0,E.cloneElement)(n,{items:i}))}if(e.type===E.Fragment){let n=e,r=De(n.props.children);return Object.is(r,n.props.children)?e:(t=!0,(0,E.cloneElement)(n,{children:r}))}return e});return t?n:e}function Oe(e){let{children:t,items:n}=e.props;return n===void 0?Te(t):Array.from(n,({id:e})=>x(e))}function ke(e){let t=[];return E.Children.forEach(e,e=>{if((0,E.isValidElement)(e)){if(e.type===C)t=Oe(e);else if(e.type===E.Fragment){let n=ke(e.props.children);n.length>0&&(t=n)}}}),t}function Ae(e,t=`equal`,n=mt){return e===null?new Map:new Map([...e.querySelectorAll(`[data-breeze-column]`)].filter(t=>t.closest(`[data-breeze-table]`)?.isSameNode(e)).flatMap((e,r)=>{let i=e.dataset.breezeColumnKey;if(i===void 0)return[];let a=e.dataset.breezeCompactLabel===`false`?void 0:e.dataset.breezeCompactLabelText;return[[i,{compactHidden:n.has(i),label:a===void 0||a.length===0?void 0:`${a}:`,track:e.dataset.breezeColumnWidth??it[t][r]??`minmax(0, 1fr)`}]]}))}function je(e,t,n,r){let i=n.indexOf(e);if(i<0)return{compactHidden:void 0,span:t};let a=n.slice(i,i+t).filter(e=>!r(e)).length;return{compactHidden:a===0,span:Math.max(a,1)}}function Me(e,t=Ae(e)){if(e===null)return;let n=[...t.keys()],r=e=>t.get(e)?.compactHidden??!1;e.querySelectorAll(`[data-breeze-cell-column]`).forEach(i=>{if(!i.closest(`[data-breeze-table]`)?.isSameNode(e))return;let{dataset:a}=i,o=a.breezeCellColumnKey??``,s=t.get(o),c=s?.label,l=i.colSpan>1?je(o,i.colSpan,n,r):null,u=l===null?s?.compactHidden:l.compactHidden;u===!0?a.breezeCompactHidden=``:u===!1&&delete a.breezeCompactHidden,c!==void 0&&c.length>0?a.label=c:delete a.label,l!==null&&i.style.setProperty(`--breeze-table-compact-column-span`,`span ${l.span} / span ${l.span}`)})}function Ne(e,t=!1){if(e.size!==0)return[...e.values()].filter(({compactHidden:e})=>!t||!e).map(({track:e})=>e).join(` `)}function Pe(e,t,n){let r=Ae(e,t,n);return Me(e,r),{compact:Ne(r,!0),full:Ne(r)}}function Fe(e,t){return e.closest(`[data-breeze-table]`)?.isSameNode(t)??!1}function Ie(e){return e?.closest(`[data-breeze-cell-column]`)??null}function Le(e,t,n){let r=e.target instanceof n.Element?e.target:null,i=t.ownerDocument.activeElement instanceof n.Element?t.ownerDocument.activeElement:null,a=Ie(r),o=a??Ie(i);return o!==null&&(a===null?i:r)===o&&Fe(o,t)?o:null}function Re(e,t,n){let r=e.closest(`[role="row"]`);return r===null?[]:[...r.querySelectorAll(`[data-breeze-cell-column]`)].filter(e=>e instanceof n.HTMLElement&&e.closest(`[role="row"]`)?.isSameNode(r)===!0&&Fe(e,t))}function ze(e){return[...e.querySelectorAll(`[data-breeze-cell-column]`)].filter(t=>Fe(t,e))}function w(e){return e?.dataset.breezeCompactHidden!==void 0}function Be(e){return e[0]}function Ve(e){return e.at(-1)}function He(e){return e.find(e=>!w(e))}function Ue(e){return e.findLast(e=>!w(e))}function We(e,t,n){t.requestAnimationFrame(()=>{n(ze(e))?.focus()})}function Ge(e,t,n,r,i,a){let o=e.ctrlKey||e.metaKey;if(o&&i){We(t,n,a.visibleBoundary);return}let s=o?ze(t):r;if(!w(a.boundary(s)))return;let c=a.visibleBoundary(s);c!==void 0&&(e.preventDefault(),n.queueMicrotask(()=>c.focus()))}function Ke(e,t,n,r,i){let a=n.getComputedStyle(t).direction===`rtl`?`ArrowLeft`:`ArrowRight`,o=e.key===a?1:-1,s=i.indexOf(r);if(!w(i[s+o]))return;let c=(o>0?i.slice(s+1):i.slice(0,s).reverse()).find(e=>!w(e));e.preventDefault(),n.queueMicrotask(()=>c?.focus())}function qe(e,t,n){if(!yt.has(e.key))return;let r=t.ownerDocument.defaultView;if(r===null||!ae(r))return;let i=Le(e,t,r);if(i===null)return;let a=Re(i,t,r);if(e.key===`Home`||e.key===`End`){Ge(e,t,r,a,n,bt[e.key]);return}Ke(e,t,r,i,a)}function Je({boundary:e=`none`,children:t,className:n,compactHiddenColumns:r=pt,defaultSelection:i,defaultSort:a,desktopColumns:s=`equal`,disabledKeys:c,layout:u=`responsive`,multiple:d=!1,onSelectionChange:f,onSortChange:p,readOnly:m=!1,ref:ee,selection:h,sort:g,virtualization:_,...te}){l();let ne=o(ee),v=(0,E.useRef)(null),[re,ae]=(0,E.useState)(a),[oe,se]=(0,E.useState)({compact:void 0,full:void 0}),y=(0,E.useMemo)(()=>ie(r),[r]),b=(0,E.useMemo)(()=>De(t),[t]),x=(0,E.useMemo)(()=>ke(b),[b]),ce=i!==void 0||d||f!==void 0||h!==void 0,le=g??re,de=(0,E.useCallback)(e=>{let t=v.current;t!==null&&qe(e,t,_!==void 0)},[_]),fe=(0,E.useCallback)(e=>{v.current?.removeEventListener(`keydown`,de,!0),v.current=e,e?.addEventListener(`keydown`,de,!0),ne(e)},[de,ne]);(0,E.useLayoutEffect)(()=>{let e=v.current;if(e===null)return()=>void 0;let t=()=>{let t=Pe(e,s,y);se(e=>e.compact===t.compact&&e.full===t.full?e:t)};t();let n=new MutationObserver(t);return n.observe(e,{attributeFilter:[`colspan`,`data-breeze-cell-column-key`,`data-breeze-column-width`,`data-breeze-compact-label`,`data-breeze-compact-label-text`],attributes:!0,childList:!0,subtree:!0}),()=>n.disconnect()},[b,y,s]);let pe=ue(_),me=oe.full===void 0&&pe===void 0?void 0:{...pe,"--breeze-table-columns":oe.full,"--breeze-table-compact-columns":oe.compact},_e=(0,E.createElement)(ge,{...te,"aria-readonly":m||void 0,children:b,className:at({boundary:e,class:n,desktopColumns:s,layout:u,virtualized:_!==void 0}),"data-boundary":e,"data-breeze-table":``,"data-layout":u,"data-virtualized":_===void 0?void 0:`true`,defaultSelectedKeys:i,disabledKeys:c,onSelectionChange:e=>f?.(ye(e)),onSortChange:m?void 0:e=>{let t={column:e.column,direction:e.direction};g===void 0&&ae(t),p?.(t)},ref:fe,selectedKeys:h,selectionMode:we(ce,d),sortDescriptor:le===void 0?void 0:{column:le.column,direction:le.direction},style:me}),ve=_===void 0?_e:(0,E.createElement)(he,{compactHiddenColumns:y,configuration:_,kind:`table`},_e);return(0,E.createElement)(_t.Provider,{value:y},(0,E.createElement)(vt.Provider,{value:x},ve))}function Ye({children:e,className:t,emptyContent:n,id:r,items:i,ref:a,...s}){let c=o(a),l=p(n);return(0,E.createElement)(oe,{...s,children:e,className:ct({class:t}),"data-section-key":r,dependencies:[e],items:i,ref:c,renderEmptyState:()=>l})}function Xe({children:e,className:t,id:n,items:r,ref:i,...a}){let s=o(i);return(0,E.createElement)(ce,{...a,children:e,className:lt({class:t}),"data-section-key":n,dependencies:[e],items:r,ref:s})}function Ze({"aria-describedby":e,className:t,disabled:n=!1,id:r,onAction:i,presentation:a=`data`,ref:s,textValue:c,tone:l=`default`,...u}){let d=o(s),f=(0,E.useCallback)(t=>{d(t),t&&(e?t.setAttribute(`aria-describedby`,e):t.removeAttribute(`aria-describedby`))},[e,d]);return(0,E.createElement)(le,{...u,className:dt({actionable:i!==void 0,class:t,presentation:a,tone:l}),"data-presentation":a,"data-tone":l,id:r,isDisabled:n,onAction:i===void 0?void 0:()=>i(r),ref:f,textValue:c})}function T({align:e=`start`,className:t,column:n,colSpan:r,presentation:i=`data`,ref:a,textValue:s,...c}){let l=(0,E.useContext)(_t),u=(0,E.useContext)(vt),d=o(a),f=be(r),p=l.has(x(n)),m=f!==void 0&&f>1?je(x(n),f,u,e=>l.has(e)):null,ee=f===void 0||f<=1?void 0:(()=>{let e=`span ${f} / span ${f}`;return{"--breeze-table-column-span":e,"--breeze-table-compact-column-span":m===null?e:`span ${m.span} / span ${m.span}`}})(),h=(0,E.useCallback)(e=>{d(e);let t=e?.closest(`[data-breeze-table]`)??null;Me(t,Ae(t,void 0,l))},[l,d]),g=(m===null?p:m.compactHidden)===!0;return(0,E.createElement)(b,{...c,className:ft({align:e,class:t,presentation:i}),colSpan:f,"data-breeze-cell-column":String(n),"data-breeze-cell-column-key":x(n),"data-breeze-compact-hidden":g?``:void 0,ref:h,style:ee,textValue:s})}function Qe({position:e=`overlay`,...t}){return(0,E.createElement)(T,{...t,children:(0,et.jsx)(f,{className:`!block`,size:16}),presentation:e===`overlay`?`disclosure`:`data`})}function $e({className:e,loading:t=!1,offset:n=1,onLoadMore:r,ref:i,...a}){let s=o(i),c=v({loading:t,onLoadMore:r}),l=(0,E.useRef)(null),u=(0,E.useCallback)(e=>{l.current=e,e?.removeAttribute(`aria-level`),s(e)},[s]);return(0,E.useLayoutEffect)(()=>{l.current?.removeAttribute(`aria-level`)}),(0,E.createElement)(fe,{...a,className:ut({class:e}),isLoading:t,onLoadMore:c,ref:u,scrollOffset:n})}var E,et,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,D,xt=t((()=>{E=e(r(),1),ve(),a(),d(),de(),m(),_e(),pe(),s(),me(),c(),et=u(),tt=`[&>tbody>tr]:relative [&>tbody>tr]:flex [&>tbody>tr]:flex-col [&>tbody>tr]:items-start [&>tbody>tr]:gap-2 [&>tbody>tr]:px-4 [&>tbody>tr]:py-4 [&>tfoot>tr]:relative [&>tfoot>tr]:flex [&>tfoot>tr]:flex-col [&>tfoot>tr]:items-start [&>tfoot>tr]:gap-2 [&>tfoot>tr]:px-4 [&>tfoot>tr]:py-4 [&>tbody>tr>td]:block [&>tbody>tr>td]:max-w-full [&>tbody>tr>td]:border-0 [&>tbody>tr>td]:p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:max-w-full [&>tfoot>tr>td]:border-0 [&>tfoot>tr>td]:p-0 sm:[&>thead>tr>th]:px-6 sm:[&>thead>tr>th]:py-3 sm:[&>thead>tr>th]:align-middle sm:[&>tbody>tr]:table-row sm:[&>tbody>tr]:border-0 sm:[&>tbody>tr]:p-0 sm:[&>tfoot>tr]:table-row sm:[&>tfoot>tr]:border-0 sm:[&>tfoot>tr]:p-0 sm:[&>tbody>tr>td]:table-cell sm:[&>tbody>tr>td]:border-b sm:[&>tbody>tr>td]:border-[var(--breeze-border)] sm:[&>tbody>tr>td]:px-6 sm:[&>tbody>tr>td]:py-3 sm:[&>tbody>tr>td]:align-middle sm:[&>tfoot>tr>td]:table-cell sm:[&>tfoot>tr>td]:border-b sm:[&>tfoot>tr>td]:border-[var(--breeze-border)] sm:[&>tfoot>tr>td]:px-6 sm:[&>tfoot>tr>td]:py-3 sm:[&>tfoot>tr>td]:align-middle`,nt=`${tt} sm:!block sm:[&>thead]:!block sm:[&>tbody]:!block sm:[&>tfoot]:!block sm:[&>thead>tr]:!grid sm:[&>thead>tr]:w-full sm:[&>thead>tr]:items-center sm:[&>thead>tr]:gap-x-4 sm:[&>thead>tr]:px-6 sm:[&>thead>tr]:py-3 sm:[&>tbody>tr]:!grid sm:[&>tbody>tr]:w-full sm:[&>tbody>tr]:items-center sm:[&>tbody>tr]:gap-x-4 sm:[&>tbody>tr]:border-b sm:[&>tbody>tr]:border-[var(--breeze-border)] sm:[&>tbody>tr]:px-6 sm:[&>tbody>tr]:py-3 sm:[&>tfoot>tr]:!grid sm:[&>tfoot>tr]:w-full sm:[&>tfoot>tr]:items-center sm:[&>tfoot>tr]:gap-x-4 sm:[&>tfoot>tr]:px-6 sm:[&>tfoot>tr]:py-3 sm:[&>thead>tr>th]:!flex sm:[&>thead>tr>th]:!h-auto sm:[&>thead>tr>th]:items-center sm:[&>thead>tr>th]:!border-0 sm:[&>thead>tr>th]:!p-0 sm:[&>tbody>tr>td]:!flex sm:[&>tbody>tr>td]:!h-auto sm:[&>tbody>tr>td]:items-center sm:[&>tbody>tr>td]:!border-0 sm:[&>tbody>tr>td]:!p-0 sm:[&>tbody>tr>td:last-child]:justify-end sm:[&>tfoot>tr>td]:!flex sm:[&>tfoot>tr>td]:!h-auto sm:[&>tfoot>tr>td]:items-center sm:[&>tfoot>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!p-0`,rt=`sm:[&>thead>tr]:grid-cols-[var(--breeze-table-columns)] sm:[&>tbody>tr]:grid-cols-[var(--breeze-table-columns)] sm:[&>tfoot>tr]:grid-cols-[var(--breeze-table-columns)]`,it={equal:[],mediaDetailsAction:[`2.25rem`,`minmax(0, 1.3fr)`,`minmax(0, 0.8fr)`,`minmax(0, 1.2fr)`,`1.25rem`]},at=i({base:`group/table block w-full border-separate border-spacing-0 text-start text-[var(--breeze-ink)] outline-none sm:table [&>tbody:last-of-type>tr:last-child]:border-b-0 sm:[&>tbody:last-of-type>tr:last-child>td]:border-b-0 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]`,compoundVariants:[{class:rt,desktopColumns:`equal`,layout:`responsiveGrid`},{class:rt,desktopColumns:`mediaDetailsAction`,layout:`responsiveGrid`}],defaultVariants:{boundary:`none`,desktopColumns:`equal`,layout:`responsive`,virtualized:!1},variants:{boundary:{none:``,strong:`min-w-0 border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)]`},desktopColumns:{equal:``,mediaDetailsAction:``},layout:{grid:`!grid grid-cols-[var(--breeze-table-compact-columns)] sm:grid-cols-[var(--breeze-table-columns)] [&>thead]:col-span-full [&>thead]:grid-cols-subgrid sm:[&>thead]:grid [&>tbody]:col-span-full [&>tbody]:grid [&>tbody]:grid-cols-subgrid [&>tfoot]:col-span-full [&>tfoot]:grid [&>tfoot]:grid-cols-subgrid sm:[&>thead>tr]:col-span-full sm:[&>thead>tr]:grid sm:[&>thead>tr]:min-h-11 sm:[&>thead>tr]:grid-cols-subgrid sm:[&>thead>tr]:items-center sm:[&>thead>tr]:px-6 [&>tbody>tr]:col-span-full [&>tbody>tr]:grid [&>tbody>tr]:min-h-11 [&>tbody>tr]:grid-cols-subgrid [&>tbody>tr]:items-center [&>tbody>tr]:px-4 sm:[&>tbody>tr]:px-6 [&>tfoot>tr]:col-span-full [&>tfoot>tr]:grid [&>tfoot>tr]:min-h-11 [&>tfoot>tr]:grid-cols-subgrid [&>tfoot>tr]:items-center [&>tfoot>tr]:px-4 sm:[&>tfoot>tr]:px-6 sm:[&>thead>tr>th]:block sm:[&>thead>tr>th]:!p-0 [&>tbody>tr>td]:block [&>tbody>tr>td]:!p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:!p-0 sm:[&>thead>tr]:border-b sm:[&>thead>tr]:border-[var(--breeze-border)] sm:[&>thead>tr>th]:border-0 [&>tbody>tr]:border-b [&>tbody>tr]:border-[var(--breeze-border)] [&>tbody>tr>td]:border-0 [&>tfoot>tr>td]:border-0 sm:[&>tbody>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!border-0`,responsive:tt,responsiveGrid:nt},virtualized:{false:``,true:`overflow-auto sm:block`}}}),ot=i({base:`hidden bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink-muted)] sm:table-header-group`}),st=i({base:`border-b border-[var(--breeze-border)] px-4 py-3 text-start font-[family-name:var(--breeze-font-display)] text-base font-bold outline-none data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[allows-sorting]:cursor-pointer forced-colors:border-[CanvasText]`,defaultVariants:{align:`start`},variants:{align:{center:`text-center sm:justify-center`,end:`text-end sm:justify-end`,start:`text-start sm:justify-start`}}}),ct=i({base:`block sm:table-row-group`}),lt=i({base:`block bg-[var(--breeze-surface-subtle)] sm:table-footer-group`}),ut=i({base:`flex min-h-11 items-center justify-center px-4 py-3 text-sm text-[var(--breeze-ink-muted)]`}),dt=i({base:`grid min-w-0 border-b border-[var(--breeze-border)] bg-[var(--breeze-surface)] py-2 outline-none sm:table-row sm:border-0 sm:py-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[selected]:bg-[var(--breeze-primary-soft)] forced-colors:data-[selected]:border-[Highlight]`,compoundVariants:[{actionable:!0,class:`data-[hovered]:bg-[var(--breeze-table-row-hover)]`,presentation:`data`,tone:`default`},{actionable:!0,class:`data-[hovered]:bg-[var(--breeze-table-row-muted-hover)]`,presentation:`data`,tone:`muted`}],defaultVariants:{presentation:`data`,tone:`default`},variants:{actionable:{false:``,true:`cursor-pointer`},presentation:{data:``,section:`min-h-11 items-center bg-[var(--breeze-table-section)] px-4 py-2 sm:bg-[var(--breeze-table-section)] sm:px-6 [&>td]:!h-auto [&>td]:!border-0 [&>td]:!p-0 [&>td]:before:!hidden`},tone:{default:``,muted:`bg-[var(--breeze-table-row-muted)] text-[var(--breeze-neutral)]`}}}),ft=i({base:`grid min-w-0 grid-cols-[minmax(5rem,auto)_minmax(0,1fr)] gap-4 border-b border-[var(--breeze-border)] px-4 py-2 text-start [grid-column:var(--breeze-table-compact-column-span)] [overflow-wrap:anywhere] last:border-b-0 before:me-1 before:hidden before:font-[family-name:var(--breeze-font-display)] before:text-base before:leading-[1.4] before:font-bold before:text-[var(--breeze-ink-muted)] data-[label]:before:inline-block data-[label]:before:content-[attr(data-label)] max-sm:data-[breeze-compact-hidden]:!hidden sm:table-cell sm:border-b sm:border-[var(--breeze-border)] sm:px-4 sm:py-3 sm:last:border-b sm:data-[label]:before:hidden sm:[grid-column:var(--breeze-table-column-span)] [&>*]:min-w-0`,defaultVariants:{align:`start`},variants:{align:{center:`sm:text-center sm:justify-center`,end:`sm:text-end sm:justify-end`,start:`sm:text-start sm:justify-start`},presentation:{data:``,disclosure:`absolute end-4 top-6 h-4 w-4 text-[var(--breeze-ink-muted)] sm:static sm:h-auto sm:w-5 sm:self-stretch sm:text-end [&>*]:ms-auto [&>svg]:size-4`}}}),pt=[],mt=new Set,ht=[],gt=new WeakMap,_t=(0,E.createContext)(mt),vt=(0,E.createContext)(ht),yt=new Set([`ArrowLeft`,`ArrowRight`,`End`,`Home`]),bt={End:{boundary:Ve,visibleBoundary:Ue},Home:{boundary:Be,visibleBoundary:He}},D={Body:Ye,Cell:T,Column:S,Disclosure:Qe,Footer:Xe,Header:C,LoadMore:$e,Root:Je,Row:Ze};try{S.displayName=`Column`,S.__docgenInfo={description:`Renders one accessible heading that can optionally request sorting.`,displayName:`Column`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Heading alignment. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Visible accessible column heading.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Derives a compact record label from this heading. Defaults to `true`.",name:`compactLabel`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Stable string or number column key.`,name:`id`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!0,tags:{},type:{name:`CollectionKey`}},rowHeader:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Marks this heading as the row label announced during cell navigation. Defaults to `false`.",name:`rowHeader`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sortable:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:"Allows this heading to request sort changes. Defaults to `false`.",name:`sortable`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Ref to the rendered column heading.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`Plain-text accessible and compact label used when the visible heading is not a string.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`string | undefined`}},width:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`}],description:`CSS width or grid-track size. Numeric values are pixels; omitted columns share remaining responsive-grid space.`,name:`width`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableColumnProps`},required:!1,tags:{},type:{name:`TableColumnWidth | undefined`}}},tags:{}}}catch{}try{C.displayName=`Header`,C.__docgenInfo={description:`Renders static or generic accessible column headings.`,displayName:`Header`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Column> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Column) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table header.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{Je.displayName=`Root`,Je.__docgenInfo={description:`Coordinates semantic table navigation, row state, sorting, and responsive labels.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{boundary:{defaultValue:{value:`none`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Optional visual treatment for the table's lower edge. Defaults to `none`.",name:`boundary`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableBoundary | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ordered header, body, and optional footer sections.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactHiddenColumns:{defaultValue:{value:`[]`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`One key or reusable key collection omitted below the Breeze small breakpoint.`,name:`compactHiddenColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CompactHiddenColumns | undefined`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Keys whose rows cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},desktopColumns:{defaultValue:{value:`equal`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`.",name:`desktopColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableDesktopColumns | undefined`}},layout:{defaultValue:{value:`responsive`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`.",name:`layout`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableLayout | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Enables multiple row selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ref to the rendered table or virtualized grid element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Optional fixed- or variable-height row windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Current selected row keys.
Current immutable selected row keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Called with the next selected row keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Excluded when selection is controlled.
Initial selected row keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks controlled row selection and sorting as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Current consumer-owned sort descriptor.
Excluded when sorting is uncontrolled.`,name:`sort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}},onSortChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Called when a sortable heading requests a new descriptor.
Called when the internally retained descriptor changes.`,name:`onSortChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`((sort: TableSort) => void) | ((sort: TableSort) => void) | undefined`}},defaultSort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Excluded when sorting is controlled.
Initial sort descriptor.`,name:`defaultSort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}}},tags:{}}}catch{}try{Ye.displayName=`Body`,Ye.__docgenInfo={description:`Renders a stable ordered table body with static or generic rows.`,displayName:`Body`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},emptyContent:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Content displayed when this body has no rows.`,name:`emptyContent`,required:!1,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table body.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{Xe.displayName=`Footer`,Xe.__docgenInfo={description:`Renders a stable ordered table footer with static or generic rows.`,displayName:`Footer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered table footer.`,name:`ref`,required:!1,tags:{},type:{name:`Ref<HTMLTableSectionElement> | undefined`}}},tags:{}}}catch{}try{Ze.displayName=`Row`,Ze.__docgenInfo={description:`Renders one keyed row whose cells follow heading order.`,displayName:`Row`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Ordered cells matching every visible table heading exactly once and in the same order, including after conditional column changes.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Prevents focus, selection, and actions for this row. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Stable string or number row key.`,name:`id`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`CollectionKey`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Called with this row key when its action is invoked.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`((key: CollectionKey) => void) | undefined`}},presentation:{defaultValue:{value:`data`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Record or grouped section geometry. Defaults to `data`.",name:`presentation`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`TableRowPresentation | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Ref to the rendered row.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableRowElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:`Plain-text row representation used for typeahead and accessibility.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!0,tags:{},type:{name:`string`}},tone:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`}],description:"Domain-neutral visual emphasis. Defaults to `default`.",name:`tone`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRowProps`},required:!1,tags:{},type:{name:`TableRowTone | undefined`}}},tags:{}}}catch{}try{T.displayName=`Cell`,T.__docgenInfo={description:`Renders one data cell and derives its compact label from the matching heading.`,displayName:`Cell`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:{value:`start`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Cell alignment at table widths. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Visible cell content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`ReactNode`}},column:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Stable key of the corresponding column heading.`,name:`column`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`CollectionKey`}},presentation:{defaultValue:{value:`data`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Canonical content geometry. `disclosure` positions one bare arrow for an actionable row. Defaults to `data`.",name:`presentation`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"data" | "disclosure" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Ref to the rendered data cell.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},textValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Plain-text cell value used for accessibility when content is not text.`,name:`textValue`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}try{Qe.displayName=`Disclosure`,Qe.__docgenInfo={description:`Renders the canonical bare arrow for an actionable row.`,displayName:`Disclosure`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:"Cell alignment at table widths. Defaults to `start`.",name:`align`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},column:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Stable key of the corresponding column heading.`,name:`column`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!0,tags:{},type:{name:`CollectionKey`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`}],description:`Ref to the rendered data cell.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableCellProps`},required:!1,tags:{},type:{name:`Ref<HTMLTableCellElement> | undefined`}},position:{defaultValue:{value:`overlay`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableDisclosureProps`}],description:"Position over a standard compact row or remain in an explicit grid track. Defaults to `overlay`.",name:`position`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableDisclosureProps`},required:!1,tags:{},type:{name:`"flow" | "overlay" | undefined`}}},tags:{}}}catch{}try{$e.displayName=`LoadMore`,$e.__docgenInfo={description:`Renders a loading row and deduplicated intersection sentinel.`,displayName:`LoadMore`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Visible loading-row content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!0,tags:{},type:{name:`ReactNode`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:"Shows the loading row and suppresses duplicate requests. Defaults to `false`.",name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onLoadMore:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Called once when more consumer-owned rows should be requested.`,name:`onLoadMore`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!0,tags:{},type:{name:`() => void | Promise<void>`}},offset:{defaultValue:{value:`1`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:"Trigger distance as a proportion of the scroll viewport. Defaults to `1`.",name:`offset`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`number | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`}],description:`Ref to the rendered native or virtualized loading row.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableLoadMoreProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement | HTMLTableRowElement> | undefined`}}},tags:{}}}catch{}try{D.displayName=`Table`,D.__docgenInfo={description:`Coordinates ordered static or generic table sections, responsive record
labels, row interaction, consumer-owned sorting, and optional virtualization.`,displayName:`Table`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.tsx`,methods:[],props:{},tags:{summary:`responsive compound data table with optional virtualization`}}}catch{}})),St=n({ActionsStayWithApplications:()=>$,CompactGridColumns:()=>R,CompactGridSpanningVisibility:()=>z,ConditionalOrderedColumns:()=>q,ControlledSortingAndSelection:()=>N,DesktopGridColumnSpan:()=>B,GridGroupedSections:()=>I,ReadOnlyAndEmpty:()=>J,ResponsiveGridColumnVariant:()=>L,ResponsiveGridColumnWidths:()=>V,ResponsiveGroupedSections:()=>H,ResponsiveItems:()=>G,ResponsiveItemsCompact:()=>K,RowTonesAndSections:()=>U,RowTonesAndSectionsCompact:()=>W,StaticOrderedSections:()=>P,StrongBoundary:()=>F,VariableVirtualizationAndLoading:()=>Y,VariableVirtualizationAndLoadingCompact:()=>X,VariableVirtualizationCompactBoundaries:()=>Q,VariableVirtualizationNarrowDesktop:()=>Z,__namedExportsOrder:()=>It,default:()=>M});function Ct(){let[e,t]=(0,Mt.useState)([1]),[n,r]=(0,Mt.useState)({column:`name`,direction:`ascending`});return(0,O.jsxs)(D.Root,{"aria-label":`Controlled items`,onSelectionChange:t,onSortChange:r,selection:e,sort:n,children:[(0,O.jsxs)(D.Header,{id:`headings`,children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,sortable:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`state`,sortable:!0,children:`State`})]}),(0,O.jsxs)(D.Body,{id:`items`,children:[(0,O.jsxs)(D.Row,{id:1,textValue:`Alpha Ready`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Ready`})]}),(0,O.jsxs)(D.Row,{id:2,textValue:`Beta In review`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Beta`}),(0,O.jsx)(D.Cell,{column:`state`,children:`In review`})]}),(0,O.jsxs)(D.Row,{id:3,textValue:`Gamma Draft`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Gamma`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Draft`})]})]})]})}function wt(){return(0,O.jsxs)(D.Root,{"aria-label":`Compact scheduled records`,compactHiddenColumns:[`marker`,`date`,`actions`],layout:`grid`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`marker`,width:`max-content`,children:`Marker`}),(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`date`,width:`max-content`,children:`Date`}),(0,O.jsx)(D.Column,{align:`end`,id:`amount`,width:`max-content`,children:`Amount`}),(0,O.jsx)(D.Column,{id:`actions`,width:`max-content`,children:`Actions`})]}),(0,O.jsxs)(D.Body,{children:[(0,O.jsxs)(D.Row,{id:`subscription`,textValue:`Subscription 12 August £20`,children:[(0,O.jsx)(D.Cell,{column:`marker`,children:`Marker`}),(0,O.jsx)(D.Cell,{column:`name`,children:`Subscription`}),(0,O.jsx)(D.Cell,{column:`date`,children:`12 August`}),(0,O.jsx)(D.Cell,{align:`end`,column:`amount`,children:`£20`}),(0,O.jsx)(D.Cell,{column:`actions`,children:`Actions`})]}),(0,O.jsxs)(D.Row,{id:`summary`,textValue:`Summary £40`,children:[(0,O.jsx)(D.Cell,{column:`marker`,children:`Summary marker`}),(0,O.jsx)(D.Cell,{colSpan:2,column:`name`,children:`Summary`}),(0,O.jsx)(D.Cell,{align:`end`,column:`amount`,children:`£40`}),(0,O.jsx)(D.Cell,{column:`actions`,children:`Summary actions`})]}),(0,O.jsxs)(D.Row,{id:`editable`,textValue:`Editable reference`,children:[(0,O.jsx)(D.Cell,{column:`marker`,children:`Editable marker`}),(0,O.jsx)(D.Cell,{column:`name`,children:(0,O.jsx)(te.Root,{"aria-label":`Reference`,defaultValue:`AB`,children:(0,O.jsx)(te.Input,{})})}),(0,O.jsx)(D.Cell,{column:`date`,children:`Editable date`}),(0,O.jsx)(D.Cell,{column:`amount`,children:`Editable amount`}),(0,O.jsx)(D.Cell,{column:`actions`,children:`Editable actions`})]})]})]})}function Tt(){return(0,O.jsxs)(D.Root,{"aria-label":`Spanning visibility`,compactHiddenColumns:[`hidden-a`,`hidden-c`,`hidden-d`],layout:`grid`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`hidden-a`,rowHeader:!0,children:`Hidden A`}),(0,O.jsx)(D.Column,{id:`visible-b`,children:`Visible B`}),(0,O.jsx)(D.Column,{id:`hidden-c`,children:`Hidden C`}),(0,O.jsx)(D.Column,{id:`hidden-d`,children:`Hidden D`}),(0,O.jsx)(D.Column,{id:`visible-e`,children:`Visible E`})]}),(0,O.jsx)(D.Body,{children:(0,O.jsxs)(D.Row,{id:`entry`,textValue:`Mixed Hidden Remainder`,children:[(0,O.jsx)(D.Cell,{colSpan:2,column:`hidden-a`,children:`Mixed`}),(0,O.jsx)(D.Cell,{colSpan:2,column:`hidden-c`,children:`Hidden`}),(0,O.jsx)(D.Cell,{column:`visible-e`,children:`Remainder`})]})})]})}function Et(){return(0,O.jsxs)(D.Root,{"aria-label":`Semantic row presentations`,className:`grid-cols-2`,layout:`grid`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{align:`end`,id:`score`,children:`Score`})]}),(0,O.jsxs)(D.Body,{children:[(0,O.jsxs)(D.Row,{id:`group-a`,presentation:`section`,textValue:`Group A 20`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Group A`}),(0,O.jsx)(D.Cell,{align:`end`,column:`score`,children:`20`})]}),(0,O.jsxs)(D.Row,{id:`active`,onAction:()=>void 0,textValue:`Active 30`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Active`}),(0,O.jsx)(D.Cell,{align:`end`,column:`score`,children:`30`})]}),(0,O.jsxs)(D.Row,{id:`paused`,onAction:()=>void 0,textValue:`Paused 10`,tone:`muted`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Paused`}),(0,O.jsx)(D.Cell,{align:`end`,column:`score`,children:`10`})]})]})]})}async function Dt(e){let t=j(e),n=t.getByRole(`row`,{name:`Group A`}),r=t.getByRole(`row`,{name:`Active`}),i=t.getByRole(`row`,{name:`Paused`}),a=e.ownerDocument.defaultView;await k(n).toHaveAttribute(`data-presentation`,`section`),await k(n.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await k(a?.getComputedStyle(n).backgroundColor).toBe(`rgb(223, 228, 236)`),await k(a?.getComputedStyle(r).backgroundColor).toBe(`rgb(255, 255, 255)`),await k(i).toHaveAttribute(`data-tone`,`muted`),await k(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(241, 243, 246)`),await A.hover(r),await k(a?.getComputedStyle(r).backgroundColor).toBe(`rgb(248, 250, 255)`),await A.unhover(r),await A.hover(i),await k(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(233, 237, 242)`)}function Ot(){return(0,O.jsxs)(D.Root,{"aria-label":`Responsive items`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{compactLabel:!1,id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`state`,children:`State`})]}),(0,O.jsxs)(D.Body,{children:[(0,O.jsxs)(D.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Ready`})]}),(0,O.jsxs)(D.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Beta`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Review`})]})]})]})}function kt({compactHiddenState:e=!1,expandedState:t=!1}){let n=t?`Ready with a detailed status that wraps onto several lines`:`Ready`;return(0,O.jsxs)(D.Root,{"aria-label":`Virtual data`,compactHiddenColumns:e?[`state`]:void 0,virtualization:{estimatedRowHeight:52,mode:`variable`,overscan:80,viewportHeight:156},children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`state`,children:`State`})]}),(0,O.jsxs)(D.Body,{children:[(0,O.jsxs)(D.Row,{id:1,textValue:`Alpha ${n}`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`}),(0,O.jsx)(D.Cell,{column:`state`,children:n})]}),(0,O.jsxs)(D.Row,{id:2,textValue:`Beta In review`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Beta`}),(0,O.jsx)(D.Cell,{column:`state`,children:`In review`})]}),(0,O.jsxs)(D.Row,{id:3,textValue:`Gamma Draft`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Gamma`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Draft`})]}),(0,O.jsx)(D.LoadMore,{loading:!0,onLoadMore:()=>void 0,children:`Loading more items`})]})]})}function At(){return(0,O.jsxs)(D.Root,{"aria-label":`Virtual boundary records`,compactHiddenColumns:[`marker`,`support`,`actions`],layout:`grid`,virtualization:{estimatedRowHeight:52,mode:`variable`,overscan:0,viewportHeight:156},children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`marker`,children:`Marker`}),(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`support`,children:`Support`}),(0,O.jsx)(D.Column,{id:`amount`,children:`Amount`}),(0,O.jsx)(D.Column,{id:`actions`,children:`Actions`})]}),(0,O.jsx)(D.Body,{items:Ft,children:e=>(0,O.jsxs)(D.Row,{id:e.id,textValue:`${e.name} ${e.amount}`,children:[(0,O.jsxs)(D.Cell,{column:`marker`,children:[`Marker `,e.id]}),(0,O.jsx)(D.Cell,{column:`name`,children:e.name}),(0,O.jsxs)(D.Cell,{column:`support`,children:[`Support `,e.id]}),(0,O.jsx)(D.Cell,{column:`amount`,children:e.amount}),(0,O.jsxs)(D.Cell,{column:`actions`,children:[`Actions `,e.id]})]})})]})}async function jt(e,t=!1){let n=j(e),r=n.getByRole(`grid`,{name:`Virtual data`}),i=n.getByRole(`row`,{name:`Alpha`}),a=n.getByRole(`row`,{name:`Beta`}),o=n.getByRole(`rowheader`,{name:`Alpha`}),s=t?n.getByText(/Ready/):n.getByRole(`gridcell`,{name:`Ready`}),c=i.getBoundingClientRect(),l=o.getBoundingClientRect(),u=s.getBoundingClientRect(),d=r.getBoundingClientRect(),f=e.ownerDocument.defaultView,p=(f?.innerWidth??0)<681;if(await k(c.width).toBe(d.width),await k(f?.getComputedStyle(i).borderBottomWidth).toBe(p?`1px`:`0px`),p){let e=a.getBoundingClientRect();t?(await k(u.width).toBe(0),await k(c.bottom).toBeGreaterThanOrEqual(e.y)):(await k(l.width).toBe(u.width),await k(l.x).toBe(u.x),await k(u.y).toBeGreaterThan(l.y),await k(c.bottom).toBeLessThanOrEqual(e.y)),await k(r.scrollWidth).toBe(r.clientWidth);return}let m=n.getByRole(`columnheader`,{name:`Name`}),ee=n.getByRole(`columnheader`,{name:`State`}),h=m.getBoundingClientRect(),g=ee.getBoundingClientRect(),_=a.getBoundingClientRect();await k(l.width).toBe(h.width),await k(u.width).toBe(g.width),await k(l.right).toBe(u.left),await k(c.bottom).toBeLessThanOrEqual(_.y),await k(f?.getComputedStyle(o).borderBottomWidth).toBe(`1px`),await k(f?.getComputedStyle(s).borderBottomWidth).toBe(`1px`)}var Mt,O,k,Nt,A,Pt,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Ft,Y,X,Z,Q,$,It,Lt=t((()=>{Mt=e(r(),1),ee(),g(),ne(),xt(),O=u(),{expect:k,fireEvent:Nt,userEvent:A,waitFor:Pt,within:j}=__STORYBOOK_MODULE_TEST__,M={component:Je,decorators:[e=>(Object.assign(D.Body,{displayName:`Table.Body`}),Object.assign(D.Cell,{displayName:`Table.Cell`}),Object.assign(D.Column,{displayName:`Table.Column`}),Object.assign(D.Disclosure,{displayName:`Table.Disclosure`}),Object.assign(D.Footer,{displayName:`Table.Footer`}),Object.assign(D.Header,{displayName:`Table.Header`}),Object.assign(D.LoadMore,{displayName:`Table.LoadMore`}),Object.assign(D.Root,{displayName:`Table.Root`}),Object.assign(D.Row,{displayName:`Table.Row`}),(0,O.jsx)(e,{}))],subcomponents:{Body:Ye,Cell:T,Column:S,Disclosure:Qe,Footer:Xe,Header:C,LoadMore:$e,Row:Ze},title:`Collections/Table`},N={args:{"aria-label":`Items`,children:null},play:async({canvasElement:e})=>{let t=j(e);await A.click(t.getByRole(`columnheader`,{name:`Name`})),await k(t.getByRole(`columnheader`,{name:`Name`})).toHaveAttribute(`aria-sort`,`descending`),await k(t.getByRole(`rowheader`,{name:`Alpha`})).toHaveAttribute(`data-label`,`Name:`)},render:Ct},P={args:{"aria-label":`Static data`,children:null},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Static data`,children:[(0,O.jsxs)(D.Header,{id:`heading-section`,children:[(0,O.jsx)(D.Column,{id:`label`,rowHeader:!0,children:`Label`}),(0,O.jsx)(D.Column,{id:`value`,children:`Value`})]}),(0,O.jsx)(D.Body,{id:`body-section`,children:(0,O.jsxs)(D.Row,{id:`first`,textValue:`First Long value`,children:[(0,O.jsx)(D.Cell,{column:`label`,children:`First`}),(0,O.jsx)(D.Cell,{column:`value`,children:`A long value that wraps in the responsive card presentation`})]})}),(0,O.jsx)(D.Footer,{id:`footer-section`,children:(0,O.jsxs)(D.Row,{id:`summary`,textValue:`Summary One item`,children:[(0,O.jsx)(D.Cell,{column:`label`,children:`Summary`}),(0,O.jsx)(D.Cell,{column:`value`,children:`One item`})]})})]})},F={args:{"aria-label":`Bounded items`,boundary:`strong`,children:null},play:async({canvasElement:e})=>{let t=j(e).getByRole(`grid`,{name:`Bounded items`}),n=getComputedStyle(t);await k(t).toHaveAttribute(`data-boundary`,`strong`),await k(n.borderTopWidth).toBe(`0px`),await k(n.borderRightWidth).toBe(`0px`),await k(n.borderBottomWidth).toBe(`2px`),await k(n.borderLeftWidth).toBe(`0px`)},render:({"aria-label":e,boundary:t})=>(0,O.jsxs)(D.Root,{"aria-label":e,boundary:t,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`state`,children:`State`})]}),(0,O.jsx)(D.Body,{children:(0,O.jsxs)(D.Row,{id:`aurora`,textValue:`Aurora Ready`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Aurora`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Ready`})]})})]})},I={args:{"aria-label":`Grouped grid items`,children:null},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`grid`,{name:`Grouped grid items`}),r=t.getByRole(`row`,{name:`Name State`}),i=t.getByRole(`row`,{name:`Beta`}),a=t.getByRole(`row`,{name:`Gamma`}),o=t.getByRole(`columnheader`,{name:`State`}),s=t.getByRole(`columnheader`,{name:`Name`}),c=t.getByRole(`rowheader`,{name:`Active`}),l=t.getByRole(`gridcell`,{name:`Ready`}),u=t.getByRole(`gridcell`,{name:`Review`}),d=t.getByRole(`gridcell`,{name:`Draft`}),f=e.ownerDocument.defaultView;await k(f?.getComputedStyle(n).display).toBe(`grid`),await k(f?.getComputedStyle(r.parentElement).display).toBe(`grid`),await k(f?.getComputedStyle(r).display).toBe(`grid`),await k(f?.getComputedStyle(i.parentElement).display).toBe(`grid`),await k(f?.getComputedStyle(i).display).toBe(`grid`),await k(f?.getComputedStyle(l).display).toBe(`block`),await k(c).toHaveAttribute(`colspan`,`2`),await k(c.getBoundingClientRect().left).toBeCloseTo(s.getBoundingClientRect().left,1),await k(c.getBoundingClientRect().right).toBeCloseTo(o.getBoundingClientRect().right,1),await k(f?.getComputedStyle(i).borderBottomWidth).toBe(`1px`),await k(f?.getComputedStyle(a).borderBottomWidth).toBe(`0px`),await k(l.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1),await k(u.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1),await k(d.getBoundingClientRect().left).toBeCloseTo(o.getBoundingClientRect().left,1)},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Grouped grid items`,className:`grid-cols-[minmax(0,1fr)_auto]`,layout:`grid`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`state`,children:`State`})]}),(0,O.jsxs)(D.Body,{id:`active`,children:[(0,O.jsx)(D.Row,{id:`active-section`,presentation:`section`,textValue:`Active`,children:(0,O.jsx)(D.Cell,{colSpan:2,column:`name`,children:`Active`})}),(0,O.jsxs)(D.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Ready`})]}),(0,O.jsxs)(D.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Beta`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Review`})]})]}),(0,O.jsxs)(D.Body,{id:`archived`,children:[(0,O.jsx)(D.Row,{id:`archived-section`,presentation:`section`,textValue:`Archived`,children:(0,O.jsx)(D.Cell,{colSpan:2,column:`name`,children:`Archived`})}),(0,O.jsxs)(D.Row,{id:`gamma`,textValue:`Gamma Draft`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Gamma`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Draft`})]})]})]})},L={args:{"aria-label":`Responsive company records`,children:null},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`columnheader`,{name:`Media`}),r=t.getByRole(`columnheader`,{name:`Name`}),i=t.getByRole(`columnheader`,{name:`Number`}),a=t.getByRole(`columnheader`,{name:`Contact`}),o=t.getByRole(`columnheader`,{name:`Action`}),s=t.getByRole(`gridcell`,{name:`AC`}),c=t.getByRole(`rowheader`,{name:`Acme`});await k(n.getBoundingClientRect().width).toBeCloseTo(36,1),await k(o.getBoundingClientRect().width).toBeCloseTo(20,1),await k(r.getBoundingClientRect().width).toBeGreaterThan(a.getBoundingClientRect().width),await k(a.getBoundingClientRect().width).toBeGreaterThan(i.getBoundingClientRect().width),await k(s.getBoundingClientRect().left).toBeCloseTo(n.getBoundingClientRect().left,1),await k(c.getBoundingClientRect().left).toBeCloseTo(r.getBoundingClientRect().left,1),await k(s).toHaveAttribute(`data-breeze-compact-hidden`,``)},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Responsive company records`,compactHiddenColumns:[`media`],desktopColumns:`mediaDetailsAction`,layout:`responsiveGrid`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{compactLabel:!1,id:`media`,children:`Media`}),(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`number`,children:`Number`}),(0,O.jsx)(D.Column,{id:`contact`,children:`Contact`}),(0,O.jsx)(D.Column,{compactLabel:!1,id:`action`,children:`Action`})]}),(0,O.jsx)(D.Body,{children:(0,O.jsxs)(D.Row,{id:`acme`,textValue:`Acme 123 contact@example.test`,children:[(0,O.jsx)(D.Cell,{column:`media`,children:`AC`}),(0,O.jsx)(D.Cell,{column:`name`,children:`Acme`}),(0,O.jsx)(D.Cell,{column:`number`,children:`123`}),(0,O.jsx)(D.Cell,{column:`contact`,children:`contact@example.test`}),(0,O.jsx)(D.Cell,{column:`action`,children:`View`})]})})]})},R={args:{"aria-label":`Compact scheduled records`,children:null},globals:{viewport:{value:`compactBoundary`}},parameters:{viewport:{options:{compactBoundary:{name:`Compact boundary`,styles:{height:`800px`,width:`680px`}}}}},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`grid`,{name:`Compact scheduled records`}),r=t.getByRole(`row`,{name:`Subscription`}),i=t.getByRole(`rowheader`,{name:`Subscription`}),a=t.getByText(`12 August`),o=t.getByRole(`gridcell`,{name:`£20`}),s=t.getByRole(`row`,{name:`Summary`}),c=t.getByRole(`rowheader`,{name:`Summary`}),l=j(s).getByRole(`gridcell`,{name:`£40`}),u=getComputedStyle(n).gridTemplateColumns.split(` `);await k(u).toHaveLength(2),await k(a.getBoundingClientRect().width).toBe(0),await k(i.getBoundingClientRect().right).toBeLessThanOrEqual(o.getBoundingClientRect().left),await k(r.getBoundingClientRect().width).toBeGreaterThan(0),await k(c.getBoundingClientRect().right).toBeLessThanOrEqual(l.getBoundingClientRect().left),await A.click(i),await k(i).toHaveFocus(),await A.keyboard(`{ArrowRight}`),await k(o).toHaveFocus(),await A.keyboard(`{ArrowLeft}`),await k(i).toHaveFocus(),await A.keyboard(`{End}`),await k(o).toHaveFocus(),await A.keyboard(`{Home}`),await k(i).toHaveFocus();let d=t.getByRole(`textbox`,{name:`Reference`});await A.click(d),await A.keyboard(`{ArrowRight}`),await k(d).toHaveFocus()},render:wt},z={args:{"aria-label":`Spanning visibility`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=j(e),n=t.getByText(`Mixed`),r=t.getByText(`Hidden`);await k(n.getBoundingClientRect().width).toBeGreaterThan(0),await k(r.getBoundingClientRect().width).toBe(0)},render:Tt},B={args:{"aria-label":`Compact scheduled records`,children:null},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`grid`,{name:`Compact scheduled records`}),r=t.getByRole(`row`,{name:`Summary`}),i=t.getByRole(`rowheader`,{name:`Summary`}),a=j(r).getByRole(`gridcell`,{name:`£40`}),o=t.getByRole(`columnheader`,{name:`Name`}),s=getComputedStyle(n).gridTemplateColumns.split(` `);await k(s).toHaveLength(5),await k(getComputedStyle(i).gridColumn).toBe(`span 2 / span 2`),await k(i.getBoundingClientRect().left).toBe(o.getBoundingClientRect().left),await k(i.getBoundingClientRect().right).toBe(a.getBoundingClientRect().left)},render:wt},V={args:{"aria-label":`Responsive records`,children:null},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`row`,{name:`Example record`}),r=getComputedStyle(n).gridTemplateColumns.split(` `),i=t.getByText(`Amount`),a=t.getByText(`£10.00`);await k(r[0]).toBe(`36px`),await k(r.at(-1)).toBe(`20px`),await k(a.getBoundingClientRect().right).toBeCloseTo(i.getBoundingClientRect().right,1)},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Responsive records`,layout:`responsiveGrid`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{compactLabel:!1,id:`marker`,textValue:`Marker`,width:36,children:(0,O.jsx)(`span`,{className:`sr-only`,children:`Marker`})}),(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{align:`end`,id:`amount`,width:`max-content`,children:(0,O.jsx)(`span`,{children:`Amount`})}),(0,O.jsx)(D.Column,{compactLabel:!1,id:`action`,textValue:`Action`,width:`1.25rem`,children:(0,O.jsx)(`span`,{className:`sr-only`,children:`Action`})})]}),(0,O.jsx)(D.Body,{children:(0,O.jsxs)(D.Row,{id:`record`,textValue:`Example record`,children:[(0,O.jsx)(D.Cell,{column:`marker`,children:(0,O.jsx)(`span`,{className:`flex size-9 items-center justify-center`,children:`A`})}),(0,O.jsx)(D.Cell,{column:`name`,children:`Example record`}),(0,O.jsx)(D.Cell,{align:`end`,column:`amount`,children:(0,O.jsx)(`span`,{children:`£10.00`})}),(0,O.jsx)(D.Disclosure,{column:`action`,position:`flow`})]})})]})},H={args:{"aria-label":`Grouped responsive items`,children:null},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`gridcell`,{name:`Review`}),r=t.getByRole(`gridcell`,{name:`Draft`}),i=e.ownerDocument.defaultView;await k(i?.getComputedStyle(n).borderBottomWidth).toBe(`1px`),await k(i?.getComputedStyle(r).borderBottomWidth).toBe(`0px`)},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Grouped responsive items`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`state`,children:`State`})]}),(0,O.jsxs)(D.Body,{id:`active`,children:[(0,O.jsxs)(D.Row,{id:`alpha`,textValue:`Alpha Ready`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Ready`})]}),(0,O.jsxs)(D.Row,{id:`beta`,textValue:`Beta Review`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Beta`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Review`})]})]}),(0,O.jsx)(D.Body,{id:`archived`,children:(0,O.jsxs)(D.Row,{id:`gamma`,textValue:`Gamma Draft`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Gamma`}),(0,O.jsx)(D.Cell,{column:`state`,children:`Draft`})]})})]})},U={args:{"aria-label":`Semantic row presentations`,children:null},play:async({canvasElement:e})=>Dt(e),render:()=>(0,O.jsx)(Et,{})},W={args:{"aria-label":`Semantic row presentations`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>Dt(e),render:()=>(0,O.jsx)(Et,{})},G={args:{"aria-label":`Responsive items`,children:null},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`columnheader`,{name:`Name`}),r=t.getByRole(`row`,{name:`Alpha`}),i=t.getByRole(`rowheader`,{name:`Alpha`}),a=t.getByRole(`gridcell`,{name:`Ready`}),o=t.getByRole(`gridcell`,{name:`Review`}),s=e.ownerDocument.defaultView,c=s?.getComputedStyle(n),l=s?.getComputedStyle(i),u=s?.getComputedStyle(a,`::before`);await k(n.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await k(r.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await k(c?.paddingLeft).toBe(l?.paddingLeft),await k(l?.verticalAlign).toBe(`middle`),await k(l?.borderBottomWidth).toBe(`1px`),await k(a).toHaveAttribute(`data-label`,`State:`),await k(u?.display).toBe(`none`),await k(s?.getComputedStyle(o).borderBottomWidth).toBe(`0px`)},render:()=>(0,O.jsx)(Ot,{})},K={args:{"aria-label":`Responsive items`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`row`,{name:`Alpha`}),r=t.getByRole(`row`,{name:`Beta`}),i=t.getByRole(`rowheader`,{name:`Alpha`}),a=t.getByRole(`gridcell`,{name:`Ready`}),o=e.ownerDocument.defaultView,s=o?.getComputedStyle(n),c=o?.getComputedStyle(a),l=o?.getComputedStyle(a,`::before`);await k(s?.display).toBe(`flex`),await k(s?.flexDirection).toBe(`column`),await k(Number.parseFloat(s?.gap??`0`)).toBeGreaterThan(0),await k(s?.borderBottomWidth).toBe(`1px`),await k(o?.getComputedStyle(r).borderBottomWidth).toBe(`0px`),await k(c?.display).toBe(`block`),await k(l?.display).toBe(`inline-block`),await k(c?.paddingTop).toBe(`0px`),await k(c?.borderBottomWidth).toBe(`0px`),await k(a).toHaveAttribute(`data-label`,`State:`),await k(i).not.toHaveAttribute(`data-label`)},render:()=>(0,O.jsx)(Ot,{})},q={args:{"aria-label":`Conditional columns`,children:null},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Conditional columns`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`state`,children:`State`}),(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`})]}),(0,O.jsxs)(D.Body,{children:[(0,O.jsxs)(D.Row,{id:1,textValue:`Ready Alpha`,children:[(0,O.jsx)(D.Cell,{column:`state`,children:`Ready`}),(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`})]}),(0,O.jsxs)(D.Row,{id:2,textValue:`In review Beta`,children:[(0,O.jsx)(D.Cell,{column:`state`,children:`In review`}),(0,O.jsx)(D.Cell,{column:`name`,children:`Beta`})]}),(0,O.jsxs)(D.Row,{id:3,textValue:`Draft Gamma`,children:[(0,O.jsx)(D.Cell,{column:`state`,children:`Draft`}),(0,O.jsx)(D.Cell,{column:`name`,children:`Gamma`})]})]})]})},J={args:{"aria-label":`States`,children:null},render:()=>(0,O.jsxs)(_,{gap:`xl`,children:[(0,O.jsxs)(D.Root,{"aria-label":`Read-only`,readOnly:!0,selection:[1],children:[(0,O.jsx)(D.Header,{children:(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`})}),(0,O.jsx)(D.Body,{children:(0,O.jsx)(D.Row,{id:1,textValue:`Alpha`,children:(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`})})})]}),(0,O.jsxs)(D.Root,{"aria-label":`Empty`,children:[(0,O.jsx)(D.Header,{children:(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`})}),(0,O.jsx)(D.Body,{emptyContent:`No items`,children:null})]})]})},Ft=Array.from({length:20},(e,t)=>({amount:`£${t+1}`,id:t+1,name:`Record ${t+1}`})),Y={args:{"aria-label":`Virtual data`,children:null},play:async({canvasElement:e})=>jt(e),render:()=>(0,O.jsx)(kt,{})},X={args:{"aria-label":`Virtual data`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>jt(e,!0),render:()=>(0,O.jsx)(kt,{compactHiddenState:!0})},Z={args:{"aria-label":`Virtual data`,children:null},play:async({canvasElement:e})=>jt(e,!0),render:()=>(0,O.jsx)(`div`,{style:{width:320},children:(0,O.jsx)(kt,{compactHiddenState:!0,expandedState:!0})})},Q={args:{"aria-label":`Virtual boundary records`,children:null},globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=j(e),n=t.getByRole(`rowheader`,{name:`Record 1`}),r=t.getByRole(`gridcell`,{name:`£1`});await A.click(n),await A.keyboard(`{ArrowRight}`),await k(r).toHaveFocus(),await A.keyboard(`{ArrowLeft}`),await k(n).toHaveFocus(),await Nt.keyDown(n,{ctrlKey:!0,key:`End`,metaKey:!0}),await Pt(()=>k(t.getByRole(`gridcell`,{name:`£20`})).toHaveFocus());let i=t.getByRole(`gridcell`,{name:`£20`});await Nt.keyDown(i,{ctrlKey:!0,key:`Home`,metaKey:!0}),await Pt(()=>k(t.getByRole(`rowheader`,{name:`Record 1`})).toHaveFocus())},render:At},$={args:{"aria-label":`Action table`,children:null},render:()=>(0,O.jsxs)(D.Root,{"aria-label":`Action table`,children:[(0,O.jsxs)(D.Header,{children:[(0,O.jsx)(D.Column,{id:`name`,rowHeader:!0,children:`Name`}),(0,O.jsx)(D.Column,{id:`action`,children:`Action`})]}),(0,O.jsx)(D.Body,{children:(0,O.jsxs)(D.Row,{id:`alpha`,textValue:`Alpha Inspect`,children:[(0,O.jsx)(D.Cell,{column:`name`,children:`Alpha`}),(0,O.jsx)(D.Cell,{column:`action`,children:(0,O.jsx)(h,{appearance:`ghost`,size:`sm`,children:`Inspect`})})]})})]})},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source},description:{story:`Authors columns and rows directly while the application controls selected
keys and the consumer-owned sort descriptor.

@summary explicitly authored table with controlled sorting and selection`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source},description:{story:`Composes keyed static header, body, and footer sections whose cells follow
the visible heading order and retain long-value wrapping.

@summary static ordered header body and footer sections`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source},description:{story:`Adds the canonical strong lower boundary without introducing top or side
borders, preserving the table's relationship to surrounding content.

@summary table with a strong lower boundary`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source},description:{story:`Uses persistent CSS-grid rows across multiple keyed body sections so every
cell stays aligned with its corresponding heading track.

@summary persistent grid layout with grouped body sections`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source},description:{story:`Uses a named five-column desktop arrangement while retaining compact card
rows below the Breeze small breakpoint.

@summary typed media, details, and action desktop grid columns`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Compact scheduled records',
    children: null
  },
  globals: {
    viewport: {
      value: 'compactBoundary'
    }
  },
  parameters: {
    viewport: {
      options: {
        compactBoundary: {
          name: 'Compact boundary',
          styles: {
            height: '800px',
            width: '680px'
          }
        }
      }
    }
  },
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
    const tracks = getComputedStyle(table).gridTemplateColumns.split(' ');
    await expect(tracks).toHaveLength(2);
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
    await userEvent.click(reference);
    await userEvent.keyboard('{ArrowRight}');
    await expect(reference).toHaveFocus();
  },
  render: GridColumnSpanTable
}`,...R.parameters?.docs?.source},description:{story:`Removes supporting desktop-only columns and their grid tracks at the compact
breakpoint while preserving spanning and keyboard geometry.

@summary compact grid omits hidden tracks`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
    const mixed = canvas.getByText('Mixed');
    const hidden = canvas.getByText('Hidden');
    await expect(mixed.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(hidden.getBoundingClientRect().width).toBe(0);
  },
  render: CompactSpanningVisibilityTable
}`,...z.parameters?.docs?.source},description:{story:`Keeps a span visible when any covered column remains in the compact grid and
removes it when every covered column is compact-hidden.

@summary compact spans follow covered column visibility`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
    const tracks = getComputedStyle(table).gridTemplateColumns.split(' ');
    await expect(tracks).toHaveLength(5);
    await expect(getComputedStyle(summary).gridColumn).toBe('span 2 / span 2');
    await expect(summary.getBoundingClientRect().left).toBe(nameHeading.getBoundingClientRect().left);
    await expect(summary.getBoundingClientRect().right).toBe(summaryAmount.getBoundingClientRect().left);
  },
  render: GridColumnSpanTable
}`,...B.parameters?.docs?.source},description:{story:`Restores the native multi-column span when compact-only columns are visible
above the small breakpoint.

@summary desktop grid preserves full spans`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source},description:{story:`Applies intrinsic and icon widths from the generic column API while the
remaining columns share the available desktop width.

@summary responsive grid driven by column widths`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source},description:{story:`Keeps separate responsive body sections visually bounded while removing the
final table-row divider only at the end of the complete collection.

@summary responsive table with grouped body sections`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Semantic row presentations',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectSemanticRowPresentations(canvasElement),
  render: () => <SemanticRowPresentations />
}`,...U.parameters?.docs?.source},description:{story:`Compares non-actionable section geometry with default and muted actionable
data-row treatments at the standard viewport width.

@summary semantic section rows and actionable row tones`,...U.parameters?.docs?.description}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source},description:{story:`Verifies that section geometry and default or muted actionable row emphasis
remain distinguishable in the canonical compact viewport.

@summary compact semantic section rows and row tones`,...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source},description:{story:`Shows ordinary columnar records at table width with header-derived compact
labels prepared but visually suppressed above the small breakpoint.

@summary responsive records in columnar table layout`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source},description:{story:`Adapts the same records into stacked compact rows and derives visible cell
labels from headings without duplicating the row-header label.

@summary compact records with heading-derived cell labels`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source},description:{story:`Authors state before name in both the header and every row so the visible
cell order remains aligned with its headings.

@summary reordered columns with matched cell order`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source},description:{story:`Compares an immutable selected row with application-authored empty content
for a body whose current item collection is empty.

@summary read-only selection and empty table content`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual data',
    children: null
  },
  play: async ({
    canvasElement
  }) => expectVirtualizedTableGeometry(canvasElement),
  render: () => <VirtualizedTable />
}`,...Y.parameters?.docs?.source},description:{story:`Windows variable-height rows inside a bounded viewport and renders a loading
sentinel while preserving desktop heading and cell geometry.

@summary variable-height virtualized rows with loading sentinel`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
  }) => expectVirtualizedTableGeometry(canvasElement, true),
  render: () => <VirtualizedTable compactHiddenState />
}`,...X.parameters?.docs?.source},description:{story:`Verifies variable-height row windowing and the loading sentinel against the
stacked compact record presentation without horizontal overflow.

@summary compact variable-height virtualized table`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
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

@summary application-owned action inside a table cell`,...$.parameters?.docs?.description}}};try{M.displayName=`Root`,M.__docgenInfo={description:`Coordinates semantic table navigation, row state, sorting, and responsive labels.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{boundary:{defaultValue:{value:`none`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Optional visual treatment for the table's lower edge. Defaults to `none`.",name:`boundary`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableBoundary | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ordered header, body, and optional footer sections.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},compactHiddenColumns:{defaultValue:{value:`[]`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`One key or reusable key collection omitted below the Breeze small breakpoint.`,name:`compactHiddenColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CompactHiddenColumns | undefined`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Keys whose rows cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},desktopColumns:{defaultValue:{value:`equal`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`.",name:`desktopColumns`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableDesktopColumns | undefined`}},layout:{defaultValue:{value:`responsive`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`.",name:`layout`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`TableLayout | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:"Enables multiple row selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Ref to the rendered table or virtualized grid element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`}],description:`Optional fixed- or variable-height row windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`TableRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Current selected row keys.
Current immutable selected row keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Called with the next selected row keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Excluded when selection is controlled.
Initial selected row keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ReadOnlyTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSelectionProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks controlled row selection and sorting as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSelectionProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},sort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Current consumer-owned sort descriptor.
Excluded when sorting is uncontrolled.`,name:`sort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}},onSortChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Called when a sortable heading requests a new descriptor.
Called when the internally retained descriptor changes.`,name:`onSortChange`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`((sort: TableSort) => void) | ((sort: TableSort) => void) | undefined`}},defaultSort:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`UncontrolledTableSortProps`}],description:`Excluded when sorting is controlled.
Initial sort descriptor.`,name:`defaultSort`,parent:{fileName:`breeze-ui/src/primitives/Table/Table.tsx`,name:`ControlledTableSortProps`},required:!1,tags:{},type:{name:`TableSort | undefined`}}},tags:{}}}catch{}try{N.displayName=`ControlledSortingAndSelection`,N.__docgenInfo={description:`Authors columns and rows directly while the application controls selected
keys and the consumer-owned sort descriptor.`,displayName:`ControlledSortingAndSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`explicitly authored table with controlled sorting and selection`}}}catch{}try{P.displayName=`StaticOrderedSections`,P.__docgenInfo={description:`Composes keyed static header, body, and footer sections whose cells follow
the visible heading order and retain long-value wrapping.`,displayName:`StaticOrderedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`static ordered header body and footer sections`}}}catch{}try{F.displayName=`StrongBoundary`,F.__docgenInfo={description:`Adds the canonical strong lower boundary without introducing top or side
borders, preserving the table's relationship to surrounding content.`,displayName:`StrongBoundary`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`table with a strong lower boundary`}}}catch{}try{I.displayName=`GridGroupedSections`,I.__docgenInfo={description:`Uses persistent CSS-grid rows across multiple keyed body sections so every
cell stays aligned with its corresponding heading track.`,displayName:`GridGroupedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`persistent grid layout with grouped body sections`}}}catch{}try{L.displayName=`ResponsiveGridColumnVariant`,L.__docgenInfo={description:`Uses a named five-column desktop arrangement while retaining compact card
rows below the Breeze small breakpoint.`,displayName:`ResponsiveGridColumnVariant`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`typed media, details, and action desktop grid columns`}}}catch{}try{R.displayName=`CompactGridColumns`,R.__docgenInfo={description:`Removes supporting desktop-only columns and their grid tracks at the compact
breakpoint while preserving spanning and keyboard geometry.`,displayName:`CompactGridColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact grid omits hidden tracks`}}}catch{}try{z.displayName=`CompactGridSpanningVisibility`,z.__docgenInfo={description:`Keeps a span visible when any covered column remains in the compact grid and
removes it when every covered column is compact-hidden.`,displayName:`CompactGridSpanningVisibility`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact spans follow covered column visibility`}}}catch{}try{B.displayName=`DesktopGridColumnSpan`,B.__docgenInfo={description:`Restores the native multi-column span when compact-only columns are visible
above the small breakpoint.`,displayName:`DesktopGridColumnSpan`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`desktop grid preserves full spans`}}}catch{}try{V.displayName=`ResponsiveGridColumnWidths`,V.__docgenInfo={description:`Applies intrinsic and icon widths from the generic column API while the
remaining columns share the available desktop width.`,displayName:`ResponsiveGridColumnWidths`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive grid driven by column widths`}}}catch{}try{H.displayName=`ResponsiveGroupedSections`,H.__docgenInfo={description:`Keeps separate responsive body sections visually bounded while removing the
final table-row divider only at the end of the complete collection.`,displayName:`ResponsiveGroupedSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive table with grouped body sections`}}}catch{}try{U.displayName=`RowTonesAndSections`,U.__docgenInfo={description:`Compares non-actionable section geometry with default and muted actionable
data-row treatments at the standard viewport width.`,displayName:`RowTonesAndSections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`semantic section rows and actionable row tones`}}}catch{}try{W.displayName=`RowTonesAndSectionsCompact`,W.__docgenInfo={description:`Verifies that section geometry and default or muted actionable row emphasis
remain distinguishable in the canonical compact viewport.`,displayName:`RowTonesAndSectionsCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact semantic section rows and row tones`}}}catch{}try{G.displayName=`ResponsiveItems`,G.__docgenInfo={description:`Shows ordinary columnar records at table width with header-derived compact
labels prepared but visually suppressed above the small breakpoint.`,displayName:`ResponsiveItems`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`responsive records in columnar table layout`}}}catch{}try{K.displayName=`ResponsiveItemsCompact`,K.__docgenInfo={description:`Adapts the same records into stacked compact rows and derives visible cell
labels from headings without duplicating the row-header label.`,displayName:`ResponsiveItemsCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact records with heading-derived cell labels`}}}catch{}try{q.displayName=`ConditionalOrderedColumns`,q.__docgenInfo={description:`Authors state before name in both the header and every row so the visible
cell order remains aligned with its headings.`,displayName:`ConditionalOrderedColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`reordered columns with matched cell order`}}}catch{}try{J.displayName=`ReadOnlyAndEmpty`,J.__docgenInfo={description:`Compares an immutable selected row with application-authored empty content
for a body whose current item collection is empty.`,displayName:`ReadOnlyAndEmpty`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`read-only selection and empty table content`}}}catch{}try{Y.displayName=`VariableVirtualizationAndLoading`,Y.__docgenInfo={description:`Windows variable-height rows inside a bounded viewport and renders a loading
sentinel while preserving desktop heading and cell geometry.`,displayName:`VariableVirtualizationAndLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`variable-height virtualized rows with loading sentinel`}}}catch{}try{X.displayName=`VariableVirtualizationAndLoadingCompact`,X.__docgenInfo={description:`Verifies variable-height row windowing and the loading sentinel against the
stacked compact record presentation without horizontal overflow.`,displayName:`VariableVirtualizationAndLoadingCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`compact variable-height virtualized table`}}}catch{}try{Z.displayName=`VariableVirtualizationNarrowDesktop`,Z.__docgenInfo={description:`Keeps desktop row measurement aligned with viewport-driven responsive CSS
when the virtualized table itself is narrower than the small breakpoint.`,displayName:`VariableVirtualizationNarrowDesktop`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`narrow desktop virtualization keeps visible cells in measurement`}}}catch{}try{Q.displayName=`VariableVirtualizationCompactBoundaries`,Q.__docgenInfo={description:`Preserves collection-wide modified Home and End navigation while compact
boundary columns are hidden and rows are windowed.`,displayName:`VariableVirtualizationCompactBoundaries`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`virtualized compact navigation reaches collection boundaries`}}}catch{}try{$.displayName=`ActionsStayWithApplications`,$.__docgenInfo={description:`Places an application-owned action control in an ordinary keyed cell rather
than teaching Table application commands or business workflows.`,displayName:`ActionsStayWithApplications`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Table/Table.stories.tsx`,methods:[],props:{},tags:{summary:`application-owned action inside a table cell`}}}catch{}It=[`ControlledSortingAndSelection`,`StaticOrderedSections`,`StrongBoundary`,`GridGroupedSections`,`ResponsiveGridColumnVariant`,`CompactGridColumns`,`CompactGridSpanningVisibility`,`DesktopGridColumnSpan`,`ResponsiveGridColumnWidths`,`ResponsiveGroupedSections`,`RowTonesAndSections`,`RowTonesAndSectionsCompact`,`ResponsiveItems`,`ResponsiveItemsCompact`,`ConditionalOrderedColumns`,`ReadOnlyAndEmpty`,`VariableVirtualizationAndLoading`,`VariableVirtualizationAndLoadingCompact`,`VariableVirtualizationNarrowDesktop`,`VariableVirtualizationCompactBoundaries`,`ActionsStayWithApplications`]}));Lt();export{$ as ActionsStayWithApplications,R as CompactGridColumns,z as CompactGridSpanningVisibility,q as ConditionalOrderedColumns,N as ControlledSortingAndSelection,B as DesktopGridColumnSpan,I as GridGroupedSections,J as ReadOnlyAndEmpty,L as ResponsiveGridColumnVariant,V as ResponsiveGridColumnWidths,H as ResponsiveGroupedSections,G as ResponsiveItems,K as ResponsiveItemsCompact,U as RowTonesAndSections,W as RowTonesAndSectionsCompact,P as StaticOrderedSections,F as StrongBoundary,Y as VariableVirtualizationAndLoading,X as VariableVirtualizationAndLoadingCompact,Q as VariableVirtualizationCompactBoundaries,Z as VariableVirtualizationNarrowDesktop,It as __namedExportsOrder,M as default,Lt as n,St as t};