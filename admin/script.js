//rangeSlider
$("#range_repeat").ionRangeSlider({
  skin:'big',
  min: 0,
  max: 120,
  step: 10,
  values: [0, 10, 30, 45, 60, 90, 120],
  grid: true,
  grid_snap: true
});
$("#range_delay").ionRangeSlider({
  skin:'big',
  min: 0,
  max: 120,
  step: 10,
  values: [0, 5, 10, 15, 30, 45, 60],
  grid: true,
  grid_snap: true
});
//datepicker на два инпута для повторов
$('#webinar_time-start').datepicker({
  range: true,
  position: "top right",
  showButtonPanel: true,
  onSelect: function (fd, d, picker) { 
    $("#webinar_time-start").val(fd.split("-")[0]);
    $("#webinar_time-finish").val(fd.split("-")[1]);
  }
});
//datepicker выбора даты проведения
$('#webinar_calendar').datepicker({
  autoClose: true,
  showButtonPanel: true
});
//визуальная смена при загрузке файлов
scenario_file.addEventListener('change',hideLoadScenrio);
function hideLoadScenrio(e) {
  let scenario_text = document.getElementsByClassName('scenario_added-check')[0];
  e.target.nextElementSibling.style.display="none";
  e.target.previousElementSibling.style.display="flex";
  scenario_text.append(e.target.files[0].name);
}