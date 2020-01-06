var doneRequest = 0;
$(document).ready(function () {
    $('#menu-item-modal').on('show.bs.modal', function() {
        $('body').toggleClass('modal-backdrop-transparent');
    });
    $('#menu-item-modal').on('hide.bs.modal', function() {
        $('body').toggleClass('modal-backdrop-transparent');
    });

    initMenuPopup();
});


function tryUpdate(items) {
    if(doneRequest == items) {
        doneRequest = 0;
        updateSort();
    }
}


function updateSort() {
    $("#menu-item-modal .carousel").sortable("refresh").sortable( "refreshPositions");
    var order = $("#menu-item-modal .carousel").sortable("toArray");
    sort = new Array();
    for (var i = 0; i < order.length; i++) {
        var id = $("#" + order[i]).data('id');
        if(id) {
            var position = i;
            var item = new Array()
            item.push(id, position);
            sort.push(item);
        }
    }
    if($("#menu-item-modal .carousel .slider-item").length > 4)
        $("#flush-user-menu").show();
    else
        $("#flush-user-menu").hide();
    var data = {};
    data[yupeTokenName] = yupeToken;
    data['sort'] = sort;
    $.ajax({
        url: '/backend/desktop/home/setMenuOrder',
        data: data,  
        type: 'POST',
        success: function (data) {
            if(data == 'error')
                swal({   
                    text: "Произошла ошибка. Возможно внесенные вами изменения не сохранились. Обновите страницу.",    
                    type: 'warning', 
                    confirmButtonText: 'OK',
                });
            else
                refreshUserMenu();
        }
    });
}


function addNewElement(helper) {
    console.log('addNewElement');

    var icon = $(helper).data('icon');
    var url = $(helper).data('url');
    var label = $(helper).data('label');
    var module = $(helper).data('module');
    var rurl = $(helper).data('rurl');
    var countNewItems = 1; // $("#menu-item-modal .carousel .module-item .module").length;

    $('.module-item .module[data-module="' + module +'"]').addClass('selected');
    $('.searchResult .smodule-item[data-module="' + module +'"]').addClass('selected');

    var $newElement = $($('#slider-item-tmpl').html());
    $newElement.find('img').attr('src', assets + '/images/modules/bags/' + module + '.png')
    $newElement.find('.name').text(label);
    $("#menu-item-modal .carousel").append( $newElement );

    /*сохраняем на сервере*/
    var data = {};
    data['icon'] = icon;
    data['url'] = url;
    data['label'] = label;
    data['module'] = module;
    data[yupeTokenName] = yupeToken;
    $.ajax({
        method: "POST",
        url: "/backend/desktop/home/menuItem",
        data: data,
        success: function(data){
            $('#slider-item'+data.data).remove();
            $newElement.attr('id', 'slider-item' + data.data);
            $newElement.attr('data-id', data.data);
            $newElement.attr('data-module', module);
            doneRequest = doneRequest + 1;
            tryUpdate(countNewItems);
        },
        error: function(xhr, str){
            alert('Возникла ошибка: ' + xhr.response);
        }
    });
}


function removeMenuItem(id, module) {
    console.log('removeMenuItem');
    if(!id)
        return false;
    var data = {};
    data['id'] = id;
    data[yupeTokenName] = yupeToken;
    $.ajax({
        method: "POST",
        url: "/backend/desktop/home/menuItemDel",
        data: data,
        success: function(data){
            $('.module-item .module[data-module="' + module +'"]').removeClass('selected');
            $('.searchResult .smodule-item[data-module="' + module +'"]').removeClass('selected');
            $('.lmenu').find("#item" + id).remove();
            if($('#menu-item-modal .carousel .slider-item').length == 0) {
                $('#menu-item-modal .carousel').append('<div class="slider-item empty full"></div>');
            }
        },
        error: function(xhr, str){
            alert('Возникла ошибка: ' + xhr.response);
        }
    });
}

