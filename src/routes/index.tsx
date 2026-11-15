import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Bell, LayoutGrid, ChevronRight, ChevronDown, PlayCircle, Settings, EllipsisVertical, Box, CircleCheck, RefreshCw, Plus, Layers, Folder, Tag, Package, SquareCheck, Info, Search, Download, Eye, List, Upload, Pencil, X, CirclePlus, CircleAlert, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dyo from '@/assets/product-dyo.png.asset.json';
import filli from '@/assets/product-filli.png.asset.json';
import kalekim from '@/assets/product-kalekim.png.asset.json';
import pvc from '@/assets/product-pvc.png.asset.json';
import marketplaceLogo from '@/assets/marketplace-logo.png.asset.json';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Marketplace Entegrasyonu | İnşaatÇevrem ERP' },
    { name: 'description', content: 'ERP ürünlerinizi seçin, Marketplace eşleştirmelerini inceleyin ve aktarım ayarlarını yönetin.' },
    { property: 'og:title', content: 'Marketplace Entegrasyonu | İnşaatÇevrem ERP' },
    { property: 'og:description', content: 'ERP ürün seçimi, Marketplace eşleştirme kontrolü ve aktarım paneli.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Marketplace,
});

const initialProducts = [
  { id: 1, name: 'DYO DIŞ CEPHE BEŞYILDIZ SİL.DIŞ CEPHE B BAZ 15LT', brand: 'DYO', price: '1.350,00 ₺', match: 'Silikonlu Dış Cephe Boyası', image: dyo.url, status: 'matched', suggestions: ['Silikonlu Dış Cephe Boyası', 'Dış Cephe Boyası'] },
  { id: 2, name: 'FİLLİ BOYA SİLİKONLU DIŞ CEPHE 7,5LT', brand: 'Filli Boya', price: '780,00 ₺', match: 'Silikonlu Dış Cephe Boyası', image: filli.url, status: 'matched', suggestions: ['Silikonlu Dış Cephe Boyası', 'Dış Cephe Boyası'] },
  { id: 3, name: 'KALEKİM SERAMİK YAPIŞTIRICI 25KG', brand: 'Kalekim', price: '295,00 ₺', match: 'Seramik Yapıştırıcısı', image: kalekim.url, status: 'matched', suggestions: ['Seramik Yapıştırıcısı', 'Yapıştırıcı Harçları'] },
  { id: 4, name: 'PVC DİRSEK 90 DERECE 50MM', brand: '—', price: '45,00 ₺', match: 'PVC Dirsek', image: pvc.url, status: 'pending', suggestions: ['PVC Dirsek', 'PVC Boru ve Eklentileri'] },
  { id: 5, name: 'ÖZEL YAPI MALZEMESİ', brand: 'Örnek', price: '320,00 ₺', match: 'Eşleşme bulunamadı', image: '', status: 'new', suggestions: ['Yapı Malzemeleri'] },
];
const methods = [ { label: 'Tüm Ürünler', icon: Layers }, { label: 'Kategoriye Göre Seç', icon: Folder }, { label: 'Ürün Grubuna Göre Seç', icon: Layers }, { label: 'Markaya Göre Seç', icon: Tag }, { label: 'Stoktaki Ürünler', icon: Package }, { label: 'Manuel Seçim', icon: SquareCheck } ];
type DialogKind = 'help' | 'settings' | 'connection' | 'method' | 'match' | 'preview' | 'results' | 'transfer' | 'notifications' | 'apps' | 'account' | null;

