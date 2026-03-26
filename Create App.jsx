src/App.jsx
import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
  LayoutDashboard, Users, ShoppingCart, Package, Truck, DollarSign,
  UserCheck, Shield, History, Bell, Search, Plus, Download, Filter,
  ChevronRight, ChevronDown, AlertTriangle, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Building2, Globe, Phone, Mail, Calendar, Clock, Star, Tag,
  Barcode, FileText, RefreshCw, Eye, Edit, Trash2, Send,
  Warehouse, CreditCard, PieChart as PieIcon, Activity,
  UserPlus, Briefcase, MapPin, Hash, Zap, Lock, Info,
  Receipt, ClipboardList, Layers, Box, BarChart2, Banknote
} from 'lucide-react';

/* ── Fonts ── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body,#root{font-family:'Instrument Sans',system-ui,sans-serif;background:#f0f2f5;}
    .mono{font-family:'DM Mono',monospace!important;}
    @keyframes fadein{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .fi{animation:fadein .3s ease both;}
    .pulse{animation:pulse 2.4s ease-in-out infinite;}
    .ticker-scroll{animation:ticker 35s linear infinite;display:inline-block;white-space:nowrap;}
    ::-webkit-scrollbar{width:3px;height:3px;}
    ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px;}
    .tr:hover>td{background:#f8fafc!important;}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;}
    .clickable:hover{background:#f8fafc;cursor:pointer;}
  `}</style>
);

/* ══════════════════════════════════════════════
   ENTERPRISE DATA MODEL — Normalized, Relational
   ══════════════════════════════════════════════ */

/* ── Reference Tables ── */
const CURRENCIES = ['USD','EUR','GBP','AED','SGD'];
const COUNTRIES  = ['United States','Germany','United Kingdom','UAE','Singapore','India','Japan'];

/* ── Accounts (unified: Customer / Supplier / Vendor) ── */
const ACCOUNTS = [
  {id:'ACC-001',name:'MedPharm Solutions',  type:'Customer', industry:'Healthcare',  country:'US', tier:'Enterprise',revenue:2850000,status:'Active',  credit:500000,ar:124500,contact:'Sarah Chen',     email:'s.chen@medpharm.com',    phone:'+1-415-555-0101',since:'2019-03-12',rating:4.8,tags:['Key Account','Pharma']},
  {id:'ACC-002',name:'BioMed Global',        type:'Supplier', industry:'Manufacturing',country:'DE', tier:'Tier-1',   spend:1200000, ap:87300, contact:'Klaus Mayer',    email:'k.mayer@biomed.de',      phone:'+49-89-555-0202',since:'2020-06-01',rating:4.5,tags:['Cold Chain','Certified']},
  {id:'ACC-003',name:'VitaLabs Inc.',         type:'Supplier', industry:'Manufacturing',country:'US', tier:'Tier-1',   spend:850000,  ap:43200, contact:'Tom Reeves',     email:'t.reeves@vitalabs.com',  phone:'+1-312-555-0303',since:'2018-11-20',rating:4.7,tags:['OTC','Approved']},
  {id:'ACC-004',name:'CityHealth Network',   type:'Customer', industry:'Healthcare',  country:'UK', tier:'Mid-Market',revenue:980000, ar:56700, contact:'Emma Walsh',     email:'e.walsh@cityhealth.co.uk',phone:'+44-20-555-0404',since:'2021-02-14',rating:4.2,tags:['NHS Partner']},
  {id:'ACC-005',name:'LogiFreight Ltd.',      type:'Vendor',   industry:'Logistics',   country:'SG', tier:'Tier-2',   spend:340000,  ap:18900, contact:'Raj Patel',      email:'r.patel@logifreight.sg', phone:'+65-6555-0505',since:'2022-04-08',rating:3.9,tags:['3PL','Cold Chain']},
  {id:'ACC-006',name:'Alpine Clinics Group', type:'Customer', industry:'Healthcare',  country:'US', tier:'Mid-Market',revenue:1450000,ar:89200, contact:'Dr. M. Torres',  email:'m.torres@alpineclinics.com',phone:'+1-720-555-0606',since:'2020-09-15',rating:4.6,tags:['Chronic Care','Key Account']},
  {id:'ACC-007',name:'MediTrans Logistics',  type:'Vendor',   industry:'Logistics',   country:'US', tier:'Tier-2',   spend:210000,  ap:12400, contact:'Dana Ellis',     email:'d.ellis@meditrans.com',  phone:'+1-800-555-0707',since:'2023-01-20',rating:3.7,tags:['Distribution']},
  {id:'ACC-008',name:'GlobalRx Imports',     type:'Customer', industry:'Wholesale',   country:'AE', tier:'Enterprise',revenue:3200000,ar:210000,contact:'Amir Khalil',   email:'a.khalil@globalrx.ae',   phone:'+971-4-555-0808',since:'2018-07-30',rating:4.9,tags:['Export','Key Account']},
];

/* ── Contacts (linked to Accounts) ── */
const CONTACTS = [
  {id:'CON-001',acct:'ACC-001',name:'Sarah Chen',     title:'VP Procurement',    email:'s.chen@medpharm.com',    phone:'+1-415-555-0101',last:'2024-05-20',status:'Active'},
  {id:'CON-002',acct:'ACC-001',name:'David Liu',      title:'Supply Chain Dir',  email:'d.liu@medpharm.com',     phone:'+1-415-555-0109',last:'2024-05-10',status:'Active'},
  {id:'CON-003',acct:'ACC-004',name:'Emma Walsh',     title:'Head of Ops',       email:'e.walsh@cityhealth.co.uk',phone:'+44-20-555-0404',last:'2024-05-18',status:'Active'},
  {id:'CON-004',acct:'ACC-006',name:'Dr. M. Torres',  title:'Chief Medical Off', email:'m.torres@alpineclinics.com',phone:'+1-720-555-0606',last:'2024-05-21',status:'Active'},
  {id:'CON-005',acct:'ACC-008',name:'Amir Khalil',    title:'CEO',               email:'a.khalil@globalrx.ae',   phone:'+971-4-555-0808',last:'2024-05-22',status:'Active'},
];

/* ── Leads / Opportunities ── */
const LEADS = [
  {id:'OPP-001',name:'MedPharm Q3 Expansion',   acct:'ACC-001',stage:'Closed Won', value:420000, prob:100,owner:'Alex R.',  close:'2024-06-30',activity:'Contract signed'},
  {id:'OPP-002',name:'Alpine Clinics Annual RFP',acct:'ACC-006',stage:'Negotiation',value:280000, prob:75, owner:'Maya K.', close:'2024-07-15',activity:'Final terms review'},
  {id:'OPP-003',name:'GlobalRx Supply Renewal',  acct:'ACC-008',stage:'Proposal',   value:950000, prob:60, owner:'Chris M.',close:'2024-08-01',activity:'Proposal submitted'},
  {id:'OPP-004',name:'CityHealth Cold Chain',    acct:'ACC-004',stage:'Discovery',  value:190000, prob:30, owner:'Alex R.', close:'2024-09-01',activity:'Needs assessment'},
  {id:'OPP-005',name:'New Prospect — PharmEx',   acct:null,      stage:'Lead',      value:120000, prob:10, owner:'Maya K.', close:'2024-10-01',activity:'Initial contact'},
];

/* ── Sales Orders ── */
const ORDERS = [
  {id:'SO-4421',acct:'ACC-001',date:'2024-05-18',due:'2024-06-01',items:3,total:84500, status:'Processing', paid:false, inv:'INV-7731'},
  {id:'SO-4420',acct:'ACC-008',date:'2024-05-15',due:'2024-05-30',items:8,total:312000,status:'Shipped',    paid:true,  inv:'INV-7730'},
  {id:'SO-4419',acct:'ACC-006',date:'2024-05-12',due:'2024-05-26',items:2,total:46800, status:'Delivered',  paid:true,  inv:'INV-7729'},
  {id:'SO-4418',acct:'ACC-004',date:'2024-05-10',due:'2024-05-24',items:5,total:128400,status:'Invoiced',   paid:false, inv:'INV-7728'},
  {id:'SO-4417',acct:'ACC-001',date:'2024-05-08',due:'2024-05-22',items:4,total:67200, status:'Delivered',  paid:true,  inv:'INV-7727'},
  {id:'SO-4416',acct:'ACC-008',date:'2024-05-05',due:'2024-05-19',items:6,total:224000,status:'Delivered',  paid:true,  inv:'INV-7726'},
];

/* ── Purchase Orders ── */
const POS = [
  {id:'PO-1891',acct:'ACC-002',date:'2024-05-20',due:'2024-06-10',items:4,total:98400, status:'Pending Approval',approved:false},
  {id:'PO-1890',acct:'ACC-003',date:'2024-05-18',due:'2024-06-05',items:2,total:43200, status:'Approved',          approved:true},
  {id:'PO-1889',acct:'ACC-002',date:'2024-05-14',due:'2024-05-30',items:6,total:187500,status:'In Transit',         approved:true},
  {id:'PO-1888',acct:'ACC-005',date:'2024-05-10',due:'2024-05-24',items:1,total:28600, status:'Received',           approved:true},
  {id:'PO-1887',acct:'ACC-003',date:'2024-05-08',due:'2024-05-22',items:3,total:71000, status:'Received',           approved:true},
];

/* ── Products / SKUs ── */
const PRODUCTS = [
  {id:'SKU-099',name:'Vitamin D3 Complex 2000IU', cat:'OTC',       cost:12.40,price:24.99,stock:142,rop:50, uom:'Unit',gtin:'00614141999011',status:'Active'},
  {id:'SKU-102',name:'Insulin Pen G2 (3mL U-100)',cat:'Rx-Cold',   cost:54.00,price:89.00,stock:18, rop:30, uom:'Unit',gtin:'00614142000129',status:'Active'},
  {id:'SKU-107',name:'Metformin HCl 500mg 100ct', cat:'Rx',        cost:9.80, price:18.50,stock:387,rop:80, uom:'Pack',gtin:'00614141999288',status:'Active'},
  {id:'SKU-201',name:'Oxycodone HCl 10mg 30ct',   cat:'Rx-CII',    cost:28.00,price:42.00,stock:47, rop:20, uom:'Pack',gtin:'00614142000342',status:'Active'},
  {id:'SKU-305',name:'Gloves Nitrile M (Box/100)', cat:'Supplies',  cost:8.20, price:15.00,stock:890,rop:200,uom:'Box', gtin:'00614141999505',status:'Active'},
  {id:'SKU-306',name:'Surgical Mask N95 (50ct)',   cat:'Supplies',  cost:14.00,price:28.00,stock:312,rop:100,uom:'Box', gtin:'00614141999506',status:'Active'},
  {id:'SKU-SV1',name:'Clinical Consultation',      cat:'Service',   cost:80.00,price:150.0,stock:null,rop:null,uom:'Session',gtin:null,      status:'Active'},
  {id:'SKU-SV2',name:'Annual Wellness Visit',      cat:'Service',   cost:60.00,price:120.0,stock:null,rop:null,uom:'Session',gtin:null,      status:'Active'},
];