function initMenuCarousel()
{
    $("#menu-item-modal .carousel").sortable({
        opacity: 0.8,
        items: '.slider-item', 
        dropOnEmpty: true,
        placeholder: "slider-item empty",
        connectWith: "#delete-module-area",
        appendTo: "#menu-item-modal .modal-content",
        helper: 'clone',
        cursor: "move",
        scroll: false,
        over: function() {
            $('.slider-item.empty.full').hide();
        },
        out: function() {
            $('.slider-item.empty.full').show();
        },
        update: function(event, ui) {
            var helperCount = $("#menu-item-modal .carousel .module-item").length;
            var countNewItems = $("#menu-item-modal .carousel .module-item .module").length;
            if(helperCount > 0) {
                var helper = $("#menu-item-modal .carousel .module-item");
                var lasElement = helper;

                var selector = "#menu-item-modal .carousel .module-item .module";

                if($("#menu-item-modal .carousel .module-item .module.selected").length > 0)
                    selector = "#menu-item-modal .carousel .module-item .module.selected";

                $(selector).each(function(indx) {
                    if(!$(this).is('.selected')) $(this).addClass('selected');

                    var icon = $(this).data('icon');
                    var url = $(this).data('url');
                    var label = $(this).data('label');
                    var module = $(this).data('module');
                    var rurl = $(this).data('rurl');

                    $('.module-item .module[data-module="' + module +'"]').addClass('selected');
                    $('.searchResult .smodule-item[data-module="' + module +'"]').addClass('selected');

                    var $newElement = $($('#slider-item-tmpl').html());
                    $newElement.find('img').attr('src', assets + '/images/modules/bags/' + module + '.png')
                    $newElement.find('.name').text(label);
                    $newElement.insertAfter( $(lasElement) );
                    lasElement = $newElement;
                    
                    /*сохраняем на сервере*/
                    var data = {};
                    data['icon'] = icon;
                    data['url'] = url;
                    data['label'] = label;
                    data['module'] = module;
                    data[yupeTokenName] = yupeToken;
                    $.ajax({
                        method: "POST",
                        url: "/backend/desktop/home/menuItem",
                        data: data,
                        success: function(data){
                            $('#slider-item'+data.data).remove();
                            $newElement.attr('id', 'slider-item' + data.data);
                            $newElement.attr('data-id', data.data);
                            $newElement.attr('data-module', module);
                            doneRequest = doneRequest + 1;
                            tryUpdate(countNewItems);
                        },
                        error: function(xhr, str){
                            alert('Возникла ошибка: ' + xhr.response);
                        }
                    });
                });
                $(helper).remove();
            } else  {
                updateSort();
            }
        },
        activate: function(event, ui) {
            if(ui.helper.hasClass('slider-item')) {
                $("#delete-module-area").show();
            }
        },
        stop: function(event, ui) {
            $("#delete-module-area").hide();
            $('.slider-item.empty.full').remove();
        }
    });
    // $('#delete-module-area').on('sortupdate', function() {
    //     $("#delete-module-area .slider-item").each(function () {
    //         var module = $(this).data('module');
    //         var id = $(this).data('id');
    //         removeMenuItem(id, module);   
    //     });
    // });
}

