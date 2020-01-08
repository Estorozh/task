let icon_theme = document.getElementsByClassName('icon_theme')[1],
  theme = document.querySelector('.theme'),
  icon_message = document.getElementsByClassName('icon_message')[0],
  rightColumn = document.getElementsByClassName('goodly-webinar__right-column')[0];

// показание окна выбора тем
icon_theme.addEventListener('mouseover', () => theme.style.display = 'flex' );
icon_theme.addEventListener('click', (e)=> e.preventDefault() );
document.addEventListener('click',(e)=> {
  if(e.target != icon_theme || e.target != theme)
    theme.style.display = "none";
})

// переключение светлой темной темы на мобильном
let icon_themeMobile = document.getElementsByClassName('icon_theme')[0], dark=true;
icon_themeMobile.addEventListener('click', ()=> {
  if(dark) {
    document.documentElement.style.setProperty('--colorBg', '#fff');
    document.documentElement.style.setProperty('--colorFont', '#333641');
    dark = false;
  } else {
    document.documentElement.style.setProperty('--colorBg', '#151A25');
    document.documentElement.style.setProperty('--colorFont', '#fff');
    dark = true;
  }
} )

// отключение и включения чата
icon_message.addEventListener('click',()=>{
  if(window.getComputedStyle(rightColumn).getPropertyValue('display') != 'none') {
    rightColumn.style.display = 'none';
  } else {
    rightColumn.style.display = 'flex';
  }
} )

//отключение и вклчение количество участников
let countMember = document.getElementsByClassName('countMember');
for(i=0; i < countMember.length; i++) {
  countMember[i].addEventListener('click',()=> {
    if(window.getComputedStyle(members).getPropertyValue('display') != 'none') {
      members.style.display = 'none';
      messages.style.display = 'block';
    } else {
      members.style.display = 'block';
      messages.style.display = 'none';
    }
  } )
}

//примерная обработка нажатия кнопки доп материалов
let documents = document.getElementsByClassName('documents')[0],
  files_wrap = document.createElement('div'),
  files_wrap_show = false,
  files_wrap_close = document.createElement('i'),
  file = files.innerHTML;

files_wrap.style.cssText = `
  width: 320px;
  margin: 0 auto;
  background-color: rgba(0,0,0,.8);  
  border-radius: 10px;  
  padding: 10px;  
  border: 1px solid white;  
  max-height: 80vh;  
  min-height: 20vh;  
  height: auto;
  overflow-y: auto;
  `; 
files_wrap_close.style.cssText = `
  color: red;
  position: relative;
  top: -5px;
  left: 95%;
  font-size: 20px;
  line-height:0;
  height: 20px;
  `;
files_wrap_close.className = 'fa fa-close icon';
files_wrap.innerHTML = file;
files_wrap.prepend(files_wrap_close);
files_wrap.className = 'files_wrap';
documents.addEventListener('click',() => {
  if(files_wrap_show) {
    filesClose()
  } else {
    filesShow();
  }
})

function filesShow() {
  files.style.cssText = `
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-line-pack: center;
        align-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
            align-items: center;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    max-height: 100%;
    position: fixed;
    z-index: 2;
    background-color: rgba(0,0,0,.5);
    left:0;
    right: 0;
    top: 0;
    bottom: 0;
    `;
  files.innerHTML = files_wrap.outerHTML;
  files_wrap_show = true;    
  files_wrap_close = document.querySelector('.fa-close');
  files_wrap_close.addEventListener('click', ()=> {filesClose()} );
  files.addEventListener('click', (e)=>{ if(e.target.id == "files") filesClose() } )
}

function filesClose() {
  files.innerHTML = file;
  files.style.cssText = `
    backgroundColor: transparent;
    max-height: 30vh;
    position: relative; `;
  if(document.body.clientWidth > 767) {
    files.style.display = 'table';
  } else {
    files.style.display = 'none';
  }
  files_wrap_show = false;
}
//обработка нажатия кнопки доп материалов в мобильной версии
let documents_mobile  = document.querySelector('.files-mobile');
documents_mobile.addEventListener('click', ()=> {
  filesShow();
} )

if (files_wrap_show) {
  document.addEventListener('click',(e)=> {
    if( !e.target.closest('.files_wrap') )
      console.log(e.target);
  });
}