/* ── Invoices ── */
const INVOICES = [
  {id:'INV-7731',acct:'ACC-001',so:'SO-4421',date:'2024-05-18',due:'2024-06-17',amount:84500, status:'Unpaid',  days:0},
  {id:'INV-7730',acct:'ACC-008',so:'SO-4420',date:'2024-05-15',due:'2024-06-14',amount:312000,status:'Paid',    days:0},
  {id:'INV-7729',acct:'ACC-006',so:'SO-4419',date:'2024-05-12',due:'2024-06-11',amount:46800, status:'Paid',    days:0},
  {id:'INV-7728',acct:'ACC-004',so:'SO-4418',date:'2024-05-10',due:'2024-06-09',amount:128400,status:'Overdue', days:18},
  {id:'INV-7727',acct:'ACC-001',so:'SO-4417',date:'2024-05-08',due:'2024-06-07',amount:67200, status:'Paid',    days:0},
];

/* ── Employees ── */
const EMPLOYEES = [
  {id:'EMP-001',name:'Alexandra Reed',  dept:'Sales',       title:'VP Sales',           loc:'New York',  salary:145000,status:'Active',since:'2019-01-15',reports:8},
  {id:'EMP-002',name:'Marcus Johnson',  dept:'Finance',     title:'CFO',                loc:'New York',  salary:180000,status:'Active',since:'2018-06-01',reports:6},
  {id:'EMP-003',name:'Priya Sharma',    dept:'Procurement', title:'Procurement Director',loc:'Chicago',   salary:125000,status:'Active',since:'2020-03-20',reports:5},
  {id:'EMP-004',name:'Tom Berger',      dept:'Logistics',   title:'Logistics Manager',  loc:'Dallas',    salary:98000, status:'Active',since:'2021-07-08',reports:4},
  {id:'EMP-005',name:'Maya Kowalski',   dept:'Sales',       title:'Senior AE',          loc:'New York',  salary:95000, status:'Active',since:'2021-11-01',reports:0},
  {id:'EMP-006',name:'Chris Mendez',    dept:'Sales',       title:'Account Executive',  loc:'Miami',     salary:82000, status:'Active',since:'2022-04-15',reports:0},
  {id:'EMP-007',name:'Sarah Lin',       dept:'Compliance',  title:'Compliance Officer', loc:'New York',  salary:115000,status:'Active',since:'2020-08-10',reports:2},
  {id:'EMP-008',name:'James Park',      dept:'IT',          title:'Systems Administrator',loc:'Remote',  salary:105000,status:'Active',since:'2021-02-28',reports:1},
  {id:'EMP-009',name:'Nina Patel',      dept:'HR',          title:'HR Manager',         loc:'Chicago',   salary:92000, status:'On Leave',since:'2022-06-01',reports:2},
  {id:'EMP-010',name:'David Osei',      dept:'Finance',     title:'Senior Accountant',  loc:'New York',  salary:88000, status:'Active',since:'2022-09-15',reports:0},
];

/* ── Finance: AR Aging / AP Aging ── */
const AR_AGING = [
  {bucket:'Current',     amount:480000},
  {bucket:'1-30 days',  amount:128400},
  {bucket:'31-60 days', amount:84500},
  {bucket:'61-90 days', amount:46800},
  {bucket:'90+ days',   amount:22000},
];
const AP_AGING = [
  {bucket:'Current',     amount:143200},
  {bucket:'1-30 days',  amount:87300},
  {bucket:'31-60 days', amount:43200},
  {bucket:'61-90 days', amount:18900},
  {bucket:'90+ days',   amount:6400},
];

/* ── Revenue & cost data ── */
const MONTHLY = [
  {m:'Nov',rev:820000,cogs:492000,gp:328000,orders:38},{m:'Dec',rev:1240000,cogs:744000,gp:496000,orders:61},
  {m:'Jan',rev:740000,cogs:444000,gp:296000,orders:32},{m:'Feb',rev:890000,cogs:534000,gp:356000,orders:41},
  {m:'Mar',rev:1080000,cogs:648000,gp:432000,orders:52},{m:'Apr',rev:960000,cogs:576000,gp:384000,orders:45},
  {m:'May',rev:1120000,cogs:672000,gp:448000,orders:54},
];

const PIPELINE_STAGES = [
  {stage:'Lead',count:12,value:1440000},
  {stage:'Discovery',count:8,value:1020000},
  {stage:'Proposal',count:5,value:2180000},
  {stage:'Negotiation',count:3,value:980000},
  {stage:'Closed Won',count:14,value:3840000},
];

/* ── Audit Log ── */
const AUDIT = [
  {id:'LOG-001',ts:'2024-05-22T09:12:00Z',module:'Sales',      action:'ORDER_CREATED',   user:'Alex R.',    ref:'SO-4421',note:'Sales order created for MedPharm Solutions'},
  {id:'LOG-002',ts:'2024-05-22T08:44:00Z',module:'Finance',    action:'INVOICE_OVERDUE', user:'SYSTEM',     ref:'INV-7728',note:'Invoice overdue 18 days — CityHealth Network'},
  {id:'LOG-003',ts:'2024-05-21T15:30:00Z',module:'Procurement',action:'PO_APPROVED',     user:'Priya S.',   ref:'PO-1890',note:'PO approved — VitaLabs Inc. $43,200'},
  {id:'LOG-004',ts:'2024-05-21T14:05:00Z',module:'Compliance', action:'DISPENSE',        user:'NPI-987654', ref:'DISP-002',note:'Rx dispensed — Oxycodone SU-OX-001, DEA verified'},
  {id:'LOG-005',ts:'2024-05-21T11:20:00Z',module:'CRM',        action:'OPP_UPDATED',     user:'Maya K.',    ref:'OPP-003',note:'GlobalRx Supply Renewal moved to Proposal'},
  {id:'LOG-006',ts:'2024-05-20T16:45:00Z',module:'Inventory',  action:'STOCK_ALERT',     user:'SYSTEM',     ref:'SKU-102',note:'Insulin Pen G2 stock 18 — below reorder point 30'},
  {id:'LOG-007',ts:'2024-05-20T14:33:00Z',module:'Compliance', action:'AUDIT_SCAN',      user:'Sarah L.',   ref:'BCH-991',note:'Cold chain batch integrity updated to UNDER_REVIEW'},
  {id:'LOG-008',ts:'2024-05-20T10:00:00Z',module:'HR',         action:'EMPLOYEE_UPDATE', user:'Nina P.',    ref:'EMP-009',note:'Employee EMP-009 status changed to On Leave'},
  {id:'LOG-009',ts:'2024-05-19T09:00:00Z',module:'Finance',    action:'PAYMENT_RECEIVED',user:'David O.',   ref:'INV-7730',note:'Payment $312,000 received — GlobalRx Imports'},
  {id:'LOG-010',ts:'2024-05-19T02:14:00Z',module:'Compliance', action:'COLD_CHAIN_EXCURSION',user:'SYSTEM',ref:'SU-IP-013',note:'Temp excursion: 9.4°C for 22 min — unit SU-IP-013'},
];

/* ═══════════════════════════
   DESIGN TOKENS
   ═══════════════════════════ */
const C = {
  sb:'#07090f',sbBorder:'#141c2e',sbText:'#64748b',sbHov:'#0f1629',
  accent:'#0ea5e9',accentD:'#0284c7',
  bg:'#f0f2f5',surface:'#ffffff',
  border:'#e2e8f0',borderMid:'#cbd5e1',
  t1:'#0f172a',t2:'#475569',t3:'#94a3b8',
  green:'#059669',greenL:'#f0fdf4',greenB:'#bbf7d0',
  amber:'#d97706',amberL:'#fffbeb',amberB:'#fde68a',
  red:'#dc2626',redL:'#fef2f2',redB:'#fecaca',
  blue:'#0ea5e9',blueL:'#f0f9ff',blueB:'#bae6fd',
  purple:'#7c3aed',purpleL:'#f5f3ff',purpleB:'#ddd6fe',
  sky:'#0284c7',
};

/* ═══════════════════════════
   HELPERS
   ═══════════════════════════ */
const fmt = {
  usd: v => v == null ? 'N/A' : '$'+Number(v).toLocaleString('en-US',{minimumFractionDigits:0}),
  date: d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—',
  ts:   d => d ? new Date(d).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—',
  pct:  v => v+'%',
};
const accountName = id => ACCOUNTS.find(a=>a.id===id)?.name || '—';
const stageColor = s => ({
  'Lead':{'bg':'#f8fafc','tx':C.t3,'br':C.border},
  'Discovery':{'bg':C.blueL,'tx':C.blue,'br':C.blueB},
  'Proposal':{'bg':'#fdf4ff','tx':'#a21caf','br':'#f0abfc'},
  'Negotiation':{'bg':C.amberL,'tx':C.amber,'br':C.amberB},
  'Closed Won':{'bg':C.greenL,'tx':C.green,'br':C.greenB},
  'Closed Lost':{'bg':C.redL,'tx':C.red,'br':C.redB},
}[s]||{'bg':'#f8fafc','tx':C.t2,'br':C.border});
const orderStatusColor = s => ({
  'Processing':{bg:C.blueL,tx:C.blue,br:C.blueB},
  'Shipped':{bg:'#fdf4ff',tx:'#a21caf',br:'#f0abfc'},
  'Delivered':{bg:C.greenL,tx:C.green,br:C.greenB},
  'Invoiced':{bg:C.amberL,tx:C.amber,br:C.amberB},
  'Cancelled':{bg:C.redL,tx:C.red,br:C.redB},
}[s]||{bg:'#f8fafc',tx:C.t2,br:C.border});
const invStatusColor = s => ({
  'Paid':{bg:C.greenL,tx:C.green,br:C.greenB},
  'Unpaid':{bg:C.amberL,tx:C.amber,br:C.amberB},
  'Overdue':{bg:C.redL,tx:C.red,br:C.redB},
}[s]||{bg:'#f8fafc',tx:C.t2,br:C.border});

