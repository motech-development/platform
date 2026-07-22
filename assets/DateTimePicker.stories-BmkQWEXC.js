import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,d as a,f as o,l as s,n as c,p as l,r as u,t as d,u as f}from"./iframe-q_a4TWX4.js";import{n as p,t as m}from"./StoryConstraint-zHJlDOLD.js";import{n as h,t as g}from"./Stack-CT7mlz7n.js";import{i as _,n as v,o as y,s as b,t as ee}from"./TextField-CiykLqt4.js";import{a as te,n as ne,s as x}from"./conversion-CzNrxg-Q.js";import{i as re,n as ie,t as ae}from"./DateInput-CtYEBHNC.js";import{c as oe,d as se,o as ce,r as le,t as S,u as ue}from"./PickerParts-B5NghtYQ.js";import{a as C,i as w,n as T,r as E,t as D}from"./PickerFieldParts-DGj1yoPp.js";import{t as de}from"./TimeField-5ebVaCR1.js";function fe(){let e=(0,j.useContext)(F);if(e===null)throw Error(`DateTimePicker parts must be rendered within DateTimePicker.Root.`);return e}function O({className:e,ref:t,...n}){let r=(0,j.useContext)(ue),{disabled:i,readOnly:o}=fe(),{messages:c}=s(),l=a(t);if(r===null)throw Error(`DateTimePicker.Calendar must be rendered within DateTimePicker.Root.`);let u=e=>{e!==null&&r.setTimeValue(e)};return(0,j.createElement)(`div`,{...n,className:M({class:e}),"data-breeze-date-time-calendar":``,ref:l},(0,j.createElement)(S),(0,j.createElement)(re,{className:N(),granularity:`minute`,isDisabled:i,isInvalid:r.isInvalid,isReadOnly:o,onChange:i||o?void 0:u,value:r.timeValue},(0,j.createElement)(y.Label,null,c.selectTime),(0,j.createElement)(ae,{className:P()})))}function k({"aria-label":e,placement:t=`bottom end`,...n}){let{messages:r}=s();return(0,j.createElement)(le,{...n,"aria-label":e??r.selectDateTime,placement:t})}function A({children:e,className:t,defaultValue:n,disabled:r=!1,form:i,invalid:o=!1,maxValue:c,minValue:l,name:u,onChange:d,readOnly:f=!1,ref:p,required:m=!1,value:h,...g}){let{timeZone:_=`UTC`}=s(),v={disabled:r,readOnly:f};return(0,j.createElement)(se,{...g,children:(0,j.createElement)(F,{value:v},e),className:C({class:t}),defaultValue:x(n??null,_)??void 0,form:i,granularity:`minute`,isDisabled:r,isInvalid:o,isReadOnly:f,isRequired:m,maxValue:x(c??null,_)??void 0,minValue:x(l??null,_)??void 0,name:u,onChange:f?void 0:e=>d?.(ne(e)),ref:a(p),value:h===void 0?void 0:x(h,_)})}var j,M,N,P,F,I,pe=t((()=>{j=n(r(),1),oe(),de(),o(),te(),f(),i(),ie(),w(),ce(),b(),M=l({base:`flex w-full flex-col gap-3`}),N=l({base:`flex min-w-0 flex-col gap-1.5 border-t border-[var(--breeze-border)] pt-3`}),P=l({base:`min-h-11 w-full text-base font-normal leading-[1.4]`}),F=(0,j.createContext)(null),I={Calendar:O,Description:y.Description,Error:y.Error,Group:D,Input:T,Label:y.Label,Popover:k,Root:A,Trigger:E};try{O.displayName=`Calendar`,O.__docgenInfo={description:``,displayName:`Calendar`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,methods:[],props:{ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerCalendarPartProps`}],description:`Ref to the rendered calendar.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerCalendarPartProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}}},tags:{}}}catch{}try{k.displayName=`Popover`,k.__docgenInfo={description:``,displayName:`Popover`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerPopoverPartProps`}],description:`Calendar content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerPopoverPartProps`},required:!0,tags:{},type:{name:`ReactNode`}},placement:{defaultValue:{value:`bottom end`},declarations:[{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerPopoverPartProps`}],description:`Logical placement relative to the field trigger.`,name:`placement`,parent:{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerPopoverPartProps`},required:!1,tags:{},type:{name:`PickerPopoverPlacement | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerPopoverPartProps`}],description:`Ref to the rendered popover.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/date/PickerParts.tsx`,name:`PickerPopoverPartProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}}},tags:{}}}catch{}try{A.displayName=`Root`,A.__docgenInfo={description:`Coordinates explicit-offset instants with provider-zone display and behavior.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Label, segmented input, trigger, calendar popup, and guidance.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Prevents focus and editing.`,name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`boolean | undefined`}},form:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`External native form id.`,name:`form`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Exposes invalid state.`,name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`boolean | undefined`}},maxValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Latest selectable explicit-offset ISO instant.`,name:`maxValue`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},minValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Earliest selectable explicit-offset ISO instant.`,name:`minValue`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Native form field name.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Marks the picker as required.`,name:`required`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Ref to the rendered picker root.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Current controlled explicit-offset instant.
Current immutable explicit-offset instant.
Excluded when uncontrolled.`,name:`value`,required:!1,tags:{},type:{name:`string | null | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Called with the next explicit-offset instant.
Excluded because read-only pickers cannot change.`,name:`onChange`,required:!1,tags:{},type:{name:`((value: string | null) => void) | ((value: string | null) => void) | undefined`}},defaultValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Excluded when controlled.
Initial uncontrolled explicit-offset instant.`,name:`defaultValue`,required:!1,tags:{},type:{name:`string | null | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Mutable controlled pickers cannot be read-only.
Prevents changes.
Uncontrolled state cannot be read-only.`,name:`readOnly`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{I.displayName=`DateTimePicker`,I.__docgenInfo={description:`Accessible compound date-time picker with stable explicit-offset values.`,displayName:`DateTimePicker`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,methods:[],props:{},tags:{summary:`locale-aware instant selection with explicit-offset values`}}}catch{}})),me=e({BoundariesInvalidForm:()=>Y,ControlledAndReadOnly:()=>q,Disabled:()=>X,ExplicitOffset:()=>G,NarrowExplicitOffset:()=>K,RightToLeft:()=>Z,TimeZoneAndDst:()=>J,__namedExportsOrder:()=>Q,default:()=>U});function L(){return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(I.Label,{children:`Date and time`}),(0,z.jsxs)(I.Group,{children:[(0,z.jsx)(I.Input,{}),(0,z.jsx)(I.Trigger,{})]}),(0,z.jsx)(I.Popover,{children:(0,z.jsx)(I.Calendar,{})})]})}function he(){let[e,t]=(0,R.useState)(`2026-07-13T13:30:00+01:00`);return(0,z.jsx)(I.Root,{onChange:t,value:e,children:(0,z.jsx)(L,{})})}var R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$=t((()=>{R=n(r(),1),p(),c(),w(),h(),b(),pe(),z=u(),{expect:B,userEvent:V,within:H}=__STORYBOOK_MODULE_TEST__,U={component:A,decorators:[e=>(Object.assign(I.Calendar,{displayName:`DateTimePicker.Calendar`}),Object.assign(I.Description,{displayName:`DateTimePicker.Description`}),Object.assign(I.Error,{displayName:`DateTimePicker.Error`}),Object.assign(I.Group,{displayName:`DateTimePicker.Group`}),Object.assign(I.Input,{displayName:`DateTimePicker.Input`}),Object.assign(I.Label,{displayName:`DateTimePicker.Label`}),Object.assign(I.Popover,{displayName:`DateTimePicker.Popover`}),Object.assign(I.Root,{displayName:`DateTimePicker.Root`}),Object.assign(I.Trigger,{displayName:`DateTimePicker.Trigger`}),(0,z.jsx)(e,{}))],subcomponents:{Calendar:O,Description:ee,Error:v,Group:D,Input:T,Label:_,Popover:k,Trigger:E},title:`Date and Time/DateTimePicker`},W=1,G={args:{children:null},play:async({canvasElement:e})=>{let t=H(e),n=t.getByRole(`group`),r=t.getByRole(`button`,{name:/Calendar Date and time/});await B(n).toHaveClass(`w-full`,`min-h-11`,`border`),await B(r).toHaveClass(`border-0`),await B(r).not.toHaveClass(`border-s`,`border-l`),await B(r.querySelector(`svg`)).toHaveAttribute(`height`,`1.25rem`);let i=n.querySelector(`[data-type="timeZoneName"]`);await B(i).toHaveTextContent(`UTC`),await B(i).not.toHaveAttribute(`role`),await B(i).not.toHaveAttribute(`tabindex`),await V.click(r);let a=H(e.ownerDocument.body),o=a.getByText(`Select time`).parentElement;if(!(o instanceof HTMLElement))throw Error(`Expected the DateTimePicker popover time field.`);let s=H(o).getByRole(`spinbutton`,{name:/minute/i}),c=o.querySelector(`[data-type="timeZoneName"]`),l=a.getByRole(`dialog`),u=l.getBoundingClientRect(),d=r.getBoundingClientRect();await B(a.getByRole(`application`)).toBeVisible(),await B(l).toHaveAttribute(`data-placement`,`bottom`),await B(Math.abs(u.right-d.right)).toBeLessThanOrEqual(12),await B(Math.abs(u.right-d.right)).toBeLessThan(Math.abs(u.left-d.left)),await B(a.getByRole(`button`,{name:/13.*July.*2026/i})).toHaveFocus(),await B(s).toHaveTextContent(`30`),await B(s).toHaveAttribute(`contenteditable`,`true`),await B(s).toHaveAttribute(`inputmode`,`numeric`),await B(c).toHaveTextContent(`UTC`),await B(c).not.toHaveAttribute(`role`),await B(c).not.toHaveAttribute(`tabindex`),await V.click(s),await V.keyboard(`{ArrowUp}`),await B(s).toHaveTextContent(`31`),await V.click(a.getByRole(`button`,{name:/14.*July.*2026/i})),await B(t.getByRole(`spinbutton`,{name:/day/i})).toHaveTextContent(`14`),await B(t.getByRole(`spinbutton`,{name:/minute/i})).toHaveTextContent(`31`)},render:()=>(0,z.jsxs)(I.Root,{defaultValue:`2026-07-13T12:30:00+00:00`,children:[(0,z.jsx)(I.Label,{children:`Date and time`}),(0,z.jsxs)(I.Group,{children:[(0,z.jsx)(I.Input,{}),(0,z.jsx)(I.Trigger,{})]}),(0,z.jsx)(I.Popover,{children:(0,z.jsx)(I.Calendar,{})})]})},K={args:{children:null},play:async({canvasElement:e})=>{let t=H(e),n=t.getByTestId(`narrow-date-time-host`),r=t.getByRole(`group`),i=t.getByRole(`button`,{name:/Date and time/}),a=t.getAllByRole(`spinbutton`),o=r.querySelector(`[data-breeze-time-zone]`),s=r.getBoundingClientRect(),c=a[0]?.parentElement?.getBoundingClientRect(),l=a[0]?.getBoundingClientRect(),u=o?.getBoundingClientRect(),d=i.getBoundingClientRect();if(c===void 0||l===void 0||u===void 0)throw Error(`Expected segmented date-time input anatomy.`);await B(o).not.toHaveAttribute(`role`),await B(o).not.toHaveAttribute(`tabindex`),await B(s.right).toBeLessThanOrEqual(n.getBoundingClientRect().right+W),await B(l.left).toBeGreaterThanOrEqual(c.left-W),await B(u.right).toBeLessThanOrEqual(c.right+W),await B(c.right).toBeLessThanOrEqual(d.left+W),await V.click(i);let f=H(e.ownerDocument.body).getByText(`Select time`).closest(`[data-breeze-date-time-calendar]`),p=f?.closest(`[data-placement]`),m=f?.querySelector(`[data-type="hour"]`)?.parentElement;if(f==null||p==null||m==null)throw Error(`Expected the complete narrow date-time surface.`);await B(p.scrollWidth).toBeLessThanOrEqual(p.clientWidth),await B(m.getBoundingClientRect().left).toBeGreaterThanOrEqual(p.getBoundingClientRect().left+W),await B(m.getBoundingClientRect().right).toBeLessThanOrEqual(p.getBoundingClientRect().right-W);let h=H(m).getByRole(`spinbutton`,{name:/minute/i});await V.click(h),await V.keyboard(`{ArrowUp}`),await B(h).toHaveTextContent(`31`)},render:()=>(0,z.jsx)(m,{size:`responsive-narrow`,testId:`narrow-date-time-host`,children:(0,z.jsx)(I.Root,{defaultValue:`2026-07-13T12:30:00+00:00`,children:(0,z.jsx)(L,{})})})},q={args:{children:null},play:async({canvasElement:e})=>{let t=H(e).getAllByRole(`button`,{name:/Calendar Date and time/})[1],n=t?.parentElement;await B(n).toHaveClass(`group-data-[readonly]/picker-field:opacity-70`),await B(t).not.toHaveClass(`opacity-70`)},render:()=>(0,z.jsxs)(g,{gap:`md`,children:[(0,z.jsx)(he,{}),(0,z.jsx)(I.Root,{readOnly:!0,value:`2026-07-13T13:30:00+01:00`,children:(0,z.jsx)(L,{})})]})},J={args:{children:null},render:()=>(0,z.jsx)(d,{locale:`en-GB`,timeZone:`Europe/London`,children:(0,z.jsx)(I.Root,{defaultValue:`2026-03-29T00:30:00+00:00`,children:(0,z.jsx)(L,{})})})},Y={args:{children:null},play:async({canvasElement:e})=>{let t=H(e);await V.click(t.getByRole(`button`,{name:/Calendar Date and time/}));let n=H(e.ownerDocument.body).getByText(`Select time`).parentElement?.querySelector(`[role="spinbutton"]`)?.parentElement;await B(n).toHaveAttribute(`data-invalid`)},render:()=>(0,z.jsxs)(I.Root,{form:`booking`,invalid:!0,maxValue:`2026-07-31T23:59:00+01:00`,minValue:`2026-07-01T00:00:00+01:00`,name:`dateTime`,required:!0,children:[(0,z.jsx)(L,{}),(0,z.jsx)(I.Description,{children:`Explicit-offset instant.`}),(0,z.jsx)(I.Error,{children:`Select a valid instant.`})]})},X={args:{children:null},render:()=>(0,z.jsx)(I.Root,{defaultValue:`2026-07-13T12:30:00+00:00`,disabled:!0,children:(0,z.jsx)(L,{})})},Z={args:{children:null},play:async({canvasElement:e})=>{let t=H(e).getByRole(`button`,{name:/Date and time/});await V.click(t);let n=H(e.ownerDocument.body),r=n.getByText(`Select time`).parentElement,i=n.getByRole(`dialog`),a=n.getByRole(`application`),o=H(a).getByRole(`button`,{name:`Previous`}),s=H(a).getAllByRole(`button`,{name:`Next`})[0],c=e.querySelector(`[dir="rtl"]`);await B(c).toBeVisible(),await B(r).toHaveTextContent(`Select time`),await B(i).toHaveAttribute(`dir`,`rtl`),await B(i).toHaveAccessibleName(`Select date and time`),await B(a).toBeVisible(),await B(o.querySelector(`svg`)).toHaveClass(`lucide-arrow-left`,`rtl:rotate-180`),await B(s?.querySelector(`svg`)).toHaveClass(`lucide-arrow-right`,`rtl:rotate-180`),await B(getComputedStyle(o.querySelector(`svg`)).rotate).toBe(`180deg`),await B(getComputedStyle(s?.querySelector(`svg`)).rotate).toBe(`180deg`),await B(o.getBoundingClientRect().left).toBeGreaterThan(s?.getBoundingClientRect().left??1/0)},render:()=>(0,z.jsx)(d,{direction:`rtl`,locale:`en-GB`,timeZone:`Europe/London`,children:(0,z.jsx)(I.Root,{defaultValue:`2026-07-13T12:30:00+00:00`,children:(0,z.jsx)(L,{})})})},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group');
    const trigger = canvas.getByRole('button', {
      name: /Calendar Date and time/
    });
    await expect(group).toHaveClass('w-full', 'min-h-11', 'border');
    await expect(trigger).toHaveClass('border-0');
    await expect(trigger).not.toHaveClass('border-s', 'border-l');
    await expect(trigger.querySelector('svg')).toHaveAttribute('height', '1.25rem');
    const inlineTimeZone = group.querySelector('[data-type="timeZoneName"]');
    await expect(inlineTimeZone).toHaveTextContent('UTC');
    await expect(inlineTimeZone).not.toHaveAttribute('role');
    await expect(inlineTimeZone).not.toHaveAttribute('tabindex');
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const timeLabel = body.getByText('Select time');
    const timeField = timeLabel.parentElement;
    if (!(timeField instanceof HTMLElement)) {
      throw new Error('Expected the DateTimePicker popover time field.');
    }
    const popoverTime = within(timeField);
    const popoverMinute = popoverTime.getByRole('spinbutton', {
      name: /minute/i
    });
    const popoverTimeZone = timeField.querySelector('[data-type="timeZoneName"]');
    const popover = body.getByRole('dialog');
    const popoverBounds = popover.getBoundingClientRect();
    const triggerBounds = trigger.getBoundingClientRect();
    await expect(body.getByRole('application')).toBeVisible();
    await expect(popover).toHaveAttribute('data-placement', 'bottom');
    await expect(Math.abs(popoverBounds.right - triggerBounds.right)).toBeLessThanOrEqual(12);
    await expect(Math.abs(popoverBounds.right - triggerBounds.right)).toBeLessThan(Math.abs(popoverBounds.left - triggerBounds.left));
    await expect(body.getByRole('button', {
      name: /13.*July.*2026/i
    })).toHaveFocus();
    await expect(popoverMinute).toHaveTextContent('30');
    await expect(popoverMinute).toHaveAttribute('contenteditable', 'true');
    await expect(popoverMinute).toHaveAttribute('inputmode', 'numeric');
    await expect(popoverTimeZone).toHaveTextContent('UTC');
    await expect(popoverTimeZone).not.toHaveAttribute('role');
    await expect(popoverTimeZone).not.toHaveAttribute('tabindex');
    await userEvent.click(popoverMinute);
    await userEvent.keyboard('{ArrowUp}');
    await expect(popoverMinute).toHaveTextContent('31');
    await userEvent.click(body.getByRole('button', {
      name: /14.*July.*2026/i
    }));
    await expect(canvas.getByRole('spinbutton', {
      name: /day/i
    })).toHaveTextContent('14');
    await expect(canvas.getByRole('spinbutton', {
      name: /minute/i
    })).toHaveTextContent('31');
  },
  render: () => <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
      <DateTimePicker.Label>Date and time</DateTimePicker.Label>
      <DateTimePicker.Group>
        <DateTimePicker.Input />
        <DateTimePicker.Trigger />
      </DateTimePicker.Group>
      <DateTimePicker.Popover>
        <DateTimePicker.Calendar />
      </DateTimePicker.Popover>
    </DateTimePicker.Root>
}`,...G.parameters?.docs?.source},description:{story:`Edits an explicit-offset instant through inline segments and the complete
calendar-plus-time popup while keeping the timezone suffix informative and
unfocusable.

@summary explicit-offset date and time selection`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId('narrow-date-time-host');
    const group = canvas.getByRole('group');
    const trigger = canvas.getByRole('button', {
      name: /Date and time/
    });
    const spinButtons = canvas.getAllByRole('spinbutton');
    const timeZone = group.querySelector('[data-breeze-time-zone]');
    const groupGeometry = group.getBoundingClientRect();
    const inputGeometry = spinButtons[0]?.parentElement?.getBoundingClientRect();
    const firstSegmentGeometry = spinButtons[0]?.getBoundingClientRect();
    const lastSegmentGeometry = timeZone?.getBoundingClientRect();
    const triggerGeometry = trigger.getBoundingClientRect();
    if (inputGeometry === undefined || firstSegmentGeometry === undefined || lastSegmentGeometry === undefined) {
      throw new Error('Expected segmented date-time input anatomy.');
    }
    await expect(timeZone).not.toHaveAttribute('role');
    await expect(timeZone).not.toHaveAttribute('tabindex');
    await expect(groupGeometry.right).toBeLessThanOrEqual(host.getBoundingClientRect().right + COMPACT_TOLERANCE);
    await expect(firstSegmentGeometry.left).toBeGreaterThanOrEqual(inputGeometry.left - COMPACT_TOLERANCE);
    await expect(lastSegmentGeometry.right).toBeLessThanOrEqual(inputGeometry.right + COMPACT_TOLERANCE);
    await expect(inputGeometry.right).toBeLessThanOrEqual(triggerGeometry.left + COMPACT_TOLERANCE);
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const calendarSurface = body.getByText('Select time').closest<HTMLElement>('[data-breeze-date-time-calendar]');
    const popover = calendarSurface?.closest<HTMLElement>('[data-placement]');
    const popoverTimeInput = calendarSurface?.querySelector<HTMLElement>('[data-type="hour"]')?.parentElement;
    if (calendarSurface === null || calendarSurface === undefined || popover === null || popover === undefined || popoverTimeInput === null || popoverTimeInput === undefined) {
      throw new Error('Expected the complete narrow date-time surface.');
    }
    await expect(popover.scrollWidth).toBeLessThanOrEqual(popover.clientWidth);
    await expect(popoverTimeInput.getBoundingClientRect().left).toBeGreaterThanOrEqual(popover.getBoundingClientRect().left + COMPACT_TOLERANCE);
    await expect(popoverTimeInput.getBoundingClientRect().right).toBeLessThanOrEqual(popover.getBoundingClientRect().right - COMPACT_TOLERANCE);
    const compactMinute = within(popoverTimeInput).getByRole('spinbutton', {
      name: /minute/i
    });
    await userEvent.click(compactMinute);
    await userEvent.keyboard('{ArrowUp}');
    await expect(compactMinute).toHaveTextContent('31');
  },
  render: () => <StoryConstraint size="responsive-narrow" testId="narrow-date-time-host">
      <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
        <Parts />
      </DateTimePicker.Root>
    </StoryConstraint>
}`,...K.parameters?.docs?.source},description:{story:`Constrains the complete explicit-offset field and popup to a narrow surface,
verifying segmented input, timezone text, trigger, and time controls remain
usable.

@summary narrow explicit-offset picker geometry`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const readOnlyTrigger = within(canvasElement).getAllByRole('button', {
      name: /Calendar Date and time/
    })[1];
    const readOnlyGroup = readOnlyTrigger?.parentElement;
    await expect(readOnlyGroup).toHaveClass('group-data-[readonly]/picker-field:opacity-70');
    await expect(readOnlyTrigger).not.toHaveClass('opacity-70');
  },
  render: () => <Stack gap="md">
      <Controlled />
      <DateTimePicker.Root readOnly value="2026-07-13T13:30:00+01:00">
        <Parts />
      </DateTimePicker.Root>
    </Stack>
}`,...q.parameters?.docs?.source},description:{story:`Compares mutable application-owned instant state with an immutable
explicit-offset value and verifies compound read-only styling stays
coherent.

