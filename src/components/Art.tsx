import { useId, useState } from 'react';
/** Vector concept renders: intentionally not photographs of completed projects. */
export function ProjectArt({ kind = 'home', className = '', image = '', alt = '' }: { kind?: string; className?: string; image?: string; alt?: string }) {
  const id = useId().replace(/:/g, '');
  const [failed, setFailed] = useState('');
  if (image && failed !== image) return <img className={`project-art media-photo ${className}`} src={image} alt={alt || '项目图片'} loading="lazy" onError={() => setFailed(image)}/>;
  const g = (name: string) => `url(#${id}-${name})`;
  return <svg className={`project-art ${className}`} viewBox="0 0 600 380" role="img" aria-label={`${kind === 'home' ? '智能家居终端' : kind === 'robot' ? '智能移动平台' : '边缘视觉设备'}概念示意图`}>
    <defs>
      <linearGradient id={`${id}-bg`} x2="1" y2="1"><stop stopColor={kind === 'vision' ? '#d2e4e2' : '#d9e5ed'} /><stop offset="1" stopColor={kind === 'robot' ? '#9daebb' : '#edf3f5'} /></linearGradient>
      <linearGradient id={`${id}-metal`} x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".46" stopColor="#e3e8eb"/><stop offset="1" stopColor="#91a4b2"/></linearGradient>
      <linearGradient id={`${id}-black`} x2="1" y2="1"><stop stopColor="#263c4a"/><stop offset=".55" stopColor="#07141e"/><stop offset="1" stopColor="#18333f"/></linearGradient>
      <linearGradient id={`${id}-board`} x2="1" y2="1"><stop stopColor="#0f6970"/><stop offset="1" stopColor="#082e3c"/></linearGradient>
      <radialGradient id={`${id}-lens`}><stop stopColor="#154f75"/><stop offset=".35" stopColor="#051e33"/><stop offset=".55" stopColor="#397b87"/><stop offset=".62" stopColor="#071820"/><stop offset=".84" stopColor="#395158"/><stop offset="1" stopColor="#071b24"/></radialGradient>
      <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="220%"><feGaussianBlur stdDeviation="13"/></filter>
    </defs>
    <rect width="600" height="380" fill={g('bg')}/>
    <path d="M0 294 600 249v131H0Z" fill="#fff" opacity=".2"/>
    <ellipse cx="302" cy="322" rx="153" ry="23" fill="#213844" opacity=".28" filter={g('shadow')}/>
    {kind === 'home' ? <g transform="translate(8,-3)">
      <path d="m340 278 52 30h-92l-35-26Z" fill="#8b9eaa"/><path d="m302 228 36 18 19 58h-60Z" fill={g('metal')}/>
      <rect x="159" y="41" width="263" height="272" rx="33" fill="#718794"/>
      <rect x="150" y="35" width="263" height="272" rx="33" fill={g('metal')} stroke="#f5fcff" strokeWidth="2"/>
      <rect x="169" y="55" width="225" height="225" rx="18" fill={g('black')}/>
      <path d="M190 62h180c10 0 16 5 16 15v36L177 226V78c0-10 5-16 13-16Z" fill="#fff" opacity=".045"/>
      <text x="190" y="85" fill="#99becb" fontFamily="sans-serif" fontSize="8" letterSpacing="2">HOME / CONNECTED</text>
      <circle cx="373" cy="81" r="3" fill="#64c9ac"/>
      <text x="187" y="149" fill="#8dddff" fontFamily="sans-serif" fontWeight="500" fontSize="49">26.8<tspan fontSize="19" dy="-22">°</tspan></text>
      <text x="190" y="169" fill="#9badb9" fontFamily="sans-serif" fontSize="9" letterSpacing="2">ROOM TEMPERATURE</text>
      <path d="M189 190h184" stroke="#3c535f"/>
      <g fill="#aec6d0" fontFamily="sans-serif"><text x="191" y="216" fontSize="17">48<tspan fontSize="9"> %</tspan></text><text x="300" y="216" fontSize="17">396<tspan fontSize="8"> ppm</tspan></text><text x="191" y="233" fontSize="8">HUMIDITY</text><text x="301" y="233" fontSize="8">AIR QUALITY</text></g>
      <g fill="#284959"><rect x="190" y="248" width="51" height="15" rx="5"/><rect x="251" y="248" width="51" height="15" rx="5"/><rect x="312" y="248" width="61" height="15" rx="5"/></g>
      <circle cx="282" cy="294" r="3" fill="#8398a5"/>
      <path d="M419 70v199" stroke="#78909f" strokeWidth="2"/>
    </g> : kind === 'robot' ? <g>
      <g fill={g('black')} stroke="#395263" strokeWidth="3"><ellipse cx="187" cy="269" rx="40" ry="46"/><ellipse cx="421" cy="249" rx="39" ry="46"/><ellipse cx="402" cy="302" rx="43" ry="44"/></g>
      <g stroke="#77909e" strokeWidth="3" fill="#1d3544"><ellipse cx="178" cy="269" rx="24" ry="33"/><ellipse cx="410" cy="302" rx="25" ry="32"/></g>
      <path d="m146 229 226-70 96 80-226 71Z" fill="#173441" stroke="#496573"/>
      <path d="m146 216 226-69 96 79-226 72Z" fill={g('metal')} stroke="#f7fcff"/>
      <path d="m172 209 187-49 70 62-187 54Z" fill={g('board')} stroke="#58a5ac"/>
      <g stroke="#a8d6c5" opacity=".6" fill="none"><path d="m195 210 62-17 65 46 64-16m-175 16 56-18 39 32m28-80 16 29 61 6"/><path d="m222 191 54 8 22-16 45 34"/></g>
      <path d="m253 204 61-17 31 26-63 18Z" fill="#0a1520" stroke="#60717a"/>
      <g fill="#c2b87e"><circle cx="185" cy="209" r="4"/><circle cx="358" cy="167" r="4"/><circle cx="409" cy="221" r="4"/><circle cx="242" cy="263" r="4"/></g>
      <path d="M254 203v-79l63-9v83" fill="#1e3946" stroke="#7693a1"/>
      <path d="m224 97 86-21 47 36-87 22Z" fill="#597a87"/><path d="m224 97 46 37v49l-46-33Z" fill="#122c3b"/><path d="m270 134 87-22v51l-87 21Z" fill="#213e4f"/>
      <ellipse cx="291" cy="151" rx="15" ry="17" fill={g('metal')}/><ellipse cx="334" cy="139" rx="15" ry="17" fill={g('metal')}/><ellipse cx="291" cy="151" rx="10" ry="12" fill="#14344a"/><ellipse cx="334" cy="139" rx="10" ry="12" fill="#14344a"/>
      <path d="M356 193v-61" stroke="#1c3644" strokeWidth="7"/><circle cx="356" cy="128" r="6" fill="#2b4153"/>
      <path d="m202 229 22 13m158-47 22 13" stroke="#4bc4f7" strokeWidth="7" strokeLinecap="round"/>
    </g> : <g>
      <path d="m173 88 242 27 11 190-244-27Z" fill="#366d68" stroke="#8ab9ac" strokeWidth="3"/>
      <path d="m186 99 215 25 10 165-216-24Z" fill="#0c4749"/>
      <g fill="none" stroke="#81ad8e" strokeWidth="2" opacity=".75"><path d="m197 113 48 5 1 34m-44-20 19 2 3 50m130-48 35 5 2 41m-160 33 1 41 50 6m66-8 36 3-2-31"/></g>
      <g fill="#c9cbb4"><rect x="196" y="215" width="34" height="52" rx="3" transform="rotate(6 196 215)"/><rect x="364" y="202" width="32" height="77" rx="3" transform="rotate(6 364 202)"/></g>
      <rect x="201" y="134" width="164" height="136" rx="17" fill="#192d39" transform="rotate(6 201 134)"/>
      <ellipse cx="281" cy="201" rx="86" ry="89" fill="#10202a"/><ellipse cx="279" cy="194" rx="80" ry="81" fill="#415e66" stroke="#aabcc0" strokeWidth="2"/>
      <circle cx="276" cy="191" r="70" fill="#0b1b27"/><circle cx="276" cy="191" r="60" fill={g('lens')}/><circle cx="276" cy="191" r="34" fill="#0c293b" stroke="#254e6a"/>
      <ellipse cx="264" cy="174" rx="18" ry="12" fill="#8ed4e2" opacity=".28"/><circle cx="290" cy="213" r="8" fill="#9b65b3" opacity=".22"/>
      <g fill="#d6d7a4"><circle cx="185" cy="101" r="5"/><circle cx="402" cy="125" r="5"/><circle cx="193" cy="267" r="5"/><circle cx="414" cy="292" r="5"/></g>
      <path d="m225 102 26 3m4 0 26 3m4 0 26 3m4 0 26 3" stroke="#ddc88f" strokeWidth="6"/>
      <rect x="177" y="290" width="204" height="18" rx="4" fill="#d2e0df" opacity=".5"/>
    </g>}
  </svg>;
}
export function ActivityArt({ kind, image = '', alt = '', example = true }: { kind: string; image?: string; alt?: string; example?: boolean }) {
  const [failed, setFailed] = useState('');
  const showImage = Boolean(image && failed !== image);
  return <div className={`activity-art activity-art--${kind}`}>
    {showImage ? <img src={image} alt={alt || '活动图片'} loading="lazy" onError={() => setFailed(image)}/> : kind === 'community' ? <ProjectArt kind="robot"/> : <WorkshopArt/>}
    <span className="image-caption">{showImage ? (example ? '场景示意' : '活动照片') : '概念示意'}</span>
  </div>;
}