/* ═══════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════ */
const Chip = ({children,bg='#f8fafc',tx=C.t2,br=C.border,dot}) => (
  <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:9,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',background:bg,color:tx,border:`1px solid ${br}`,padding:'2px 9px',borderRadius:20}}>
    {dot&&<span style={{width:5,height:5,borderRadius:'50%',background:dot,display:'inline-block'}}/>}{children}
  </span>
);
const Btn = ({children,ic:Icon,solid,danger,small,onClick}) => (
  <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:5,padding:small?'6px 12px':'8px 16px',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer',border:'1px solid',transition:'all .15s',fontFamily:'inherit',
    background:solid?C.accent:danger?C.red:'#fff',color:solid||danger?'#fff':C.t2,
    borderColor:solid?C.accent:danger?C.red:C.border,boxShadow:solid?'0 2px 8px #0ea5e922':danger?'0 2px 8px #dc262622':'none'}}>
    {Icon&&<Icon size={12}/>}{children}
  </button>
);
const Hdr = ({title,sub,right}) => (
  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20}}>
    <div><h2 style={{fontSize:18,fontWeight:700,color:C.t1,letterSpacing:'-.02em'}}>{title}</h2>{sub&&<p style={{fontSize:10,color:C.t3,textTransform:'uppercase',letterSpacing:'.08em',fontWeight:600,marginTop:3}}>{sub}</p>}</div>
    {right&&<div style={{display:'flex',gap:8,alignItems:'center'}}>{right}</div>}
  </div>
);
const KPI = ({ic:Icon,label,value,sub,color,trend,trendUp}) => (
  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 20px'}}>
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
      <div style={{background:`${color}18`,borderRadius:8,padding:7}}><Icon size={16} color={color}/></div>
      {trend!=null&&<div style={{display:'flex',alignItems:'center',gap:3,fontSize:10,fontWeight:700,color:trendUp?C.green:C.red}}>
        {trendUp?<TrendingUp size={9}/>:<TrendingDown size={9}/>}{trend}%
      </div>}
    </div>
    <div style={{fontSize:24,fontWeight:700,color:C.t1,lineHeight:1,marginBottom:3,fontFamily:'DM Mono,monospace'}}>{value}</div>
    <div style={{fontSize:12,fontWeight:600,color:C.t2}}>{label}</div>
    {sub&&<div style={{fontSize:10,color:C.t3,marginTop:2}}>{sub}</div>}
  </div>
);
const CT = ({active,payload,label,pre='',suf=''}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:C.t1,border:'1px solid #1e293b',borderRadius:8,padding:'8px 12px',fontSize:11}}>
    <p style={{color:C.t3,marginBottom:4,fontWeight:600}}>{label}</p>
    {payload.map((p,i)=><p key={i} style={{color:p.color||'#fff',margin:'2px 0',fontWeight:600}}>{p.name}: {pre}{typeof p.value==='number'?p.value.toLocaleString():p.value}{suf}</p>)}
  </div>;
};
const THead = ({cols}) => (
  <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
    {cols.map(c=><th key={c} style={{padding:'9px 14px',fontSize:9,fontWeight:700,color:C.t3,textTransform:'uppercase',letterSpacing:'.08em',textAlign:'left',whiteSpace:'nowrap'}}>{c}</th>)}
  </tr></thead>
);
const TTable = ({cols,children,style}) => (
  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden',...style}}>
    <table style={{width:'100%',borderCollapse:'collapse'}}><THead cols={cols}/><tbody>{children}</tbody></table>
  </div>
);
const TD = ({children,mono,right,style}) => (
  <td style={{padding:'11px 14px',fontSize:12,color:mono?C.t2:C.t1,fontFamily:mono?'DM Mono,monospace':'inherit',textAlign:right?'right':'left',...style}}>{children}</td>
);

/* ═══════════════════════════
   MODULE 1 — EXECUTIVE DASHBOARD
   ═══════════════════════════ */
