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
