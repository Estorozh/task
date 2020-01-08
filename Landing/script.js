let icon_theme = document.getElementsByClassName('icon_theme')[1],
  theme = document.querySelector('.theme'),
  icon_message = document.getElementsByClassName('icon_message')[0],
  rightColumn = document.getElementsByClassName('goodly-webinar__right-column')[0],
  dark = true, 
  bg = document.getElementsByClassName('bg')[0];

// показание окна выбора тем
icon_theme.addEventListener('mouseover', () => theme.style.display = 'flex' );
icon_theme.addEventListener('click', (e)=> e.preventDefault() );
document.addEventListener('click',(e)=> {
  if(e.target != icon_theme || e.target != theme)
    theme.style.display = "none";
})

// при выборе фона он меняется
theme.addEventListener('click',(e) => {
  if( e.target.closest('.block') ) {
    if( e.target.parentElement.className == 'theme_dark') {
      document.documentElement.style.setProperty('--colorBg', '#151A25');
      document.documentElement.style.setProperty('--colorFont', '#fff');
    } else {
      document.documentElement.style.setProperty('--colorBg', '#fff');
      document.documentElement.style.setProperty('--colorFont', '#333641');
    }

    switch(e.target.id) {
      case 'light_floor':
        bg.style.backgroundImage = 'url("img/background.jpg")';
      break;
      case 'light_gradient1':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #D9A7C7 2.08%, #FFFCDC 92.93%)';
      break;
      case 'light_gradient1':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #D9A7C7 2.08%, #FFFCDC 92.93%)';
      break;
      case 'light_gradient2':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #EFEFBB 2.08%, #D4D3DD 92.93%)';
      break;
      case 'light_sky':
        bg.style.backgroundImage = 'url("img/light-sky.jpg")';
      break;
      case 'light_gradient3':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #DDE4ED 2.08%, #DDE4ED 92.93%)';
      break;
      case 'light_snow':
        bg.style.backgroundImage = 'url("img/light-snow.jpg")';
      break;
      case 'dark_floor':
        bg.style.backgroundImage = 'url("img/background-dark.jpg")';
      break;
      case 'dark_dot':
        bg.style.backgroundImage = 'url("img/dark-dot.jpg")';
      break;
      case 'dark_wood':
        bg.style.backgroundImage = 'url("img/dark-wood.jpg")';
      break;
      case 'dark_color1':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #222 2.08%, #222 92.93%)';
      break;
      case 'dark_color2':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #212A37 2.08%, #212A37 92.93%)';
      break;
      case 'dark_color3':
        bg.style.backgroundImage = 'linear-gradient(11.52deg, #36414F 2.08%, #36414F 92.93%)';
      break;
    }

    document.querySelector('.theme-active').classList.remove('theme-active');
    e.target.classList.add('theme-active');
  }
})

// переключение светлой темной темы на мобильном
let icon_themeMobile = document.getElementsByClassName('icon_theme')[0];
icon_themeMobile.addEventListener('click', ()=> {
  if(dark) {
    document.documentElement.style.setProperty('--colorBg', '#fff');
    document.documentElement.style.setProperty('--colorFont', '#333641');
    bg.style.backgroundImage = 'url("img/background.jpg")';
    dark = false;
  } else {
    document.documentElement.style.setProperty('--colorBg', '#151A25');
    document.documentElement.style.setProperty('--colorFont', '#fff');
    bg.style.backgroundImage = 'url("img/background-dark.jpg")';
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