const Dashboard = () => {
  const totalRev = MONTHLY.reduce((a,m)=>a+m.rev,0);
  const totalOrders = ORDERS.length;
  const openAR = AR_AGING.reduce((a,x)=>a+x.amount,0);
  const openAP = AP_AGING.reduce((a,x)=>a+x.amount,0);
  const overdueInv = INVOICES.filter(i=>i.status==='Overdue');
  const lowStock = PRODUCTS.filter(p=>p.stock!=null&&p.rop!=null&&p.stock<=p.rop);
  const pipelineValue = LEADS.reduce((a,l)=>a+(l.value*(l.prob/100)),0);

  return <div className="fi">
    {/* Alert banner */}
    {(overdueInv.length>0||lowStock.length>0)&&<div style={{background:C.amberL,border:`1px solid ${C.amberB}`,borderRadius:10,padding:'10px 18px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
      <AlertTriangle size={14} color={C.amber}/>
      <span style={{fontSize:12,fontWeight:600,color:'#92400e'}}>{overdueInv.length} overdue invoice{overdueInv.length!==1?'s':''} totalling {fmt.usd(overdueInv.reduce((a,i)=>a+i.amount,0))}</span>
      <span style={{color:C.amberB}}>·</span>
      <span style={{fontSize:12,fontWeight:600,color:'#92400e'}}>{lowStock.length} SKU{lowStock.length!==1?'s':''} below reorder point</span>
    </div>}

    {/* KPIs */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      <KPI ic={DollarSign}  label="YTD Revenue"       value={fmt.usd(totalRev)}        color={C.green}  sub="7-month period"          trend={14}  trendUp/>
      <KPI ic={ShoppingCart}label="Open Orders"        value={ORDERS.filter(o=>o.status!=='Delivered').length} color={C.blue} sub={`${totalOrders} total orders`} trend={8} trendUp/>
      <KPI ic={Receipt}     label="Accounts Receivable"value={fmt.usd(openAR)}          color={C.amber}  sub={`${overdueInv.length} overdue`} trend={5} trendUp={false}/>
      <KPI ic={CreditCard}  label="Weighted Pipeline"  value={fmt.usd(pipelineValue)}   color={C.purple} sub={`${LEADS.length} opportunities`} trend={22} trendUp/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      <KPI ic={Users}       label="Active Accounts"    value={ACCOUNTS.filter(a=>a.status==='Active').length} color={C.sky} sub="Customers + suppliers" trend={6} trendUp/>
      <KPI ic={Package}     label="Total SKUs"          value={PRODUCTS.length}          color='#8b5cf6' sub={`${lowStock.length} low stock`}    trend={3} trendUp/>
      <KPI ic={Truck}       label="Accounts Payable"   value={fmt.usd(openAP)}          color={C.red}   sub="All supplier AP"         trend={2} trendUp={false}/>
      <KPI ic={UserCheck}   label="Headcount"           value={EMPLOYEES.filter(e=>e.status==='Active').length} color='#0d9488' sub="Active employees" trend={0} trendUp/>
    </div>

    {/* Charts */}
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
          <div><p style={{fontSize:11,color:C.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:2}}>Revenue & Gross Profit</p><p style={{fontSize:13,fontWeight:700,color:C.t1}}>7-Month Performance</p></div>
          <div style={{display:'flex',gap:12,fontSize:10,fontWeight:600,color:C.t2}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:10,height:2,background:C.accent,borderRadius:2,display:'inline-block'}}/> Revenue</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:10,height:2,background:C.green,borderRadius:2,display:'inline-block'}}/> Gross Profit</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MONTHLY} margin={{top:0,right:0,left:-10,bottom:0}}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={.12}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient>
              <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.12}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="m" tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false} tickFormatter={v=>'$'+(v/1000)+'k'}/>
            <Area type="monotone" dataKey="rev" stroke={C.accent} strokeWidth={2} fill="url(#rg)" dot={false} name="Revenue"/>
            <Area type="monotone" dataKey="gp"  stroke={C.green}  strokeWidth={2} fill="url(#gg)" dot={false} name="Gross Profit"/>
            <Tooltip content={<CT pre="$"/>}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pipeline funnel */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
        <p style={{fontSize:11,color:C.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:2}}>Sales Pipeline</p>
        <p style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:14}}>By Stage</p>
        {PIPELINE_STAGES.map((s,i)=>{
          const maxW = Math.max(...PIPELINE_STAGES.map(x=>x.value));
          const w = (s.value/maxW)*100;
          const c = [C.t3,C.blue,'#a21caf',C.amber,C.green][i];
          return <div key={s.stage} style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:10,fontWeight:600,color:C.t2}}>{s.stage}</span>
              <span style={{fontSize:10,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace'}}>{fmt.usd(s.value)}</span>
            </div>
            <div style={{height:5,background:'#f1f5f9',borderRadius:3}}>
              <div style={{height:5,width:`${w}%`,background:c,borderRadius:3,transition:'width .6s'}}/>
            </div>
          </div>;
        })}
      </div>
    </div>

    {/* Bottom row */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
      {/* Recent orders */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1}}>Recent Orders</p>
          <Btn small ic={ArrowUpRight}>View All</Btn>
        </div>
        {ORDERS.slice(0,4).map(o=>{
          const sc=orderStatusColor(o.status);
          return <div key={o.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
            <div><p style={{fontSize:11,fontWeight:600,color:C.t1}}>{o.id}</p><p style={{fontSize:10,color:C.t3}}>{accountName(o.acct)}</p></div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:11,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace'}}>{fmt.usd(o.total)}</p>
              <Chip bg={sc.bg} tx={sc.tx} br={sc.br}>{o.status}</Chip>
            </div>
          </div>;
        })}
      </div>

      {/* AR Aging */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px'}}>
        <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:12}}>AR Aging</p>
        {AR_AGING.map((a,i)=>{
          const col=[C.green,C.blue,C.amber,C.red,'#be123c'][i];
          const total=AR_AGING.reduce((s,x)=>s+x.amount,0);
          return <div key={a.bucket} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <span style={{fontSize:10,color:C.t2,fontWeight:500,width:80,flexShrink:0}}>{a.bucket}</span>
            <div style={{flex:1,height:4,background:'#f1f5f9',borderRadius:3}}>
              <div style={{height:4,width:`${(a.amount/total)*100}%`,background:col,borderRadius:3}}/>
            </div>
            <span style={{fontSize:10,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',width:70,textAlign:'right'}}>{fmt.usd(a.amount)}</span>
          </div>;
        })}
      </div>

      {/* Recent audit */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px'}}>
        <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:12}}>Recent Activity</p>
        {AUDIT.slice(0,5).map(log=>{
          const mc={Sales:C.blue,Finance:C.green,Procurement:C.purple,Compliance:C.amber,CRM:'#0d9488',Inventory:C.red,HR:C.sky}[log.module]||C.t3;
          return <div key={log.id} style={{display:'flex',gap:8,marginBottom:9,paddingBottom:9,borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:mc,marginTop:4,flexShrink:0}}/>
            <div>
              <p style={{fontSize:11,fontWeight:600,color:C.t1,lineHeight:1.3}}>{log.note.slice(0,52)}{log.note.length>52?'…':''}</p>
              <p style={{fontSize:9,color:C.t3,marginTop:2,fontFamily:'DM Mono,monospace'}}>{fmt.ts(log.ts)} · {log.module}</p>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
};

/* ═══════════════════════════
   MODULE 2 — CRM
   ═══════════════════════════ */
const CRMModule = () => {
  const [view,setView]=useState('accounts');
  const [q,setQ]=useState('');
  const [sel,setSel]=useState(null);
  const [typeFilter,setTypeFilter]=useState('All');
  const filtered = ACCOUNTS.filter(a=>(typeFilter==='All'||a.type===typeFilter)&&(a.name.toLowerCase().includes(q.toLowerCase())||a.id.includes(q)));
  const sa = sel?ACCOUNTS.find(a=>a.id===sel):null;
  const saContacts = sa?CONTACTS.filter(c=>c.acct===sa.id):[];
  const saOpps = sa?LEADS.filter(l=>l.acct===sa.id):[];

  const typeCol={Customer:{bg:C.blueL,tx:C.blue,br:C.blueB},Supplier:{bg:C.greenL,tx:C.green,br:C.greenB},Vendor:{bg:C.amberL,tx:C.amber,br:C.amberB}};

  return <div className="fi">
    <Hdr title="CRM — Accounts & Relationships" sub="Customers · Suppliers · Vendors · Contacts · Opportunities"
      right={[<Btn key="n" ic={UserPlus} solid small>New Account</Btn>]}/>

    {/* View tabs */}
    <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:`1px solid ${C.border}`,paddingBottom:0}}>
      {['accounts','opportunities','contacts'].map(v=>(
        <button key={v} onClick={()=>setView(v)} style={{padding:'8px 16px',fontSize:11,fontWeight:600,textTransform:'capitalize',border:'none',background:'none',cursor:'pointer',color:view===v?C.accent:C.t3,borderBottom:`2px solid ${view===v?C.accent:'transparent'}`,transition:'all .15s',fontFamily:'inherit'}}>{v}</button>
      ))}
    </div>

    {view==='accounts'&&<>
      <div style={{display:'flex',gap:8,marginBottom:14}}>
        <div style={{position:'relative',flex:1}}>
          <Search size={12} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%',paddingLeft:30,paddingRight:12,paddingTop:7,paddingBottom:7,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,outline:'none',color:C.t1,fontFamily:'inherit'}} placeholder="Search accounts…"/>
        </div>
        {['All','Customer','Supplier','Vendor'].map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)} style={{padding:'6px 13px',borderRadius:20,fontSize:10,fontWeight:700,border:'1px solid',cursor:'pointer',transition:'all .15s',background:typeFilter===t?C.accent:'#fff',color:typeFilter===t?'#fff':C.t2,borderColor:typeFilter===t?C.accent:C.border}}>{t}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:sa?'1fr 360px':'1fr',gap:16}}>
        <TTable cols={['Account','Type','Industry','Country','Revenue/Spend','AR/AP','Rating','Status']}>
          {filtered.map(a=>{
            const tc=typeCol[a.type]||{bg:'#f8fafc',tx:C.t2,br:C.border};
            const isA=sel===a.id;
            return <tr key={a.id} className="tr clickable" onClick={()=>setSel(isA?null:a.id)}
              style={{borderBottom:`1px solid ${C.border}`,background:isA?C.blueL:''}}>
              <TD><div style={{display:'flex',alignItems:'center',gap:9}}>
                <div style={{width:32,height:32,borderRadius:9,background:tc.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:tc.tx,flexShrink:0}}>{a.name[0]}</div>
                <div><p style={{fontSize:12,fontWeight:600,color:C.t1}}>{a.name}</p><p style={{fontSize:9,color:C.t3,fontFamily:'DM Mono,monospace'}}>{a.id}</p></div>
              </div></TD>
              <TD><Chip bg={tc.bg} tx={tc.tx} br={tc.br}>{a.type}</Chip></TD>
              <TD style={{color:C.t2,fontSize:11}}>{a.industry}</TD>
              <TD style={{color:C.t2,fontSize:11}}>{a.country}</TD>
              <TD mono style={{fontWeight:700}}>{fmt.usd(a.revenue||a.spend)}</TD>
              <TD mono style={{fontSize:11,color:a.type==='Customer'?C.blue:C.amber}}>{fmt.usd(a.ar||a.ap)}</TD>
              <TD><div style={{display:'flex',alignItems:'center',gap:3}}><Star size={10} color="#f59e0b" fill="#f59e0b"/><span style={{fontSize:11,fontWeight:700}}>{a.rating}</span></div></TD>
              <TD><Chip bg={C.greenL} tx={C.green} br={C.greenB} dot={C.green}>{a.status}</Chip></TD>
            </tr>;
          })}
        </TTable>

        {sa&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden',alignSelf:'start'}}>
          <div style={{padding:'16px 18px',borderBottom:`1px solid ${C.border}`,background:`linear-gradient(135deg,${(typeCol[sa.type]||{bg:'#f8fafc'}).bg},transparent)`}}>
            <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
              <div style={{width:40,height:40,borderRadius:10,background:(typeCol[sa.type]||{bg:C.border}).bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:(typeCol[sa.type]||{tx:C.t2}).tx}}>{sa.name[0]}</div>
              <div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:C.t1}}>{sa.name}</p><p style={{fontSize:9,color:C.t3,fontFamily:'DM Mono,monospace'}}>{sa.id}</p></div>
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              <Chip bg={(typeCol[sa.type]||{bg:'#f8fafc'}).bg} tx={(typeCol[sa.type]||{tx:C.t2}).tx} br={(typeCol[sa.type]||{br:C.border}).br}>{sa.type}</Chip>
              {sa.tags?.map(t=><Chip key={t}>{t}</Chip>)}
            </div>
          </div>
          <div style={{padding:'14px 18px'}}>
            {[['Industry',sa.industry],['Country',sa.country],['Tier',sa.tier],['Member Since',fmt.date(sa.since)],['Primary Contact',sa.contact],['Email',sa.email],['Phone',sa.phone],[sa.type==='Customer'?'Lifetime Revenue':'Total Spend',fmt.usd(sa.revenue||sa.spend)],[sa.type==='Customer'?'Open AR':'Open AP',fmt.usd(sa.ar||sa.ap)]].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:10,fontWeight:700,color:C.t3,textTransform:'uppercase',letterSpacing:'.06em'}}>{l}</span>
                <span style={{fontSize:11,fontWeight:600,color:C.t1,maxWidth:180,textAlign:'right'}}>{v}</span>
              </div>
            ))}
          </div>
          {saOpps.length>0&&<div style={{padding:'12px 18px',borderTop:`1px solid ${C.border}`}}>
            <p style={{fontSize:10,fontWeight:700,color:C.t3,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Opportunities</p>
            {saOpps.map(o=>{const sc=stageColor(o.stage);return <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <span style={{fontSize:11,color:C.t1,fontWeight:600,flex:1}}>{o.name.slice(0,28)}…</span>
              <Chip bg={sc.bg} tx={sc.tx} br={sc.br}>{o.stage}</Chip>
            </div>;})}
          </div>}
          {saContacts.length>0&&<div style={{padding:'12px 18px',borderTop:`1px solid ${C.border}`}}>
            <p style={{fontSize:10,fontWeight:700,color:C.t3,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Contacts</p>
            {saContacts.map(c=><div key={c.id} style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <div><p style={{fontSize:11,fontWeight:600,color:C.t1}}>{c.name}</p><p style={{fontSize:10,color:C.t3}}>{c.title}</p></div>
              <p style={{fontSize:10,color:C.blue,fontFamily:'DM Mono,monospace'}}>{c.email}</p>
            </div>)}
          </div>}
        </div>}
      </div>
    </>}

    {view==='opportunities'&&<>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
        {PIPELINE_STAGES.map((s,i)=>{
          const c=[C.t3,C.blue,'#a21caf',C.amber,C.green][i];
          const opps=LEADS.filter(l=>l.stage===s.stage);
          return <div key={s.stage} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
            <div style={{padding:'10px 14px',borderBottom:`1px solid ${C.border}`,background:`${c}10`}}>
              <p style={{fontSize:10,fontWeight:700,color:c,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.stage}</p>
              <p style={{fontSize:11,color:C.t2,fontWeight:600,marginTop:2}}>{fmt.usd(s.value)} · {s.count} deals</p>
            </div>
            <div style={{padding:'10px 10px',display:'flex',flexDirection:'column',gap:8}}>
              {opps.map(o=><div key={o.id} style={{background:'#f8fafc',border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 12px'}}>
                <p style={{fontSize:11,fontWeight:600,color:C.t1,marginBottom:3}}>{o.name}</p>
                <p style={{fontSize:10,color:C.t3}}>{accountName(o.acct)||'New Prospect'}</p>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
                  <span style={{fontSize:10,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace'}}>{fmt.usd(o.value)}</span>
                  <span style={{fontSize:10,color:C.t3}}>{o.prob}%</span>
                </div>
              </div>)}
            </div>
          </div>;
        })}
      </div>
    </>}

    {view==='contacts'&&<TTable cols={['Contact','Account','Title','Email','Phone','Last Activity','Status']}>
      {CONTACTS.map(c=><tr key={c.id} className="tr" style={{borderBottom:`1px solid ${C.border}`}}>
        <TD><div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:C.blueL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.blue}}>{c.name[0]}</div>
          <span style={{fontSize:12,fontWeight:600,color:C.t1}}>{c.name}</span>
        </div></TD>
        <TD style={{color:C.t2,fontSize:11}}>{accountName(c.acct)}</TD>
        <TD style={{color:C.t2,fontSize:11}}>{c.title}</TD>
        <TD mono style={{fontSize:10,color:C.blue}}>{c.email}</TD>
        <TD mono style={{fontSize:10}}>{c.phone}</TD>
        <TD style={{fontSize:11,color:C.t3}}>{fmt.date(c.last)}</TD>
        <TD><Chip bg={C.greenL} tx={C.green} br={C.greenB} dot={C.green}>{c.status}</Chip></TD>
      </tr>)}
    </TTable>}
  </div>;
};

/* ═══════════════════════════
   MODULE 3 — SALES
   ═══════════════════════════ */
const SalesModule = () => {
  const [view,setView]=useState('orders');
  return <div className="fi">
    <Hdr title="Sales Management" sub="Orders · Invoices · Quotes · Revenue"
      right={[<Btn key="n" ic={Plus} solid small>New Order</Btn>]}/>
    <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
      {['orders','invoices'].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:'8px 16px',fontSize:11,fontWeight:600,textTransform:'capitalize',border:'none',background:'none',cursor:'pointer',color:view===v?C.accent:C.t3,borderBottom:`2px solid ${view===v?C.accent:'transparent'}`,fontFamily:'inherit'}}>{v}</button>)}
    </div>
    {/* Summary KPIs */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      {[
        {l:'Total Orders',v:ORDERS.length,c:C.blue},
        {l:'Order Value (MTD)',v:fmt.usd(ORDERS.reduce((a,o)=>a+o.total,0)),c:C.green},
        {l:'Paid Invoices',v:INVOICES.filter(i=>i.status==='Paid').length,c:C.green},
        {l:'Overdue',v:INVOICES.filter(i=>i.status==='Overdue').length,c:C.red},
      ].map(s=><div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
        <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:3}}>{s.v}</p>
        <p style={{fontSize:11,fontWeight:600,color:C.t2}}>{s.l}</p>
      </div>)}
    </div>
    {view==='orders'&&<TTable cols={['Order ID','Account','Date','Due Date','Items','Total','Status','Invoice','']}>
      {ORDERS.map(o=>{const sc=orderStatusColor(o.status);return <tr key={o.id} className="tr" style={{borderBottom:`1px solid ${C.border}`}}>
        <TD mono style={{color:C.blue,fontWeight:600,fontSize:11}}>{o.id}</TD>
        <TD style={{fontWeight:600,fontSize:12}}>{accountName(o.acct)}</TD>
        <TD style={{color:C.t2,fontSize:11}}>{fmt.date(o.date)}</TD>
        <TD style={{color:C.t2,fontSize:11}}>{fmt.date(o.due)}</TD>
        <TD style={{color:C.t2,textAlign:'center'}}>{o.items}</TD>
        <TD mono style={{fontWeight:700}}>{fmt.usd(o.total)}</TD>
        <TD><Chip bg={sc.bg} tx={sc.tx} br={sc.br}>{o.status}</Chip></TD>
        <TD mono style={{fontSize:10,color:C.purple}}>{o.inv}</TD>
        <TD><div style={{display:'flex',gap:4}}><Btn small ic={Eye}>View</Btn></div></TD>
      </tr>;})}
    </TTable>}
    {view==='invoices'&&<TTable cols={['Invoice','Account','Sales Order','Date','Due','Amount','Status','Overdue Days','']}>
      {INVOICES.map(i=>{const ic=invStatusColor(i.status);return <tr key={i.id} className="tr" style={{borderBottom:`1px solid ${C.border}`,background:i.status==='Overdue'?'#fff5f5':''}}>
        <TD mono style={{color:C.blue,fontWeight:600,fontSize:11}}>{i.id}</TD>
        <TD style={{fontWeight:600,fontSize:12}}>{accountName(i.acct)}</TD>
        <TD mono style={{fontSize:10,color:C.t3}}>{i.so}</TD>
        <TD style={{color:C.t2,fontSize:11}}>{fmt.date(i.date)}</TD>
        <TD style={{color:i.status==='Overdue'?C.red:C.t2,fontSize:11,fontWeight:i.status==='Overdue'?700:400}}>{fmt.date(i.due)}</TD>
        <TD mono style={{fontWeight:700}}>{fmt.usd(i.amount)}</TD>
        <TD><Chip bg={ic.bg} tx={ic.tx} br={ic.br}>{i.status}</Chip></TD>
        <TD style={{color:i.days>0?C.red:C.t3,fontWeight:i.days>0?700:400,textAlign:'center'}}>{i.days>0?`${i.days}d`:'—'}</TD>
        <TD><div style={{display:'flex',gap:4}}><Btn small ic={Send}>Send</Btn></div></TD>
      </tr>;})}
    </TTable>}
  </div>;
};