function Marketplace() {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState([1, 2, 3]);
  const [focused, setFocused] = useState(1);
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('Tüm Ürünler');
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(1);
  const [priceSource, setPriceSource] = useState('Perakende Satış Fiyatı');
  const [stockSharing, setStockSharing] = useState('Stok miktarını gösterme');
  const product = products.find(p => p.id === focused) ?? products[0];
  const visibleProducts = products.filter(p => `${p.name} ${p.brand}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')));
  const toggle = (id: number) => setSelected(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  const exportProducts = () => {
    const csv = '\uFEFFÜrün;Marka;Satış Fiyatı;Marketplace Eşleşmesi\n' + visibleProducts.map(p => `${p.name};${p.brand};${p.price};${p.match}`).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'erp-urunleri.csv'; anchor.click(); URL.revokeObjectURL(url);
  };
  const openMatch = (id: number) => { setFocused(id); setDialog('match'); };
  const changeMatch = (match: string) => { setProducts(prev => prev.map(p => p.id === focused ? { ...p, match, status: match === 'Yeni Ürün Önerisi' ? 'new' : 'matched' } : p)); setDialog(null); };
  const titles: Record<string,string> = { help: 'Nasıl Çalışır?', settings: 'Entegrasyon Ayarları', connection: 'Bağlantı Ayarları', method, match: 'Eşleştirmeyi Değiştir', preview: 'Seçili Ürünleri Önizle', results: 'Eşleştirme Sonuçları', transfer: 'Marketplace’e Aktarım', notifications: 'Bildirimler', apps: 'Uygulamalar', account: 'Hesap Bilgileri' };

  return <div className="market-app">
    <header className="topbar">
      <div className="breadcrumbs"><span>Network</span><ChevronRight size={17} className="text-muted-foreground"/><strong>Marketplace Entegrasyonu</strong></div>
      <div className="account-area">
        <Button variant="ghost" size="icon" className="notification" aria-label="Bildirimler" onClick={() => setDialog('notifications')}><Bell size={21}/></Button>
        <Button variant="ghost" size="icon" className="apps-button" aria-label="Uygulamalar" onClick={() => setDialog('apps')}><LayoutGrid size={20}/></Button>
        <div className="h-6 border-l border-border"/><div className="avatar">MK</div>
        <div className="account-name">Mehmet Kaya<small>Yapı Market A.Ş.</small></div>
        <Button variant="ghost" size="icon" aria-label="Hesap menüsü" onClick={() => setDialog('account')}><ChevronDown/></Button>
      </div>
    </header>
    <main className="market-main">
      <div className="page-intro"><div><h1>Marketplace Entegrasyonu</h1><p>ERP ürünlerinizi İnşaatÇevrem Marketplace hesabınıza bağlayabilir, ürün adı, marka, satış fiyatı ve (isterseniz) stok bilgisiyle toplu olarak aktarabilirsiniz.</p></div>
        <div className="intro-actions"><Button variant="outline" className="reference-button" onClick={() => setDialog('help')}><PlayCircle className="text-primary"/>Nasıl Çalışır?</Button><Button variant="outline" className="reference-button" onClick={() => setDialog('settings')}><Settings/>Entegrasyon Ayarları</Button></div>
      </div>
      <section className="summary-grid" aria-label="Entegrasyon özeti">
        <div className="summary-item"><div className="connection-top"><img src={marketplaceLogo.url} alt="" className="market-logo"/><div className="connection-title">İnşaatÇevrem<small>Marketplace</small></div><span className="connected"><span/>Bağlı</span></div><div className="connection-bottom"><div><strong>Yapı Market A.Ş.</strong><p>Hesap: insaatcevrem.com/yapimarket</p></div><div className="connection-controls"><Button variant="outline" className="reference-button" onClick={() => setDialog('connection')}><Settings/>Bağlantı Ayarları</Button><Button variant="ghost" size="icon" className="row-menu" aria-label="Bağlantı seçenekleri" onClick={() => setDialog('connection')}><EllipsisVertical/></Button></div></div></div>
        {[{label:'Toplam ERP Ürünü',value:'1.248',icon:Box,tone:'text-brand bg-brand-soft',valueTone:''},{label:'Aktarılan Ürün',value:'892',icon:CircleCheck,tone:'text-success bg-success-soft',valueTone:''},{label:'Eşleştirme Bekleyen',value:'134',icon:RefreshCw,tone:'text-warning bg-warning-soft',valueTone:'text-warning'},{label:'Yeni Ürün Önerisi',value:'27',icon:Plus,tone:'text-primary bg-secondary',valueTone:'text-primary'}].map(stat => <div key={stat.label} className="summary-item"><div className={`stat-icon ${stat.tone}`}><stat.icon size={23}/></div><div className="stat-label">{stat.label}</div><div className={`stat-value ${stat.valueTone}`}>{stat.value}</div></div>)}
      </section>
      <section className="steps" aria-label="Aktarım adımları">{[{title:'Ürün Seçimi',text:'Hangi ürünleri aktaracağınızı belirleyin'},{title:'Eşleştirme Kontrolü',text:'ERP ürünleri ile Marketplace karşılıklarını inceleyin'},{title:'Aktarım',text:"Onayladığınız ürünleri Marketplace’e gönderin"}].map((s,i) => <div className={`step ${step === i+1 ? 'active' : ''}`} key={s.title}><div className="step-number">{i+1}</div><div><h3>{s.title}</h3><p>{s.text}</p></div>{i<2 && <ChevronRight className="step-chevron"/>}</div>)}</section>
      <div className="workspace">
        <aside className="selection-panel"><h2 className="section-title">1. Ürün Seçim Yöntemi</h2><div className="method-list">{methods.map(m => <Button variant="ghost" key={m.label} className={`method-button ${method === m.label ? 'selected' : ''}`} onClick={() => {setMethod(m.label); if(m.label === 'Tüm Ürünler') {setQuery('');} else if(m.label === 'Manuel Seçim') {setSelected([]);} else {setDialog('method');}}}><m.icon/><span className="method-label">{m.label}{m.label === 'Tüm Ürünler' && <small>(1.248 ürün)</small>}</span>{method === m.label ? <CircleCheck className="method-check" fill="currentColor" stroke="var(--card)"/> : <ChevronRight className="method-arrow"/>}</Button>)}</div>
          <div className="transfer-settings"><h2 className="section-title">2. Aktarım Ayarları</h2><div><label htmlFor="price" className="setting-label">Fiyat Kaynağı</label><select id="price" className="reference-select" value={priceSource} onChange={e => setPriceSource(e.target.value)}><option>Perakende Satış Fiyatı</option><option>Toptan Satış Fiyatı</option><option>Liste Fiyatı</option></select></div><div><label htmlFor="stock" className="setting-label">Stok Miktarı Paylaşımı <Info size={12} className="text-muted-foreground"/></label><div className="stock-select"><EyeOff size={15}/><select id="stock" className="reference-select" value={stockSharing} onChange={e => setStockSharing(e.target.value)}><option>Stok miktarını gösterme</option><option>Stok miktarını göster</option></select></div></div><p className="setting-note"><Info size={13}/><span>Ürün adı ve marka her zaman aktarılır.<br/>Stok miktarı isteğe bağlıdır.</span></p></div>
        </aside>
        <section className="products-panel"><div className="products-toolbar"><h2>ERP Ürünleri <span>(1.248 kayıt)</span></h2><label className="search-field"><Search size={16}/><input aria-label="Ürün ara" placeholder="Ürün adı, marka, kod ile ara..." value={query} onChange={e => setQuery(e.target.value)}/></label><Button variant="outline" className="reference-button" onClick={exportProducts}><Download/>Dışa Aktar</Button></div>
          <table className="product-table"><thead><tr><th><input type="checkbox" className="row-check" aria-label="Tüm görünen ürünleri seç" checked={visibleProducts.length>0 && visibleProducts.every(p => selected.includes(p.id))} onChange={e => setSelected(e.target.checked ? visibleProducts.map(p => p.id) : [])}/></th><th>ERP Ürün Adı</th><th>Marka</th><th>Satış Fiyatı</th><th>Marketplace Eşleşmesi</th><th>Durum</th><th/></tr></thead><tbody>{visibleProducts.map(p => <tr key={p.id} onClick={() => setFocused(p.id)}><td><input type="checkbox" className="row-check" aria-label={`${p.name} seç`} checked={selected.includes(p.id)} onChange={() => toggle(p.id)}/></td><td className="product-name">{p.name}</td><td>{p.brand}</td><td className="price-cell">{p.price}</td><td><Button variant="outline" className="match-button" onClick={() => openMatch(p.id)}>{p.image ? <img src={p.image} alt=""/> : <Search/>}<span>{p.match}</span><ChevronDown/></Button></td><td><span className={`status ${p.status}`}>{p.status === 'matched' ? <CircleCheck/> : p.status === 'pending' ? <CircleAlert/> : <CirclePlus/>}{p.status === 'matched' ? 'Eşleşti' : p.status === 'pending' ? 'Onay Gerekli' : 'Yeni Ürün Önerisi'}</span></td><td><Button variant="ghost" className="row-menu" aria-label={`${p.name} seçenekleri`} onClick={() => openMatch(p.id)}><EllipsisVertical/></Button></td></tr>)}{visibleProducts.length===0 && <tr><td colSpan={7} className="empty-table">Aramanıza uygun ürün bulunamadı.</td></tr>}</tbody></table>
          <div className="table-footer"><div className="selection-count"><span>Seçili: <strong>{selected.length} ürün</strong></span><span>Toplam: <strong>1.248 ürün</strong></span></div><div className="pagination"><label htmlFor="page-size" className="pagination-label">Sayfa başına:</label><select id="page-size" className="reference-select page-size"><option>50</option><option>25</option><option>100</option></select><Button variant="ghost" className="page-button" aria-label="Önceki sayfa" onClick={() => setPage(Math.max(1,page-1))}><ChevronRight className="rotate-180"/></Button>{[1,2,3].map(n => <Button key={n} variant={page===n?'default':'ghost'} className="page-button" onClick={() => setPage(n)}>{n}</Button>)}<span>...</span><Button variant={page===25?'default':'ghost'} className="page-button" onClick={() => setPage(25)}>25</Button><Button variant="ghost" className="page-button" aria-label="Sonraki sayfa" onClick={() => setPage(Math.min(25,page+1))}><ChevronRight/></Button></div></div>
        </section>
        {product && <aside className="detail-panel"><h2 className="section-title">Seçili Ürün Detayı</h2><div className="detail-product">{product.image ? <img className="detail-image" src={product.image} alt={product.name}/> : <div className="detail-image grid place-items-center"><Package/></div>}<div><h3>{product.id === 1 ? "DYO DIŞ CEPHE BEŞYILDIZ SİL.DIŞ CEPHE B BAZ 15LT" : product.name}</h3><span className="erp-label">ERP Ürünü</span></div></div><dl className="detail-data"><div><dt>Marka</dt><span>:</span><dd>{product.brand}</dd></div><div><dt>Satış Fiyatı</dt><span>:</span><dd>{product.price}</dd></div><div><dt>Seçilen Eşleşme</dt><span>:</span><dd>{product.match}</dd></div></dl><div className="detail-message"><CircleCheck/><p>{product.status==='matched' ? "Bu ürün Marketplace’te mevcut ürünle eşleştirildi." : product.status==='pending' ? 'Bu ürünün eşleşmesi onayınızı bekliyor.' : 'Bu ürün için yeni ürün önerisi oluşturulabilir.'}</p></div><div className="detail-actions"><Button variant="outline" className="reference-button" onClick={() => openMatch(product.id)}><Pencil/>Eşleştirmeyi Değiştir</Button><Button variant="outline" className="reference-button" onClick={() => setSelected(prev => prev.filter(id => id!==product.id))}><X/>Aktarımdan Çıkar</Button></div></aside>}
        <footer className="bottom-actions"><Button variant="outline" className="reference-button" onClick={() => {setStep(2);setDialog('results');}}><List/>Eşleştirme Sonuçlarını İncele</Button><Button variant="outline" className="reference-button" onClick={() => setDialog('preview')}><Eye/>Seçili Ürünleri Önizle</Button><Button className="reference-button transfer-button" disabled={selected.length===0} onClick={() => {setStep(3);setDialog('transfer');}}><Upload/>Marketplace’e Aktar ({selected.length} Ürün)</Button></footer>
      </div>
    </main>
    {dialog && <div className="dialog-backdrop" onClick={() => setDialog(null)}><section role="dialog" aria-modal="true" aria-label={titles[dialog]} className="market-dialog" onClick={e => e.stopPropagation()}><div className="dialog-heading"><h2>{titles[dialog]}</h2><Button variant="ghost" size="icon" aria-label="Kapat" onClick={() => setDialog(null)}><X/></Button></div><div className="dialog-body">
      {dialog==='help' && <><p><strong>1. Ürün Seçimi</strong><br/>Aktarılacak ERP ürünlerini ve fiyat kaynağını seçin.</p><p><strong>2. Eşleştirme Kontrolü</strong><br/>Marketplace karşılıklarını inceleyin ve gerekli eşleştirmeleri onaylayın.</p><p><strong>3. Aktarım</strong><br/>Seçili ürünlerinizi önizleyerek aktarımı onaylayın.</p></>}
      {(dialog==='settings' || dialog==='connection') && <><p><strong>Yapı Market A.Ş.</strong><br/>insaatcevrem.com/yapimarket</p><p className="text-success"><CircleCheck className="inline mr-2" size={15}/>Bağlı · Örnek hesap</p><label className="setting-label" htmlFor="dialog-price">Fiyat Kaynağı</label><select id="dialog-price" className="reference-select" value={priceSource} onChange={e => setPriceSource(e.target.value)}><option>Perakende Satış Fiyatı</option><option>Toptan Satış Fiyatı</option><option>Liste Fiyatı</option></select><label className="setting-label" htmlFor="dialog-stock">Stok Miktarı Paylaşımı</label><select id="dialog-stock" className="reference-select" value={stockSharing} onChange={e => setStockSharing(e.target.value)}><option>Stok miktarını gösterme</option><option>Stok miktarını göster</option></select></>}
      {dialog==='method' && <div className="option-list">{(method==='Markaya Göre Seç' ? ['DYO','Filli Boya','Kalekim','Örnek'] : method==='Stoktaki Ürünler' ? ['Stoktaki tüm ürünler'] : ['Boya','Seramik','Tesisat','Diğer']).map((option,i) => <Button variant="outline" className="reference-button" key={option} onClick={() => {setQuery(method==='Markaya Göre Seç' ? option : ['BOYA','SERAMİK','PVC','ÖZEL'][i] ?? '');setDialog(null);}}><ChevronRight/>{option}</Button>)}</div>}
      {dialog==='match' && product && <><p>{product.name}</p><div className="option-list">{[...new Set([product.match, ...product.suggestions].filter(value => value && value !== 'Eşleşme bulunamadı')), 'Yeni Ürün Önerisi'].map(option => <Button variant={option === product.match ? 'default' : 'outline'} className="reference-button" key={option} onClick={() => changeMatch(option)}>{option === product.match ? <Check/> : <ChevronRight/>}{option}</Button>)}</div></>}
      {(dialog==='preview' || dialog==='results' || dialog==='transfer') && <>{products.filter(p => selected.includes(p.id)).map(p => <div className="dialog-product" key={p.id}>{p.image && <img src={p.image} alt=""/>}<span><strong>{p.name}</strong><br/>{p.match}</span><strong>{p.price}</strong></div>)}{selected.length===0 && <p>Henüz ürün seçilmedi.</p>}{dialog==='transfer' && <p className="mt-4 text-muted-foreground">Bu ekran örnek verilerle çalışır. Gerçek Marketplace bağlantısı olmadığı için ürünler gönderilmez.</p>}</>}
      {dialog==='notifications' && <p>Yeni bildiriminiz bulunmuyor.</p>}{dialog==='apps' && <p>İnşaatÇevrem ERP · Marketplace</p>}{dialog==='account' && <p><strong>Mehmet Kaya</strong><br/>Yapı Market A.Ş.<br/>Örnek hesap</p>}
    </div><div className="dialog-footer"><Button variant="outline" className="reference-button" onClick={() => {setDialog(null); if(dialog==='transfer')setStep(1);}}>Kapat</Button>{(dialog==='settings' || dialog==='connection') && <Button className="reference-button" onClick={() => setDialog(null)}>Kaydet</Button>}</div></section></div>}
  </div>;
}