@summary controlled and read-only instant values`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <BreezeProvider locale="en-GB" timeZone="Europe/London">
      <DateTimePicker.Root defaultValue="2026-03-29T00:30:00+00:00">
        <Parts />
      </DateTimePicker.Root>
    </BreezeProvider>
}`,...J.parameters?.docs?.source},description:{story:`Displays an explicit-offset instant through the Europe/London provider zone
at the daylight-saving boundary, keeping transport value and localized
display concerns separate.

@summary provider timezone at a daylight-saving boundary`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: /Calendar Date and time/
    }));
    const timeLabel = within(canvasElement.ownerDocument.body).getByText('Select time');
    const timeInput = timeLabel.parentElement?.querySelector('[role="spinbutton"]')?.parentElement;
    await expect(timeInput).toHaveAttribute('data-invalid');
  },
  render: () => <DateTimePicker.Root form="booking" invalid maxValue="2026-07-31T23:59:00+01:00" minValue="2026-07-01T00:00:00+01:00" name="dateTime" required>
      <Parts />
      <DateTimePicker.Description>
        Explicit-offset instant.
      </DateTimePicker.Description>
      <DateTimePicker.Error>Select a valid instant.</DateTimePicker.Error>
    </DateTimePicker.Root>
}`,...Y.parameters?.docs?.source},description:{story:`Combines native form naming, required invalid feedback, and explicit-offset
minimum and maximum instants across both inline and popup time fields.