/* ═══════════════════════════
   MODULE 4 — PROCUREMENT
   ═══════════════════════════ */
const ProcurementModule = () => {
  const [view,setView]=useState('pos');
  const suppliers = ACCOUNTS.filter(a=>a.type==='Supplier'||a.type==='Vendor');
  return <div className="fi">
    <Hdr title="Procurement" sub="Purchase Orders · Suppliers · Vendor Management"
      right={[<Btn key="n" ic={Plus} solid small>New PO</Btn>]}/>
    <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
      {['pos','suppliers'].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:'8px 16px',fontSize:11,fontWeight:600,textTransform:'capitalize',border:'none',background:'none',cursor:'pointer',color:view===v?C.accent:C.t3,borderBottom:`2px solid ${view===v?C.accent:'transparent'}`,fontFamily:'inherit'}}>{v==='pos'?'Purchase Orders':'Suppliers & Vendors'}</button>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      {[
        {l:'Open POs',v:POS.filter(p=>p.status!=='Received').length,c:C.blue},
        {l:'Pending Approval',v:POS.filter(p=>!p.approved).length,c:C.amber},
        {l:'Total AP (Open)',v:fmt.usd(ACCOUNTS.filter(a=>a.ap).reduce((s,a)=>s+a.ap,0)),c:C.red},
        {l:'Approved Suppliers',v:suppliers.filter(s=>s.status==='Active').length,c:C.green},
      ].map(s=><div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
        <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:3}}>{s.v}</p>
        <p style={{fontSize:11,fontWeight:600,color:C.t2}}>{s.l}</p>
      </div>)}
    </div>
    {view==='pos'&&<TTable cols={['PO Number','Supplier','Date','Due Date','Items','Total','Status','Approved','']}>
      {POS.map(p=>{
        const sc={
          'Pending Approval':{bg:C.amberL,tx:C.amber,br:C.amberB},
          'Approved':{bg:C.blueL,tx:C.blue,br:C.blueB},
          'In Transit':{bg:'#fdf4ff',tx:'#a21caf',br:'#f0abfc'},
          'Received':{bg:C.greenL,tx:C.green,br:C.greenB},
        }[p.status]||{bg:'#f8fafc',tx:C.t2,br:C.border};
        return <tr key={p.id} className="tr" style={{borderBottom:`1px solid ${C.border}`,background:!p.approved?'#fffbeb':''}}>
          <TD mono style={{color:C.purple,fontWeight:600,fontSize:11}}>{p.id}</TD>
          <TD style={{fontWeight:600,fontSize:12}}>{accountName(p.acct)}</TD>
          <TD style={{color:C.t2,fontSize:11}}>{fmt.date(p.date)}</TD>
          <TD style={{color:C.t2,fontSize:11}}>{fmt.date(p.due)}</TD>
          <TD style={{color:C.t2,textAlign:'center'}}>{p.items}</TD>
          <TD mono style={{fontWeight:700}}>{fmt.usd(p.total)}</TD>
          <TD><Chip bg={sc.bg} tx={sc.tx} br={sc.br}>{p.status}</Chip></TD>
          <TD>{p.approved?<CheckCircle2 size={14} color={C.green}/>:<XCircle size={14} color={C.amber}/>}</TD>
          <TD><div style={{display:'flex',gap:4}}>{!p.approved&&<Btn small ic={CheckCircle2} solid>Approve</Btn>}<Btn small ic={Eye}>View</Btn></div></TD>
        </tr>;
      })}
    </TTable>}
    {view==='suppliers'&&<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
      {suppliers.map(s=>{
        const tc={Supplier:{bg:C.greenL,tx:C.green,br:C.greenB},Vendor:{bg:C.amberL,tx:C.amber,br:C.amberB}}[s.type]||{bg:'#f8fafc',tx:C.t2,br:C.border};
        return <div key={s.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
            <div style={{background:tc.bg,borderRadius:9,padding:7}}><Building2 size={16} color={tc.tx}/></div>
            <Chip bg={tc.bg} tx={tc.tx} br={tc.br}>{s.type}</Chip>
          </div>
          <p style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:3}}>{s.name}</p>
          <p style={{fontSize:10,color:C.t3,marginBottom:12}}>{s.industry} · {s.country}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[['Tier',s.tier],['Total Spend',fmt.usd(s.spend)],['Open AP',fmt.usd(s.ap)],['Rating',s.rating+'★']].map(([l,v])=>(
              <div key={l}><p style={{fontSize:8,color:C.t3,fontWeight:700,textTransform:'uppercase',margin:'0 0 1px'}}>{l}</p><p style={{fontSize:11,fontWeight:600,color:C.t1}}>{v}</p></div>
            ))}
          </div>
          <div style={{marginTop:10,display:'flex',gap:6}}>
            {s.tags?.map(t=><Chip key={t}>{t}</Chip>)}
          </div>
        </div>;
      })}
    </div>}
  </div>;
};

/* ═══════════════════════════
   MODULE 5 — INVENTORY
   ═══════════════════════════ */
const InventoryModule = () => {
  const [catFilter,setCatFilter]=useState('All');
  const cats=['All',...new Set(PRODUCTS.map(p=>p.cat))];
  const list=catFilter==='All'?PRODUCTS:PRODUCTS.filter(p=>p.cat===catFilter);
  const catCol={OTC:{bg:C.blueL,tx:C.blue,br:C.blueB},'Rx-Cold':{bg:C.purpleL,tx:C.purple,br:C.purpleB},Rx:{bg:C.greenL,tx:C.green,br:C.greenB},'Rx-CII':{bg:C.redL,tx:C.red,br:C.redB},Supplies:{bg:C.amberL,tx:C.amber,br:C.amberB},Service:{bg:'#f0fdf4',tx:'#0d9488',br:'#99f6e4'}};

  return <div className="fi">
    <Hdr title="Inventory Management" sub="SKUs · Stock Levels · Reorder Points · Product Catalogue"
      right={[<Btn key="n" ic={Plus} solid small>Add SKU</Btn>,<Btn key="e" ic={Download} small>Export</Btn>]}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      {[
        {l:'Total SKUs',v:PRODUCTS.length,c:C.blue},
        {l:'Low Stock Alerts',v:PRODUCTS.filter(p=>p.stock!=null&&p.rop!=null&&p.stock<=p.rop).length,c:C.red},
        {l:'Inventory Value',v:fmt.usd(PRODUCTS.filter(p=>p.stock).reduce((a,p)=>a+(p.cost*p.stock),0)),c:C.green},
        {l:'Avg Margin',v:Math.round(PRODUCTS.filter(p=>p.stock).reduce((a,p)=>a+((p.price-p.cost)/p.price*100),0)/PRODUCTS.filter(p=>p.stock).length)+'%',c:C.purple},
      ].map(s=><div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
        <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:3}}>{s.v}</p>
        <p style={{fontSize:11,fontWeight:600,color:C.t2}}>{s.l}</p>
      </div>)}
    </div>
    <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
      {cats.map(c=><button key={c} onClick={()=>setCatFilter(c)} style={{padding:'5px 13px',borderRadius:20,fontSize:10,fontWeight:700,border:'1px solid',cursor:'pointer',background:catFilter===c?C.accent:'#fff',color:catFilter===c?'#fff':C.t2,borderColor:catFilter===c?C.accent:C.border}}>{c}</button>)}
    </div>
    <TTable cols={['SKU','Product','Category','Cost','Price','Margin','Stock','Reorder Pt','Stock Level','Status']}>
      {list.map(p=>{
        const cc=catCol[p.cat]||{bg:'#f8fafc',tx:C.t2,br:C.border};
        const margin=Math.round((p.price-p.cost)/p.price*100);
        const stockPct = p.stock!=null&&p.rop!=null ? Math.min(100,(p.stock/Math.max(p.rop*2,p.stock))*100) : null;
        const isLow = p.stock!=null&&p.rop!=null&&p.stock<=p.rop;
        return <tr key={p.id} className="tr" style={{borderBottom:`1px solid ${C.border}`,background:isLow?C.redL+'80':''}}>
          <TD mono style={{fontSize:10,color:C.t3}}>{p.id}</TD>
          <TD><div>
            <p style={{fontSize:12,fontWeight:600,color:C.t1}}>{p.name}</p>
            {p.gtin&&<p style={{fontSize:9,color:C.t3,fontFamily:'DM Mono,monospace'}}>GTIN: {p.gtin}</p>}
          </div></TD>
          <TD><Chip bg={cc.bg} tx={cc.tx} br={cc.br}>{p.cat}</Chip></TD>
          <TD mono style={{fontSize:11}}>{fmt.usd(p.cost)}</TD>
          <TD mono style={{fontSize:11,fontWeight:700}}>{fmt.usd(p.price)}</TD>
          <TD><span style={{fontSize:11,fontWeight:700,color:margin>=40?C.green:margin>=25?C.amber:C.red}}>{margin}%</span></TD>
          <TD mono style={{fontWeight:700,color:isLow?C.red:C.t1}}>{p.stock??'∞'}</TD>
          <TD mono style={{fontSize:11,color:C.t3}}>{p.rop??'—'}</TD>
          <TD style={{minWidth:100}}>
            {stockPct!=null&&<div>
              <div style={{height:4,background:'#f1f5f9',borderRadius:3}}>
                <div style={{height:4,width:`${stockPct}%`,background:isLow?C.red:stockPct<50?C.amber:C.green,borderRadius:3,transition:'width .5s'}}/>
              </div>
              {isLow&&<p style={{fontSize:9,color:C.red,fontWeight:700,marginTop:2}}>Below ROP</p>}
            </div>}
          </TD>
          <TD><Chip bg={C.greenL} tx={C.green} br={C.greenB}>{p.status}</Chip></TD>
        </tr>;
      })}
    </TTable>
  </div>;
};

