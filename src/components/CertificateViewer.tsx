import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { assetPath } from '../lib/assetPath.mjs';

export type Certificate = { image: string; thumbnail: string; width: number; height: number };
const mediaPath = (path: string) => assetPath(path, import.meta.env.BASE_URL || '/');

export function CertificateThumbnail({ certificate, title, sourceLabel, onOpen }: { certificate: Certificate; title: string; sourceLabel: string; onOpen: () => void }) {
  const [failed, setFailed] = useState(false);
  return <button className="certificate-thumbnail" onClick={onOpen} aria-label={`查看${title}的${sourceLabel}大图`} aria-haspopup="dialog">
    {!failed && <img src={mediaPath(certificate.thumbnail)} alt={`${sourceLabel}，公开脱敏副本`} loading="lazy" decoding="async" onError={() => setFailed(true)}/>}
    <span>{sourceLabel}<Icon name="search" size={15}/>查看大图</span>
  </button>;
}

export function CertificateViewer({ certificate, title, sourceLabel, onClose }: { certificate: Certificate; title: string; sourceLabel: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      dialog.current?.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="certificate-viewer" aria-labelledby="certificate-viewer-title" onCancel={onClose} onClose={() => { if (!dialog.current?.open) onClose(); }} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]');
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <header className="certificate-viewer__header">
      <div><h2 id="certificate-viewer-title">{sourceLabel}</h2><p>{title}</p></div>
      <button type="button" className="icon-button" aria-label="关闭证书大图" autoFocus onClick={onClose}><Icon name="close"/></button>
    </header>
    <div className={`certificate-viewer__canvas${zoomed ? ' certificate-viewer__canvas--zoomed' : ''}`} tabIndex={0} role="region" aria-label="证明图片，可滚动查看">
      {failed ? <p role="status">图片暂时无法加载，请关闭后重试。</p> : <img src={mediaPath(certificate.image)} alt={`${title}，${sourceLabel}公开脱敏副本`} width={certificate.width} height={certificate.height} onError={() => setFailed(true)}/>}
    </div>
    <footer className="certificate-viewer__footer">
      <p>公开脱敏副本</p>
      <div><button type="button" className="button button--outline" onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>{zoomed ? '适应屏幕' : '放大'}</button><a className="button button--outline" href={mediaPath(certificate.image)} target="_blank" rel="noopener noreferrer">单独打开<Icon name="external" size={15}/></a></div>
    </footer>
  </dialog>;
}