@summary bounded invalid instant with form integration`,...Y.parameters?.docs?.description}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00" disabled>
      <Parts />
    </DateTimePicker.Root>
}`,...X.parameters?.docs?.source},description:{story:`Shows a populated explicit-offset picker in its disabled state so localized
date, time, and timezone content remain visible without accepting
interaction.

@summary disabled populated date-time picker`,...X.parameters?.docs?.description}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: /Date and time/
    });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const timeLabel = body.getByText('Select time');
    const timeField = timeLabel.parentElement;
    const popover = body.getByRole('dialog');
    const application = body.getByRole('application');
    const previous = within(application).getByRole('button', {
      name: 'Previous'
    });
    const next = within(application).getAllByRole('button', {
      name: 'Next'
    })[0];
    const rightToLeftRoot = canvasElement.querySelector('[dir="rtl"]');
    await expect(rightToLeftRoot).toBeVisible();
    await expect(timeField).toHaveTextContent('Select time');
    await expect(popover).toHaveAttribute('dir', 'rtl');
    await expect(popover).toHaveAccessibleName('Select date and time');
    await expect(application).toBeVisible();
    await expect(previous.querySelector('svg')).toHaveClass('lucide-arrow-left', 'rtl:rotate-180');
    await expect(next?.querySelector('svg')).toHaveClass('lucide-arrow-right', 'rtl:rotate-180');
    await expect(getComputedStyle(previous.querySelector('svg') as SVGElement).rotate).toBe('180deg');
    await expect(getComputedStyle(next?.querySelector('svg') as SVGElement).rotate).toBe('180deg');
    await expect(previous.getBoundingClientRect().left).toBeGreaterThan(next?.getBoundingClientRect().left ?? Number.POSITIVE_INFINITY);
  },
  render: () => <BreezeProvider direction="rtl" locale="en-GB" timeZone="Europe/London">
      <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
        <Parts />
      </DateTimePicker.Root>
    </BreezeProvider>
}`,...Z.parameters?.docs?.source},description:{story:`Runs the full English date-time popup in explicit right-to-left direction
and verifies dialog direction, accessible naming, and mirrored month
navigation.

