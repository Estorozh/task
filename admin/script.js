//simple pagination
$(function() {
  $('.pagination').pagination({
    items: 30,
    itemsOnPage: 8,
    cssStyle: 'light-theme',
    displayedPages: 4,
    edges: 1,
    prevText: '<',
    nextText: '>'
  });
});
//dropdown
let header_dropdown_arrow = document.getElementsByClassName('header_filter_arrow'),
  header_dropdown = document.querySelector('.header_dropdown');
header_dropdown_arrow[0].addEventListener('click', (e)=> {
  header_dropdown.classList.remove('hide');
  e.target.classList.add('hide');
  e.target.previousElementSibling.classList.add('hide');
});
header_dropdown_arrow[1].addEventListener('click', (e)=> {
  header_dropdown.classList.add('hide');
  header_dropdown_arrow[0].classList.remove('hide');
  header_dropdown_arrow[0].previousElementSibling.classList.remove('hide');
});

