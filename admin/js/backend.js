swal.setDefaults({html: true, allowOutsideClick: true});

$(document).ready(function () {
   
    $('.addplace .addbutton span.caret').addClass('fa fa-plus');
    $(".bigmenu a").prepend('<i class="iclass"></i>');
    $('.bigmenu .dropdown-menu .iclass').remove();
    $("#toggle-menu").click(function(e) {
        e.preventDefault();
        e.stopPropagation();


        if ($('#rmenu').hasClass('open')) {
            $("#rmenu").removeClass('open');
            deleteCookie('open_gdly_rmenu');
        } else {
            setCookie('open_gdly_rmenu', '1', {expires:31104000, domain: 'goodly.pro', path: '/'});
            $("#rmenu").addClass('open');
        }
        return false;
    });

    menuupdate();

    // кружки при нажатии на кнопку
    $(document).on("mousedown", ".btn-ripples", function(e) {
        var $self = $(this);
        
        if($self.is(".btn-disabled") || $self.prop('disabled')) {
            return;
        }
        if($self.closest("[data-ripple]")) {
            e.stopPropagation();
        }
        
        var initPos = $self.css("position");
        var offs = $self.offset();
        var x = 0; // e.pageX - offs.left;
        var y = this.offsetHeight/2; //e.pageY - offs.top;
        var dia = Math.min(this.offsetHeight, this.offsetWidth, 100);
        var $ripple = $('<div/>', {class: "ripple", appendTo: $self});
        
        if(!initPos || initPos === "static") {
            $self.css({position:"relative"});
        }
        
        $('<div/>', {
            class : "rippleWave",
            css : {
                background: $self.data("ripple"),
                width: dia,
                height: dia,
                left: x - (dia/2),
                top: y - (dia/2),
            },
            appendTo : $ripple,
            one : {
                animationend : function(){
                    $ripple.remove();
                }
            }
        });
    });


    initMenuSortable();

    $(document).click(function(event) { 
        $target = $(event.target);
        if(!$target.closest('.desktop-settings').length && $('.desktop-settings').is(":visible")) {
            $('.desktop-settings').hide();
        }
    });

});

function menuupdate() {
    $('.addplace .addbutton span.caret').addClass('fa fa-plus');

    $('#addplace > div > div > button.dropdown-toggle').on('click', function () {
        $("#addplace .addbutton").hasClass('open') ? $("#addplace .addbutton").removeClass('open') : $("#addplace .addbutton").addClass('open');
    });
    $("#addplace").find('.navbar').removeClass('navbar-fixed-top navbar-default');
    var minh = $("#usermenu").height();
    var pageh = $("footer").position().top;

    var url = window.location.href;
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = matches && matches[1];
    $('.bigmenu .navbar .nav li').removeClass('active');
    $('.addplace .navbar .nav li').removeClass('active');
    $('.bigmenu .nav a').filter(function () {
        return this.getAttribute("href") && this.getAttribute("href") != '#' && (url.indexOf(this.href)>-1);
    }).parents('li').addClass('active');
    $('.addplace .nav a').filter(function () {
        return this.getAttribute("href") && this.getAttribute("href") != '#' && url==this.href;
    }).parents('li').addClass('active');
}

function toggleLeftMenu(e)
{
    e.preventDefault();
    if($("#leftmenu").hasClass('closed')) {
        $("#leftmenu").removeClass('closed');
        $('.shown_without_left_menu').fadeOut('fast');
        $("#toggle-left-img").attr('title', 'Свернуть').removeClass('closed');
        deleteCookie('close_gdly_lmenu');
    } else {
        setCookie('close_gdly_lmenu', '1', {expires:31104000, domain: 'goodly.pro', path: '/'});
        $("#leftmenu").addClass('closed');
        $('.shown_without_left_menu').fadeIn('fast');
        $("#toggle-left-img").attr('title', 'Развернуть').addClass('closed');
    }
    return false;
}

function setCookie(name, value, options) {
    set_cookie(name, value, options);
}

function set_cookie(name, value, options) { 
    options = options || {}; 

    var expires = options.expires; 

    if (typeof expires == "number" && expires) { 
        var d = new Date(); 
        d.setTime(d.getTime() + expires * 1000); 
        expires = options.expires = d; 
    } 
    if (expires && expires.toUTCString) { 
        options.expires = expires.toUTCString(); 
    }

    value = encodeURIComponent(value); 
    var updatedCookie = name + "=" + value; 

    for (var propName in options) { 
        updatedCookie += "; " + propName; 
        var propValue = options[propName]; 
        if (propValue !== true) { 
            updatedCookie += "=" + propValue; 
        }
    } 
    document.cookie = updatedCookie; 
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1,
        path: '/',
        domain: 'goodly.pro',
    })
}

function refreshUserMenu() {
    var data = {};
    data[yupeTokenName] = yupeToken;
    $.ajax({
        url: '/backend/desktop/home/getUserMenu',
        data: data,  
        type: 'POST',
        success: function (response) {
            if(response.result) {
                $(".menu-sortable" ).sortable('destroy');
                $("#user-menu-wrap").empty().html(response.data[0]);
                $("#user-mini-menu-wrap").empty().html(response.data[1]);
                $('.lmenu [data-toggle="tooltip"]').tooltip();
                initMenuSortable();
            }
        }
    });
}

function initMenuSortable() {
    $(".menu-sortable" ).sortable({
        revert: true,
        opacity: 0.8,
        placeholder: 'empty_space',
        items: '.draggable',
        handle: '.handle',
        activate: function(event, ui) {
            $( '.empty_space' ).css( {'height':$(ui.item).css('height'), 'width':$(ui.item).css('width')});
        },
        update: function(){
            var order = $(this).sortable("toArray");
            sort = new Array();
            for (var i = 0; i < order.length; i++) {
                var id = $("#" + order[i]).data('id');
                var position = i;
                var item = new Array()
                item.push(id, position);
                sort.push(item);
            }
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
                    else  {
                        refreshUserMenu();
                        initMenuPopup();
                    }
                }
            });
        }
    });



    // $('.hide-btn').click(function(){
    //    $('.bigmenu').addClass('hide');
    //    $('.addplace').addClass('hide');
    //    $('#page-wrapper').addClass('full-screen');
    //    $('#leftmenu').addClass('full-menu');
    // });

    // $('.show-menu-btn').click(function(){
    //     $('.bigmenu').removeClass('hide');
    //     $('.addplace').removeClass('hide');
    //     $('#page-wrapper').removeClass('full-screen');
    //     $('#leftmenu').removeClass('full-menu');
    // });

    // $('.show-menu-btn').click(function(){
    //     $('#yii_booster_collapse_yw8').toggleClass('hide');
    //   })

}