@summary right-to-left date-time popup and navigation`,...Z.parameters?.docs?.description}}};try{U.displayName=`Root`,U.__docgenInfo={description:`Coordinates explicit-offset instants with provider-zone display and behavior.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Label, segmented input, trigger, calendar popup, and guidance.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Prevents focus and editing.`,name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`boolean | undefined`}},form:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`External native form id.`,name:`form`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Exposes invalid state.`,name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`boolean | undefined`}},maxValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Latest selectable explicit-offset ISO instant.`,name:`maxValue`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},minValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Earliest selectable explicit-offset ISO instant.`,name:`minValue`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Native form field name.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`string | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Marks the picker as required.`,name:`required`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`}],description:`Ref to the rendered picker root.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Current controlled explicit-offset instant.
Current immutable explicit-offset instant.
Excluded when uncontrolled.`,name:`value`,required:!1,tags:{},type:{name:`string | null | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Called with the next explicit-offset instant.
Excluded because read-only pickers cannot change.`,name:`onChange`,required:!1,tags:{},type:{name:`((value: string | null) => void) | ((value: string | null) => void) | undefined`}},defaultValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Excluded when controlled.
Initial uncontrolled explicit-offset instant.`,name:`defaultValue`,required:!1,tags:{},type:{name:`string | null | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/DateTimePicker/DateTimePicker.tsx`,name:`TypeLiteral`}],description:`Mutable controlled pickers cannot be read-only.
Prevents changes.
Uncontrolled state cannot be read-only.`,name:`readOnly`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{G.displayName=`ExplicitOffset`,G.__docgenInfo={description:`Edits an explicit-offset instant through inline segments and the complete
calendar-plus-time popup while keeping the timezone suffix informative and
unfocusable.`,displayName:`ExplicitOffset`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`explicit-offset date and time selection`}}}catch{}try{K.displayName=`NarrowExplicitOffset`,K.__docgenInfo={description:`Constrains the complete explicit-offset field and popup to a narrow surface,
verifying segmented input, timezone text, trigger, and time controls remain
usable.`,displayName:`NarrowExplicitOffset`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`narrow explicit-offset picker geometry`}}}catch{}try{q.displayName=`ControlledAndReadOnly`,q.__docgenInfo={description:`Compares mutable application-owned instant state with an immutable
explicit-offset value and verifies compound read-only styling stays
coherent.`,displayName:`ControlledAndReadOnly`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`controlled and read-only instant values`}}}catch{}try{J.displayName=`TimeZoneAndDst`,J.__docgenInfo={description:`Displays an explicit-offset instant through the Europe/London provider zone
at the daylight-saving boundary, keeping transport value and localized
display concerns separate.`,displayName:`TimeZoneAndDst`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`provider timezone at a daylight-saving boundary`}}}catch{}try{Y.displayName=`BoundariesInvalidForm`,Y.__docgenInfo={description:`Combines native form naming, required invalid feedback, and explicit-offset
minimum and maximum instants across both inline and popup time fields.`,displayName:`BoundariesInvalidForm`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`bounded invalid instant with form integration`}}}catch{}try{X.displayName=`Disabled`,X.__docgenInfo={description:`Shows a populated explicit-offset picker in its disabled state so localized
date, time, and timezone content remain visible without accepting
interaction.`,displayName:`Disabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`disabled populated date-time picker`}}}catch{}try{Z.displayName=`RightToLeft`,Z.__docgenInfo={description:`Runs the full English date-time popup in explicit right-to-left direction
and verifies dialog direction, accessible naming, and mirrored month
navigation.`,displayName:`RightToLeft`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DateTimePicker/DateTimePicker.stories.tsx`,methods:[],props:{},tags:{summary:`right-to-left date-time popup and navigation`}}}catch{}Q=[`ExplicitOffset`,`NarrowExplicitOffset`,`ControlledAndReadOnly`,`TimeZoneAndDst`,`BoundariesInvalidForm`,`Disabled`,`RightToLeft`]}));$();export{Y as BoundariesInvalidForm,q as ControlledAndReadOnly,X as Disabled,G as ExplicitOffset,K as NarrowExplicitOffset,Z as RightToLeft,J as TimeZoneAndDst,Q as __namedExportsOrder,U as default,$ as n,me as t};