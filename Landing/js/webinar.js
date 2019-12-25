$("#shop-logo").attr('src', 'img/logo.png');

// create object and connect to web socket server
var socket = new YiiNodeSocket();
socket.debug(false);

var webinarRoom;
var player;

var visiters = 1;
var endR = 'https://propiar.goodly.pro/store/29vwk4nx';
var logoutR = 'https://propiar.goodly.pro/stock/1all';
var videoDuration;
var username = '123';
var startvisiters = parseInt(90);
var lockChat = parseInt(0);

var isRoomStart = false;


socket.onConnect(function () {

    webinarRoom = socket.room('gwRoom3727').join(function (success, numberOfRoomSubscribers) {
        // success - boolean, numberOfRoomSubscribers - number of room members
        // if error occurred then success = false, and numberOfRoomSubscribers - contains error message
        if (success) {

            console.log('client in room: gwRoom3727');
            // console.log(numberOfRoomSubscribers + ' clients in room: gwRoom3727');
            visiters = numberOfRoomSubscribers;

            $("#messages").scrollTop($("#messages")[0].scrollHeight);
            resizeChat();

            //если человек пришел позже даты начала, загружаем видео и мотаем на нужный момент
            if(needStart) {

                var start = parseInt(+new Date()/1000) - parseInt(1577251200);
                if(!isRoomStart)
                    startRoom(start);

            } else {

                $('.show-on-start').hide();

                $('.countdown').downCount({
                    date: new Date('2019-12-25 08:20:00'),
                    offset: +3
                    }, function () {
                });

                //лочим чат до начала вебинара
                webinarRoom.emit('lockChat', {
                    value: 1
                });

                var wait = parseInt(1577251200) - parseInt(+new Date()/1000);

                console.log('Старт через ' + wait + ' секунд');

                setTimeout(function() {
                    if(!isRoomStart)
                        startRoom(1);
                }, wait*1000)
            }

            // отображаем кол-во  людей в комнате
            webinarRoom.emit('visitersChange', {
                count: numberOfRoomSubscribers
            });

            /*----------------------------------------*/
            this.on('visitersChange', function (data) {
                $(".members-count").text(startvisiters + data.count);
            });

            this.on('goOnline', function (data) {

                console.log('goOnline');
                console.log(data);

                //начало трансляции,
                $('.hide-on-start').hide();
                $('.show-on-start').show();

                initPlayer(data.url, 1);

                webinarRoom.emit('lockChat', {
                    value: 0
                });

            });
            
            this.on('chat-message', function (data) {

                //сообщение в чат
                if(data.role == 'moder' || data.role == 'admin') {
                    // console.log(data);
                    $('#messages').append($('<li><p class="username">' + data.username +' <span class="moderator">Модератор</span> </p>' + replaceLinks(data.message) + '</li>'));
                } else {

                    var re = /(https?|ftp):\/\/\S+[^\s.,> )\];'\"!?]/; 
                    var subst = '[ссылки запрещены]'; 

                    $('#messages').append($('<li><p class="username">' + data.username +'</p>' + data.message.replace(re, subst) + '</li>'));
                }

                $("#messages").scrollTop($("#messages")[0].scrollHeight);

            });

            this.on('files', function (data) {
                console.log('files event');
                console.log(data['files']);

                $("#files").empty();

                data['files'].forEach(function(value, index) {

                    //добавление кнопки/ссылки
                    if(value.url) {
                        var btn = '<li><a class="file-btn" href="' + value.url + '" target="_blank">' + value.title + '</a></li>';
                        $("#files").append($(btn));
                        $("#files-wrap").slideDown('fast', function() {
                            resizeChat();
                        });
                    }
                });

                //добавление кнопки/ссылки
                // var btn = '<li><a class="file-btn" href="' + data.url + '" target="_blank">' + data.title + '</a></li>';
                // $("#files").append($(btn));
                // $("#files-wrap").slideDown('fast', function() {
                //     var height = $("#files-wrap").height();
                //     $("#chat-wrap").css('max-height', 'calc(80vh - ' + height + 'px)')
                // });

            });

            // this.on('lockChat', function (data) {
            //     //лок/анлок чата
            //     if(data.value) {
            //         $('#chat-form').addClass('disabled');
            //     } else {
            //         $('#chat-form').removeClass('disabled');
            //     }
            // });

            /*НА ПОТОМ*/
            this.on('presentationName', function (data) {
                //показать презентацию
                //{"action":"presentationName","timeshift":258,"data":"aaaaaaaaaaaaaaaaaa.pdf"},
            });
            this.on('presentationPage', function (data) {
                //показать страницу презентации
                //{"action":"presentationPage","timeshift":258,"data":"0"},
            });
            /*----------------------------------------*/

        } else {
            // numberOfRoomSubscribers - error message
            alert('Произошла ошибка при подключении к комнате. Попробуйте обновить страницу');
        }
    });

    webinarRoom.on('leave', function() {
        visiters = visiters-1;
        webinarRoom.emit('visitersChange', {
            count: visiters
        });
        console.log("Someone left the room.");
    });

});