function WorkshopArt() {
  const id = useId().replace(/:/g, '');
  return <svg className="project-art" viewBox="0 0 600 380" role="img" aria-label="单片机开发板与 LED 入门实践概念图"><defs><linearGradient id={`${id}-bg`} x2="1" y2="1"><stop stopColor="#d2e8f4"/><stop offset="1" stopColor="#eef6fa"/></linearGradient><linearGradient id={`${id}-pcb`} x2="1" y2="1"><stop stopColor="#176a94"/><stop offset="1" stopColor="#104e73"/></linearGradient></defs><rect width="600" height="380" fill={`url(#${id}-bg)`}/><path d="M0 295 600 238v142H0Z" fill="#fff" opacity=".35"/><ellipse cx="314" cy="303" rx="152" ry="22" fill="#356078" opacity=".15"/><g transform="translate(143 61) rotate(-7 160 130)"><rect x="5" y="10" width="312" height="240" rx="13" fill="#174961"/><rect width="312" height="240" rx="13" fill={`url(#${id}-pcb)`} stroke="#6cbed6" strokeWidth="2"/>{[18,285].map(x => <g key={x}>{Array.from({length:12},(_,i)=><g key={i}><rect x={x} y={22+i*16} width="12" height="10" rx="1" fill="#142e3d"/><rect x={x+4} y={24+i*16} width="4" height="5" fill="#c9c6a3"/></g>)}</g>)}<g stroke="#7bbad1" opacity=".55" fill="none"><path d="M48 67h34l24 24h102l40-31h22M49 91h23l33 21M49 167h28l37-25h86l37 38h30M50 192h56l27-33h35l40 45h60M52 36h66v25m62-26v29"/></g><rect x="108" y="75" width="97" height="96" rx="3" fill="#132533" stroke="#628699" strokeWidth="2"/>{Array.from({length:10},(_,i)=><g key={i} stroke="#b1bec2" strokeWidth="3"><path d={`M${114+i*9} 67v8m0 96v9M100 ${82+i*9}h8m97 0h8`}/></g>)}<text x="157" y="118" textAnchor="middle" fill="#d9e9ee" fontSize="15" fontFamily="sans-serif">MCU</text><text x="157" y="139" textAnchor="middle" fill="#7798a7" fontSize="7" fontFamily="sans-serif">FIRST LIGHT. FIRST STEP.</text><rect x="126" y="-10" width="63" height="30" rx="4" fill="#d7e2e7" stroke="#809eac"/><rect x="140" y="-5" width="35" height="12" rx="3" fill="#273e4c"/><rect x="232" y="99" width="31" height="31" rx="4" fill="#b9cbd3"/><circle cx="247.5" cy="114.5" r="9" fill="#273f4c"/><circle cx="69" cy="205" r="7" fill="#b8f4aa"/><circle cx="69" cy="205" r="15" fill="#c4ffa4" opacity=".2"/><text x="86" y="209" fill="#b3d9e3" fontSize="9" fontFamily="sans-serif">LED / ON</text><text x="206" y="215" fill="#a3c3d1" fontSize="8" fontFamily="sans-serif">HELLO, HARDWARE.</text><g fill="#c7dce5">{[[10,10],[302,10],[10,230],[302,230]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="4"/>)}</g></g></svg>;
}