/* ═══════════════════════════
   MODULE 6 — FINANCE
   ═══════════════════════════ */
const FinanceModule = () => {
  const [view,setView]=useState('overview');
  const totalRev = MONTHLY.reduce((a,m)=>a+m.rev,0);
  const totalCOGS = MONTHLY.reduce((a,m)=>a+m.cogs,0);
  const totalGP = totalRev-totalCOGS;
  const gpPct = Math.round((totalGP/totalRev)*100);
  const totalAR = AR_AGING.reduce((a,x)=>a+x.amount,0);
  const totalAP = AP_AGING.reduce((a,x)=>a+x.amount,0);

  return <div className="fi">
    <Hdr title="Finance & Accounting" sub="P&L · AR/AP · Cash Flow · Aging Reports"
      right={[<Btn key="e" ic={Download} small>Export</Btn>]}/>
    <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
      {['overview','ar','ap'].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:'8px 16px',fontSize:11,fontWeight:600,border:'none',background:'none',cursor:'pointer',color:view===v?C.accent:C.t3,borderBottom:`2px solid ${view===v?C.accent:'transparent'}`,fontFamily:'inherit',textTransform:'capitalize'}}>{v==='ar'?'Accounts Receivable':v==='ap'?'Accounts Payable':'P&L Overview'}</button>)}
    </div>

    {view==='overview'&&<>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[{l:'YTD Revenue',v:fmt.usd(totalRev),c:C.green},{l:'COGS',v:fmt.usd(totalCOGS),c:C.red},{l:'Gross Profit',v:fmt.usd(totalGP),c:C.blue},{l:'GP Margin',v:gpPct+'%',c:C.purple}].map(s=>(
          <div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
            <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:3}}>{s.v}</p>
            <p style={{fontSize:11,fontWeight:600,color:C.t2}}>{s.l}</p>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:14}}>Revenue vs COGS vs Gross Profit</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY} margin={{top:0,right:0,left:-10,bottom:0}} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false} tickFormatter={v=>'$'+(v/1000)+'k'}/>
              <Bar dataKey="rev"  fill={C.accent} radius={[3,3,0,0]} name="Revenue" barSize={14}/>
              <Bar dataKey="cogs" fill={C.red+'80'} radius={[3,3,0,0]} name="COGS" barSize={14}/>
              <Bar dataKey="gp"   fill={C.green} radius={[3,3,0,0]} name="Gross Profit" barSize={14}/>
              <Tooltip content={<CT pre="$"/>}/>
              <Legend wrapperStyle={{fontSize:10}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:14}}>AR vs AP Position</p>
          {[{l:'Total AR',v:totalAR,c:C.blue},{l:'Total AP',v:totalAP,c:C.red},{l:'Net Working Capital',v:totalAR-totalAP,c:totalAR-totalAP>=0?C.green:C.red},{l:'Current Ratio',v:((totalAR/totalAP)).toFixed(2)+'x',c:C.purple}].map(s=>(
            <div key={s.l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:11,color:C.t2,fontWeight:500}}>{s.l}</span>
              <span style={{fontSize:13,fontWeight:700,color:s.c,fontFamily:'DM Mono,monospace'}}>{typeof s.v==='number'?fmt.usd(s.v):s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </>}

    {view==='ar'&&<>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:14}}>AR Aging Breakdown</p>
          {AR_AGING.map((a,i)=>{
            const col=[C.green,C.blue,C.amber,C.red,'#be123c'][i];
            const total=AR_AGING.reduce((s,x)=>s+x.amount,0);
            return <div key={a.bucket} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:11,color:C.t2,fontWeight:500}}>{a.bucket}</span>
                <span style={{fontSize:11,fontWeight:700,color:col,fontFamily:'DM Mono,monospace'}}>{fmt.usd(a.amount)}</span>
              </div>
              <div style={{height:5,background:'#f1f5f9',borderRadius:3}}>
                <div style={{height:5,width:`${(a.amount/total)*100}%`,background:col,borderRadius:3}}/>
              </div>
            </div>;
          })}
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:4}}>Open Invoices</p>
          <p style={{fontSize:11,color:C.t3,marginBottom:14}}>{fmt.usd(INVOICES.filter(i=>i.status!=='Paid').reduce((a,i)=>a+i.amount,0))} outstanding</p>
          {INVOICES.filter(i=>i.status!=='Paid').map(inv=>{
            const ic=invStatusColor(inv.status);
            return <div key={inv.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
              <div><p style={{fontSize:11,fontWeight:600,color:C.t1}}>{inv.id}</p><p style={{fontSize:10,color:C.t3}}>{accountName(inv.acct)}</p></div>
              <div style={{textAlign:'right'}}>
                <p style={{fontSize:12,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace'}}>{fmt.usd(inv.amount)}</p>
                <Chip bg={ic.bg} tx={ic.tx} br={ic.br}>{inv.status}{inv.days>0?` +${inv.days}d`:''}</Chip>
              </div>
            </div>;
          })}
        </div>
      </div>
    </>}

    {view==='ap'&&<>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:14}}>AP Aging Breakdown</p>
          {AP_AGING.map((a,i)=>{
            const col=[C.green,C.blue,C.amber,C.red,'#be123c'][i];
            const total=AP_AGING.reduce((s,x)=>s+x.amount,0);
            return <div key={a.bucket} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:11,color:C.t2,fontWeight:500}}>{a.bucket}</span>
                <span style={{fontSize:11,fontWeight:700,color:col,fontFamily:'DM Mono,monospace'}}>{fmt.usd(a.amount)}</span>
              </div>
              <div style={{height:5,background:'#f1f5f9',borderRadius:3}}>
                <div style={{height:5,width:`${(a.amount/total)*100}%`,background:col,borderRadius:3}}/>
              </div>
            </div>;
          })}
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:14}}>AP by Supplier</p>
          {ACCOUNTS.filter(a=>a.ap>0).sort((a,b)=>b.ap-a.ap).map(a=>(
            <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
              <div><p style={{fontSize:11,fontWeight:600,color:C.t1}}>{a.name}</p><p style={{fontSize:10,color:C.t3}}>{a.tier}</p></div>
              <span style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:'DM Mono,monospace'}}>{fmt.usd(a.ap)}</span>
            </div>
          ))}
        </div>
      </div>
    </>}
  </div>;
};

/* ═══════════════════════════
   MODULE 7 — HR
   ═══════════════════════════ */
