(function(){
  var body=document.body;
  var menuBtn=document.getElementById('menuBtn');
  var backdrop=document.getElementById('backdrop');
  function closeNav(){body.classList.remove('nav-open');}
  if(menuBtn){menuBtn.addEventListener('click',function(){body.classList.toggle('nav-open');});}
  if(backdrop){backdrop.addEventListener('click',closeNav);}
  var sidebar=document.getElementById('sidebar');
  if(sidebar){sidebar.addEventListener('click',function(e){if(e.target.tagName==='A'){closeNav();}});}

  // Copy buttons on every code block
  document.querySelectorAll('.content pre, .home pre').forEach(function(pre){
    var wrap=document.createElement('div');wrap.className='code-wrap';
    pre.parentNode.insertBefore(wrap,pre);wrap.appendChild(pre);
    var btn=document.createElement('button');btn.className='copy-btn';btn.type='button';
    btn.textContent='Sao chép';wrap.appendChild(btn);
    btn.addEventListener('click',function(){
      var text=pre.innerText;
      function done(){btn.textContent='Đã chép';btn.classList.add('done');
        setTimeout(function(){btn.textContent='Sao chép';btn.classList.remove('done');},1600);}
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(function(){fallback();});
      }else{fallback();}
      function fallback(){var ta=document.createElement('textarea');ta.value=text;
        document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}
        document.body.removeChild(ta);done();}
    });
  });

  // Image viewer for every image on the site (progress diagrams, SQL
  // diagram, and any image added later): click to open, zoom, drag.
  (function(){
    var lb=document.createElement('div');lb.className='prog-lightbox';lb.id='progLightbox';
    lb.innerHTML='<button type="button" class="prog-lb-close" id="progLbClose">Đóng</button><img id="progLbImg" alt="Ảnh phóng lớn"><div class="prog-lb-zoom"><button type="button" id="progLbZoomOut">Thu nhỏ</button><span id="progLbZoomLabel">Vừa màn hình</span><button type="button" id="progLbZoomIn">Phóng to</button><button type="button" id="progLbZoomFit">Đặt lại</button></div><div class="prog-lb-hint">Lăn chuột để zoom, kéo để di chuyển, bấm đúp vào ảnh để phóng to 200%</div><div class="prog-lb-actions"><a id="progLbDownload" href="#" download>Tải ảnh này</a></div>';
    document.body.appendChild(lb);
    var img=document.getElementById('progLbImg');var dl=document.getElementById('progLbDownload');
    var zOut=document.getElementById('progLbZoomOut');var zIn=document.getElementById('progLbZoomIn');
    var zFit=document.getElementById('progLbZoomFit');var zLabel=document.getElementById('progLbZoomLabel');
    var mode='fit',scale=1;
    function label(){zLabel.textContent=(mode==='fit')?'Vừa màn hình':Math.round(scale*100)+'%';}
    function fit(){mode='fit';img.style.width='';img.style.maxWidth='92vw';img.style.maxHeight='80vh';img.style.cursor='zoom-in';label();}
    function apply(){img.style.maxWidth='none';img.style.maxHeight='none';img.style.width=Math.round(img.naturalWidth*scale)+'px';img.style.cursor='grab';label();}
    function zoomIn(){if(!img.naturalWidth){return;}if(mode==='fit'){scale=(img.clientWidth/img.naturalWidth)*1.25;mode='zoom';}else{scale=Math.min(scale*1.25,8);}apply();}
    function zoomOut(){if(mode==='fit'){return;}scale=scale/1.25;if(scale<0.3){fit();}else{apply();}}
    function open(src){img.src=src;dl.href=src;lb.classList.add('open');lb.scrollTop=0;lb.scrollLeft=0;fit();}
    function close(){lb.classList.remove('open');img.src='';fit();}
    function isImgLink(a){var h=a.getAttribute('href')||'';return /\.(svg|png|jpe?g|webp|gif)(\?.*)?$/i.test(h);}
    document.querySelectorAll('.prog-thumb,.prog-view').forEach(function(el){el.addEventListener('click',function(){open(el.getAttribute('data-full'));});});
    document.querySelectorAll('.content img, .home img').forEach(function(im){
      if(im.id==='progLbImg'||im.classList.contains('prog-thumb')){return;}
      im.addEventListener('click',function(){
        var link=im.closest('a');
        if(link&&isImgLink(link)){return;}
        open(im.getAttribute('data-full')||im.src);});
    });
    document.querySelectorAll('.content a, .home a').forEach(function(a){
      var im=a.querySelector('img');if(!im||!isImgLink(a)){return;}
      a.addEventListener('click',function(e){e.preventDefault();open(a.getAttribute('href'));});
    });
    document.getElementById('progLbClose').addEventListener('click',close);
    lb.addEventListener('click',function(e){if(e.target===lb){close();}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){close();}});
    zIn.addEventListener('click',zoomIn);zOut.addEventListener('click',zoomOut);zFit.addEventListener('click',fit);
    img.addEventListener('dblclick',function(){if(mode==='fit'){scale=2;mode='zoom';apply();}else{fit();}});
    lb.addEventListener('wheel',function(e){e.preventDefault();if(e.deltaY<0){zoomIn();}else{zoomOut();}},{passive:false});
    var dragging=false,sx=0,sy=0,sl=0,st=0;
    lb.addEventListener('pointerdown',function(e){if(mode!=='zoom'){return;}dragging=true;sx=e.clientX;sy=e.clientY;sl=lb.scrollLeft;st=lb.scrollTop;});
    window.addEventListener('pointermove',function(e){if(!dragging){return;}lb.scrollLeft=sl-(e.clientX-sx);lb.scrollTop=st-(e.clientY-sy);});
    window.addEventListener('pointerup',function(){dragging=false;});
  })();

  // Scrollspy for the per-page TOC
  var tocLinks={};
  document.querySelectorAll('.toc a').forEach(function(a){
    tocLinks[a.getAttribute('href').slice(1)]=a;});
  var heads=Object.keys(tocLinks).map(function(id){return document.getElementById(id);})
    .filter(function(el){return !!el;});
  if(heads.length&&'IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          document.querySelectorAll('.toc a.active').forEach(function(a){a.classList.remove('active');});
          var link=tocLinks[en.target.id];
          if(link){link.classList.add('active');}
        }});
    },{rootMargin:'-70px 0px -70% 0px'});
    heads.forEach(function(h){obs.observe(h);});
  }

  // Back to top
  var toTop=document.getElementById('toTop');
  if(toTop){
    window.addEventListener('scroll',function(){
      toTop.classList.toggle('show',window.scrollY>600);},{passive:true});
    toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  }

  // Index quick filter
  var filter=document.getElementById('docFilter');
  if(filter){
    filter.addEventListener('input',function(){
      var q=filter.value.trim().toLowerCase();
      document.querySelectorAll('.card').forEach(function(card){
        card.style.display=card.getAttribute('data-search').indexOf(q)>-1?'':'none';});
      document.querySelectorAll('.home .group-block').forEach(function(g){
        var any=false;
        g.querySelectorAll('.card').forEach(function(c){if(c.style.display!=='none'){any=true;}});
        g.style.display=any?'':'none';});
    });
  }
})();