socket.onDisconnect(function () {
    console.log('onDisconnect');
});

socket.onReconnect(function () {
    console.log('onReconnect');
});

window.onbeforeunload = function() {
    //покинул комнату
    webinarRoom.emit('leave');
    if(logoutR) {
        window.location.href = logoutR;
    } else {
        window.close();
    }
};

/*отправка сообщений в чате*/
$('#chat-form').submit(function(e) {
    e.preventDefault();
    if(!lockChat)
        webinarRoom.emit('chat-message', {
            username: username,
            message:  $('#chat-message').val(),
        });

    $('#chat-message').val('');

    return false;
});

$('.overlay, .preload').on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('click on video');
    player.playVideo();
    return false;

});

$('.logout-btn').on('click', function(event) {
    webinarRoom.emit('leave');
    if(logoutR) {
        window.location.href = logoutR;
    } else {
        window.close();
    }

    return false;

});

function lparser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length==11)? match[7] : false;
}

function startRoom(time)
{
    $('.hide-on-start').hide();
    $('.show-on-start').show();

    initPlayer('http://www.youtube.com/embed/UV6AAhNYGwQ', time);

    webinarRoom.emit('lockChat', {
        value: lockChat,
    });

    isRoomStart = true;
}

function initPlayer(url, start) {

    console.log('initPlayer from ' + start);

    // var tag = document.createElement('script');

    // tag.src = "https://www.youtube.com/iframe_api";
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var videoID = lparser(url);

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoID,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'iv_load_policy': 3,
            'loop': 0,
            'modestbranding': 1,
            'showinfo': 0,
            'rel':0,
            'start': parseInt(start),
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
    });

    function onPlayerReady(event) {
        console.log('onPlayerReady');

        event.target.playVideo();
        event.target.setPlaybackQuality('highres');

        // videoDuration = event.target.getDuration();

        player.playVideo();

    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            setTimeout(function() {
                $('.preload').hide();
            }, 3500);
        } else if (event.data == YT.PlayerState.ENDED) {
            console.log('video end');
            if(endR) {
                window.location.href = endR;
            } else {
                $("#player").hide();
                $('.show-on-start').hide();
                $('.hide-on-end').hide();
                $('.hide-on-start').show();

            }
        } else {
            // console.log('onPlayerStateChange');
            // console.log(event.data);
            player.playVideo();
        }
    }

    // function stopVideo() {
    //     player.stopVideo();
    // }
}

function resizeChat()
{
    var height = $("#files-wrap").height();
    $("#chat-wrap").css('max-height', 'calc(80vh - ' + height + 'px)')
}


/*<![CDATA[*/
jQuery(function($) {
jQuery('[data-toggle=popover]').popover();
jQuery('[data-toggle=tooltip]').tooltip();
});
/*]]>*/