const HRModule = () => {
  const [q,setQ]=useState('');
  const depts=[...new Set(EMPLOYEES.map(e=>e.dept))];
  const filtered=EMPLOYEES.filter(e=>e.name.toLowerCase().includes(q.toLowerCase())||e.dept.toLowerCase().includes(q.toLowerCase()));
  const deptC={Sales:C.blue,Finance:C.green,Procurement:C.purple,Logistics:C.amber,Compliance:C.red,IT:'#0d9488',HR:C.sky};

  return <div className="fi">
    <Hdr title="People & HR" sub="Employee Directory · Departments · Headcount · Payroll"
      right={[<Btn key="n" ic={UserPlus} solid small>New Employee</Btn>]}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      {[
        {l:'Total Headcount',v:EMPLOYEES.length,c:C.blue},
        {l:'Active',v:EMPLOYEES.filter(e=>e.status==='Active').length,c:C.green},
        {l:'Departments',v:depts.length,c:C.purple},
        {l:'Est. Annual Payroll',v:fmt.usd(EMPLOYEES.reduce((a,e)=>a+e.salary,0)),c:C.amber},
      ].map(s=><div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
        <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:3}}>{s.v}</p>
        <p style={{fontSize:11,fontWeight:600,color:C.t2}}>{s.l}</p>
      </div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:16}}>
      <div>
        <div style={{position:'relative',marginBottom:14}}>
          <Search size={12} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:C.t3}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%',paddingLeft:30,paddingRight:12,paddingTop:7,paddingBottom:7,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,outline:'none',color:C.t1,fontFamily:'inherit'}} placeholder="Search employees…"/>
        </div>
        <TTable cols={['Employee','Department','Title','Location','Salary','Status','Reports To','']}>
          {filtered.map(e=>{
            const c=deptC[e.dept]||C.t3;
            return <tr key={e.id} className="tr" style={{borderBottom:`1px solid ${C.border}`,background:e.status==='On Leave'?'#fffbeb':''}}>
              <TD><div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:30,height:30,borderRadius:8,background:`${c}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:c}}>{e.name.split(' ').map(n=>n[0]).join('')}</div>
                <div><p style={{fontSize:12,fontWeight:600,color:C.t1}}>{e.name}</p><p style={{fontSize:9,color:C.t3,fontFamily:'DM Mono,monospace'}}>{e.id}</p></div>
              </div></TD>
              <TD><Chip bg={`${c}15`} tx={c} br={`${c}40`}>{e.dept}</Chip></TD>
              <TD style={{fontSize:11,color:C.t2}}>{e.title}</TD>
              <TD style={{fontSize:11,color:C.t2}}>{e.loc}</TD>
              <TD mono style={{fontSize:11,fontWeight:600}}>{fmt.usd(e.salary)}</TD>
              <TD><Chip bg={e.status==='Active'?C.greenL:C.amberL} tx={e.status==='Active'?C.green:C.amber} br={e.status==='Active'?C.greenB:C.amberB} dot={e.status==='Active'?C.green:C.amber}>{e.status}</Chip></TD>
              <TD style={{fontSize:11,color:C.t3}}>{e.reports>0?`${e.reports} direct`:'IC'}</TD>
              <TD><Btn small ic={Eye}>View</Btn></TD>
            </tr>;
          })}
        </TTable>
      </div>
      {/* Dept breakdown */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px'}}>
        <p style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:14}}>By Department</p>
        {depts.map(d=>{
          const c=deptC[d]||C.t3;
          const emps=EMPLOYEES.filter(e=>e.dept===d);
          const payroll=emps.reduce((a,e)=>a+e.salary,0);
          return <div key={d} style={{marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:600,color:C.t1}}>{d}</span>
              <span style={{fontSize:10,color:C.t3}}>{emps.length} emp · {fmt.usd(payroll)}</span>
            </div>
            <div style={{height:4,background:'#f1f5f9',borderRadius:3}}>
              <div style={{height:4,width:`${(emps.length/EMPLOYEES.length)*100}%`,background:c,borderRadius:3}}/>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
};

/* ═══════════════════════════
   MODULE 8 — COMPLIANCE (Pharma-grade)
   ═══════════════════════════ */
const ComplianceModule = () => {
  const items = [
    {id:'SKU-099',name:'Vitamin D3 Complex 2000IU',  lot:'L-442-RT',exp:'2025-12-01',stock:142,reg:'FDA-UDI-DI: 00614141999011',ndcema:'NDC: 12345-678-90',          integ:'INTACT',       dscsa:false,cold:false,excursion:false},
    {id:'SKU-102',name:'Insulin Pen G2 (3mL U-100)', lot:'L-991-CL',exp:'2024-08-15',stock:18, reg:'FDA-UDI-DI: 00614142000129',ndcema:'EMA: EMEA/H/C/000441',       integ:'UNDER_REVIEW', dscsa:true,cold:true, excursion:true},
    {id:'SKU-107',name:'Metformin HCl 500mg',         lot:'L-305-MF',exp:'2026-01-20',stock:387,reg:'FDA-UDI-DI: 00614141999288',ndcema:'NDC: 67544-151-01',          integ:'INTACT',       dscsa:true,cold:false,excursion:false},
    {id:'SKU-201',name:'Oxycodone HCl 10mg (CII)',    lot:'L-088-OX',exp:'2025-03-01',stock:47, reg:'FDA-UDI-DI: 00614142000342',ndcema:'NDC: 63481-623-30 · DEA-CII', integ:'INTACT',       dscsa:true,cold:false,excursion:false},
  ];
  const ibx = s=>({
    INTACT:{bg:C.greenL,br:C.greenB,tx:C.green,dot:C.green},
    UNDER_REVIEW:{bg:C.amberL,br:C.amberB,tx:C.amber,dot:C.amber},
    COMPROMISED:{bg:C.redL,br:C.redB,tx:C.red,dot:C.red},
  }[s]||{bg:'#f8fafc',br:C.border,tx:C.t2,dot:C.t3});
  const daysTo=d=>Math.floor((new Date(d)-Date.now())/86400000);

  return <div className="fi">
    <Hdr title="Regulatory Compliance" sub="GS1 GTIN-14 · FDA UDI 21 CFR §830 · DSCSA 21 USC §360eee · EMA MA · HIPAA 21 CFR Part 11"
      right={[<Btn key="e" ic={Download} small>Audit Report</Btn>,<Btn key="b" ic={Barcode} solid small>Scan GS1</Btn>]}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      {[
        {l:'Compliant Batches',v:items.filter(i=>i.integ==='INTACT').length+'/'+items.length,c:C.green},
        {l:'Cold Chain Alerts',v:1,c:C.amber},
        {l:'DSCSA Batches',v:items.filter(i=>i.dscsa).length,c:C.purple},
        {l:'Near Expiry (<90d)',v:items.filter(i=>daysTo(i.exp)<90&&daysTo(i.exp)>=0).length,c:C.red},
      ].map(s=><div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
        <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:3}}>{s.v}</p>
        <p style={{fontSize:11,fontWeight:600,color:C.t2}}>{s.l}</p>
      </div>)}
    </div>
    <div style={{display:'grid',gap:10}}>
      {items.map(item=>{
        const ib=ibx(item.integ);
        const days=daysTo(item.exp);
        const hasAlert=item.excursion;
        return <div key={item.id} style={{background:hasAlert?'#fffdf5':C.surface,border:`1px solid ${hasAlert?C.amberB:C.border}`,borderRadius:12,overflow:'hidden'}}>
          <div style={{padding:'7px 16px',borderBottom:`1px solid ${hasAlert?C.amberB:C.border}`,background:hasAlert?C.amberL:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {hasAlert&&<><AlertTriangle size={11} color={C.amber}/><span style={{fontSize:9,fontWeight:700,color:C.amber,textTransform:'uppercase',letterSpacing:'.06em'}}>Cold Chain Excursion — Unit Under Review</span></>}
              {!hasAlert&&days<90&&<><AlertTriangle size={11} color={C.red}/><span style={{fontSize:9,fontWeight:700,color:C.red,textTransform:'uppercase',letterSpacing:'.06em'}}>{days} days to expiry</span></>}
              {!hasAlert&&days>=90&&<><CheckCircle2 size={11} color={C.green}/><span style={{fontSize:9,fontWeight:700,color:C.green,textTransform:'uppercase',letterSpacing:'.06em'}}>Compliant</span></>}
            </div>
            <div style={{display:'flex',gap:8,fontSize:9,color:C.t3,fontFamily:'DM Mono,monospace'}}><History size={10}/> Lot {item.lot}</div>
          </div>
          <div style={{padding:'14px 16px',display:'grid',gridTemplateColumns:'2fr 2fr 1.5fr 1fr',gap:16,alignItems:'center'}}>
            <div><p style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:3}}>{item.name}</p>
              <p style={{fontSize:9,color:C.t3,fontFamily:'DM Mono,monospace',marginBottom:5}}>{item.id}</p>
              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                {item.cold&&<Chip bg={C.blueL} tx={C.blue} br={C.blueB}>Cold Chain</Chip>}
                {item.dscsa&&<Chip bg={C.purpleL} tx={C.purple} br={C.purpleB}>DSCSA</Chip>}
                {item.id==='SKU-201'&&<Chip bg={C.redL} tx={C.red} br={C.redB}>Schedule II</Chip>}
              </div>
            </div>
            <div>
              <p style={{fontSize:8,fontWeight:700,color:C.t3,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>Regulatory IDs</p>
              <p style={{fontSize:10,fontFamily:'DM Mono,monospace',color:C.t1,fontWeight:600,marginBottom:2}}>{item.reg}</p>
              <p style={{fontSize:10,fontFamily:'DM Mono,monospace',color:C.t2}}>{item.ndcema}</p>
            </div>
            <div>
              <p style={{fontSize:8,fontWeight:700,color:C.t3,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>Batch Info</p>
              {[['Expiry',new Date(item.exp).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})],['Stock',item.stock+' units']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                  <span style={{fontSize:9,color:C.t3,fontWeight:700,textTransform:'uppercase'}}>{l}</span>
                  <span style={{fontSize:10,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace'}}>{v}</span>
                </div>
              ))}
              <div style={{height:3,background:'#e2e8f0',borderRadius:3,marginTop:5}}>
                <div style={{height:3,borderRadius:3,background:item.stock<30?C.red:item.stock<80?C.amber:C.green,width:`${Math.min(100,(item.stock/200)*100)}%`}}/>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:5,padding:'6px 10px',borderRadius:8,border:'1px solid',background:ib.bg,borderColor:ib.br}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:ib.dot,display:'inline-block'}}/>
              <span style={{fontSize:10,fontWeight:700,color:ib.tx}}>{item.integ}</span>
            </div>
          </div>
        </div>;
      })}
    </div>
  </div>;
};

/* ═══════════════════════════
   MODULE 9 — AUDIT LOG
   ═══════════════════════════ */
const AuditModule = () => {
  const [mod,setMod]=useState('All');
  const mods=['All',...new Set(AUDIT.map(l=>l.module))];
  const logs=mod==='All'?AUDIT:AUDIT.filter(l=>l.module===mod);
  const modC={Sales:C.blue,Finance:C.green,Procurement:C.purple,Compliance:C.amber,CRM:'#0d9488',Inventory:C.red,HR:C.sky};
  const actC = a=>({
    ORDER_CREATED:{bg:C.blueL,tx:C.blue,br:C.blueB},
    INVOICE_OVERDUE:{bg:C.redL,tx:C.red,br:C.redB},
    PO_APPROVED:{bg:C.greenL,tx:C.green,br:C.greenB},
    DISPENSE:{bg:C.greenL,tx:C.green,br:C.greenB},
    OPP_UPDATED:{bg:'#fdf4ff',tx:'#a21caf',br:'#f0abfc'},
    STOCK_ALERT:{bg:C.amberL,tx:C.amber,br:C.amberB},
    AUDIT_SCAN:{bg:C.purpleL,tx:C.purple,br:C.purpleB},
    EMPLOYEE_UPDATE:{bg:C.blueL,tx:C.sky,br:'#bae6fd'},
    PAYMENT_RECEIVED:{bg:C.greenL,tx:C.green,br:C.greenB},
    COLD_CHAIN_EXCURSION:{bg:C.amberL,tx:C.amber,br:C.amberB},
  }[a]||{bg:'#f8fafc',tx:C.t2,br:C.border});

  return <div className="fi">
    <Hdr title="System Audit Log" sub="Append-only · Tamper-evident · FDA 21 CFR Part 11 · All modules"
      right={[<Btn key="d" ic={Download} small>Export</Btn>]}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:16}}>
      {[{l:'Total Events',v:AUDIT.length,c:C.blue},{l:'System Events',v:AUDIT.filter(l=>l.user==='SYSTEM').length,c:C.amber},{l:'User Actions',v:AUDIT.filter(l=>l.user!=='SYSTEM').length,c:C.green},{l:'Alerts',v:AUDIT.filter(l=>['INVOICE_OVERDUE','STOCK_ALERT','COLD_CHAIN_EXCURSION'].includes(l.action)).length,c:C.red},{l:'Modules Active',v:new Set(AUDIT.map(l=>l.module)).size,c:C.purple}].map(s=>(
        <div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px'}}>
          <p style={{fontSize:20,fontWeight:700,color:C.t1,fontFamily:'DM Mono,monospace',marginBottom:2}}>{s.v}</p>
          <p style={{fontSize:10,fontWeight:600,color:C.t2}}>{s.l}</p>
        </div>
      ))}
    </div>
    <div style={{display:'flex',gap:5,marginBottom:14,flexWrap:'wrap'}}>
      {mods.map(m=><button key={m} onClick={()=>setMod(m)} style={{padding:'5px 12px',borderRadius:20,fontSize:9,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase',border:'1px solid',cursor:'pointer',background:mod===m?C.accent:'#fff',color:mod===m?'#fff':C.t2,borderColor:mod===m?C.accent:C.border}}>{m}</button>)}
    </div>
    <TTable cols={['Log ID','Timestamp','Module','Action','User','Reference','Event Note']}>
      {[...logs].reverse().map(log=>{
        const ac=actC(log.action);
        const mc=modC[log.module]||C.t3;
        return <tr key={log.id} className="tr" style={{borderBottom:`1px solid ${C.border}`}}>
          <TD mono style={{fontSize:9,color:C.t3}}>{log.id}</TD>
          <TD mono style={{fontSize:9,color:C.t2,whiteSpace:'nowrap'}}>{fmt.ts(log.ts)}</TD>
          <TD><Chip bg={`${mc}15`} tx={mc} br={`${mc}40`}>{log.module}</Chip></TD>
          <TD><Chip bg={ac.bg} tx={ac.tx} br={ac.br}>{log.action.replace(/_/g,' ')}</Chip></TD>
          <TD mono style={{fontSize:10,color:C.t2}}>{log.user}</TD>
          <TD mono style={{fontSize:10,color:C.accent}}>{log.ref}</TD>
          <TD style={{fontSize:11,color:C.t2,maxWidth:280}}>{log.note}</TD>
        </tr>;
      })}
    </TTable>
    <div style={{marginTop:10,padding:'10px 14px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,fontSize:10,color:C.t3,display:'flex',alignItems:'center',gap:7}}>
      <span style={{width:5,height:5,borderRadius:'50%',background:C.green,display:'inline-block'}} className="pulse"/>
      Append-only · PostgreSQL row-level triggers (no UPDATE/DELETE) · Cryptographic hash chain · 21 CFR Part 11 compliant
    </div>
  </div>;
};

/* ═══════════════════════════
   NAVIGATION CONFIG
   ═══════════════════════════ */
const NAV_GROUPS = [
  { label:'Overview',  items:[{id:'dash',    label:'Dashboard',    icon:LayoutDashboard, comp:Dashboard}] },
  { label:'Commercial',items:[
    {id:'crm',       label:'CRM',            icon:Users,           comp:CRMModule},
    {id:'sales',     label:'Sales',          icon:ShoppingCart,    comp:SalesModule},
    {id:'procurement',label:'Procurement',   icon:Truck,           comp:ProcurementModule},
  ]},
  { label:'Operations',items:[
    {id:'inventory', label:'Inventory',      icon:Package,         comp:InventoryModule},
    {id:'finance',   label:'Finance',        icon:Banknote,        comp:FinanceModule},
    {id:'hr',        label:'People & HR',    icon:UserCheck,       comp:HRModule},
  ]},
  { label:'Governance',items:[
    {id:'compliance',label:'Compliance',     icon:Shield,          comp:ComplianceModule},
    {id:'audit',     label:'Audit Log',      icon:History,         comp:AuditModule},
  ]},
];

const TICKER = [
  '📦 SO-4421 processing — MedPharm Solutions — $84,500',
  '⚠ INV-7728 overdue 18 days — CityHealth Network — $128,400',
  '🌡 Cold chain excursion — SU-IP-013 — 9.4°C for 22 min',
  '✓ PO-1890 approved — VitaLabs Inc. — $43,200',
  '📉 SKU-102 below reorder point — 18 units (ROP: 30)',
  '✓ Payment received — GlobalRx Imports — $312,000',
];

/* ═══════════════════════════
   ROOT APPLICATION
   ═══════════════════════════ */
export default function App() {
  const [active, setActive] = useState('dash');
  const allItems = NAV_GROUPS.flatMap(g=>g.items);
  const ActiveComp = allItems.find(n=>n.id===active)?.comp ?? (()=>null);

  const alerts = {
    sales: ORDERS.filter(o=>o.status==='Processing').length,
    compliance: 1,
    finance: INVOICES.filter(i=>i.status==='Overdue').length,
    inventory: PRODUCTS.filter(p=>p.stock!=null&&p.rop!=null&&p.stock<=p.rop).length,
    audit: 0,
    procurement: POS.filter(p=>!p.approved).length,
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',background:C.bg,fontFamily:'Instrument Sans,system-ui,sans-serif'}}>
      <Fonts/>

      {/* ── Sidebar ── */}
      <aside style={{width:216,background:C.sb,display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        {/* Brand */}
        <div style={{padding:'20px 16px 16px',borderBottom:`1px solid ${C.sbBorder}`}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#0ea5e9,#0284c7)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 10px #0ea5e930'}}><Activity size={16} color="#fff"/></div>
            <div>
              <h1 style={{fontSize:15,fontWeight:700,color:'#f1f5f9',margin:0,letterSpacing:'-.02em'}}>Nexus<span style={{color:'#38bdf8'}}>ERP</span></h1>
              <p style={{fontSize:7,color:'#334155',margin:0,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>Enterprise Suite</p>
            </div>
          </div>
        </div>

        {/* Nav groups */}
        <nav style={{flex:1,padding:'12px 10px',overflowY:'auto'}}>
          {NAV_GROUPS.map(group=>(
            <div key={group.label} style={{marginBottom:16}}>
              <p style={{fontSize:7,color:'#1e3a5f',fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',padding:'0 8px',marginBottom:4}}>{group.label}</p>
              {group.items.map(item=>{
                const Icon=item.icon;
                const isA=active===item.id;
                const badge=alerts[item.id];
                return <button key={item.id} onClick={()=>setActive(item.id)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:7,marginBottom:1,border:'none',cursor:'pointer',transition:'all .15s',fontFamily:'inherit',
                    background:isA?'linear-gradient(135deg,#0284c7,#0ea5e9)':'transparent',
                    color:isA?'#fff':'#475569',
                    boxShadow:isA?'0 2px 8px #0ea5e928':'none'}}>
                  <Icon size={14} style={{flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:isA?600:500,flex:1,textAlign:'left'}}>{item.label}</span>
                  {badge>0&&<span style={{fontSize:8,fontWeight:800,background:isA?'rgba(255,255,255,.22)':'#dc2626',color:'#fff',padding:'1px 5px',borderRadius:20}}>{badge}</span>}
                </button>;
              })}
            </div>
          ))}
        </nav>

        {/* System status */}
        <div style={{padding:'10px 16px',borderTop:`1px solid ${C.sbBorder}`}}>
          {[{l:'Data Integrity',v:'Secure',ok:true},{l:'HIPAA Boundary',v:'Active',ok:true},{l:'Audit Chain',v:'Verified',ok:true}].map(s=>(
            <div key={s.l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
              <span style={{fontSize:9,color:'#334155',fontWeight:600}}>{s.l}</span>
              <span style={{fontSize:9,color:s.ok?'#4ade80':'#fbbf24',fontWeight:700,fontFamily:'DM Mono,monospace'}}>{s.v}</span>
            </div>
          ))}
          <div style={{marginTop:8,display:'flex',alignItems:'center',gap:5}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#22c55e',display:'inline-block'}} className="pulse"/>
            <span style={{fontSize:8,color:'#334155',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase'}}>All Systems Operational</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{flex:1,display:'flex',flexDirection:'column',minHeight:'100vh',overflow:'hidden'}}>
        {/* Live ticker */}
        <div style={{height:24,background:'#07090f',display:'flex',alignItems:'center',overflow:'hidden',flexShrink:0,borderBottom:`1px solid ${C.sbBorder}`}}>
          <div style={{background:'#0ea5e9',padding:'0 12px',height:'100%',display:'flex',alignItems:'center',flexShrink:0,fontSize:8,fontWeight:800,letterSpacing:'.1em',color:'#fff',textTransform:'uppercase'}}>LIVE</div>
          <div style={{flex:1,overflow:'hidden'}}>
            <div className="ticker-scroll" style={{fontSize:9,fontWeight:600,color:'#334155',letterSpacing:'.03em',fontFamily:'DM Mono,monospace'}}>
              {[...TICKER,...TICKER].map((t,i)=><span key={i} style={{padding:'0 40px'}}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* Header */}
        <header style={{height:50,background:'#fff',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <p style={{fontSize:16,fontWeight:700,color:C.t1,letterSpacing:'-.02em'}}>{allItems.find(n=>n.id===active)?.label}</p>
            {alerts.finance>0&&<div style={{display:'flex',alignItems:'center',gap:4,background:C.redL,border:`1px solid ${C.redB}`,borderRadius:20,padding:'3px 9px'}}>
              <AlertTriangle size={10} color={C.red}/>
              <span style={{fontSize:10,fontWeight:700,color:C.red}}>{alerts.finance} overdue invoice{alerts.finance!==1?'s':''}</span>
            </div>}
            {alerts.inventory>0&&<div style={{display:'flex',alignItems:'center',gap:4,background:C.amberL,border:`1px solid ${C.amberB}`,borderRadius:20,padding:'3px 9px'}}>
              <Package size={10} color={C.amber}/>
              <span style={{fontSize:10,fontWeight:700,color:C.amber}}>{alerts.inventory} low stock</span>
            </div>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:5,fontSize:10,fontWeight:600,color:C.t3}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:C.green,display:'inline-block'}} className="pulse"/>
              All systems operational
            </div>
            <div style={{width:1,height:16,background:C.border}}/>
            <button style={{position:'relative',background:'none',border:'none',cursor:'pointer',padding:5,color:C.t3}}>
              <Bell size={16}/>
              {(alerts.finance+alerts.inventory)>0&&<span style={{position:'absolute',top:3,right:3,width:5,height:5,borderRadius:'50%',background:C.red,border:'1.5px solid #fff'}}/>}
            </button>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#f8fafc',border:`1px solid ${C.border}`,borderRadius:20,padding:'4px 12px 4px 4px'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e920,#0284c720)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:C.accent}}>AR</div>
              <span style={{fontSize:11,fontWeight:600,color:C.t2}}>Alexandra Reed</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <section style={{flex:1,overflowY:'auto',padding:'22px 26px',background:C.bg}}>
          <div style={{maxWidth:1320,margin:'0 auto'}}>
            <ActiveComp/>
          </div>
        </section>
      </main>
    </div>
  );
}