function initMenuPopup() {
    var data = {};
    data[yupeTokenName] = yupeToken;
    $.ajax({
        url: '/backend/desktop/home/getMenuPopup',
        data: data,  
        type: 'POST',
        success: function (response) {
            if(response.result) {
                $("#wrap_menu_item_popup").empty().html(response.data);

                $( "#menu-item-modal .module-item" ).draggable({
                    helper: function() {
                        var helper = $(this).clone();
                        helper.addClass('tmpHelper');
                        helper.find('ul').remove();
                        helper.find('.list-trig').remove();
                        return helper;
                    },
                    delay: 0,
                    opacity: 0.92,
                    handle: '.handle',
                    connectToSortable: "#menu-item-modal .carousel",
                    start: function(event, ui) {
                        ui.helper.data('dropped', false);
                    },
                    stop: function(event, ui) {
                        
                    }
                });


                $(".searchResult").sortable({
                    opacity: 0.8,
                    items: '.smodule-item',
                    placeholder: "slider-item empty",
                    connectWith: "#menu-item-modal .carousel",
                    appendTo: "#menu-item-modal .modal-content",
                    cursor: "move",
                    scroll: false,
                });

                initMenuCarousel();

                $("#delete-module-area").sortable({
                    placeholder: "",
                    update: function(event, ui) {
                        console.log(ui.item);
                        ui.item.hide();
                        var id = ui.item.data('id');
                        var module = ui.item.data('module');
                        removeMenuItem(id, module);
                    }
                });
                // $('#delete-module-area').on('sortupdate', function() {
                //     $("#delete-module-area .slider-item").each(function () {
                //         var module = $(this).data('module');
                //         var id = $(this).data('id');
                //         removeMenuItem(id, module);   
                //     });
                // });

                $("#menu-item-modal .slider-next").click(function() {
                    var current = $('.items').scrollLeft();
                    $('.items').animate({
                        scrollLeft: current + 110
                    }, 300);
                });

                $("#menu-item-modal .slider-prev").click(function() {

                    var current = $('.items').scrollLeft();
                    $('.items').animate({
                        scrollLeft: current - 110
                    }, 300);
                });

                $(".module-item ul li").click(function() {
                    var module = $(this).data('module');
                    if($(this).hasClass('selected')) {
                        var carouselItem = $('.slider-item[data-module="' + module + '"]');
                        removeMenuItem($(carouselItem).data('id'), module);
                        $(carouselItem).remove();
                        $(this).removeClass('selected');
                    }
                    else {
                        addNewElement($(this));
                    }
                });

                $("#flush-user-menu").click(function() {
                    $('.carousel .slider-item:not(.empty)').each(function() {
                        // $(this).appendTo('#delete-module-area');
                        removeMenuItem($(this).data('id'), $(this).data('module'));
                        $(this).appendTo('#delete-module-area');

                    });
                    $("#flush-user-menu").hide();
                    // $('#delete-module-area').trigger('sortupdate');
                });
                $('#moduleSearchForm .module-search-input').on('keyup change paste', function () {
                    if($(this).val())
                        $('.module-search .info').show();
                    else 
                        $('.module-search .info').hide();
                });
                $("#moduleSearchForm").on('submit', function() {
                    var text = $(this).find('.module-search-input').val();
                    if(text) {
                        $('.resetModuleSearch').show();
                        $('.categories').hide();
                        $('.searchResult .smodule-item').hide();
                        $('.searchResult .smodule-item[data-sname*="' + text.toLowerCase() + '"]').css('display', 'inline-block');
                    } else {
                        $('.resetModuleSearch').hide();
                        $('.searchResult .smodule-item').hide();
                        $('.categories').show();
                    }
                    return false;
                });
                $('.resetModuleSearch').click(function (e) {
                    e.preventDefault();
                    $("#moduleSearchForm .module-search-input").val('');
                    $("#moduleSearchForm").submit();
                    return false;
                });

                $('.module-item:not(.smodule-item)').click(function() {
                    if($(this).is('li'))
                        return true;
                    $(this).find('li').each(function(indx) {
                        var module = $(this).data('module');1
                        $('.searchResult .smodule-item[data-module="' + module + '"]').css('display', 'inline-block');
                    });
                    $('.categories').hide();
                    $('.return-block .name').text($(this).find('.name').text());
                    $('.return-block .icon').attr('src', assets + '/images/modules/white/' + $(this).data('category') + '.png');
                    $('.return-block').css('display', 'inline-block');
                    return true;
                }).on('click','li', function(e) { 
                   e.stopPropagation();  
                });
                $('.return-block').click(function () {
                    $('.searchResult .smodule-item').hide();
                    $('.categories').show();
                    $('.return-block').hide();
                });
            }
        }
    });


}